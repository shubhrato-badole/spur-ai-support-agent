import { db } from './index';
import dotenv from 'dotenv';
dotenv.config();

const policies = [
  {
    key: 'shipping',
    value: 'Spur offers free shipping on all orders above ₹499. For orders below ₹499, a flat delivery fee of ₹49 applies. Delivery times: metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune) take 2–3 business days. Other cities and towns take 5–7 business days. We currently do not ship internationally.',
  },
  {
    key: 'returns',
    value: 'Spur accepts returns within 7 days of delivery. Items must be unopened, unused, and in their original packaging. Perishable items (fresh produce, dairy, meat) are non-returnable. To initiate a return, contact our support team with your order ID.',
  },
  {
    key: 'refunds',
    value: 'Once a return is approved and the item is received at our warehouse, refunds are processed within 5–7 business days. Refunds are credited to the original payment method. For UPI and card payments, it may take an additional 2–3 days for the amount to reflect in your account.',
  },
  {
    key: 'cod',
    value: 'Cash on Delivery (COD) is available for orders up to ₹2,000. COD is not available in all pin codes. You can check availability at checkout by entering your pin code. A COD handling fee of ₹20 applies.',
  },
  {
    key: 'support_hours',
    value: 'Our customer support team is available Monday to Saturday, 10:00 AM to 7:00 PM IST. On public holidays, support is limited to email only. For urgent issues outside support hours, you can leave a message and our team will respond the next business day.',
  },
  {
    key: 'order_tracking',
    value: 'Once your order is shipped, you will receive an SMS and email with a tracking link. You can also track your order by visiting the Orders section in your Spur account.',
  },
  {
    key: 'payment_methods',
    value: 'Spur accepts UPI (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and Cash on Delivery. EMI options are available on orders above ₹2,000 for select cards.',
  },
  {
    key: 'cancellations',
    value: 'Orders can be cancelled within 2 hours of placing them, before they are dispatched. Once an order is dispatched, it cannot be cancelled — you may initiate a return after delivery instead. To cancel, go to your Orders page and click Cancel Order.',
  },
];

async function seed() {
  console.log('Seeding policies...');

  for (const policy of policies) {
    await db.query(
      `INSERT INTO policies (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [policy.key, policy.value]
    );
    console.log(`  Seeded: ${policy.key}`);
  }

  console.log('Seed complete.');
  await db.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});