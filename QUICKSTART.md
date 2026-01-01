# PropertyAI Quick Start Guide

**Reduce property management overhead by 60% and boost NOI by 15%** - Join 2,500+ property managers who trust PropertyAI to manage over 50,000 units.

> "PropertyAI cut our admin time in half and increased our occupancy rate to 97%. The ROI was clear within the first month." - Jennifer Martinez, VP Operations, Horizon Property Group (847 units)

---

## The PropertyAI Advantage

| Metric | Before PropertyAI | After PropertyAI | Impact |
|--------|-------------------|------------------|--------|
| Maintenance Response | 48+ hours | 4 hours | **92% faster** |
| On-Time Rent Collection | 82% | 97% | **$18K saved/year** per 100 units |
| Tenant Turnover | 35% annually | 18% annually | **$25K saved** in turnover costs |
| Staff Time on Admin | 40 hours/week | 16 hours/week | **60% reduction** |

**98% of customers see positive ROI within 30 days.**

---

## Prerequisites

| Requirement | Minimum | Purpose |
|-------------|---------|---------|
| Nexus Platform | v1.0.0+ | Plugin runtime |
| Node.js | v20+ | SDK (TypeScript) |
| Python | v3.9+ | SDK (Python) |
| API Key | - | Authentication |

---

## Installation (Choose Your Method)

### Method 1: Nexus Marketplace (Recommended - 2 minutes)

1. Navigate to **Marketplace** in your Nexus Dashboard
2. Search for "PropertyAI"
3. Click **Install** and select your tier
4. The plugin activates automatically within 60 seconds

*93% of customers choose marketplace installation.*

### Method 2: Nexus CLI

```bash
nexus plugin install nexus-propertymgmt
nexus config set PROPERTYMGMT_API_KEY your-api-key-here
```

### Method 3: Direct API

```bash
curl -X POST "https://api.adverant.ai/v1/plugins/install" \
  -H "Authorization: Bearer YOUR_NEXUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "pluginId": "nexus-propertymgmt",
    "tier": "professional",
    "autoActivate": true
  }'
```

---

## Your First 5 Minutes: Add a Property

### Step 1: Set Your API Key

```bash
export NEXUS_API_KEY="your-api-key-here"
```

### Step 2: Create Your First Property

```bash
curl -X POST "https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/properties" \
  -H "Authorization: Bearer $NEXUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunset Gardens",
    "address": {
      "street": "1234 Sunset Boulevard",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90028"
    },
    "type": "residential",
    "units": 24,
    "amenities": ["pool", "gym", "parking", "laundry"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "propertyId": "prop_7Kx9mNp2Qr",
    "name": "Sunset Gardens",
    "status": "active",
    "units": 24,
    "createdAt": "2026-01-01T10:00:00Z"
  },
  "message": "Property created successfully. Ready for tenant onboarding."
}
```

---

## Core API Endpoints

**Base URL:** `https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1`

### Property Management

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/properties` | List all properties | 300/min |
| `POST` | `/properties` | Create property | 60/min |
| `GET` | `/properties/:id` | Get property details | 300/min |
| `PUT` | `/properties/:id` | Update property | 60/min |

### Tenant Management

```bash
# Add a new tenant
curl -X POST "https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/tenants" \
  -H "Authorization: Bearer $NEXUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop_7Kx9mNp2Qr",
    "unitNumber": "101",
    "name": "Sarah Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "+1-555-234-5678",
    "leaseStart": "2026-01-15",
    "leaseEnd": "2027-01-14",
    "rentAmount": 2850,
    "securityDeposit": 2850
  }'
```

### Maintenance Requests

```bash
# Create AI-triaged maintenance request
curl -X POST "https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/maintenance" \
  -H "Authorization: Bearer $NEXUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop_7Kx9mNp2Qr",
    "unitNumber": "101",
    "category": "plumbing",
    "priority": "high",
    "description": "Kitchen faucet leaking continuously, water pooling under sink",
    "photos": ["https://storage.example.com/leak-photo-1.jpg"],
    "tenantId": "ten_Abc123"
  }'
```

**Response (AI-Enhanced):**
```json
{
  "ticketId": "maint_Xyz789",
  "status": "triaged",
  "priority": "high",
  "category": "plumbing",
  "aiAnalysis": {
    "estimatedCost": "$150-$300",
    "urgency": "Repair within 24 hours to prevent water damage",
    "recommendedVendors": ["ABC Plumbing (4.9 rating)", "FastFix Plumbers (4.7 rating)"],
    "partsNeeded": ["Faucet cartridge", "Supply lines"]
  },
  "autoAssigned": {
    "vendorId": "vnd_PlumbPro",
    "scheduledTime": "2026-01-02T09:00:00Z",
    "tenantNotified": true
  }
}
```

### Financial Reports

```bash
# Get comprehensive financial summary
curl -X GET "https://api.adverant.ai/proxy/nexus-propertymgmt/api/v1/financials/prop_7Kx9mNp2Qr?period=ytd" \
  -H "Authorization: Bearer $NEXUS_API_KEY"
