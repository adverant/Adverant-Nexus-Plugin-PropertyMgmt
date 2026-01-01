# PropertyAI Use Cases

Real-world implementation scenarios for AI-powered property management.

---

## Use Case 1: Automated Maintenance Workflow

### Problem

Property managers spend 8+ hours weekly coordinating maintenance requests. Delays in response frustrate tenants and lead to more expensive repairs.

### Solution

Implement AI-powered maintenance triage, vendor assignment, and tracking.

### Implementation

```typescript
import { NexusClient } from '@adverant/nexus-sdk';

class MaintenanceWorkflow {
  private property;

  constructor(nexusClient: NexusClient) {
    this.property = nexusClient.plugin('nexus-propertymgmt');
  }

  async processMaintenanceRequest(request: MaintenanceRequest) {
    // AI categorizes and prioritizes the request
    const triage = await this.property.maintenance.triage({
      description: request.description,
      propertyId: request.propertyId,
      photos: request.photos
    });

    // Find available vendors
    const vendors = await this.property.vendors.findAvailable({
      category: triage.category,
      urgency: triage.priority,
      location: request.propertyLocation,
      preferredVendors: await this.getPreferredVendors(request.propertyId)
    });

    // Auto-assign if high priority
    if (triage.priority === 'emergency') {
      const assignment = await this.property.maintenance.assign({
        requestId: request.id,
        vendorId: vendors[0].vendorId,
        scheduledTime: 'next_available',
        notifyTenant: true
      });

      return { status: 'assigned', assignment };
    }

    // Schedule for non-emergency
    const schedule = await this.property.maintenance.schedule({
      requestId: request.id,
      vendorOptions: vendors.slice(0, 3),
      preferredTimes: await this.getTenantAvailability(request.tenantId)
    });

    return { status: 'scheduled', schedule };
  }
}
```

### Business Impact

- **75% reduction** in response time
- **40% fewer** emergency escalations
- **$15,000/year** saved in repair costs through early intervention

---

## Use Case 2: Rent Collection Automation

### Problem

Chasing late rent payments consumes significant staff time. Inconsistent follow-up leads to revenue leakage.

### Solution

Automated rent reminders, payment processing, and escalation workflows.

### Implementation

```python
from adverant_nexus import NexusClient
from datetime import datetime, timedelta

class RentCollectionService:
    def __init__(self, nexus_client: NexusClient):
        self.property = nexus_client.plugin("nexus-propertymgmt")

    async def process_rent_cycle(self, month: str):
        # Get all active leases
        leases = await self.property.leases.list(
            status="active",
            rent_due_month=month
        )

        for lease in leases.items:
            # Check payment status
            payment = await self.property.payments.check(
                lease_id=lease.lease_id,
                month=month
            )

            if payment.status == "paid":
                continue

            # Calculate days overdue
            days_overdue = (datetime.now() - lease.rent_due_date).days

            if days_overdue < 0:
                # Send reminder before due date
                await self.property.notifications.send(
                    tenant_id=lease.tenant_id,
                    template="rent_reminder",
                    data={"due_date": lease.rent_due_date, "amount": lease.rent_amount}
                )
            elif days_overdue <= 5:
                # Grace period reminder
                await self.property.notifications.send(
                    tenant_id=lease.tenant_id,
                    template="rent_overdue_grace",
                    data={"days_overdue": days_overdue}
                )
            elif days_overdue <= 14:
                # Late fee applied
                await self.property.payments.apply_late_fee(
                    lease_id=lease.lease_id,
                    month=month
                )
                await self.property.notifications.send(
                    tenant_id=lease.tenant_id,
                    template="rent_late_fee",
                    data={"late_fee": lease.late_fee_amount}
                )
            else:
                # Escalate to property manager
                await self.property.escalations.create(
                    lease_id=lease.lease_id,
                    reason="persistent_non_payment",
                    recommended_action="contact_tenant"
                )
```

### Business Impact

- **95% on-time payment rate** (up from 82%)
- **60% reduction** in collection staff time
- **$8,000/month** recovered late fees

---

## Use Case 3: Portfolio Financial Analytics

### Problem

Property owners lack visibility into portfolio performance. Manual financial reporting takes days to compile.

### Solution

Real-time financial dashboards with AI-generated insights.

### Implementation

```typescript
class PortfolioAnalytics {
  private property;

  constructor(nexusClient: NexusClient) {
    this.property = nexusClient.plugin('nexus-propertymgmt');
  }

  async getPortfolioSummary(ownerId: string) {
    const portfolio = await this.property.portfolio.get({
      ownerId,
      includeMetrics: true
    });

    // Get financial summary across all properties
    const financials = await this.property.financials.aggregate({
      propertyIds: portfolio.properties.map(p => p.propertyId),
      period: 'ytd',
      groupBy: 'property'
    });

    // AI-generated insights
    const insights = await this.property.analytics.insights({
      portfolioId: portfolio.portfolioId,
      focus: ['underperforming', 'opportunities', 'risks']
    });

    return {
      summary: {
        totalProperties: portfolio.properties.length,
        totalUnits: portfolio.totalUnits,
        occupancyRate: portfolio.occupancyRate,
        totalRevenue: financials.totalRevenue,
        totalExpenses: financials.totalExpenses,
        netOperatingIncome: financials.noi,
        capRate: financials.capRate
      },
      propertyBreakdown: financials.byProperty,
      aiInsights: insights.recommendations,
      alerts: insights.alerts
    };
  }

  async generateOwnerReport(ownerId: string, period: string) {
    const report = await this.property.reports.generate({
      type: 'owner_statement',
      ownerId,
      period,
      format: 'pdf',
      includeCharts: true,
      includeInsights: true
    });

    return {
      reportUrl: report.downloadUrl,
      generatedAt: report.generatedAt
    };
  }
}
```

