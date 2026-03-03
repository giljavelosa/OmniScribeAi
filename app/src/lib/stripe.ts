/**
 * Server-side Stripe client.
 * Requires STRIPE_SECRET_KEY in env.
 */
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export function getStripeClient(): Stripe {
  if (!secretKey || typeof secretKey !== "string") {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, { typescript: true });
}

export function isStripeConfigured(): boolean {
  return Boolean(secretKey && typeof secretKey === "string");
}