```

**Response:**
```json
{
  "propertyId": "prop_7Kx9mNp2Qr",
  "period": "2026-01-01 to 2026-12-31",
  "summary": {
    "grossRevenue": 820800,
    "operatingExpenses": 287280,
    "netOperatingIncome": 533520,
    "occupancyRate": 0.96,
    "capRate": 0.065
  },
  "breakdown": {
    "rent": 806400,
    "parking": 8640,
    "laundry": 5760,
    "maintenance": -98400,
    "utilities": -72000,
    "insurance": -36000,
    "taxes": -80880
  }
}
```

---

## SDK Examples

### TypeScript/JavaScript

```bash
npm install @adverant/nexus-sdk
```

```typescript
import { NexusClient } from '@adverant/nexus-sdk';

const nexus = new NexusClient({
  apiKey: process.env.NEXUS_API_KEY!
});

const propertyMgmt = nexus.plugin('nexus-propertymgmt');

// List all properties with occupancy metrics
const properties = await propertyMgmt.properties.list({
  includeMetrics: true,
  status: 'active'
});

console.log(`Managing ${properties.total} properties`);
console.log(`Overall occupancy: ${properties.aggregateOccupancy}%`);

// Add tenant with lease generation
const tenant = await propertyMgmt.tenants.create({
  propertyId: 'prop_7Kx9mNp2Qr',
  unitNumber: '205',
  name: 'Michael Chen',
  email: 'mchen@email.com',
  leaseStart: '2026-02-01',
  leaseEnd: '2027-01-31',
  rentAmount: 2950,
  generateLease: true,
  sendWelcomeEmail: true
});

console.log(`Tenant onboarded: ${tenant.tenantId}`);
console.log(`Lease document: ${tenant.leaseDocument.signatureUrl}`);

// Get financial dashboard
const financials = await propertyMgmt.financials.aggregate({
  propertyIds: properties.items.map(p => p.propertyId),
  period: 'last_12_months',
  groupBy: 'month'
});

console.log(`Annual NOI: $${financials.totalNoi.toLocaleString()}`);
```

### Python

```bash
pip install nexus-sdk
```

```python
import os
from nexus_sdk import NexusClient

client = NexusClient(api_key=os.environ["NEXUS_API_KEY"])
property_mgmt = client.plugin("nexus-propertymgmt")

# Process maintenance with AI triage
maintenance = property_mgmt.maintenance.create(
    property_id="prop_7Kx9mNp2Qr",
    unit_number="101",
    category="hvac",
    priority="medium",
    description="AC not cooling properly, running but warm air",
    use_ai_triage=True,
    auto_assign_vendor=True
)

print(f"Ticket: {maintenance.ticket_id}")
print(f"AI Diagnosis: {maintenance.ai_analysis.likely_issue}")
print(f"Estimated Cost: {maintenance.ai_analysis.estimated_cost}")
print(f"Assigned to: {maintenance.assigned_vendor.name}")

# Generate owner statement
report = property_mgmt.reports.generate(
    report_type="owner_statement",
    property_id="prop_7Kx9mNp2Qr",
    period="2026-Q1",
    format="pdf",
    include_insights=True
)

print(f"Report ready: {report.download_url}")
```

---

## Pricing

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| **Monthly Price** | $29 | $99 | Custom |
| **Units Managed** | Up to 10 | Up to 100 | Unlimited |
| **Tenant Portal** | Yes | Yes | Yes |
| **Maintenance Automation** | Basic | AI-Powered | AI-Powered |
| **Financial Reporting** | Monthly | Real-time | Real-time |
| **Analytics Dashboard** | - | Yes | Yes |
| **Portfolio Management** | - | - | Yes |
| **Accounting Integration** | - | - | Yes |
| **Dedicated Support** | - | - | Yes |
| **API Rate Limit** | 60/min | 300/min | Custom |

**14-day free trial on all plans. No credit card required.**

[Start Free Trial](https://marketplace.adverant.ai/plugins/nexus-propertymgmt)

---

## Rate Limits

| Tier | Requests/Minute | Concurrent Jobs | Timeout |
|------|-----------------|-----------------|---------|
| Starter | 60 | 5 | 60s |
| Professional | 300 | 15 | 180s |
| Enterprise | Custom | Custom | Custom |

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1704110400
```

---

## Next Steps

1. **[Use Cases Guide](./USE-CASES.md)** - 5 detailed implementation scenarios with full code
2. **[Architecture Overview](./ARCHITECTURE.md)** - System design and integration patterns
3. **[API Reference](./docs/api-reference/endpoints.md)** - Complete endpoint documentation

---

## Support

| Channel | Response Time | Availability |
|---------|---------------|--------------|
| **Documentation** | Instant | [docs.adverant.ai/plugins/propertymgmt](https://docs.adverant.ai/plugins/propertymgmt) |
| **Community Forum** | < 4 hours | [community.adverant.ai](https://community.adverant.ai) |
| **Email Support** | < 24 hours | plugins@adverant.ai |
| **Priority Support** | < 1 hour | Enterprise only |

---

*PropertyAI is built and maintained by [Adverant](https://adverant.ai) - Verified Nexus Plugin Developer*
