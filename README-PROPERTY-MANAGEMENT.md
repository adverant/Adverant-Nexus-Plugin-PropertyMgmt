# Nexus Property Management Platform

**AI-Powered Vacation Rental Management System**

Complete property management solution integrated with the Adverant Nexus stack, featuring:
- 🏠 Multi-property management
- 🔐 Multi-brand smart lock integration (via Seam API)
- 🤖 AI-powered guest experience
- 📸 Computer vision damage detection
- 📊 Predictive analytics and dynamic pricing
- 🧠 Nexus GraphRAG integration for continuous learning

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 20+ (for local development)
- API keys for:
  - Seam (smart locks)
  - OpenAI or Anthropic (AI features)
  - Twilio (SMS notifications)
  - SendGrid (email)
  - Stripe (payments)

### 1. Clone and Setup

```bash
git clone https://github.com/adverant/Adverant-Nexus.git
cd Adverant-Nexus
```

### 2. Configure Environment

```bash
cd docker
cp .env.example .env

# Edit .env with your API keys
nano .env
```

**Required configurations:**
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `SEAM_API_KEY` - Get from: https://seam.co
- `OPENAI_API_KEY` - Get from: https://platform.openai.com
- Database passwords (change defaults!)

### 3. Start the Stack

```bash
docker-compose -f docker-compose.property-management.yml up -d
```

This starts:
- Property Management Service (port 9020)
- Smart Lock Service (port 9022)
- PostgreSQL database
- Redis cache
- RabbitMQ message queue
- Neo4j knowledge graph
- Qdrant vector database
- Nexus GraphRAG services
- Admin dashboard (port 3000)

### 4. Initialize Database

```bash
# Run migrations
docker exec nexus-property-management npx prisma migrate deploy

# Seed initial data (optional)
docker exec nexus-property-management npm run seed
```

### 5. Access Services

- **Admin Dashboard**: http://localhost:3000
- **Property Management API**: http://localhost:9020
- **Smart Lock API**: http://localhost:9022
- **Nexus GraphRAG**: http://localhost:9001
- **API Documentation**: http://localhost:9020/docs

Default login:
- Email: `admin@example.com`
- Password: `admin123` (change immediately!)

---

## 📦 Architecture

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **Property Management** | 9020 | Core PMS, properties, reservations |
| **Smart Lock** | 9022 | Multi-brand smart lock management (Seam) |
| **Guest Experience** | 9021 | AI chatbot, service requests, upsells |
| **Damage Tracking** | 9023 | AI damage detection, maintenance |
| **Inventory** | 9024 | Multi-property inventory management |
| **Cleaning** | 9025 | Housekeeping scheduling |
| **Pricing** | 9026 | Dynamic pricing, revenue optimization |
| **Communication** | 9027 | SMS, Email, WhatsApp |
| **Channel Manager** | 9028 | Airbnb, VRBO, Booking.com sync |
| **API Gateway** | 9000 | GraphQL federation |

### Database Architecture

```
PostgreSQL
├── nexus_property_mgmt (main tables)
│   ├── properties
│   ├── reservations
│   ├── guests
│   ├── smart_locks
│   ├── access_codes
│   ├── damages
│   ├── inspections
│   └── inventory

Neo4j (knowledge graph)
├── Property relationships
├── Guest preferences
├── Damage patterns
└── Vendor performance

Qdrant (vector database)
├── Image embeddings (damage detection)
├── Document embeddings (reviews, guides)
└── Semantic search
```

---

## 🔐 Smart Lock Integration

### Supported Brands (via Seam)

- August Smart Locks
- Yale Smart Locks
- Schlage Encode
- Igloohome
- Kwikset Smart Locks
- Nuki Smart Lock
- TTLock

### Features

✅ Automated access code generation for guests
✅ Time-bound codes (auto-expire after checkout)
✅ Staff codes (cleaners, maintenance, managers)
✅ Real-time lock/unlock events
✅ Battery monitoring and alerts
✅ Tamper detection
✅ Offline PIN codes (Igloohome)
✅ Webhook integration for instant notifications

### Example: Create Guest Access Code

```typescript
POST /api/v1/access-codes/guest
{
  "smartLockId": "abc-123",
  "reservationId": "res-456",
  "guestName": "John Doe",
  "checkInDate": "2025-12-01T15:00:00Z",
  "checkOutDate": "2025-12-05T11:00:00Z"
}

// Response
{
  "id": "code-789",
  "pinCode": "123456",
  "startsAt": "2025-12-01T15:00:00Z",
  "endsAt": "2025-12-05T11:30:00Z",  // +30 min buffer
  "status": "ACTIVE"
}
```

---

## 🧠 Nexus GraphRAG Integration

### Knowledge Persistence

