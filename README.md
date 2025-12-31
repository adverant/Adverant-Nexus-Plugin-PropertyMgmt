
<h1 align="center">PropertyMgmt</h1>

<p align="center">
  <strong>Smart Property Management Platform</strong>
</p>

<p align="center">
  <a href="https://github.com/adverant/Adverant-Nexus-Plugin-PropertyMgmt/actions"><img src="https://github.com/adverant/Adverant-Nexus-Plugin-PropertyMgmt/workflows/CI/badge.svg" alt="CI Status"></a>
  <a href="https://github.com/adverant/Adverant-Nexus-Plugin-PropertyMgmt/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License"></a>
  <a href="https://marketplace.adverant.ai/plugins/property-mgmt"><img src="https://img.shields.io/badge/Nexus-Marketplace-purple.svg" alt="Nexus Marketplace"></a>
  <a href="https://discord.gg/adverant"><img src="https://img.shields.io/discord/123456789?color=7289da&label=Discord" alt="Discord"></a>
</p>

<p align="center">
  <a href="#features">Features</a> -
  <a href="#quick-start">Quick Start</a> -
  <a href="#use-cases">Use Cases</a> -
  <a href="#pricing">Pricing</a> -
  <a href="#documentation">Documentation</a>
</p>

---

## Streamline Your Property Operations

**PropertyMgmt** is a Nexus Marketplace plugin that provides comprehensive property management capabilities for short-term rentals, vacation homes, and multi-unit properties. From lease management to maintenance scheduling, PropertyMgmt gives you complete control over your property portfolio.

### Why PropertyMgmt?

- **Centralized Control**: Manage all properties from a single dashboard
- **Smart Scheduling**: AI-powered maintenance scheduling and reminders
- **Tenant Portal**: Self-service portal for tenants and guests
- **Automated Workflows**: Reduce manual tasks by 80%
- **Real-time Analytics**: Track occupancy, revenue, and performance metrics

---

## Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Property Registry** | Centralized database for all property details, amenities, and configurations |
| **Reservation Management** | End-to-end booking lifecycle from inquiry to checkout |
| **Lease Management** | Digital lease creation, signing, and renewal workflows |
| **Maintenance Scheduling** | Preventive and reactive maintenance task management |
| **Tenant Portal** | Self-service access for tenants to submit requests and view documents |
| **Financial Tracking** | Revenue tracking, expense management, and reporting |

### Property Types Supported

- **Short-term Rentals**: Airbnb, VRBO, and direct booking properties
- **Vacation Homes**: Seasonal rental properties
- **Multi-family Units**: Apartment buildings and complexes
- **Commercial Properties**: Office spaces and retail units
- **Mixed-use Properties**: Combined residential and commercial

### Integration Ready

- **Channel Managers**: Sync with Airbnb, VRBO, Booking.com
- **Payment Processors**: Stripe, Square, PayPal integration
- **Accounting Software**: QuickBooks, Xero sync
- **Smart Locks**: Schlage, August, Yale integration
- **IoT Devices**: Thermostats, sensors, security systems

---

## Quick Start

### Installation

```bash
# Via Nexus Marketplace (Recommended)
nexus plugin install nexus-property-management

# Or via API
curl -X POST "https://api.adverant.ai/plugins/nexus-property-management/install" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Create Your First Property

```bash
curl -X POST "https://api.adverant.ai/proxy/nexus-property-management/api/v1/properties" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunset Beach House",
    "type": "vacation_rental",
    "address": {
      "street": "123 Ocean Drive",
      "city": "Miami Beach",
      "state": "FL",
      "zip": "33139"
    },
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 8
  }'
```

---

## Use Cases

### Vacation Rental Operators

#### 1. Multi-Property Management
Manage 10, 50, or 500+ properties from a single dashboard. Automate check-ins, cleaning schedules, and guest communications.

#### 2. Revenue Optimization
Track occupancy rates, average daily rates, and revenue per property. Identify underperforming assets and optimization opportunities.

### Property Management Companies

#### 3. Tenant Lifecycle Management
From application to move-out, manage the complete tenant journey with automated workflows and document generation.

#### 4. Maintenance Coordination
Schedule preventive maintenance, track work orders, and coordinate with vendors through a unified platform.

---

## Pricing

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| **Price** | $49/mo | $149/mo | $499/mo |
| **Properties** | Up to 10 | Up to 50 | Unlimited |
| **Reservations/month** | 100 | 500 | Unlimited |
| **Tenant Portal** | Basic | Full | Custom Branded |
| **Integrations** | 2 | 10 | Unlimited |
| **API Access** | Limited | Full | Full + Webhooks |
| **Support** | Email | Priority | Dedicated |

[View on Nexus Marketplace](https://marketplace.adverant.ai/plugins/property-mgmt)

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/properties` | Create a new property |
| `GET` | `/properties` | List all properties |
| `GET` | `/properties/:id` | Get property details |
| `PUT` | `/properties/:id` | Update property |
| `POST` | `/reservations` | Create reservation |
| `GET` | `/reservations` | List reservations |

Full API documentation: [docs/api-reference/endpoints.md](docs/api-reference/endpoints.md)

---

## Documentation

- [Installation Guide](docs/getting-started/installation.md)
- [Configuration](docs/getting-started/configuration.md)
- [Quick Start](docs/getting-started/quickstart.md)
- [API Reference](docs/api-reference/endpoints.md)

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/adverant/Adverant-Nexus-Plugin-PropertyMgmt.git
cd Adverant-Nexus-Plugin-PropertyMgmt
npm install
npm run prisma:generate
npm run dev
```

---

## Community & Support

- **Documentation**: [docs.adverant.ai/plugins/property-mgmt](https://docs.adverant.ai/plugins/property-mgmt)
- **Discord**: [discord.gg/adverant](https://discord.gg/adverant)
- **Email**: support@adverant.ai
- **GitHub Issues**: [Report a bug](https://github.com/adverant/Adverant-Nexus-Plugin-PropertyMgmt/issues)

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with care by <a href="https://adverant.ai">Adverant</a></strong>
</p>

<p align="center">
  <a href="https://adverant.ai">Website</a> -
  <a href="https://docs.adverant.ai">Docs</a> -
  <a href="https://marketplace.adverant.ai">Marketplace</a> -
  <a href="https://twitter.com/adverant">Twitter</a>
</p>
