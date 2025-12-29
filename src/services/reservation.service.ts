import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

interface ListReservationsParams {
  page: number;
  limit: number;
  status?: ReservationStatus;
  propertyId?: string;
  guestId?: string;
  checkInFrom?: Date;
  checkInTo?: Date;
}

export class ReservationService {
  constructor(private prisma: PrismaClient) {}

  async listReservations(params: ListReservationsParams) {
    const { page, limit, status, propertyId, guestId, checkInFrom, checkInTo } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (guestId) where.guestId = guestId;
    if (checkInFrom || checkInTo) {
      where.checkInDate = {};
      if (checkInFrom) where.checkInDate.gte = checkInFrom;
      if (checkInTo) where.checkInDate.lte = checkInTo;
    }

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              addressLine1: true,
              city: true,
              state: true,
            },
          },
          unit: true,
          guest: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          accessCodes: true,
        },
        orderBy: {
          checkInDate: 'desc',
        },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReservation(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        property: true,
        unit: true,
        guest: true,
        accessCodes: true,
        serviceRequests: true,
        upsellOrders: true,
        aiConversations: true,
        inspections: true,
        damages: true,
      },
    });
  }

  async createReservation(data: any) {
    // Calculate nights
    const checkIn = dayjs(data.checkInDate);
    const checkOut = dayjs(data.checkOutDate);
    const nights = checkOut.diff(checkIn, 'days');

    // Generate confirmation code
    const confirmationCode = this.generateConfirmationCode();

    // Check for conflicts
    const conflicts = await this.checkReservationConflicts(
      data.propertyId,
      data.unitId,
      new Date(data.checkInDate),
      new Date(data.checkOutDate)
    );

    if (conflicts.length > 0) {
      throw new Error('Property is not available for the selected dates');
    }

    return this.prisma.reservation.create({
      data: {
        ...data,
        nights,
        confirmationCode,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
      },
      include: {
        property: true,
        guest: true,
      },
    });
  }

  async updateReservation(id: string, data: any) {
    // Recalculate nights if dates changed
    if (data.checkInDate || data.checkOutDate) {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      const checkIn = dayjs(data.checkInDate || reservation.checkInDate);
      const checkOut = dayjs(data.checkOutDate || reservation.checkOutDate);
      data.nights = checkOut.diff(checkIn, 'days');

      // Check for conflicts if dates changed
      const conflicts = await this.checkReservationConflicts(
        reservation.propertyId,
        reservation.unitId || undefined,
        data.checkInDate ? new Date(data.checkInDate) : reservation.checkInDate,
        data.checkOutDate ? new Date(data.checkOutDate) : reservation.checkOutDate,
        id
      );

      if (conflicts.length > 0) {
        throw new Error('Property is not available for the updated dates');
      }
    }

    return this.prisma.reservation.update({
      where: { id },
      data,
      include: {
        property: true,
        guest: true,
      },
    });
  }

  async cancelReservation(id: string, reason?: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        // Could store cancellation reason in a separate field or in guestInfo JSON
      },
      include: {
        property: true,
        guest: true,
      },
    });
  }

  async checkIn(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
      },
      include: {
        property: true,
        guest: true,
      },
    });
  }

  async checkOut(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CHECKED_OUT',
        checkedOutAt: new Date(),
      },
      include: {
        property: true,
        guest: true,
      },
    });
  }

  private async checkReservationConflicts(
    propertyId: string,
    unitId: string | undefined,
    checkInDate: Date,
    checkOutDate: Date,
    excludeReservationId?: string
  ): Promise<Reservation[]> {
    const where: any = {
      propertyId,
      status: {
        in: ['CONFIRMED', 'CHECKED_IN', 'PENDING'],
      },
      OR: [
        {
          AND: [
            { checkInDate: { lt: checkOutDate } },
            { checkOutDate: { gt: checkInDate } },
          ],
        },
      ],
    };

    if (unitId) {
      where.unitId = unitId;
    }

    if (excludeReservationId) {
      where.id = { not: excludeReservationId };
    }

    return this.prisma.reservation.findMany({ where });
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
