# PropertyMgmt Technical Specification

Complete technical reference for integrating the PropertyMgmt plugin.

---

## API Reference

### Base URL

```
https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/property
```

All endpoints require authentication via Bearer token in the Authorization header.

---

### Endpoints

#### List Properties

```http
GET /properties
```

**Query Parameters:**
- `type`: `vacation_rental | multi_family | commercial | mixed_use`
- `status`: `active | inactive | maintenance`
- `city`: Filter by city
- `state`: Filter by state
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "prop_abc123",
        "name": "Sunset Beach House",
        "type": "vacation_rental",
        "status": "active",
        "address": {
          "street": "123 Ocean Drive",
          "city": "Miami Beach",
          "state": "FL",
          "zip": "33139",
          "country": "US"
        },
        "bedrooms": 3,
        "bathrooms": 2,
        "maxGuests": 8,
        "amenities": ["pool", "wifi", "parking"],
        "occupancyRate": 0.75,
        "monthlyRevenue": 12500,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

#### Create Property

```http
POST /properties
```

**Request Body:**
```json
{
  "name": "Sunset Beach House",
  "type": "vacation_rental | multi_family | commercial | mixed_use",
  "address": {
    "street": "123 Ocean Drive",
    "city": "Miami Beach",
    "state": "FL",
    "zip": "33139",
    "country": "US"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "squareFeet": 1800,
  "maxGuests": 8,
  "amenities": ["pool", "wifi", "parking", "ac", "kitchen"],
  "description": "Oceanfront property with stunning views",
  "pricing": {
    "baseNightlyRate": 250,
    "cleaningFee": 150,
    "securityDeposit": 500,
    "weekendMultiplier": 1.2,
    "seasonalRates": [
      {
        "name": "Peak Season",
        "startDate": "2024-06-01",
        "endDate": "2024-08-31",
        "multiplier": 1.5
      }
    ]
  },
  "policies": {
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "minimumStay": 2,
    "petsAllowed": false,
    "smokingAllowed": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prop_abc123",
    "name": "Sunset Beach House",
    "type": "vacation_rental",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### Get Property Details

```http
GET /properties/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prop_abc123",
    "name": "Sunset Beach House",
    "type": "vacation_rental",
    "status": "active",
    "address": {
      "street": "123 Ocean Drive",
      "city": "Miami Beach",
      "state": "FL",
      "zip": "33139"
    },
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFeet": 1800,
    "maxGuests": 8,
    "amenities": ["pool", "wifi", "parking"],
    "description": "Oceanfront property with stunning views",
    "pricing": {
      "baseNightlyRate": 250,
      "cleaningFee": 150,
      "securityDeposit": 500
    },
    "policies": {
      "checkInTime": "15:00",
      "checkOutTime": "11:00",
      "minimumStay": 2
    },
    "photos": [
      {
        "id": "photo_xyz",
        "url": "https://cdn.adverant.ai/...",
        "caption": "Living room",
        "isPrimary": true
      }
    ],
    "stats": {
      "occupancyRate": 0.75,
      "averageDailyRate": 285,
      "totalRevenue": 45000,
      "totalBookings": 24,
      "averageRating": 4.8
    },
    "upcomingReservations": 3,
    "pendingMaintenance": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

---

#### Add Tenant

```http
POST /tenants
```

