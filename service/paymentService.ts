import md5 from "md5";
import { PAYHERE_MERCHANT_ID, PAYHERE_MERCHANT_SECRET, PAYHERE_CURRENCY } from "../config/paymentConfig";

export const PAYHERE_SANDBOX_CHECKOUT_URL = "https://sandbox.payhere.lk/pay/checkout";

// Custom deep links (using this app's own "carrentalapp://" scheme, set in
// app.json) that the checkout WebView can be intercepted on — standing in
// for a real return_url/cancel_url pair without needing a publicly-hosted
// server to redirect to.
export const PAYHERE_RETURN_URL = "carrentalapp://payment-success";
export const PAYHERE_CANCEL_URL = "carrentalapp://payment-cancel";

export type PayHereOrder = {
  orderId: string;
  amount: number; // e.g. 45 for $45.00
  items: string;
  firstName: string;
  lastName: string;
  email: string;
};

function buildHash(orderId: string, amount: number): string {
  const amountFormatted = amount.toFixed(2);
  const hashedSecret = md5(PAYHERE_MERCHANT_SECRET).toUpperCase();
  return md5(
    PAYHERE_MERCHANT_ID + orderId + amountFormatted + PAYHERE_CURRENCY + hashedSecret
  ).toUpperCase();
}

// Builds a self-submitting HTML page that POSTs straight to PayHere's
// Sandbox Checkout endpoint — this is PayHere's own documented "Checkout
// API" integration method (a plain HTML form post), meant to be loaded
// into a WebView.
export function buildPayHereCheckoutHtml(order: PayHereOrder): string {
  const amountFormatted = order.amount.toFixed(2);
  const hash = buildHash(order.orderId, order.amount);

  return `
<!DOCTYPE html>
<html>
  <body onload="document.forms[0].submit()">
    <form method="post" action="${PAYHERE_SANDBOX_CHECKOUT_URL}">
      <input type="hidden" name="merchant_id" value="${PAYHERE_MERCHANT_ID}" />
      <input type="hidden" name="return_url" value="${PAYHERE_RETURN_URL}" />
      <input type="hidden" name="cancel_url" value="${PAYHERE_CANCEL_URL}" />
      <input type="hidden" name="order_id" value="${order.orderId}" />
      <input type="hidden" name="items" value="${order.items}" />
      <input type="hidden" name="currency" value="${PAYHERE_CURRENCY}" />
      <input type="hidden" name="amount" value="${amountFormatted}" />
      <input type="hidden" name="first_name" value="${order.firstName}" />
      <input type="hidden" name="last_name" value="${order.lastName}" />
      <input type="hidden" name="email" value="${order.email}" />
      <input type="hidden" name="phone" value="0770000000" />
      <input type="hidden" name="address" value="No.1, Galle Road" />
      <input type="hidden" name="city" value="Colombo" />
      <input type="hidden" name="country" value="Sri Lanka" />
      <input type="hidden" name="hash" value="${hash}" />
    </form>
  </body>
</html>`;
}
