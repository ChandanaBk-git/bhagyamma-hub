
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/database");
const Policy = require("../models/policy.model");

const policies = [
  {
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    category: "Legal",
    displayOrder: 1,
    content: `
# Terms & Conditions

Welcome to Bhagyamma Hub.

## Eligibility
Users must be at least 18 years old.

## Account
Users must provide accurate registration information and maintain the security of their accounts.

## Products and Pricing
Product descriptions, prices, applicable charges, and availability will be displayed before purchase.

## Membership
Membership activation is subject to the Membership & Referral Policy.

## User Conduct
Fraud, misuse, or violation of platform rules may result in investigation and proportionate account action.

## Updates
Bhagyamma Hub may update these terms with an effective date.

## Legal Details
[TO CONFIRM: Legal entity name, registered address, jurisdiction, dispute process, and contact details.]

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    category: "Privacy",
    displayOrder: 2,
    content: `
# Privacy Policy

Bhagyamma Hub may collect:

- Name and mobile number
- Email address
- Delivery address
- Order and payment information
- Membership and referral information
- KYC information where required
- Wallet and commission records

## Purpose
Information is used for account management, orders, delivery, payments, membership, customer support, and security.

## Data Sharing
Information may be shared with service providers where necessary for providing services or meeting legal obligations.

## Security
Reasonable safeguards should be maintained to protect personal information.

## Retention and Deletion
[TO CONFIRM: Retention periods, deletion process, analytics, cookies, and third-party providers.]

## Contact
[TO CONFIRM: Privacy contact details.]

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Shipping & Delivery Policy",
    slug: "shipping-delivery",
    category: "Orders",
    displayOrder: 3,
    content: `
# Shipping & Delivery Policy

## Service Area
Karnataka.

## Processing
Estimated order processing time: 3–5 business days.

## Delivery
Estimated delivery time: 5–10 business days.

Delivery estimates may vary by location and courier.

## Shipping Charges
Shipping charges may vary according to location and order details.

## Damaged or Incorrect Products
Customers should report damaged, defective, or incorrect products within 48 hours of delivery.

## Tracking
Tracking information will be provided where available.

[TO CONFIRM: Courier partner, PIN-code serviceability, failed delivery process, and support contact.]

Statutory consumer rights remain unaffected.
`,
  },
  {
    title: "Cancellation, Returns & Refund Policy",
    slug: "cancellation-returns-refunds",
    category: "Orders",
    displayOrder: 4,
    content: `
# Cancellation, Returns & Refund Policy

## Cancellation
Cancellation requests after successful payment are subject to order status, applicable law, and review.

## Returns
Change-of-mind returns are subject to the applicable return rules and consumer rights.

## Damaged or Incorrect Products
Report damaged, defective, or incorrect products within 48 hours for verification.

## Refunds
Eligible refunds will be processed after verification.

## Failed Payments
If payment is captured but no valid order is created, the transaction will be investigated and an eligible refund processed.

## Membership Refunds
[TO CONFIRM: Membership refund and reversal rules.]

## Refund Timeline
[TO CONFIRM: Refund method and processing timeline.]

Statutory consumer rights remain unaffected.

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Membership & Referral Commission Policy",
    slug: "membership-referral-commission",
    category: "Membership",
    displayOrder: 5,
    content: `
# Membership & Referral Commission Policy

## Registration
Registration is free.

## Membership Activation
Membership activation amount: ₹2,000.

Membership duration: Lifetime, subject to applicable terms.

## Member Benefits
Eligible product purchases receive a 20% discount.

## Referral Commission
- Level 1: 20%
- Level 2: 5%
- Level 3 and above: 1%

Commission is calculated on the eligible membership activation amount of ₹2,000.

Illustration:
- Level 1: ₹400
- Level 2: ₹100
- Each eligible Level 3+ recipient: ₹20

## Eligibility
Self-referral is not permitted. Commission eligibility is subject to account status and verification.

## Earnings Disclaimer
No income or earnings are guaranteed.

[TO CONFIRM: Payable referral depth, renewal rules, tax treatment, settlement, and reversals.]

[LEGAL REVIEW REQUIRED: Indian direct-selling and consumer law compliance.]
`,
  },
  {
    title: "SP & Supervisor Rewards Policy",
    slug: "sp-supervisor-rewards",
    category: "Rewards",
    displayOrder: 6,
    content: `
# SP & Supervisor Rewards Policy

## Selling Points
For every eligible ₹100 product amount after discount, a member receives 2 SP.

Amounts below ₹100 are carried forward.

## Membership SP
Eligible membership activation provides 40 SP.

## Supervisor Qualification
Supervisor target: 500 accumulated SP.

## Supervisor Bonus
One-time supervisor bonus: ₹1,000.

## SP Rules
SP is not cash, is not withdrawable, and has no direct cash value.

SP may be reversed for qualifying cancelled or refunded transactions.

## Commission
SP and referral commission are separate benefits.

[TO CONFIRM: Rounding, partial refunds, bonus tax treatment, qualification timing, and inactivity rules.]
`,
  },
  {
    title: "Wallet & Withdrawal Policy",
    slug: "wallet-withdrawal",
    category: "Wallet",
    displayOrder: 7,
    content: `
# Wallet & Withdrawal Policy

## Minimum Withdrawal
₹500.

## KYC
Approved KYC is required before withdrawal.

## Approval
Withdrawal requests require manager approval.

## Payout
Automatic PhonePe payout is planned after approval, subject to merchant and payout service availability.

## Processing
Target processing time: within 24 hours after approval.

## Available Balance
Only eligible available balance may be requested for withdrawal.

## Failed Payout
Funds remain reserved until the payout result is verified. Confirmed failures may be released back to the available balance.

## Wallet Usage
The wallet is intended for eligible withdrawals and cannot be used to pay for products.

[TO CONFIRM: Provider fees, business-hour definition, reconciliation, bank mismatch, and tax treatment.]

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Account, Conduct & Supervisor Policy",
    slug: "account-conduct-supervisor",
    category: "Account",
    displayOrder: 8,
    content: `
# Account, Conduct & Supervisor Policy

## Eligibility
Members must be at least 18 years old.

## Membership
One membership per person, subject to verification.

## Conduct
Fraud, misuse, false information, or abuse of the platform may be investigated.

## Account Action
Proportionate action may be taken after review.

## Supervisor Inactivity
Inactive supervisor accounts may be reviewed by administration.

## Suspension and Termination
Suspension or termination is subject to review and applicable law.

## Pending Balances
Treatment of pending commissions and balances must follow applicable law and approved business rules.

[TO CONFIRM: Notice, appeal, and balance treatment procedures.]

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Grievance Redressal & Customer Support",
    slug: "grievance-customer-support",
    category: "Support",
    displayOrder: 9,
    content: `
# Grievance Redressal & Customer Support

Customers may raise concerns relating to:

- Orders and delivery
- Products
- Payments and refunds
- Account and membership
- Wallet and withdrawal
- Commission and SP
- KYC

## Acknowledgment
Target acknowledgment: within 2 business days.

## Resolution
Target resolution: within 7 business days, subject to investigation and applicable legal timelines.

## Escalation
Unresolved issues may be escalated to the designated grievance contact.

## Contact
Email: [TO CONFIRM]
Phone/WhatsApp: [TO CONFIRM]
Grievance Officer: [TO CONFIRM]

Support may be provided in English and Kannada.

[LEGAL REVIEW REQUIRED]
`,
  },
  {
    title: "Product Information, Pricing & Availability",
    slug: "product-information-pricing",
    category: "Products",
    displayOrder: 10,
    content: `
# Product Information, Pricing & Availability

Bhagyamma Hub aims to provide accurate product descriptions, images, prices, and availability.

## Product Images
Minor differences in product appearance may occur due to display settings or presentation.

## Pricing
Applicable prices and charges will be shown before payment.

## Availability
Product availability is subject to stock and order confirmation.

## Product Claims
Product information should not be interpreted as a medical guarantee.

[TO CONFIRM: Tax display, member discount calculation, coupon treatment, and price-error handling.]

Statutory consumer rights remain unaffected.
`,
  },
  {
    title: "Membership, Referral & Direct Selling Disclosures",
    slug: "direct-selling-disclosures",
    category: "Disclosure",
    displayOrder: 11,
    content: `
# Membership, Referral & Direct Selling Disclosures

## Registration
Free registration.

## Activation
Membership activation amount: ₹2,000.

## Membership Benefits
Lifetime membership, subject to applicable terms, and 20% discount on eligible product amount.

## Referral Rates
- Level 1: 20%
- Level 2: 5%
- Level 3+: 1%

## Referral Rules
Self-referral is not permitted. Commission eligibility is subject to approved rules.

## Earnings
No guaranteed income, profit, or earnings are promised.

## Compliance
[TO CONFIRM: Approved direct-selling structure, payable depth, tax treatment, and disclosures.]

[LEGAL REVIEW REQUIRED]
`,
  },
];

const seedPolicies = async () => {
  try {
    await connectDB();

    console.log("🌱 Starting policy seed...");

    let inserted = 0;
    let existing = 0;

    for (const policy of policies) {
      const result = await Policy.updateOne(
        { slug: policy.slug },
        {
          $setOnInsert: {
            ...policy,
            version: "1.0",
            status: "draft",
            effectiveDate: null,
            requiresLegalReview: true,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
        console.log(`✅ Inserted: ${policy.title}`);
      } else {
        existing++;
        console.log(`⏭️ Already exists: ${policy.title}`);
      }
    }

    console.log("\n🎉 Policy seed completed");
    console.log(`Inserted: ${inserted}`);
    console.log(`Already existed: ${existing}`);
    console.log("All policies remain in DRAFT status.");
  } catch (error) {
    console.error("❌ Policy seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedPolicies();