**Request Body:**
```json
{
  "propertyId": "prop_abc123",
  "unitId": "unit_xyz789",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-123-4567",
  "leaseStart": "2024-02-01",
  "leaseEnd": "2025-01-31",
  "rentAmount": 2500,
  "securityDeposit": 5000,
  "paymentDay": 1,
  "emergencyContact": {
    "name": "Jane Smith",
    "phone": "+1-555-987-6543",
    "relationship": "spouse"
  },
  "documents": [
    {
      "type": "id",
      "url": "https://storage.example.com/id.pdf"
    },
    {
      "type": "lease",
      "url": "https://storage.example.com/lease.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tenantId": "tenant_def456",
    "propertyId": "prop_abc123",
    "unitId": "unit_xyz789",
    "name": "John Smith",
    "status": "active",
    "leaseStart": "2024-02-01",
    "leaseEnd": "2025-01-31",
    "portalAccess": {
      "enabled": true,
      "inviteSent": true
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### Create Maintenance Request

```http
POST /maintenance
```

**Request Body:**
```json
{
  "propertyId": "prop_abc123",
  "unitId": "unit_xyz789",
  "title": "Leaking faucet in master bathroom",
  "description": "The faucet has been dripping for two days",
  "category": "plumbing | electrical | hvac | appliance | structural | other",
  "priority": "emergency | high | normal | low",
  "requestedBy": "tenant_def456",
  "photos": [
    "https://storage.example.com/photo1.jpg"
  ],
  "preferredSchedule": {
    "dates": ["2024-01-20", "2024-01-21"],
    "timeWindow": "morning | afternoon | evening | any"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "maintenanceId": "maint_ghi789",
    "propertyId": "prop_abc123",
    "title": "Leaking faucet in master bathroom",
    "status": "open",
    "priority": "normal",
    "assignedVendor": null,
    "estimatedCost": null,
    "scheduledDate": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### Get Financial Summary

```http
GET /financials/:propertyId
```

**Query Parameters:**
- `period`: `month | quarter | year | custom`
- `startDate`: ISO 8601 date (for custom period)
- `endDate`: ISO 8601 date (for custom period)

**Response:**
```json
{
  "success": true,
  "data": {
    "propertyId": "prop_abc123",
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "revenue": {
      "total": 15250,
      "breakdown": {
        "rent": 12500,
        "cleaningFees": 1500,
        "lateFees": 250,
        "other": 1000
      }
    },
    "expenses": {
      "total": 4200,
      "breakdown": {
        "maintenance": 1500,
        "utilities": 800,
        "insurance": 400,
        "propertyTax": 1200,
        "management": 300
      }
    },
    "netIncome": 11050,
    "occupancyRate": 0.75,
    "averageDailyRate": 285,
    "revPAR": 213.75,
    "comparison": {
      "previousPeriod": {
        "revenue": 14000,
        "revenueChange": 0.089,
        "netIncome": 10200,
        "netIncomeChange": 0.083
      }
    }
  }
}
```

---

#### Create Reservation

```http
POST /reservations
```

**Request Body:**
```json
{
  "propertyId": "prop_abc123",
  "guestInfo": {
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@example.com",
    "phone": "+1-555-234-5678",
    "guestCount": 4
  },
  "checkIn": "2024-02-15",
  "checkOut": "2024-02-20",
  "source": "direct | airbnb | vrbo | booking",
  "pricing": {
    "nightlyRate": 250,
    "nights": 5,
    "cleaningFee": 150,
    "serviceFee": 75,
    "taxes": 125,
    "total": 1600
  },
  "paymentStatus": "pending | partial | paid",
  "specialRequests": "Early check-in if possible"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reservationId": "res_jkl012",
    "propertyId": "prop_abc123",
    "guestName": "Sarah Johnson",
    "checkIn": "2024-02-15",
    "checkOut": "2024-02-20",
    "status": "confirmed",
    "total": 1600,
    "confirmationCode": "ABC123XYZ",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### List Reservations

```http
GET /reservations
```

**Query Parameters:**
- `propertyId`: Filter by property
- `status`: `pending | confirmed | checked_in | checked_out | cancelled`
- `startDate`: Filter by check-in date
- `endDate`: Filter by check-out date
- `source`: `direct | airbnb | vrbo | booking`

**Response:**
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "reservationId": "res_jkl012",
        "propertyId": "prop_abc123",
        "propertyName": "Sunset Beach House",
        "guestName": "Sarah Johnson",
        "guestCount": 4,
        "checkIn": "2024-02-15",
        "checkOut": "2024-02-20",
        "nights": 5,
        "status": "confirmed",
        "total": 1600,
        "source": "direct",
        "confirmationCode": "ABC123XYZ"
      }
    ],
    "pagination": {
      "total": 24,
      "limit": 50,
      "offset": 0
    }
  }
}
```

---

## Authentication

### Bearer Token

```bash
curl -X GET "https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/property/properties" \
  -H "Authorization: Bearer YOUR_NEXUS_API_TOKEN"
```

### Token Scopes

| Scope | Description |
|-------|-------------|
| `property:read` | View properties and details |
| `property:write` | Create and update properties |
| `tenant:read` | View tenant information |
| `tenant:write` | Manage tenants |
| `reservation:read` | View reservations |
| `reservation:write` | Create and manage reservations |
| `maintenance:read` | View maintenance requests |
| `maintenance:write` | Create and manage maintenance |
| `financial:read` | View financial data |

---

## Rate Limits

| Tier | Requests/Minute | Properties | Units |
|------|-----------------|------------|-------|
| Starter | 60 | 10 | 10 |
| Professional | 120 | 100 | 500 |
| Enterprise | 300 | Unlimited | Unlimited |

---

## Data Models

### Property

```typescript
interface Property {
  id: string;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  address: Address;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  maxGuests?: number;
  amenities: string[];
  description?: string;
  pricing: PropertyPricing;
  policies: PropertyPolicies;
  photos: Photo[];
  stats: PropertyStats;
  createdAt: string;
  updatedAt: string;
}

type PropertyType = 'vacation_rental' | 'multi_family' | 'commercial' | 'mixed_use';
type PropertyStatus = 'active' | 'inactive' | 'maintenance';
```

### Tenant

```typescript
interface Tenant {
  id: string;
  propertyId: string;
  unitId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: TenantStatus;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  securityDeposit: number;
  paymentDay: number;
  emergencyContact?: EmergencyContact;
  documents: TenantDocument[];
  paymentHistory: Payment[];
  createdAt: string;
}

type TenantStatus = 'active' | 'notice_given' | 'eviction' | 'former';
```

### Reservation

```typescript
interface Reservation {
  id: string;
  propertyId: string;
  guestInfo: GuestInfo;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: ReservationStatus;
  source: BookingSource;
  pricing: ReservationPricing;
  paymentStatus: PaymentStatus;
  confirmationCode: string;
  specialRequests?: string;
  createdAt: string;
}

type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' |
                         'checked_out' | 'cancelled' | 'no_show';
type BookingSource = 'direct' | 'airbnb' | 'vrbo' | 'booking' | 'other';
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
```

### Maintenance Request

```typescript
interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: Priority;
  status: MaintenanceStatus;
  requestedBy: string;
  assignedVendor?: string;
  photos: string[];
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes: MaintenanceNote[];
  createdAt: string;
}

type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' |
                           'appliance' | 'structural' | 'other';
type Priority = 'emergency' | 'high' | 'normal' | 'low';
type MaintenanceStatus = 'open' | 'assigned' | 'scheduled' |
                         'in_progress' | 'completed' | 'cancelled';
```

---

## SDK Integration

### JavaScript/TypeScript SDK

```typescript
import { NexusClient } from '@nexus/sdk';

const nexus = new NexusClient({
  apiKey: process.env.NEXUS_API_KEY,
});

// Create a property
const property = await nexus.property.createProperty({
  name: 'Sunset Beach House',
  type: 'vacation_rental',
  address: {
    street: '123 Ocean Drive',
    city: 'Miami Beach',
    state: 'FL',
    zip: '33139',
  },
  bedrooms: 3,
  bathrooms: 2,
  maxGuests: 8,
});

// Add a tenant
const tenant = await nexus.property.addTenant({
  propertyId: property.id,
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  leaseStart: '2024-02-01',
  leaseEnd: '2025-01-31',
  rentAmount: 2500,
});

// Create reservation
const reservation = await nexus.property.createReservation({
  propertyId: property.id,
  guestInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    guestCount: 4,
  },
  checkIn: '2024-02-15',
  checkOut: '2024-02-20',
});

// Get financials
const financials = await nexus.property.getFinancials(property.id, {
  period: 'month',
});

console.log(`Net Income: $${financials.netIncome}`);
```

### Python SDK

```python
from nexus import NexusClient

client = NexusClient(api_key=os.environ["NEXUS_API_KEY"])

# Create property
property = client.property.create_property(
    name="Sunset Beach House",
    type="vacation_rental",
    address={
        "street": "123 Ocean Drive",
        "city": "Miami Beach",
        "state": "FL",
        "zip": "33139"
    },
    bedrooms=3,
    bathrooms=2,
    max_guests=8
)

# Add tenant
tenant = client.property.add_tenant(
    property_id=property.id,
    first_name="John",
    last_name="Smith",
    email="john@example.com",
    lease_start="2024-02-01",
    lease_end="2025-01-31",
    rent_amount=2500
)

# Get financials
financials = client.property.get_financials(
    property.id,
    period="month"
)

print(f"Net Income: ${financials.net_income}")
```

---

## Webhooks

### Supported Events

| Event | Description |
|-------|-------------|
| `reservation.created` | New reservation created |
| `reservation.confirmed` | Reservation confirmed |
| `reservation.cancelled` | Reservation cancelled |
| `reservation.checked_in` | Guest checked in |
| `reservation.checked_out` | Guest checked out |
| `maintenance.created` | New maintenance request |
| `maintenance.completed` | Maintenance completed |
| `payment.received` | Payment received |
| `payment.failed` | Payment failed |
| `lease.expiring` | Lease expiring soon |

### Webhook Payload

```json
{
  "event": "reservation.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "reservationId": "res_jkl012",
    "propertyId": "prop_abc123",
    "guestName": "Sarah Johnson",
    "checkIn": "2024-02-15",
    "checkOut": "2024-02-20",
    "total": 1600
  },
  "signature": "sha256=abc123..."
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body |
| `PROPERTY_NOT_FOUND` | 404 | Property does not exist |
| `TENANT_NOT_FOUND` | 404 | Tenant does not exist |
| `RESERVATION_CONFLICT` | 409 | Dates conflict with existing reservation |
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid token |
| `INSUFFICIENT_PERMISSIONS` | 403 | Token lacks required scope |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `QUOTA_EXCEEDED` | 402 | Property/unit limit reached |

---

## Deployment Requirements

### Container Specifications

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 500m | 1000m |
| Memory | 1Gi | 2Gi |
| Storage | 5Gi | 10Gi |
| Timeout | 3 min | 5 min |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXUS_API_KEY` | Yes | Nexus platform API key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis for caching |
| `STRIPE_SECRET_KEY` | No | Stripe payment processing |
| `AIRBNB_CLIENT_ID` | No | Airbnb integration |
| `VRBO_API_KEY` | No | VRBO integration |

### Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Integrations

### Channel Managers

| Platform | Features |
|----------|----------|
| Airbnb | Sync listings, reservations, availability |
| VRBO | Sync listings, reservations, pricing |
| Booking.com | Sync reservations, availability |
| Expedia | Sync listings, reservations |

### Payment Processors

| Provider | Features |
|----------|----------|
| Stripe | Payments, ACH, subscriptions |
| Square | POS, invoicing |
| PayPal | Online payments |

### Smart Home

| Integration | Features |
|-------------|----------|
| Schlage | Smart locks, access codes |
| August | Smart locks, auto-unlock |
| Nest | Thermostats, cameras |
| Ring | Doorbells, security |

---

## Quotas and Limits

| Limit | Starter | Professional | Enterprise |
|-------|---------|--------------|------------|
| Properties | 10 | 100 | Unlimited |
| Units | 10 | 500 | Unlimited |
| Reservations/Month | 100 | 500 | Unlimited |
| Integrations | 2 | 10 | Unlimited |
| API Calls/Min | 60 | 120 | 300 |
| Storage | 1 GB | 10 GB | 100 GB |

---

## Support

- **Documentation**: [docs.adverant.ai/plugins/propertymgmt](https://docs.adverant.ai/plugins/propertymgmt)
- **API Status**: [status.adverant.ai](https://status.adverant.ai)
- **Support Email**: support@adverant.ai
- **Discord**: [discord.gg/adverant](https://discord.gg/adverant)
