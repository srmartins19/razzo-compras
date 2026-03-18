import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export const PLANS = {
  BASIC:      { id: 'basic',      price: 0,    rfqLimit: 10,  supplierLimit: 20,  userLimit: 3  },
  PRO:        { id: 'pro',        price: 299,  rfqLimit: 100, supplierLimit: 200, userLimit: 15 },
  ENTERPRISE: { id: 'enterprise', price: 999,  rfqLimit: -1,  supplierLimit: -1,  userLimit: -1 },
};

@Injectable()
export class BillingService {
  getPlans() { return Object.values(PLANS); }

  // TODO: implement Stripe checkout
  async createCheckoutSession(_companyId: string, _plan: string): Promise<{ url: string }> {
    // const session = await stripe.checkout.sessions.create({ ... });
    return { url: 'https://checkout.stripe.com/pay/placeholder' };
  }

  async handleWebhook(_payload: string, _signature: string) {
    // TODO: verify Stripe signature and handle events
    return { received: true };
  }
}
