
// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
            
            // Trigger counter animation if it's a stat card
            if (entry.target.classList.contains('stat-card')) {
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.classList.contains('counted')) {
                    animateCounter(numberElement);
                }
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ===================================
// Counter Animation
// ===================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    element.classList.add('counted');
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===================================
// ROI Calculator
// ===================================
const calculateBtn = document.getElementById('calculateBtn');
const resultsDiv = document.getElementById('results');
const commissionInput = document.getElementById('commission');
const callsInput = document.getElementById('calls');
const missedInput = document.getElementById('missed');

calculateBtn.addEventListener('click', calculateROI);

function calculateROI() {
    const commission = parseFloat(commissionInput.value) || 12000;
    const callsPerDay = parseFloat(callsInput.value) || 15;
    const missedPercentage = parseFloat(missedInput.value) || 30;
    
    // Calculations
    const dailyMissedCalls = callsPerDay * (missedPercentage / 100);
    const monthlyMissedCalls = dailyMissedCalls * 22; // 22 business days
    const conversionRate = 0.022; // 2.2% conversion rate
    const dealsLostPerMonth = monthlyMissedCalls * conversionRate;
    const monthlyLoss = dealsLostPerMonth * commission;
    const annualLoss = monthlyLoss * 12;
    const annualDealsLost = dealsLostPerMonth * 12;
    
    // Update results
    document.getElementById('annualLoss').textContent = formatCurrency(annualLoss);
    document.getElementById('monthlyLoss').textContent = formatCurrency(monthlyLoss);
    document.getElementById('lostDeals').textContent = annualDealsLost.toFixed(1);
    document.getElementById('dailyMissed').textContent = dailyMissedCalls.toFixed(1);
    document.getElementById('monthlyMissed').textContent = Math.round(monthlyMissedCalls);
    document.getElementById('monthlyDeals').textContent = dealsLostPerMonth.toFixed(1);
    
    // Show results with animation
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Animate the loss amount
    animateLossAmount(annualLoss);
}

function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString();
}

function animateLossAmount(target) {
    const element = document.getElementById('annualLoss');
    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateAmount = () => {
        current += increment;
        if (current < target) {
            element.textContent = formatCurrency(current);
            requestAnimationFrame(updateAmount);
        } else {
            element.textContent = formatCurrency(target);
        }
    };
    
    updateAmount();
}

// ===================================
// Email Form Submission
// ===================================
const emailForm = document.getElementById('emailForm');
const successModal = document.getElementById('successModal');

emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    
    // Validate email
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // In a real implementation, you would send this data to your server
    console.log('Email captured:', email);
    console.log('Calculator data:', {
        commission: commissionInput.value,
        calls: callsInput.value,
        missed: missedInput.value,
        annualLoss: document.getElementById('annualLoss').textContent
    });
    
    // Show success modal
    successModal.style.display = 'block';
    
    // Reset form
    emailInput.value = '';
    
    // Track conversion (you would integrate with your analytics here)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_capture', {
            'event_category': 'Calculator',
            'event_label': 'Email Submitted'
        });
    }
}); function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function closeModal() {
    successModal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// ===================================
// FAQ Accordion
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
// Spots Remaining Counter
// ===================================
function updateSpotsRemaining() {
    const spotsElement = document.getElementById('spotsRemaining');
    if (spotsElement) {
        // In a real implementation, this would fetch from your server
        // For demo purposes, we'll use a random number that decreases over time
        const baseSpots = 37;
        const minutesSinceMidnight = (new Date().getHours() * 60) + new Date().getMinutes();
        const spotsUsed = Math.floor(minutesSinceMidnight / 30); // 1 spot every 30 minutes
        const remainingSpots = Math.max(1, baseSpots - spotsUsed);
        
        spotsElement.textContent = `${remainingSpots} spots remaining`;
    }
}

updateSpotsRemaining();

// Update every minute
setInterval(updateSpotsRemaining, 60000);

// ===================================
// Input Validation
// ===================================
function validateNumberInput(input, min, max) {
    input.addEventListener('input', function() {
        let value = parseFloat(this.value);
        
        if (isNaN(value)) {
            this.value = '';
            return;
        }
        
        if (min !== undefined && value < min) {
            this.value = min;
        }
        
        if (max !== undefined && value > max) {
            this.value = max;
        }
    });
}

validateNumberInput(commissionInput, 1000);
validateNumberInput(callsInput, 1);
validateNumberInput(missedInput, 0, 100);

// ===================================
// Parallax Effect for Hero Background
// ===================================
const heroBackground = document.querySelector('.hero-background');

if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ===================================
// Auto-calculate on input change
// ===================================
let autoCalculateTimeout;

function scheduleAutoCalculate() {
    clearTimeout(autoCalculateTimeout);
    
    // Only auto-calculate if results are already visible
    if (resultsDiv.style.display === 'block') {
        autoCalculateTimeout = setTimeout(() => {
            calculateROI();
        }, 500); // Wait 500ms after last input change
    }
}

commissionInput.addEventListener('input', scheduleAutoCalculate);
callsInput.addEventListener('input', scheduleAutoCalculate);
missedInput.addEventListener('input', scheduleAutoCalculate);

// ===================================
// Add hover effects to feature cards
// ===================================
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// Scroll Progress Indicator (Optional)
// ===================================
function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    
    // You can use this to show a progress bar if desired
    // For now, we'll just log it
    // console.log('Scroll progress:', progress.toFixed(2) + '%');
}

window.addEventListener('scroll', updateScrollProgress);

// ===================================
// Load Animation on Page Load
// ===================================
window.addEventListener('load', () => {
    // Trigger initial animations
    const firstElements = document.querySelectorAll('.hero-content .fade-in-up');
    firstElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animationDelay = `${index * 0.2}s`;
        }, 100);
    });
});

// ===================================
// Keyboard Navigation for Accessibility
// ===================================
document.addEventListener('keydown', (e) => {
    // Close modal on Escape key
    if (e.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
});

// ===================================
// Track CTA Button Clicks
// ===================================
const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');

ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        
        // Track with analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'event_category': 'CTA',
                'event_label': buttonText
            });
        }
        
        console.log('CTA clicked:', buttonText);
    });
});

// ===================================
// Mobile Menu (if needed in future)
// ===================================
// This is a placeholder for future mobile navigation implementation

// ===================================
// Performance Optimization
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateScrollProgress();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// ===================================
// Initialize Everything
// ===================================
console.log('Real Estate AI Landing Page Loaded Successfully');
console.log('Calculator ready. Enter your numbers to see your revenue leak!');
