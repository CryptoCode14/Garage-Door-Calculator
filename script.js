 // script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const BASE_OPERATING_EXPENSE = 2000; 
    const MATERIAL_MARKUP_PERCENTAGE_FOR_PRICING_COST = 50; // This is the fixed markup on actual material cost to include in "Pricing Costs"

    // --- DOM Elements ---
    const quoteForm = document.getElementById('quoteForm');
    
    // Input Fields
    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const materialCostInput = document.getElementById('materialCost'); // This is ACTUAL material cost
    const serviceCostInput = document.getElementById('serviceCost');
    const laborHoursInput = document.getElementById('laborHours');
    const laborRateInput = document.getElementById('laborRate');
    const dayPercentageInput = document.getElementById('dayPercentage');
    const installationCostInput = document.getElementById('installationCost');
    const quoteOperatingExpensesInput = document.getElementById('quoteOperatingExpenses');
    const profitabilitySlider = document.getElementById('profitabilitySlider');
    const profitabilitySliderValueDisplay = document.getElementById('profitabilitySliderValue');

    // Output Displays within the Form
    const totalLaborCostDisplay = document.getElementById('totalLaborCostDisplay');
    const doubleMaterialCostDisplay = document.getElementById('doubleMaterialCostDisplay');
    
    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    
    // --- Helper Functions ---
    function getNumValue(element, defaultValue = 0) {
        if (!element) return defaultValue;
        const valStr = String(element.value);
        const trimmedValue = valStr.trim();
        if (trimmedValue === '') return defaultValue;
        const value = parseFloat(trimmedValue);
        return isNaN(value) ? defaultValue : value;
    }

    function getTextValue(element, defaultValue = 'N/A') {
        if (!element) return defaultValue;
        const valStr = String(element.value);
        return valStr.trim() === '' ? defaultValue : valStr.trim();
    }

    function setDisplayValue(element, value, isCurrency = true, decimals = 2, addMinusSign = false) {
        if (element) {
            let displayValStr = String(value); // Default to string if not number
            if (typeof value === 'number') {
                let prefix = isCurrency ? '$' : '';
                if (addMinusSign && value !== 0) {
                    prefix = (isCurrency ? '-$' : '-');
                    displayValStr = prefix + Math.abs(value).toFixed(decimals);
                } else {
                    displayValStr = prefix + value.toFixed(decimals);
                }
            }
            element.textContent = displayValStr;
        }
    }

    function setPercentageDisplay(element, value, decimals = 1) {
        if(element) {
            let displayValStr = String(value);
            if (typeof value === 'number') {
                displayValStr = value.toFixed(decimals) + '%';
            }
            element.textContent = displayValStr;
        }
    }

    function updateDate() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setDisplayValue(document.getElementById('preview_date'), today.toLocaleDateString('en-US', options), false);
    }

    // --- Main Calculation and Update Logic ---
    function calculateAndUpdateAll() {
        // Get input values
        const clientName = getTextValue(clientNameInput);
        const projectName = getTextValue(projectNameInput);
        const actualMaterialCost = getNumValue(materialCostInput);
        const serviceCost = getNumValue(serviceCostInput);
        const laborHours = getNumValue(laborHoursInput);
        const laborRate = getNumValue(laborRateInput);
        const dayPercentage = getNumValue(dayPercentageInput);
        const installationCost = getNumValue(installationCostInput);
        const quoteSpecificOpEx = getNumValue(quoteOperatingExpensesInput);
        const targetMarkupOnPricingCostsPercent = getNumValue(profitabilitySlider);

        if (profitabilitySliderValueDisplay) {
            profitabilitySliderValueDisplay.textContent = targetMarkupOnPricingCostsPercent.toFixed(0);
        }

        // --- Intermediate Calculations ---
        // For display in form
        const totalLaborCostActual = laborHours * laborRate;
        setDisplayValue(totalLaborCostDisplay, totalLaborCostActual);

        const doubleActualMaterialCost = actualMaterialCost * 2;
        setDisplayValue(doubleMaterialCostDisplay, doubleActualMaterialCost);
        
        // For Pricing Costs
        const materialCostMarkedUpForPricing = actualMaterialCost * (1 + MATERIAL_MARKUP_PERCENTAGE_FOR_PRICING_COST / 100);
        const dayBasedOperatingExpenses = (dayPercentage / 100) * BASE_OPERATING_EXPENSE;

        const totalPricingCosts = materialCostMarkedUpForPricing + 
                                  serviceCost + 
                                  installationCost + 
                                  dayBasedOperatingExpenses + 
                                  quoteSpecificOpEx; 
                                  // Labor is NOT included in pricing costs base

        // Selling Price Calculation
        const sellingPrice = totalPricingCosts * (1 + targetMarkupOnPricingCostsPercent / 100);

        // Actual Total Costs (for profit breakdown, includes actual material cost and labor)
        const totalActualCostsAllIncluded = actualMaterialCost + 
                                            serviceCost + 
                                            installationCost + 
                                            dayBasedOperatingExpenses + 
                                            quoteSpecificOpEx +
                                            totalLaborCostActual;

        // Net Profit Calculation
        const actualNetProfit = sellingPrice - totalActualCostsAllIncluded;
        const netProfitMarginOnRevenue = sellingPrice > 0 ? (actualNetProfit / sellingPrice) * 100 : 0;

        // --- Update Preview Pane ---
        setDisplayValue(document.getElementById('preview_clientName'), clientName, false);
        setDisplayValue(document.getElementById('preview_projectName'), projectName, false);
        
        // Cost Breakdown in Preview
        setDisplayValue(document.getElementById('preview_materialCost'), actualMaterialCost);
        setDisplayValue(document.getElementById('preview_materialMarkupPercentage'), MATERIAL_MARKUP_PERCENTAGE_FOR_PRICING_COST, false, 0);
        setDisplayValue(document.getElementById('preview_materialMarkupValue'), actualMaterialCost * (MATERIAL_MARKUP_PERCENTAGE_FOR_PRICING_COST / 100));
        setDisplayValue(document.getElementById('preview_materialCostMarkedUp'), materialCostMarkedUpForPricing);
        setDisplayValue(document.getElementById('preview_serviceCost'), serviceCost);
        setDisplayValue(document.getElementById('preview_laborHours'), laborHours, false, 1);
        setDisplayValue(document.getElementById('preview_laborRate'), laborRate, true, 2);
        setDisplayValue(document.getElementById('preview_totalLabor'), totalLaborCostActual); // Shows actual labor cost
        setDisplayValue(document.getElementById('preview_installationCost'), installationCost);
        setDisplayValue(document.getElementById('preview_grandTotal'), sellingPrice); // "Total" is now Selling Price

        // Business Analysis Preview
        setPercentageDisplay(document.getElementById('preview_targetMarkupPercentage'), targetMarkupOnPricingCostsPercent);
        setPercentageDisplay(document.getElementById('preview_dayPercentage'), dayPercentage);
        setDisplayValue(document.getElementById('preview_quoteOperatingExpenses'), quoteSpecificOpEx);
        setDisplayValue(document.getElementById('preview_doubleMaterialCost'), doubleActualMaterialCost);
        setPercentageDisplay(document.getElementById('preview_profitPercentage'), netProfitMarginOnRevenue); // This is Net Profit Margin on Revenue
        
        // Profit Breakdown Preview
        setDisplayValue(document.getElementById('preview_profit_totalRevenue'), sellingPrice);
        setDisplayValue(document.getElementById('preview_profit_operatingExpenses'), dayBasedOperatingExpenses, true, 2, true);
        setDisplayValue(document.getElementById('preview_profit_materialCosts'), actualMaterialCost, true, 2, true);
        setDisplayValue(document.getElementById('preview_profit_laborCosts'), totalLaborCostActual, true, 2, true);
        setDisplayValue(document.getElementById('preview_profit_serviceCosts'), serviceCost, true, 2, true);
        setDisplayValue(document.getElementById('preview_profit_installationCosts'), installationCost, true, 2, true);
        setDisplayValue(document.getElementById('preview_profit_quoteSpecificOpEx'), quoteSpecificOpEx, true, 2, true);
        setDisplayValue(document.getElementById('preview_netProfit'), actualNetProfit);
    }

    function resetFormAndPreview() {
        if (quoteForm) {
            quoteForm.reset(); 
        }
        if (profitabilitySlider) { // Reset slider to default
            profitabilitySlider.value = "50";
        }
        calculateAndUpdateAll(); 
        updateDate(); 
        setDisplayValue(document.getElementById('preview_quoteId'), 'QT-GEM-001', false);
    }

    // --- Event Listeners for Live Updates ---
    const inputsToWatch = [
        clientNameInput, projectNameInput, materialCostInput, serviceCostInput,
        laborHoursInput, laborRateInput, dayPercentageInput, installationCostInput,
        quoteOperatingExpensesInput, profitabilitySlider // Added slider
    ];

    inputsToWatch.forEach(inputElement => {
        if (inputElement) {
            inputElement.addEventListener('input', calculateAndUpdateAll);
        }
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFormAndPreview);
    }
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', resetFormAndPreview);
    }
    
    // --- Initial Setup ---
    updateDate();
    if (profitabilitySlider) profitabilitySlider.value = "50"; // Set initial slider value
    calculateAndUpdateAll(); 
});
