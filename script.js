
const clientValueInput = document.getElementById('client-value');
const missedCallsInput = document.getElementById('missed-calls');
const closeRateInput = document.getElementById('close-rate');
const weChargeInput = document.getElementById('we-charge');
const calculateBtn = document.getElementById('calculate-btn');

const leftOnTableDisplay = document.getElementById('left-on-table');
const roiDisplay = document.getElementById('roi-value');

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
    const weCharge = parseFloat(weChargeInput.value) || 0;

    // Formula from Google Sheet:
    // Monthly $$$ Left on Table = (Missed Calls * Close Rate * Client Value) - We Charge
    // Note: Missed Calls is treated as a base unit multiplier directly in this specific sheet logic.

    const revenue = missedCalls * (closeRate / 100) * clientValue;
    const leftOnTable = revenue - weCharge;

    // Avoid division by zero
    const roi = weCharge !== 0 ? (leftOnTable / weCharge) * 100 : 0;

    leftOnTableDisplay.textContent = formatCurrency(leftOnTable);
    roiDisplay.textContent = formatPercentage(roi);
}

calculateBtn.addEventListener('click', calculateROI);

// Initial calculation on load
calculateROI();

// Optional: Calculate on input change for real-time feedback
[clientValueInput, missedCallsInput, closeRateInput, weChargeInput].forEach(input => {
    input.addEventListener('input', calculateROI);
});