### Business Impact

- **Real-time visibility** into portfolio performance
- **80% reduction** in report generation time
- **Data-driven decisions** on property investments

---

## Use Case 4: Tenant Screening and Onboarding

### Problem

Manual tenant screening takes 3-5 days. Inconsistent screening leads to problematic tenants.

### Solution

AI-powered tenant screening with automated onboarding.

### Implementation

```typescript
class TenantScreeningService {
  private property;

  constructor(nexusClient: NexusClient) {
    this.property = nexusClient.plugin('nexus-propertymgmt');
  }

  async screenApplicant(applicationId: string) {
    const application = await this.property.applications.get(applicationId);

    // Run comprehensive screening
    const screening = await this.property.screening.run({
      applicantInfo: application.applicant,
      screeningType: 'comprehensive',
      checks: [
        'credit_score',
        'background_check',
        'eviction_history',
        'income_verification',
        'rental_history'
      ]
    });

    // AI evaluates overall risk
    const riskAssessment = await this.property.screening.assess({
      screeningId: screening.screeningId,
      propertyRequirements: {
        minCreditScore: 650,
        incomeToRentRatio: 3.0,
        noEvictions: true
      }
    });

    if (riskAssessment.recommendation === 'approve') {
      // Auto-generate lease
      const lease = await this.property.leases.generate({
        applicationId,
        templateId: application.propertyId,
        terms: application.requestedTerms
      });

      // Send for e-signature
      await this.property.documents.sendForSignature({
        documentId: lease.documentId,
        signers: [application.applicant.email]
      });
    }

    return {
      screeningId: screening.screeningId,
      riskScore: riskAssessment.riskScore,
      recommendation: riskAssessment.recommendation,
      factors: riskAssessment.factors
    };
  }
}
```

### Business Impact

- **24-hour** screening turnaround (down from 5 days)
- **50% reduction** in problematic tenant placements
- **Consistent, fair** screening criteria

---

## Use Case 5: Lease Renewal Optimization

### Problem

Manual lease renewal process leads to missed renewals and tenant turnover. Determining optimal rent increases is guesswork.

### Solution

Automated renewal campaigns with AI-optimized pricing.

### Implementation

```python
class LeaseRenewalOptimizer:
    def __init__(self, nexus_client: NexusClient):
        self.property = nexus_client.plugin("nexus-propertymgmt")

    async def process_upcoming_renewals(self, days_ahead: int = 90):
        # Get leases expiring soon
        expiring = await self.property.leases.list(
            expiring_within_days=days_ahead,
            status="active"
        )

        for lease in expiring.items:
            # Analyze tenant value
            tenant_analysis = await self.property.tenants.analyze(
                tenant_id=lease.tenant_id,
                metrics=["payment_history", "maintenance_requests", "tenure"]
            )

            # Get market rent data
            market_data = await self.property.market.analyze(
                property_id=lease.property_id,
                comp_radius_miles=2
            )

            # AI recommends renewal terms
            recommendation = await self.property.leases.recommend_renewal(
                lease_id=lease.lease_id,
                tenant_score=tenant_analysis.score,
                current_rent=lease.rent_amount,
                market_rent=market_data.median_rent,
                retention_priority="high" if tenant_analysis.score > 85 else "normal"
            )

            # Generate and send renewal offer
            offer = await self.property.leases.create_renewal_offer(
                lease_id=lease.lease_id,
                new_rent=recommendation.recommended_rent,
                term_options=[12, 18, 24],
                incentives=recommendation.incentives
            )

            await self.property.notifications.send(
                tenant_id=lease.tenant_id,
                template="renewal_offer",
                data=offer
            )

            return {
                "processed": len(expiring.items),
                "offers_sent": len([l for l in expiring.items if l.offer_sent])
            }
```

### Business Impact

- **85% renewal rate** (up from 65%)
- **$50,000/year** saved in turnover costs
- **Optimized rent increases** based on market data

---

## Integration with Nexus Ecosystem

| Plugin | Integration |
|--------|-------------|
| **GuestExperience** | Guest profiles for vacation rentals |
| **Cleaning** | Schedule turnovers based on bookings |
| **DamageTracking** | Link damage to tenants/guests |
| **Pricing** | Dynamic rental pricing |

---

## Next Steps

- [Architecture Overview](./ARCHITECTURE.md) - Technical deep-dive
- [API Reference](./docs/api-reference/endpoints.md) - Complete endpoint docs
- [Support](https://community.adverant.ai) - Community forum
