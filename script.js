  // script.js
// Ensure this script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const BASE_OPERATING_EXPENSE = 2000; 
    const MATERIAL_MARKUP_PERCENTAGE = 50; 

    // --- DOM Elements ---
    // It's crucial that these IDs match exactly with your HTML.
    const quoteForm = document.getElementById('quoteForm');
    
    // Input Fields
    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const materialCostInput = document.getElementById('materialCost');
    const serviceCostInput = document.getElementById('serviceCost');
    const laborHoursInput = document.getElementById('laborHours');
    const laborRateInput = document.getElementById('laborRate');
    const dayPercentageInput = document.getElementById('dayPercentage');
    const installationCostInput = document.getElementById('installationCost');
    const quoteOperatingExpensesInput = document.getElementById('quoteOperatingExpenses');
    const taxRateInput = document.getElementById('taxRate');
    const applyTaxCheckbox = document.getElementById('applyTax');

    // Output Displays within the Form (not for input, but for showing calculated values like Total Labor)
    const totalLaborCostDisplay = document.getElementById('totalLaborCostDisplay');
    const doubleMaterialCostDisplay = document.getElementById('doubleMaterialCostDisplay');
    
    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    
    // --- Helper Functions ---
    // Safely gets a number from an input element.
    function getNumValue(element, defaultValue = 0) {
        if (!element) {
            // console.warn('Element not found in getNumValue for ID:', element ? element.id : 'unknown'); // For debugging
            return defaultValue;
        }
        // Ensure element.value is treated as a string before trimming
        const valStr = String(element.value);
        const trimmedValue = valStr.trim();
        
        if (trimmedValue === '') {
            return defaultValue;
        }
        const value = parseFloat(trimmedValue);
        return isNaN(value) ? defaultValue : value;
    }

    // Safely gets text from an input element.
    function getTextValue(element, defaultValue = 'N/A') {
        if (!element) {
            // console.warn('Element not found in getTextValue for ID:', element ? element.id : 'unknown'); // For debugging
            return defaultValue;
        }
        const valStr = String(element.value); // Ensure it's a string
        return valStr.trim() === '' ? defaultValue : valStr.trim();
    }

    // Sets the text content of a display element (e.g., a span or div).
    function setDisplayValue(element, value, isCurrency = true, decimals = 2) {
        if (element) {
            let displayVal = value;
            if (typeof value === 'number') {
                if (isCurrency) {
                    displayVal = '$' + value.toFixed(decimals);
                } else {
                    displayVal = value.toFixed(decimals);
                }
            }
            element.textContent = displayVal;
        } else {
            // console.warn('Display element not found in setDisplayValue for value:', value); // For debugging
        }
    }

    // Sets percentage text content.
    function setPercentageDisplay(element, value, decimals = 1) {
        if(element) {
            let displayVal = value;
            if (typeof value === 'number') {
                displayVal = value.toFixed(decimals) + '%';
            }
            element.textContent = displayVal;
        } else {
             // console.warn('Display element for percentage not found for value:', value); // For debugging
        }
    }

    // Updates the date in the preview.
    function updateDate() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateElement = document.getElementById('preview_date');
        setDisplayValue(dateElement, today.toLocaleDateString('en-US', options), false);
    }

    // --- Main Calculation and Update Logic ---
    // This function is called whenever an input changes or on initial load.
    function calculateAndUpdateAll() {
        // console.log('Calculating...'); // For debugging: check if function is called

        // Get input values using helper functions
        const clientName = getTextValue(clientNameInput);
        const projectName = getTextValue(projectNameInput);
        const materialCost = getNumValue(materialCostInput);
        // console.log('Material Cost Input:', materialCost); // For debugging
        const serviceCost = getNumValue(serviceCostInput);
        const laborHours = getNumValue(laborHoursInput);
        const laborRate = getNumValue(laborRateInput);
        const dayPercentage = getNumValue(dayPercentageInput);
        const installationCost = getNumValue(installationCostInput);
        const quoteOperatingExpenses = getNumValue(quoteOperatingExpensesInput);
        const taxRate = getNumValue(taxRateInput);
        const applyTax = applyTaxCheckbox ? applyTaxCheckbox.checked : true; // Default to true if checkbox not found

        // --- Perform Calculations ---
        const totalLabor = laborHours * laborRate;
        setDisplayValue(totalLaborCostDisplay, totalLabor);

        const doubleMaterialCost = materialCost * 2;
        setDisplayValue(doubleMaterialCostDisplay, doubleMaterialCost);
        
        const materialMarkupValue = materialCost * (MATERIAL_MARKUP_PERCENTAGE / 100);
        const materialCostMarkedUp = materialCost + materialMarkupValue;

        const subtotal = materialCostMarkedUp + serviceCost + totalLabor + installationCost;
        const taxAmount = applyTax ? subtotal * (taxRate / 100) : 0;
        const grandTotal = subtotal + taxAmount;

        const totalRevenueAfterTax = grandTotal; 
        const dayBasedOperatingExpenses = (dayPercentage / 100) * BASE_OPERATING_EXPENSE;
        
        const netProfit = totalRevenueAfterTax - 
                          dayBasedOperatingExpenses - 
                          materialCost - 
                          totalLabor - 
                          serviceCost -
                          installationCost -
                          quoteOperatingExpenses;

        const profitPercentageOfRevenue = totalRevenueAfterTax > 0 ? (netProfit / totalRevenueAfterTax) * 100 : 0;
        const markupTargetLower = doubleMaterialCost + 300;
        const markupTargetUpper = doubleMaterialCost + 400;

        // --- Update Preview Pane ---
        // Fetch preview elements each time or store them globally if performance becomes an issue.
        // For now, fetching directly for clarity that these are distinct from input elements.
        setDisplayValue(document.getElementById('preview_clientName'), clientName, false);
        setDisplayValue(document.getElementById('preview_projectName'), projectName, false);
        setDisplayValue(document.getElementById('preview_materialCost'), materialCost);
        setDisplayValue(document.getElementById('preview_materialMarkupPercentage'), MATERIAL_MARKUP_PERCENTAGE, false, 0);
        setDisplayValue(document.getElementById('preview_materialMarkupValue'), materialMarkupValue);
        setDisplayValue(document.getElementById('preview_materialCostMarkedUp'), materialCostMarkedUp);
        setDisplayValue(document.getElementById('preview_serviceCost'), serviceCost);
        setDisplayValue(document.getElementById('preview_laborHours'), laborHours, false, 1);
        setDisplayValue(document.getElementById('preview_laborRate'), laborRate, true, 2);
        setDisplayValue(document.getElementById('preview_totalLabor'), totalLabor);
        setDisplayValue(document.getElementById('preview_installationCost'), installationCost);
        setDisplayValue(document.getElementById('preview_subtotal'), subtotal);
        setDisplayValue(document.getElementById('preview_taxRate'), taxRate, false, 2);
        setDisplayValue(document.getElementById('preview_taxAmount'), taxAmount);
        setDisplayValue(document.getElementById('preview_grandTotal'), grandTotal);
        setPercentageDisplay(document.getElementById('preview_dayPercentage'), dayPercentage);
        setDisplayValue(document.getElementById('preview_quoteOperatingExpenses'), quoteOperatingExpenses);
        setDisplayValue(document.getElementById('preview_doubleMaterialCost'), doubleMaterialCost);
        setDisplayValue(document.getElementById('preview_markupTarget'), `$${markupTargetLower.toFixed(2)} - $${markupTargetUpper.toFixed(2)}`, false);
        setPercentageDisplay(document.getElementById('preview_profitPercentage'), profitPercentageOfRevenue);
        setDisplayValue(document.getElementById('preview_profit_totalRevenue'), totalRevenueAfterTax);
        setDisplayValue(document.getElementById('preview_profit_operatingExpenses'), dayBasedOperatingExpenses);
        setDisplayValue(document.getElementById('preview_profit_materialCosts'), materialCost);
        setDisplayValue(document.getElementById('preview_profit_laborCosts'), totalLabor);
        setDisplayValue(document.getElementById('preview_profit_serviceCosts'), serviceCost);
        setDisplayValue(document.getElementById('preview_profit_installationCosts'), installationCost);
        setDisplayValue(document.getElementById('preview_profit_quoteSpecificOpEx'), quoteOperatingExpenses);
        setDisplayValue(document.getElementById('preview_netProfit'), netProfit);
    }

    // Resets the form and updates the preview.
    function resetFormAndPreview() {
        if (quoteForm) {
            quoteForm.reset(); 
        }
        // Ensure defaults are set after reset, as .reset() reverts to HTML defaults
        if(taxRateInput) taxRateInput.value = "8.25"; 
        if(applyTaxCheckbox) applyTaxCheckbox.checked = true; 
        
        calculateAndUpdateAll(); 
        updateDate(); 
        const quoteIdElement = document.getElementById('preview_quoteId');
        setDisplayValue(quoteIdElement, 'QT-GEM-001', false); // Reset quote ID if it's dynamic in future
    }

    // --- Event Listeners for Live Updates ---
    // List of all input elements that should trigger a recalculation.
    const inputsToWatch = [
        clientNameInput, projectNameInput, materialCostInput, serviceCostInput,
        laborHoursInput, laborRateInput, dayPercentageInput, installationCostInput,
        quoteOperatingExpensesInput, taxRateInput
    ];

    inputsToWatch.forEach(inputElement => {
        if (inputElement) { // Check if the element was found
            inputElement.addEventListener('input', calculateAndUpdateAll);
        } else {
            // console.warn('An input element to watch was not found. This might be okay if the element is optional.'); // For debugging
        }
    });

    if (applyTaxCheckbox) {
        applyTaxCheckbox.addEventListener('change', calculateAndUpdateAll);
    } else {
        // console.warn('Apply tax checkbox not found.'); // For debugging
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFormAndPreview);
    }
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', resetFormAndPreview);
    }
    
    // --- Initial Setup ---
    // This runs once when the page is loaded and ready.
    updateDate();
    if(taxRateInput) { // Ensure taxRateInput exists before setting its value
        taxRateInput.value = "8.25"; 
    }
    calculateAndUpdateAll(); // Perform an initial calculation to populate fields
});
