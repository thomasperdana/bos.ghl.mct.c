const clientValueInput = document.getElementById('client-value');
const missedCallsInput = document.getElementById('missed-calls');
const closeRateInput = document.getElementById('close-rate');
const calculateBtn = document.getElementById('calculate-btn');

const leftOnTableDisplay = document.getElementById('left-on-table');
const weChargeDisplay = document.getElementById('we-charge');
const roiDisplay = document.getElementById('roi-value');

const WE_CHARGE = 297;

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value / 100);
}

function calculateROI() {
    const clientValue = parseFloat(clientValueInput.value) || 0;
    const missedCalls = parseFloat(missedCallsInput.value) || 0;
    const closeRate = parseFloat(closeRateInput.value) || 0;

    // Formula from Google Sheet:
    // Monthly $$$ Left on Table = (Missed Calls * Close Rate * Client Value) - We Charge
    // Note: Missed Calls is treated as a base unit multiplier directly in this specific sheet logic.
    // revenue = 20 * 0.20 * 5000 = 20,000

    const revenue = missedCalls * (closeRate / 100) * clientValue;
    const leftOnTable = revenue - WE_CHARGE;

    const roi = (leftOnTable / WE_CHARGE) * 100;

    leftOnTableDisplay.textContent = formatCurrency(leftOnTable);
    roiDisplay.textContent = formatPercentage(roi);
}

calculateBtn.addEventListener('click', calculateROI);

// Initial calculation on load
calculateROI();

// Optional: Calculate on input change for real-time feedback
[clientValueInput, missedCallsInput, closeRateInput].forEach(input => {
    input.addEventListener('input', calculateROI);
});
