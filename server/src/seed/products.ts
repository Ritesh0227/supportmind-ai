// server/src/seed/products.ts
import { Product } from '../types.js';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-nexusdesk',
    slug: 'nexusdesk-core',
    name: 'NexusDesk Core',
    description: 'Enterprise ticketing portal, unified agent workspace, SLA management, and customer portal.',
    icon: 'Layout',
  },
  {
    id: 'prod-cloudscale',
    slug: 'cloudscale-api',
    name: 'CloudScale API',
    description: 'Developer REST/GraphQL APIs, real-time webhooks, rate limits, and authentication tokens.',
    icon: 'Cpu',
  },
  {
    id: 'prod-authshield',
    slug: 'authshield-pro',
    name: 'AuthShield Pro',
    description: 'Identity security suite, multi-factor authentication (MFA), SAML 2.0 SSO, and audit logging.',
    icon: 'Shield',
  },
  {
    id: 'prod-billing',
    slug: 'billing-engine',
    name: 'BillingEngine',
    description: 'Automated recurring invoicing, usage metering, payment gateways, and tax calculation.',
    icon: 'CreditCard',
  },
  {
    id: 'prod-shiptrack',
    slug: 'shiptrack-express',
    name: 'ShipTrack Express',
    description: 'Global shipment fulfillment tracking, multi-carrier label dispatch, and automated parcel returns.',
    icon: 'Truck',
  },
];
