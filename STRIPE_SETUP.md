# Stripe Integration Setup Instructions

## Overview
This project uses Stripe Checkout for payment processing. Follow these steps to configure Stripe for your application.

## Prerequisites
- A Stripe account (sign up at https://stripe.com)
- Access to your Stripe Dashboard

## Setup Steps

### 1. Create a Stripe Account
1. Go to https://stripe.com and create an account
2. Complete the verification process
3. Access your Stripe Dashboard at https://dashboard.stripe.com

### 2. Get Your API Keys
1. In the Stripe Dashboard, go to **Developers** → **API keys**
2. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)

### 3. Configure the Frontend
1. Open `js/order.js`
2. Replace the placeholder key with your **Publishable key**:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_ACTUAL_KEY_HERE';
   ```

### 4. Create a Product in Stripe
1. In the Stripe Dashboard, go to **Products**
2. Click **+ Add Product**
3. Configure the product:
   - **Name**: Missed Call Text Back Solution
   - **Description**: AI-powered call management for real estate agents
   - **Pricing**: Set up two prices:
     - One-time setup fee: $497
     - Recurring subscription: $497/month
4. Note the Product ID (starts with `prod_`)
5. Update the `STRIPE_PRODUCT_ID` in `js/order.js` if it's different

### 5. Set Up the Backend (Server-Side)
Stripe Checkout requires a server-side endpoint to create checkout sessions.

#### Option A: Using a Node.js Server
Create an API endpoint at `/api/create-checkout-session`:

```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_YOUR_SETUP_FEE_PRICE_ID', // One-time setup
          quantity: 1,
        },
        {
          price: 'price_YOUR_SUBSCRIPTION_PRICE_ID', // Monthly subscription
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/order.html`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Option B: Using Stripe Payment Links (No Code Required)
1. In the Stripe Dashboard, go to **Payment Links**
2. Click **+ New**
3. Configure the payment link with your product and pricing
4. Enable the 30-day trial option
5. Copy the payment link URL
6. Modify `js/order.js` to redirect directly to the payment link:
   ```javascript
   function handleCheckout() {
       window.location.href = 'https://buy.stripe.com/YOUR_PAYMENT_LINK';
   }
   ```

### 6. Test the Integration
1. Use Stripe's test card numbers for testing:
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0027 6000 3184`
   - Declined: `4000 0000 0000 0002`
2. Use any future expiry date and any 3-digit CVC
3. Test the complete checkout flow

### 7. Go Live
1. Complete Stripe's account verification
2. Replace test keys with live keys:
   - Use `pk_live_` publishable key
   - Use `sk_live_` secret key
3. Test with a real card (you can refund it immediately)
4. Monitor transactions in the Stripe Dashboard

## Security Notes
- **Never** commit your secret key to version control
- Always use environment variables for API keys
- The publishable key is safe to use in the frontend
- Stripe handles all sensitive payment data (PCI compliant)

## Webhook Setup (Optional but Recommended)
To handle subscription events (renewals, cancellations, etc.):

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Set the endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Use it to verify webhook signatures in your server

## Troubleshooting

### "Stripe is not configured" Error
- Ensure you've replaced `pk_test_YOUR_PUBLISHABLE_KEY_HERE` with your actual key
- Check browser console for specific error messages

### Checkout Session Creation Fails
- Verify your server endpoint is running and accessible
- Check that price IDs are correct in your server code
- Review Stripe Dashboard logs for detailed error messages

### Payment Links
If using payment links instead of checkout sessions:
- Ensure the link is active in Stripe Dashboard
- Verify the trial period is configured correctly
- Test the link in an incognito window

## Support Resources
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test card numbers: https://stripe.com/docs/testing

## Current Implementation Status
- ✅ Frontend Stripe.js integration
- ✅ Order page with pricing display
- ✅ Checkout button handlers
- ⚠️ Server-side endpoint needs to be created
- ⚠️ Replace placeholder API keys

---

**Note**: The checkout button will show a friendly error message until you configure your Stripe keys and create the server endpoint or payment link.