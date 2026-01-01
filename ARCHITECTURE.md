# PropertyAI Architecture

Technical architecture and system design for the PropertyAI property management plugin.

---

## System Overview

```mermaid
flowchart TB
    subgraph Client Layer
        A[Nexus Dashboard] --> B[API Gateway]
        C[Tenant Portal] --> B
        D[Mobile App] --> B
    end

    subgraph PropertyAI Service
        B --> E[REST API Layer]
        E --> F[Property Manager]
        E --> G[Tenant Manager]
        E --> H[Maintenance Engine]
        E --> I[Financial Engine]
    end

    subgraph AI Services
        H --> J[MageAgent]
        I --> J
    end

    subgraph Data Layer
        F --> K[(PostgreSQL)]
        G --> K
        H --> K
        I --> K
        F --> L[(Document Storage)]
    end
```

---

## Core Components

### 1. REST API Layer

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/properties` | GET | List properties |
| `/api/v1/tenants` | POST | Add tenant |
| `/api/v1/maintenance` | POST | Create maintenance request |
| `/api/v1/financials/:propertyId` | GET | Get financial summary |

### 2. Property Manager

Handles property lifecycle and configuration.

**Capabilities:**
- Property CRUD operations
- Unit management
- Amenity tracking
- Document management

### 3. Tenant Manager

Manages tenant relationships and communications.

**Features:**
- Tenant profiles
- Lease management
- Communication history
- Payment tracking

### 4. Maintenance Engine

AI-powered maintenance request handling.

```mermaid
stateDiagram-v2
    [*] --> Submitted
    Submitted --> Triaged: AI Analysis
    Triaged --> Assigned: Vendor Matched
    Assigned --> Scheduled: Time Confirmed
    Scheduled --> InProgress: Work Started
    InProgress --> Completed: Work Done
    Completed --> Verified: Inspection Passed
    Verified --> [*]
```

### 5. Financial Engine

Comprehensive financial tracking and reporting.

**Metrics:**
- Revenue tracking
- Expense management
- P&L statements
- Cap rate calculations
- Cash flow analysis

---

## Data Model

```mermaid
erDiagram
    PROPERTIES ||--o{ UNITS : contains
    UNITS ||--o{ LEASES : has
    TENANTS ||--o{ LEASES : signs
    PROPERTIES ||--o{ MAINTENANCE : receives
    PROPERTIES ||--o{ FINANCIALS : generates
    LEASES ||--o{ PAYMENTS : includes

    PROPERTIES {
        string property_id PK
        string name
        string address
        string type
        string status
        jsonb amenities
    }

    UNITS {
        string unit_id PK
        string property_id FK
        string unit_number
        integer bedrooms
        integer bathrooms
        decimal sqft
        decimal rent_amount
    }

    TENANTS {
        string tenant_id PK
        string name
        string email
        string phone
        decimal credit_score
        jsonb screening_results
    }

    LEASES {
        uuid lease_id PK
        string unit_id FK
        string tenant_id FK
        date start_date
        date end_date
        decimal rent_amount
        string status
    }

    MAINTENANCE {
        uuid request_id PK
        string property_id FK
        string category
        string priority
        string status
        text description
        timestamp created_at
    }

    FINANCIALS {
        uuid transaction_id PK
        string property_id FK
        string type
        decimal amount
        date transaction_date
        string category
    }
```

---

## Security Model

### Authentication
- Bearer token via Nexus API Gateway
- Tenant portal uses separate auth flow
- Multi-factor authentication for sensitive operations

### Authorization
- Role-based: Owner, Manager, Maintenance, Tenant
- Property-level permissions
- Data isolation by portfolio

```mermaid
flowchart LR
    A[Request] --> B{Valid Token?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Role Check}
    D -->|Owner| E[Full Portfolio Access]
    D -->|Manager| F[Assigned Properties]
    D -->|Tenant| G[Own Unit Only]
```

---

## Deployment Architecture

### Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus-propertymgmt
  namespace: nexus-plugins
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexus-propertymgmt
  template:
    spec:
      containers:
      - name: property-api
        image: adverant/nexus-propertymgmt:1.0.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /live
            port: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
```

### Resource Allocation

| Resource | Request | Limit |
|----------|---------|-------|
| CPU | 500m | 1000m |
| Memory | 1Gi | 2Gi |
| Disk | 5Gi | 10Gi |

---

## Integration Points

### Nexus Platform

```mermaid
flowchart LR
    subgraph Nexus
        A[API Gateway]
        B[Auth Service]
    end

    subgraph PropertyAI
        C[API Layer]
        D[Core Services]
    end

    subgraph Plugins
        E[Cleaning]
        F[DamageTracking]
        G[Pricing]
    end

    A --> C
    B --> C
    D <--> E
    D <--> F
    D <--> G
```

### Event Bus

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `property.lease.created` | Lease details | Billing, Notifications |
| `property.maintenance.created` | Request details | Vendors, Scheduling |
| `property.payment.received` | Payment details | Accounting, Reports |

---

## Performance

### Rate Limits

| Tier | Requests/min | Concurrent |
|------|--------------|------------|
| Starter | 60 | 5 |
| Professional | 300 | 15 |
| Enterprise | Custom | Custom |

### Caching

- Property data: 5 minute TTL
- Financial summaries: 1 hour TTL
- Tenant profiles: 15 minute TTL

---

## Monitoring

### Metrics (Prometheus)

```
# Property metrics
property_units_total{status}
property_occupancy_rate{property_id}
property_maintenance_open{priority}

# Financial metrics
property_revenue_total{property_id}
property_expenses_total{category}
property_noi{property_id}
```

### Alerting

| Alert | Condition | Severity |
|-------|-----------|----------|
| High Vacancy | >20% vacant units | Warning |
| Payment Overdue | >5 days late | Warning |
| Emergency Maintenance | Unassigned >1 hour | Critical |

---

## Next Steps

- [Quick Start Guide](./QUICKSTART.md) - Get started quickly
- [Use Cases](./USE-CASES.md) - Implementation scenarios
- [API Reference](./docs/api-reference/endpoints.md) - Complete docs