All operations are automatically stored in Nexus for:
- **Pattern Learning**: Successful damage repair strategies
- **Guest Preferences**: Remembered across stays
- **Cost Estimation**: Improved accuracy over time
- **Predictive Maintenance**: Equipment failure forecasting

### Example: Damage Cost Estimation

```typescript
// AI estimates $500 for carpet stain repair
// Nexus recalls 10 similar carpet stains
// Historical median cost: $350
// Final estimate: (350 * 0.7) + (500 * 0.3) = $395
```

### Nexus Health Check

```bash
curl http://localhost:9001/health

{
  "graphrag": { "healthy": true, "latency": 45 },
  "mageagent": { "healthy": true, "activeAgents": 0 },
  "neo4j": { "healthy": true },
  "qdrant": { "healthy": true }
}
```

---

## 📊 API Examples

### Create Property

```bash
POST /api/v1/properties
Authorization: Bearer <jwt_token>

{
  "name": "Luxury Beach Condo",
  "propertyType": "CONDO",
  "addressLine1": "123 Ocean Drive",
  "city": "Miami",
  "state": "FL",
  "postalCode": "33139",
  "bedrooms": 2,
  "bathrooms": 2,
  "maxGuests": 4,
  "basePrice": 250.00,
  "cleaningFee": 100.00,
  "securityDeposit": 500.00,
  "amenities": ["wifi", "pool", "parking", "beach_access"],
  "photos": ["https://..."]
}
```

### Create Reservation

```bash
POST /api/v1/reservations

{
  "propertyId": "prop-123",
  "guestId": "guest-456",
  "channel": "AIRBNB",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-05",
  "guests": 2,
  "pricing": {
    "nightlyRate": 250,
    "nights": 4,
    "cleaningFee": 100,
    "serviceFee": 50,
    "taxes": 70,
    "total": 1170
  }
}
```

### Get Property Availability

```bash
GET /api/v1/properties/prop-123/availability?startDate=2025-12-01&endDate=2025-12-31

{
  "propertyId": "prop-123",
  "days": [
    { "date": "2025-12-01", "available": false },
    { "date": "2025-12-02", "available": false },
    { "date": "2025-12-03", "available": false },
    { "date": "2025-12-04", "available": false },
    { "date": "2025-12-05", "available": true },
    ...
  ]
}
```

---

## 🔧 Development

### Run Services Locally

```bash
# Property Management Service
cd services/nexus-property-management
npm install
npm run dev

# Smart Lock Service
cd services/nexus-smart-lock
npm install
npm run dev
```

### Database Migrations

```bash
# Create migration
cd services/nexus-property-management
npx prisma migrate dev --name add_feature

# Apply migrations
npx prisma migrate deploy

# Studio (GUI)
npx prisma studio
```

### Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📈 Monitoring

### Health Checks

```bash
# All services
for port in 9020 9021 9022 9023 9024 9025 9026 9027 9028; do
  echo "Port $port:"
  curl -s http://localhost:$port/health | jq .status
done
```

### Logs

```bash
# View logs
docker-compose logs -f property-management
docker-compose logs -f smart-lock

# Error logs only
docker-compose logs --tail=100 property-management | grep ERROR
```

### Metrics

- Prometheus metrics: `http://localhost:9020/metrics`
- Grafana dashboard: `http://localhost:3001`

---

## 🚢 Deployment

### Production Checklist

- [ ] Change all default passwords
- [ ] Set secure `JWT_SECRET`
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup schedule (PostgreSQL, Neo4j)
- [ ] Configure monitoring (Sentry, Datadog)
- [ ] Set up log aggregation
- [ ] Enable rate limiting
- [ ] Configure CORS origins
- [ ] Test disaster recovery
- [ ] Review security audit

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/deployments/

# Check status
kubectl get pods -n nexus-property-mgmt
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

---

## 📄 License

Copyright © 2025 Adverant. All rights reserved.

---

## 🆘 Support

- **Documentation**: https://docs.adverant.com/property-management
- **Issues**: https://github.com/adverant/Adverant-Nexus/issues
- **Discord**: https://discord.gg/adverant
- **Email**: support@adverant.com

---

## 🏆 Awards & Recognition

Built to compete in HotelTechAwards 2025 categories:
- Best Property Management System
- Best Innovation in Guest Experience
- Best Use of AI in Hospitality

**Competitive Advantages:**
- ✅ Only PMS with AI damage detection
- ✅ Only PMS with predictive maintenance
- ✅ Only PMS with inventory forecasting
- ✅ Only PMS with Nexus GraphRAG learning
- ✅ Multi-brand smart lock support (50+ brands)
- ✅ Hotel-grade guest experience for vacation rentals

---

**Built with ❤️ by the Adverant team**
