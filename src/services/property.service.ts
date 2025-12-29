import { PrismaClient, Property, PropertyStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

interface ListPropertiesParams {
  page: number;
  limit: number;
  status?: PropertyStatus;
  ownerId?: string;
  managerId?: string;
}

export class PropertyService {
  constructor(private prisma: PrismaClient) {}

  async listProperties(params: ListPropertiesParams) {
    const { page, limit, status, ownerId, managerId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;
    if (managerId) where.managerId = managerId;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          units: true,
          smartLocks: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProperty(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        manager: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        units: true,
        smartLocks: true,
        reservations: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
            },
          },
          orderBy: {
            checkInDate: 'asc',
          },
          take: 10,
        },
      },
    });
  }

  async createProperty(data: any) {
    return this.prisma.property.create({
      data: {
        ...data,
        amenities: data.amenities || [],
        houseRules: data.houseRules || {},
        photos: data.photos || [],
      },
      include: {
        owner: true,
        manager: true,
      },
    });
  }

  async updateProperty(id: string, data: any) {
    return this.prisma.property.update({
      where: { id },
      data,
      include: {
        owner: true,
        manager: true,
        units: true,
      },
    });
  }

  async deleteProperty(id: string) {
    // Soft delete by setting status to ARCHIVED
    return this.prisma.property.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
  }

  async getAvailability(id: string, startDate: Date, endDate: Date) {
    // Get all reservations that overlap with the date range
    const reservations = await this.prisma.reservation.findMany({
      where: {
        propertyId: id,
        status: {
          in: ['CONFIRMED', 'CHECKED_IN'],
        },
        OR: [
          {
            AND: [
              { checkInDate: { lte: endDate } },
              { checkOutDate: { gte: startDate } },
            ],
          },
        ],
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
        status: true,
      },
    });

    // Generate calendar with availability
    const days = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      const isAvailable = !reservations.some((r) => {
        const checkIn = dayjs(r.checkInDate);
        const checkOut = dayjs(r.checkOutDate);
        return (
          currentDate.isAfter(checkIn, 'day') &&
          currentDate.isBefore(checkOut, 'day')
        ) || currentDate.isSame(checkIn, 'day');
      });

      days.push({
        date: currentDate.format('YYYY-MM-DD'),
        available: isAvailable,
      });

      currentDate = currentDate.add(1, 'day');
    }

    return {
      propertyId: id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
    };
  }

  async getStatistics(id: string) {
    const now = new Date();
    const thirtyDaysAgo = dayjs().subtract(30, 'days').toDate();
    const oneYearAgo = dayjs().subtract(1, 'year').toDate();

    const [
      totalReservations,
      upcomingReservations,
      last30DaysReservations,
      last30DaysReservationsData,
      yearlyReservationsData,
      reviews,
    ] = await Promise.all([
      this.prisma.reservation.count({
        where: { propertyId: id },
      }),
      this.prisma.reservation.count({
        where: {
          propertyId: id,
          checkInDate: { gte: now },
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      }),
      this.prisma.reservation.count({
        where: {
          propertyId: id,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.reservation.findMany({
        where: {
          propertyId: id,
          createdAt: { gte: thirtyDaysAgo },
          status: { in: ['CONFIRMED', 'CHECKED_OUT'] },
        },
        select: { pricing: true },
      }),
      this.prisma.reservation.findMany({
        where: {
          propertyId: id,
          createdAt: { gte: oneYearAgo },
          status: { in: ['CONFIRMED', 'CHECKED_OUT'] },
        },
        select: { pricing: true },
      }),
      this.prisma.$queryRaw<{ avgRating: number }[]>`
        SELECT COALESCE(AVG(rating), 0) as "avgRating"
        FROM "ServiceRequest"
        WHERE "propertyId" = ${id}
        AND rating IS NOT NULL
      `,
    ]);

    // Calculate revenue from pricing JSON
    const last30DaysRevenue = last30DaysReservationsData.reduce((sum, res: any) => {
      const pricing = res.pricing as any;
      return sum + (pricing?.totalPrice || pricing?.total || 0);
    }, 0);

    const yearlyRevenue = yearlyReservationsData.reduce((sum, res: any) => {
      const pricing = res.pricing as any;
      return sum + (pricing?.totalPrice || pricing?.total || 0);
    }, 0);

    // Calculate average rating
    const averageRating = reviews[0]?.avgRating || 0;

    // Calculate occupancy rate (bookings / available days in last 30 days)
    const daysInPeriod = 30;
    const bookedDays = await this.prisma.reservation.aggregate({
      where: {
        propertyId: id,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
        OR: [
          {
            checkInDate: { gte: thirtyDaysAgo, lte: now },
          },
          {
            checkOutDate: { gte: thirtyDaysAgo, lte: now },
          },
          {
            AND: [
              { checkInDate: { lte: thirtyDaysAgo } },
              { checkOutDate: { gte: now } },
            ],
          },
        ],
      },
      _sum: {
        nights: true,
      },
    });

    const occupancyRate = bookedDays._sum.nights
      ? Math.min(bookedDays._sum.nights / daysInPeriod, 1)
      : 0;

    return {
      totalReservations,
      upcomingReservations,
      last30DaysReservations,
      last30DaysRevenue: Math.round(last30DaysRevenue * 100) / 100,
      yearlyRevenue: Math.round(yearlyRevenue * 100) / 100,
      averageRating: Math.round(averageRating * 10) / 10,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
    };
  }
}
