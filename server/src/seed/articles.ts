// server/src/seed/articles.ts
import { Article } from '../types.js';

export const SEED_ARTICLES: Article[] = [
  // 1. Account Management
  {
    id: 'art-pwd-reset',
    title: 'How to Reset Your Account Password',
    slug: 'how-to-reset-password',
    category_id: 'cat-account-mgmt',
    product: 'AuthShield Pro',
    troubleshooting: "1. If no reset email arrives within 5 minutes, inspect your spam or junk folder.\n2. Ensure your email provider allows automated mail from noreply@supportmind.ai.\n3. Reset links expire after 60 minutes; request a fresh link if expired.",
    excerpt: 'Follow this step-by-step procedure to reset your forgotten password or update your existing credentials securely.',
    keywords: ['password', 'reset', 'forgot', 'login', 'credentials', 'security', 'account access'],
    tags: ['Security', 'Account', 'Authentication'],
    status: 'published',
    views_count: 342,
    helpful_count: 58,
    not_helpful_count: 2,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-02-15T14:30:00Z',
    content: `## Password Reset Procedure

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

If you have forgotten your password or are unable to log in to your SupportMind account, follow these verified steps to regain access:

1. Navigate to the **Sign In** screen.
2. Click the **"Forgot Password?"** link below the password input field.
3. Enter the email address associated with your account and click **"Send Reset Link"**.
4. Check your inbox for a message with the subject line *"Reset Your SupportMind AI Password"*.
5. Click the secure link inside the email (valid for 60 minutes).
6. Enter and confirm your new password. Passwords must contain at least 8 characters, including one uppercase letter, one number, and one symbol.
7. Click **"Save New Password"** and log in with your updated credentials.

> **Note:** If you do not see the reset email within 5 minutes, inspect your spam or junk folder. If issues persist, verify that you entered the exact email address linked to your account.`
  },
  {
    id: 'art-email-change',
    title: 'How to Change Your Registered Email Address',
    slug: 'how-to-change-email-address',
    category_id: 'cat-account-mgmt',
    product: 'AuthShield Pro',
    troubleshooting: "1. Check the new email inbox for the 6-digit verification code.\n2. Verification codes are valid for 15 minutes.\n3. If you no longer have access to your old email, contact identity support.",
    excerpt: 'Learn how to update the primary email address linked to your account for notifications and billing.',
    keywords: ['change email', 'update email', 'email address', 'primary email', 'account settings'],
    tags: ['Account', 'Settings', 'Profile'],
    status: 'published',
    views_count: 184,
    helpful_count: 31,
    not_helpful_count: 1,
    created_at: '2026-01-12T11:00:00Z',
    updated_at: '2026-01-20T16:00:00Z',
    content: `## Changing Your Account Email Address

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

To modify the email address tied to your SupportMind user profile:

1. Log in to your SupportMind account.
2. Click your profile avatar in the upper right-hand corner and choose **Account Settings**.
3. Under the **Profile & Security** tab, locate the **Email Address** field.
4. Click **"Edit Email"** next to your current address.
5. Enter your new primary email address and confirm your current password for verification.
6. A 6-digit confirmation code will be dispatched to your new email address.
7. Enter the 6-digit code in the verification modal to finalize the update.

> **Important:** Your invoice notifications and account alert emails will immediately transfer to the updated address upon verification.`
  },
  {
    id: 'art-mfa-setup',
    title: 'Configuring Multi-Factor Authentication (MFA)',
    slug: 'configuring-multi-factor-authentication',
    category_id: 'cat-account-mgmt',
    product: 'AuthShield Pro',
    troubleshooting: "1. Ensure your mobile device time is synchronized with network time.\n2. If you lost your phone, enter one of your 10 one-time emergency backup codes.\n3. Organization admins can initiate an MFA reset after identity verification.",
    excerpt: 'Enhance your account security by enabling Two-Factor Authentication using authenticator apps.',
    keywords: ['mfa', '2fa', 'two factor', 'security', 'authenticator', 'totp'],
    tags: ['Security', 'MFA', 'Account'],
    status: 'published',
    views_count: 120,
    helpful_count: 22,
    not_helpful_count: 0,
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-02-01T12:00:00Z',
    content: `## Multi-Factor Authentication (MFA) Setup

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

To protect your organization and data against unauthorized access, SupportMind supports standard TOTP-based authentication (Google Authenticator, Authy, 1Password):

1. Go to **Settings > Security > Multi-Factor Authentication**.
2. Toggle **"Enable MFA"** to ON.
3. Scan the displayed QR code with your mobile authenticator app.
4. Input the 6-digit one-time code shown in your app into the prompt.
5. Download or print your one-time backup recovery codes and store them in a secure location.`
  },

  // 2. Billing and Payments
  {
    id: 'art-find-invoice',
    title: 'Where to Find and Download Your Invoices',
    slug: 'where-to-find-invoice',
    category_id: 'cat-billing-payments',
    product: 'BillingEngine',
    troubleshooting: "1. Allow up to 10 minutes following subscription renewal for the PDF receipt to compile.\n2. Ensure browser pop-up blockers are not preventing the PDF download.\n3. Update VAT/tax IDs in Billing Settings prior to cycle close.",
    excerpt: 'Detailed instructions on accessing past billing statements, VAT receipts, and downloadable PDF invoices.',
    keywords: ['invoice', 'receipt', 'billing statement', 'download invoice', 'find invoice', 'tax invoice'],
    tags: ['Billing', 'Invoices', 'Finance'],
    status: 'published',
    views_count: 420,
    helpful_count: 76,
    not_helpful_count: 3,
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-02-18T11:00:00Z',
    content: `## Accessing Past Invoices and Payment Receipts

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

All generated payment receipts, monthly subscription invoices, and annual summaries are archived in your customer dashboard:

1. Sign in to your dashboard at SupportMind.
2. Open the navigation menu and click on **Billing & Plans**.
3. Scroll down to the **"Invoice History"** section.
4. You will see a chronological table showing:
   - Invoice Date
   - Invoice Reference Number (e.g., \`INV-2026-8890\`)
   - Billed Amount and Currency
   - Payment Status (Paid, Pending, Failed)
5. Click the **"Download PDF"** button next to any line item to save a print-ready copy for your records or accounting team.

> **Tip:** You can also configure automatic monthly invoice copies to be sent to your finance team by adding an additional billing recipient under Billing Settings.`
  },
  {
    id: 'art-declined-payment',
    title: 'Why Was My Payment Declined? Common Causes and Fixes',
    slug: 'why-was-my-payment-declined',
    category_id: 'cat-billing-payments',
    product: 'BillingEngine',
    troubleshooting: "1. Check that billing ZIP code matches your bank statement address (AVS match).\n2. Confirm card expiry date and CVV.\n3. Authorize international SaaS transactions with your card issuer.\n4. Complete the 3D Secure / OTP SMS verification within 3 minutes.",
    excerpt: 'Troubleshoot credit card errors, bank declines, 3D Secure verification timeouts, and billing address mismatches.',
    keywords: ['payment declined', 'card error', 'failed payment', 'insufficient funds', 'billing issue', '3d secure'],
    tags: ['Billing', 'Payments', 'Troubleshooting'],
    status: 'published',
    views_count: 310,
    helpful_count: 62,
    not_helpful_count: 4,
    created_at: '2026-01-14T13:00:00Z',
    updated_at: '2026-02-10T09:15:00Z',
    content: `## Troubleshooting Declined Payments

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Payment transactions can fail for several verified banking reasons. Here are the most frequent causes and recommended resolutions:

1. **Incorrect Billing ZIP / Postal Code:** Your bank's Address Verification System (AVS) requires that the billing postal code entered matches the address on your bank statement.
2. **Card Expiration or Incorrect CVV:** Double-check the 3-digit or 4-digit security code on the back of your card.
3. **Bank Fraud & International Restrictions:** Many financial institutions flag recurring online SaaS transactions or foreign currency payments. Contact your bank or card issuer and ask them to authorize charges from SupportMind.
4. **3D Secure / OTP Verification Timeout:** If your card requires an SMS code or biometric banking app confirmation, ensure you complete the authorization prompt before the 2-minute timer lapses.
5. **Insufficient Available Balance:** Ensure credit limits or debit card balances cover the full transaction amount.

**Next Step:** Once verified with your card provider, update your card details under **Billing & Plans > Payment Methods** and retry the payment.`
  },
  {
    id: 'art-payment-methods',
    title: 'Accepted Payment Methods and Currencies',
    slug: 'accepted-payment-methods-currencies',
    category_id: 'cat-billing-payments',
    product: 'BillingEngine',
    troubleshooting: "1. Verify your debit card supports recurring auto-debit transactions.\n2. For ACH/SEPA wire transfers, allow 3-5 business days for banking settlement.\n3. If PayPal fails, verify that your PayPal account has an active backup funding card.",
    excerpt: 'Review accepted credit/debit cards, digital wallets, bank transfers, and supported international currencies.',
    keywords: ['payment methods', 'credit card', 'paypal', 'apple pay', 'currencies', 'usd', 'eur'],
    tags: ['Billing', 'Payments'],
    status: 'published',
    views_count: 145,
    helpful_count: 24,
    not_helpful_count: 1,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-28T14:00:00Z',
    content: `## Supported Payment Methods

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

SupportMind accepts the following verified payment methods worldwide:

- **Credit & Debit Cards:** Visa, Mastercard, American Express, Discover, JCB.
- **Digital Wallets:** Apple Pay, Google Pay.
- **Enterprise Bank Transfers:** Automated Clearing House (ACH) and SEPA wire transfers for annual plans above $1,000 USD.

**Billing Currencies:** Transactions are settled in USD ($), EUR (€), and GBP (£). Currency conversions are determined by your issuing bank without additional merchant markups.`
  },

  // 3. Orders
  {
    id: 'art-track-order',
    title: 'How to Track Your Order in Real Time',
    slug: 'how-to-track-order',
    category_id: 'cat-orders',
    product: 'NexusDesk Core',
    troubleshooting: "1. Tracking numbers take 12 to 24 hours to populate on carrier scanning portals.\n2. Verify the order number matches the format ORD-2026-XXXX.\n3. If tracking displays \"Pending Carrier Pickup\" for more than 48 hours, alert support.",
    excerpt: 'Find tracking numbers, carrier status updates, estimated transit times, and shipment notifications.',
    keywords: ['track order', 'order tracking', 'tracking number', 'shipment status', 'where is my package'],
    tags: ['Orders', 'Tracking', 'Shipment'],
    status: 'published',
    views_count: 512,
    helpful_count: 94,
    not_helpful_count: 2,
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-02-12T15:00:00Z',
    content: `## Order Tracking Guide

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Once your order is processed and packaged, tracking information is automatically assigned:

1. **Email Notification:** As soon as carrier dispatch occurs, an automated email titled *"Your SupportMind Order Has Shipped!"* is sent containing your unique carrier tracking code.
2. **In-Dashboard Tracking:**
   - Go to **My Account > Orders**.
   - Select the order you wish to trace.
   - Click the **"Track Shipment"** button to view real-time location checkpoints (Label Created, In Transit, Out for Delivery, Delivered).
3. **Carrier Direct Tracking:** You can copy the tracking identifier and query the carrier website directly (FedEx, UPS, DHL, or USPS).

> **Tracking Update Delay:** Please note that carrier scans may take 12 to 24 hours to appear in the tracking portal after the shipping label is generated.`
  },
  {
    id: 'art-cancel-order',
    title: 'Can I Cancel My Order? Cancellation Window and Rules',
    slug: 'can-i-cancel-order',
    category_id: 'cat-orders',
    product: 'NexusDesk Core',
    troubleshooting: "1. The automated cancellation window is strictly 30 minutes post-purchase.\n2. If the Cancel Order button is absent, your parcel has entered fulfillment.\n3. Once shipped, decline delivery or initiate an instant return at /returns.",
    excerpt: 'Understand order cancellation rules, the strict 30-minute automated fulfillment window, and steps to cancel.',
    keywords: ['cancel order', 'cancellation', 'stop shipment', 'cancel purchase', 'order window'],
    tags: ['Orders', 'Cancellation', 'Fulfillment'],
    status: 'published',
    views_count: 388,
    helpful_count: 67,
    not_helpful_count: 5,
    created_at: '2026-01-07T14:00:00Z',
    updated_at: '2026-02-16T10:00:00Z',
    content: `## Order Cancellation Policy and Instructions

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Because our fulfillment warehouse utilizes automated pick-and-pack logistics, order cancellation is subject to a strict timeframe:

- **The 30-Minute Cancellation Window:** You may cancel an order directly from your account within **30 minutes** of submitting payment.
- **How to Cancel:**
  1. Open **My Account > Orders**.
  2. Locate your active order. If it is within 30 minutes, a red **"Cancel Order"** button will be visible.
  3. Click **"Cancel Order"** and choose a reason from the dropdown.
  4. Your order status will immediately change to *Cancelled*, and a full refund will be automatically scheduled.
- **After 30 Minutes:** If the 30-minute window has elapsed, the order has been batched for shipment and cannot be interrupted. In this scenario, allow the package to be delivered, then initiate a standard return using our Returns Portal for a full refund.`
  },
  {
    id: 'art-modify-shipping-address',
    title: 'Modifying the Shipping Address on an Active Order',
    slug: 'modifying-shipping-address',
    category_id: 'cat-orders',
    product: 'NexusDesk Core',
    troubleshooting: "1. Address changes are only accepted before the order reaches Processing status.\n2. If already dispatched, use carrier package intercept (UPS My Choice / FedEx Delivery Manager).\n3. Destination country changes cannot be processed on active orders.",
    excerpt: 'How to update an incorrect street address, apartment number, or recipient name before shipping.',
    keywords: ['change address', 'shipping address', 'modify order', 'wrong address', 'delivery address'],
    tags: ['Orders', 'Shipping', 'Address'],
    status: 'published',
    views_count: 175,
    helpful_count: 28,
    not_helpful_count: 2,
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-02-05T13:00:00Z',
    content: `## Updating Your Delivery Address

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

If you noticed a typo or incorrect address after purchasing:

1. Check your order status under **My Account > Orders**.
2. If the status is **"Processing"** (not yet dispatched): Click **"Edit Shipping Details"** and save the corrected address.
3. If the status has progressed to **"Shipped"**: The carrier is already in physical possession of the shipment. You must contact the assigned carrier directly (e.g., FedEx Delivery Manager or UPS My Choice) to request a package reroute or hold for pickup.`
  },

  // 4. Shipping and Delivery
  {
    id: 'art-shipping-times',
    title: 'Standard, Express, and International Delivery Timeframes',
    slug: 'shipping-delivery-timeframes',
    category_id: 'cat-shipping-delivery',
    product: 'ShipTrack Express',
    troubleshooting: "1. Orders placed after 2:00 PM EST ship the next business day.\n2. International transit times exclude customs clearance delays in destination country.\n3. Check carrier service alerts for regional severe weather advisories.",
    excerpt: 'Detailed turnaround estimates, regional transit schedules, and expedited shipping service tiers.',
    keywords: ['delivery times', 'shipping times', 'standard shipping', 'express delivery', 'international transit'],
    tags: ['Shipping', 'Delivery', 'Logistics'],
    status: 'published',
    views_count: 290,
    helpful_count: 53,
    not_helpful_count: 3,
    created_at: '2026-01-11T09:30:00Z',
    updated_at: '2026-02-14T11:45:00Z',
    content: `## Estimated Shipping Timeframes

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Transit durations depend on the selected tier at checkout and the destination location:

| Shipping Tier | Domestic (USA / Canada) | International (Europe / Asia) |
|---|---|---|
| **Standard Ground** | 3 – 5 Business Days | 7 – 14 Business Days |
| **Expedited Priority** | 2 – 3 Business Days | 4 – 6 Business Days |
| **Next-Day Air** | 1 Business Day (Order by 1 PM EST) | Not Available |

- **Dispatch Processing:** Orders placed before 1:00 PM EST on business days are dispatched the same day. Orders placed on weekends or federal holidays ship on the following business day.
- **Customs & Duties:** International shipments may experience customs clearance delays of 1 to 3 days depending on regional customs clearance procedures.`
  },
  {
    id: 'art-delayed-lost-package',
    title: 'Handling Delayed Shipments and Lost Packages',
    slug: 'handling-delayed-lost-shipments',
    category_id: 'cat-shipping-delivery',
    product: 'ShipTrack Express',
    troubleshooting: "1. Wait 2 business days after carrier expected delivery date for late scan updates.\n2. Inspect front porch, building concierge, or side gate.\n3. Submit an official lost parcel inquiry if tracking has no scans for 5 consecutive business days.",
    excerpt: 'Steps to take if your package is stalled in transit, marked delivered but missing, or damaged upon arrival.',
    keywords: ['delayed shipment', 'lost package', 'stolen package', 'package missing', 'late delivery'],
    tags: ['Shipping', 'Issues', 'Claims'],
    status: 'published',
    views_count: 210,
    helpful_count: 45,
    not_helpful_count: 1,
    created_at: '2026-01-16T15:00:00Z',
    updated_at: '2026-02-09T16:20:00Z',
    content: `## Missing or Stalled Shipment Protocol

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

If your shipment status shows unexpected delays:

1. **Carrier Status "In Transit - Delayed":** Weather disruptions or logistical sorting bottlenecks occasionally add 24 to 48 hours. If the status remains unchanged for more than 4 consecutive business days, reach out to our support team to file a carrier trace.
2. **Marked "Delivered" But Not Received:**
   - Inspect surrounding porches, side entrances, and building mailrooms.
   - Inquire with household members or nearby neighbors.
   - Carriers occasionally log a scan premature by up to 24 hours.
   - If not found after 24 hours, contact SupportMind customer support with your order number. We will dispatch a complimentary replacement or issue an immediate refund.`
  },
  {
    id: 'art-safe-drop-signature',
    title: 'Signature Requirements and Safe-Drop Policies',
    slug: 'signature-requirements-safedrop',
    category_id: 'cat-shipping-delivery',
    product: 'ShipTrack Express',
    troubleshooting: "1. Orders valued over $250 require direct adult physical signature.\n2. Leave electronic signature instructions via carrier portal if permitted.\n3. If missed delivery notice is left, arrange redelivery or local depot pickup.",
    excerpt: 'Information on when an adult signature is legally required for high-value deliveries.',
    keywords: ['signature required', 'safe drop', 'delivery signature', 'courier signature'],
    tags: ['Shipping', 'Security'],
    status: 'published',
    views_count: 98,
    helpful_count: 18,
    not_helpful_count: 0,
    created_at: '2026-01-25T13:00:00Z',
    updated_at: '2026-01-25T13:00:00Z',
    content: `## Signature Guidelines for Shipments

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

To safeguard high-value merchandise:

- Orders totaling **$250 USD or greater** automatically require a physical signature upon delivery.
- If you are unavailable during delivery attempts, the courier will leave a door notice with options to reschedule delivery or pick up the parcel at your local courier depot within 5 business days.`
  },

  // 5. Returns and Refunds
  {
    id: 'art-request-return',
    title: 'How to Request a Return and Generate Return Labels',
    slug: 'how-to-request-return',
    category_id: 'cat-returns-refunds',
    product: 'ShipTrack Express',
    troubleshooting: "1. Ensure item is within the 30-day return window from delivery date.\n2. Items must be in original packaging with serial numbers intact.\n3. Print the generated prepaid PDF label and tape securely to the carton.",
    excerpt: 'Complete guide on generating prepaid return shipping labels and preparing merchandise for return.',
    keywords: ['return', 'request return', 'return label', 'return item', 'return portal', 'exchange'],
    tags: ['Returns', 'Refunds', 'Policy'],
    status: 'published',
    views_count: 489,
    helpful_count: 89,
    not_helpful_count: 4,
    created_at: '2026-01-09T10:00:00Z',
    updated_at: '2026-02-17T14:00:00Z',
    content: `## Requesting a Product Return

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

SupportMind offers a hassle-free **30-day return window** starting from the recorded delivery date. To initiate a return:

1. Visit our **Online Returns Center** at \`/returns\`.
2. Enter your **Order Number** (found in your confirmation email) and your account email.
3. Select the specific items you wish to return and indicate the primary reason (e.g., wrong size, defective item, changed mind).
4. Choose your preferred reimbursement method: **Original Payment Method** or **Store Credit (+10% Bonus)**.
5. Download and print the **Prepaid Return Shipping Label**.
6. Place the item securely inside its original packaging along with all documentation and accessories.
7. Affix the prepaid label to the package exterior and drop it off at any authorized carrier drop-off location.

> **Condition Requirement:** Items must be in clean, unmarred condition with manufacturer tags intact to qualify for a full refund.`
  },
  {
    id: 'art-refund-timeframe',
    title: 'When Will I Receive My Refund? Processing Timeframes',
    slug: 'when-will-i-receive-refund',
    category_id: 'cat-returns-refunds',
    product: 'ShipTrack Express',
    troubleshooting: "1. Warehouse inspection requires 1-2 business days after parcel arrival.\n2. Credit card posting takes 5-7 business days depending on issuing bank.\n3. PayPal and Apple Pay refunds settle in 24-48 hours.",
    excerpt: 'Learn about return warehouse inspection times, financial settlement schedules, and bank posting timelines.',
    keywords: ['refund timeframe', 'receive refund', 'refund status', 'how long refund', 'money back'],
    tags: ['Refunds', 'Finance', 'Returns'],
    status: 'published',
    views_count: 435,
    helpful_count: 81,
    not_helpful_count: 2,
    created_at: '2026-01-13T12:00:00Z',
    updated_at: '2026-02-15T11:00:00Z',
    content: `## Refund Processing Timelines

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Once your returned package is sent back, here is the verified chronological refund schedule:

1. **Transit & Intake (3 – 5 Business Days):** The carrier transports the return to our centralized inspection facility.
2. **Quality Inspection (1 – 2 Business Days):** Our returns team checks the package contents to verify return condition.
3. **Refund Authorization (Instant):** Upon passing inspection, an automatic refund credit is triggered immediately, and an email confirmation is dispatched.
4. **Bank Posting Window (5 – 7 Business Days):** Depending on your card issuer or banking provider, funds will appear on your bank statement within **5 to 7 business days**.

> **Payment Provider Specifics:**
> - **Credit/Debit Cards:** 5 to 7 business days.
> - **PayPal / Apple Pay:** 24 to 48 hours.
> - **Store Credit:** Immediate availability.`
  },
  {
    id: 'art-non-returnable-items',
    title: 'Non-Returnable Items and Restocking Fee Exemptions',
    slug: 'non-returnable-items-exemptions',
    category_id: 'cat-returns-refunds',
    product: 'ShipTrack Express',
    troubleshooting: "1. Opened hygiene accessories and downloaded software licenses are non-returnable.\n2. If you received a defective non-returnable product, file a warranty claim instead.\n3. Clearance items marked \"Final Sale\" cannot be refunded.",
    excerpt: 'Detailed overview of non-refundable digital goods, hygiene products, and restocking fee policies.',
    keywords: ['non returnable', 'restocking fee', 'final sale', 'return exceptions'],
    tags: ['Returns', 'Exceptions'],
    status: 'published',
    views_count: 110,
    helpful_count: 19,
    not_helpful_count: 2,
    created_at: '2026-01-22T14:00:00Z',
    updated_at: '2026-01-22T14:00:00Z',
    content: `## Non-Returnable Items & Conditions

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

For hygiene, safety, and digital licensing reasons, certain product categories are exempt from standard returns:

- Downloadable software licenses and digital activation keys.
- Gift cards and promotional promotional vouchers.
- Consumable items once the tamper-evident factory seal is broken.

*Standard returns for physical hardware carry **zero restocking fees**.*`
  },

  // 6. Products
  {
    id: 'art-product-specs',
    title: 'Product Compatibility and System Requirements',
    slug: 'product-compatibility-specs',
    category_id: 'cat-products',
    product: 'NexusDesk Core',
    troubleshooting: "1. Ensure OS version meets minimum specifications (Windows 11 / macOS 13+ / Ubuntu 22.04).\n2. Update browser to latest Chrome, Firefox, or Safari release.\n3. Enable WebGL and hardware acceleration in browser settings.",
    excerpt: 'Check hardware specifications, operating system versions, and minimum hardware requirements.',
    keywords: ['specifications', 'compatibility', 'system requirements', 'hardware specs', 'os support'],
    tags: ['Products', 'Specs', 'Hardware'],
    status: 'published',
    views_count: 165,
    helpful_count: 35,
    not_helpful_count: 1,
    created_at: '2026-01-17T09:00:00Z',
    updated_at: '2026-02-04T10:00:00Z',
    content: `## Technical Specifications & Compatibility Matrix

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

SupportMind hardware modules and software suites are engineered to integrate smoothly across modern operating environments:

- **Operating Systems Supported:**
  - Windows 10 & Windows 11 (64-bit)
  - macOS Monterey (12.0) or newer (Native Apple Silicon & Intel)
  - Linux (Ubuntu 20.04+, Debian 11+, Fedora 36+)
- **Minimum Hardware:** 4 GB RAM, 2.0 GHz Dual-Core CPU, 500 MB disk space.
- **Recommended Hardware:** 8 GB RAM, Quad-Core CPU, Gigabit Network Interface.`
  },
  {
    id: 'art-warranty-claims',
    title: 'Hardware Warranty Coverage and Claim Submission',
    slug: 'warranty-coverage-claim-submission',
    category_id: 'cat-products',
    product: 'NexusDesk Core',
    troubleshooting: "1. Have purchase invoice and hardware serial number ready.\n2. Warranty covers factory hardware defects for 12 months; excludes accidental drops.\n3. Replacement units are dispatched within 48 hours of RMA approval.",
    excerpt: 'Understand our standard 1-year limited warranty and how to submit a replacement claim for defective equipment.',
    keywords: ['warranty', 'warranty claim', 'hardware defect', 'replacement warranty', 'guarantee'],
    tags: ['Products', 'Warranty', 'Hardware'],
    status: 'published',
    views_count: 195,
    helpful_count: 39,
    not_helpful_count: 0,
    created_at: '2026-01-19T13:30:00Z',
    updated_at: '2026-02-11T16:00:00Z',
    content: `## 1-Year Limited Warranty Terms

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

All SupportMind brand physical devices carry a **1-Year Limited Manufacturer Warranty** against defects in materials and craftsmanship:

- **Covered:** Component failure, manufacturing solder defects, power supply failures under normal use.
- **Not Covered:** Accidental liquid damage, unauthorized disassembly, drops or cosmetic wear.
- **Submitting a Claim:** File a claim via **Support > Warranty Claim** by providing your device serial number and a short video or description demonstrating the defect.`
  },
  {
    id: 'art-firmware-updates',
    title: 'Accessing Firmware Updates and User Manuals',
    slug: 'firmware-updates-user-manuals',
    category_id: 'cat-products',
    product: 'NexusDesk Core',
    troubleshooting: "1. Verify device battery level is above 50% before initiating firmware flash.\n2. Do not disconnect USB cable during update process.\n3. If firmware update fails, hold reset button for 10 seconds to enter recovery mode.",
    excerpt: 'Download the latest certified firmware releases, safety guides, and printable PDF user manuals.',
    keywords: ['firmware', 'user manual', 'pdf guide', 'documentation', 'firmware update'],
    tags: ['Products', 'Downloads', 'Documentation'],
    status: 'published',
    views_count: 88,
    helpful_count: 15,
    not_helpful_count: 0,
    created_at: '2026-01-26T10:00:00Z',
    updated_at: '2026-01-26T10:00:00Z',
    content: `## Device Documentation & Firmware Downloads

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

Official technical documents and firmware binaries are maintained in our download center:

1. Visit **SupportMind Downloads** at \`/resources/downloads\`.
2. Filter by device product model and hardware revision code.
3. Access certified PDF user manuals in English, Spanish, French, and German.
4. Firmware updates include checksum hashes (SHA-256) for installation integrity verification.`
  },

  // 7. Technical Support
  {
    id: 'art-website-not-loading',
    title: 'Website Not Loading? Troubleshooting Connection and Browser Issues',
    slug: 'website-not-loading-troubleshooting',
    category_id: 'cat-technical-support',
    product: 'CloudScale API',
    troubleshooting: "1. Clear browser cache and cookies or test in an Incognito window.\n2. Flush local DNS cache in command prompt via \"ipconfig /flushdns\".\n3. Check global system status at status.supportmind.ai.\n4. Temporarily disable VPN or ad-blocking browser extensions.",
    excerpt: 'Quick steps to solve blank screens, timeout errors, DNS resolution glitches, and browser caching conflicts.',
    keywords: ['website not loading', 'not loading', 'blank screen', 'browser error', 'clear cache', 'dns', 'error 500'],
    tags: ['Technical Support', 'Troubleshooting', 'Browser'],
    status: 'published',
    views_count: 498,
    helpful_count: 91,
    not_helpful_count: 3,
    created_at: '2026-01-06T11:00:00Z',
    updated_at: '2026-02-17T09:00:00Z',
    content: `## Resolving Website Loading Issues

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

If the SupportMind web application or portal fails to load properly, follow these diagnostic steps:

1. **Clear Browser Cache and Cookies:**
   - Chrome / Edge: Press \`Ctrl + Shift + Delete\` (Windows) or \`Cmd + Shift + Delete\` (Mac).
   - Select *"Cached images and files"* and *"Cookies and site data"* for the past 24 hours.
   - Click **Clear data**, restart the browser, and reload the page.
2. **Test in Private / Incognito Mode:**
   - Browser extensions (especially aggressive ad-blockers or script filters) can interfere with application scripts. Open an Incognito window (\`Ctrl + Shift + N\`) to verify.
3. **Flush Local DNS Resolver Cache:**
   - On Windows: Open Command Prompt and execute \`ipconfig /flushdns\`.
   - On macOS: Open Terminal and execute \`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder\`.
4. **Check Official System Status:**
   - View our live infrastructure status page at \`status.supportmind.ai\` to verify whether planned maintenance or cloud outages are underway.
5. **Disable VPN or Proxy Services:**
   - Corporate proxy networks or VPN routes may block WebSockets or REST API endpoints.`
  },
  {
    id: 'art-api-rate-limits',
    title: 'Resolving API Rate Limits and 429 Too Many Requests Errors',
    slug: 'resolving-api-rate-limits',
    category_id: 'cat-technical-support',
    product: 'CloudScale API',
    troubleshooting: "1. Inspect response headers: \"X-RateLimit-Remaining\" and \"Retry-After\".\n2. Implement exponential backoff retry logic with jitter.\n3. Cache frequent read queries locally to reduce redundant API calls.\n4. Upgrade rate limit tier from 60 to 1,000 req/min in API Portal.",
    excerpt: 'Detailed developer guide on handling HTTP 429 status codes, rate limits, and implementing exponential backoff.',
    keywords: ['api rate limit', '429 error', 'too many requests', 'backoff', 'api integration', 'rate limits'],
    tags: ['Technical Support', 'API', 'Developers'],
    status: 'published',
    views_count: 178,
    helpful_count: 32,
    not_helpful_count: 1,
    created_at: '2026-01-21T16:00:00Z',
    updated_at: '2026-02-08T12:00:00Z',
    content: `## Managing API Rate Limits

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

The SupportMind REST API implements per-minute token buckets to preserve uptime:

- **Free Tier:** 60 requests per minute.
- **Pro Tier:** 300 requests per minute.
- **Enterprise Tier:** 1,200 requests per minute.

**Headers to Monitor:**
- \`X-RateLimit-Limit\`: Maximum queries permitted in current window.
- \`X-RateLimit-Remaining\`: Remaining quota.
- \`Retry-After\`: Number of seconds to pause before retrying.

**Recommended Fix:** Implement automated exponential backoff with jitter in your HTTP client library.`
  },
  {
    id: 'art-contact-support',
    title: 'How to Contact SupportMind Customer Support Team',
    slug: 'how-to-contact-customer-support',
    category_id: 'cat-technical-support',
    product: 'CloudScale API',
    troubleshooting: "1. Live Chat is active 24/7 in the bottom-right corner of the portal.\n2. For critical outages (P1), email emergency@supportmind.ai.\n3. Phone hours operate Monday - Friday 8:00 AM - 8:00 PM EST.",
    excerpt: 'Get in touch with human support representatives via live chat, priority email, and scheduled video sessions.',
    keywords: ['contact support', 'customer support', 'help desk', 'phone number', 'email support', 'live chat hours'],
    tags: ['Support', 'Contact', 'Customer Service'],
    status: 'published',
    views_count: 610,
    helpful_count: 112,
    not_helpful_count: 1,
    created_at: '2026-01-05T08:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
    content: `## Contacting Customer Support

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

If our AI Knowledge Assistant or articles cannot resolve your inquiry, our dedicated support team is available across multiple channels:

- **Live Chat:** Available 24/7 on the bottom right corner of the SupportMind portal. Average first response time: under 3 minutes.
- **Priority Email Desk:** Dispatch inquiries to \`support@supportmind.ai\`. Guaranteed response within 4 business hours.
- **Support Hours for Phone & Video:** Monday through Friday, 8:00 AM – 8:00 PM EST.
- **Emergency Incident Escalation:** For Tier 1 enterprise outages, contact our emergency escalation line provided in your Enterprise SLA package.

When submitting a ticket, please include your account email, order ID or API client ID, and any relevant error screenshots.`
  },

  // 8. Privacy and Security
  {
    id: 'art-privacy-policy-gdpr',
    title: 'How SupportMind AI Protects Customer Data (GDPR & CCPA Compliance)',
    slug: 'data-protection-privacy-gdpr',
    category_id: 'cat-privacy-security',
    product: 'AuthShield Pro',
    troubleshooting: "1. Review sub-processors list and Data Processing Agreement (DPA) under Privacy Settings.\n2. Standard EU Model Contractual Clauses (SCCs) are included by default.\n3. Submit DPA signature requests to privacy@supportmind.ai.",
    excerpt: 'Detailed summary of our enterprise data handling, encryption standards, and GDPR compliance policies.',
    keywords: ['privacy policy', 'gdpr', 'ccpa', 'data protection', 'encryption', 'security standards'],
    tags: ['Privacy', 'Security', 'Compliance'],
    status: 'published',
    views_count: 154,
    helpful_count: 27,
    not_helpful_count: 0,
    created_at: '2026-01-14T09:00:00Z',
    updated_at: '2026-02-02T11:00:00Z',
    content: `## Data Privacy & Encryption Standards

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

SupportMind AI adheres strictly to international privacy frameworks including GDPR (EU) and CCPA (California):

- **Zero AI Training on Customer Private Data:** Customer support conversations and corporate documentation are never used to train generalized foundation models without explicit contractual permission.
- **Encryption at Rest:** All stored databases and file attachments are encrypted with AES-256.
- **Encryption in Transit:** All traffic enforces TLS 1.3 with HSTS headers.
- **Audit Trails:** Administrative modifications and access events are recorded in immutable audit logs.`
  },
  {
    id: 'art-export-delete-data',
    title: 'Requesting Account Data Export or Right-to-be-Forgotten Deletion',
    slug: 'requesting-data-export-deletion',
    category_id: 'cat-privacy-security',
    product: 'AuthShield Pro',
    troubleshooting: "1. Data export packages (JSON format) take 24-48 hours to assemble.\n2. Account deletion is permanent and wipes all workspace history after 30 days.\n3. Active billing subscriptions must be cancelled before requesting account termination.",
    excerpt: 'Exercise your legal privacy rights to download your complete personal data archive or request permanent deletion.',
    keywords: ['delete account', 'data export', 'right to be forgotten', 'gdpr request', 'privacy deletion'],
    tags: ['Privacy', 'GDPR', 'Account'],
    status: 'published',
    views_count: 132,
    helpful_count: 23,
    not_helpful_count: 0,
    created_at: '2026-01-23T11:00:00Z',
    updated_at: '2026-02-01T15:00:00Z',
    content: `## Data Export & Permanent Deletion

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

In compliance with privacy regulations:

1. **Exporting Your Data:** Go to **Account Settings > Privacy & Data > Export Archive**. You will receive a ZIP container with machine-readable JSON logs of your profile, order history, and saved preferences.
2. **Permanent Account Deletion:** To permanently erase your profile and associated data, submit a deletion request under **Privacy > Delete Account**. Once submitted, a 7-day grace period applies, after which all customer records are permanently deleted.`
  },
  {
    id: 'art-report-vulnerability',
    title: 'Reporting Security Vulnerabilities (Responsible Disclosure)',
    slug: 'reporting-security-vulnerabilities',
    category_id: 'cat-privacy-security',
    product: 'AuthShield Pro',
    troubleshooting: "1. Send encrypted reports using PGP key to security@supportmind.ai.\n2. Include reproduction steps, affected endpoints, and payload examples.\n3. Please allow 48 hours for our security team to triage before disclosure.",
    excerpt: 'Guidelines for security researchers submitting findings through our responsible disclosure program.',
    keywords: ['security vulnerability', 'bug bounty', 'disclosure', 'cve', 'security report'],
    tags: ['Security', 'Vulnerability'],
    status: 'published',
    views_count: 76,
    helpful_count: 14,
    not_helpful_count: 0,
    created_at: '2026-01-27T10:00:00Z',
    updated_at: '2026-01-27T10:00:00Z',
    content: `## Responsible Disclosure Program

*(Demonstration Knowledge Base - SupportMind AI Sample Data)*

We welcome responsible security research:

- Report potential vulnerabilities to \`security@supportmind.ai\`.
- Include reproducible proof-of-concept steps.
- We acknowledge verified reports within 24 business hours.
- Do not access or modify customer data or attempt denial-of-service tests.`
  }
];
