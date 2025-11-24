// ===================================
// Stripe Checkout Integration
// ===================================

// IMPORTANT: Replace with your actual Stripe Publishable Key
// Get your keys from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
const STRIPE_PRODUCT_ID = 'prod_TU0QlQKE9OhDX4';

// Initialize Stripe
let stripe;
try {
    stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
} catch (error) {
    console.error('Stripe initialization error:', error);
    console.log('Please configure your Stripe API keys in js/order.js');
}

// Checkout button handlers
const checkoutButton = document.getElementById('checkout-button');
const checkoutButton2 = document.getElementById('checkout-button-2');
const loadingModal = document.getElementById('loadingModal');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

if (checkoutButton) {
    checkoutButton.addEventListener('click', handleCheckout);
}

if (checkoutButton2) {
    checkoutButton2.addEventListener('click', handleCheckout);
}

async function handleCheckout() {
    // Check if Stripe is configured
    if (!stripe || STRIPE_PUBLISHABLE_KEY === 'pk_test_YOUR_PUBLISHABLE_KEY_HERE') {
        showError('Stripe is not configured yet. Please set up your Stripe API keys.');
        return;
    }

    // Show loading modal
    loadingModal.style.display = 'block';

    try {
        // In a real implementation, you would make an API call to your server
        // to create a Stripe Checkout Session
        // For now, we'll show instructions on how to set this up
        
        // Example server-side endpoint call:
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: STRIPE_PRODUCT_ID,
                successUrl: window.location.origin + '/success.html',
                cancelUrl: window.location.origin + '/order.html',
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const session = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        loadingModal.style.display = 'none';
        showError(
            'We\'re currently setting up payment processing. Please contact us directly at success@aiagentcalls.com or call (555) 123-4567 to get started. We\'ll have you up and running within 24 hours!'
        );
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

function closeErrorModal() {
    errorModal.style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === errorModal) {
        closeErrorModal();
    }
});

// ===================================
// FAQ Accordion (reuse from main script)
// ===================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
});

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ===================================
// Initialize
// ===================================
console.log('Order page loaded successfully');
if (STRIPE_PUBLISHABLE_KEY === 'pk_test_YOUR_PUBLISHABLE_KEY_HERE') {
    console.warn('⚠️ STRIPE NOT CONFIGURED: Please update STRIPE_PUBLISHABLE_KEY in js/order.js');
    console.log('📖 Setup Instructions:');
    console.log('1. Sign up for a Stripe account at https://stripe.com');
    console.log('2. Get your API keys from https://dashboard.stripe.com/apikeys');
    console.log('3. Replace STRIPE_PUBLISHABLE_KEY in js/order.js with your publishable key');
    console.log('4. Create a server endpoint to handle checkout session creation');
    console.log('5. Update the product ID if needed');
}