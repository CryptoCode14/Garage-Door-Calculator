   <script>
        // script.js
        document.addEventListener('DOMContentLoaded', () => {
            // --- Constants ---
            const BASE_OPERATING_EXPENSE = 2000; // As hinted in screenshot "calculates against $2,000 operating expenses"
            const MATERIAL_MARKUP_PERCENTAGE = 50; // As shown in screenshot preview

            // --- DOM Elements ---
            const quoteForm = document.getElementById('quoteForm');
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

            const calculateQuoteBtn = document.getElementById('calculateQuoteBtn');
            const resetBtn = document.getElementById('resetBtn');
            const newQuoteBtn = document.getElementById('newQuoteBtn');
            
            // --- Helper Functions ---
            function getNumValue(element, defaultValue = 0) {
                if (!element) return defaultValue;
                const value = parseFloat(element.value);
                return isNaN(value) || element.value.trim() === '' ? defaultValue : value;
            }

            function getTextValue(element, defaultValue = 'N/A') {
                if (!element || element.value.trim() === '') return defaultValue;
                return element.value.trim();
            }

            function setText(elementId, value, isCurrency = true, decimals = 2) {
                const element = document.getElementById(elementId);
                if (element) {
                    if (typeof value === 'number' && isCurrency) {
                        element.textContent = '$' + value.toFixed(decimals);
                    } else if (typeof value === 'number' && !isCurrency) {
                         element.textContent = value.toFixed(decimals);
                    } 
                    else {
                        element.textContent = value;
                    }
                }
            }
             function setPercentageText(elementId, value, decimals = 1) {
                const element = document.getElementById(elementId);
                if(element) {
                    element.textContent = value.toFixed(decimals) + '%';
                }
            }


            function updateDate() {
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                setText('preview_date', today.toLocaleDateString('en-US', options), false);
            }

            // --- Main Calculation Logic ---
            function calculateQuote() {
                // Get input values
                const clientName = getTextValue(clientNameInput);
                const projectName = getTextValue(projectNameInput);
                const materialCost = getNumValue(materialCostInput);
                const serviceCost = getNumValue(serviceCostInput);
                const laborHours = getNumValue(laborHoursInput);
                const laborRate = getNumValue(laborRateInput);
                const dayPercentage = getNumValue(dayPercentageInput);
                const installationCost = getNumValue(installationCostInput);
                const quoteOperatingExpenses = getNumValue(quoteOperatingExpensesInput); // Quote specific OpEx
                const taxRate = getNumValue(taxRateInput);
                const applyTax = applyTaxCheckbox.checked;

                // --- Calculations ---
                // Labor
                const totalLabor = laborHours * laborRate;
                document.getElementById('totalLaborCostDisplay').textContent = totalLabor.toFixed(2);

                // Materials
                const materialMarkupValue = materialCost * (MATERIAL_MARKUP_PERCENTAGE / 100);
                const materialCostMarkedUp = materialCost + materialMarkupValue;

                // Subtotal
                const subtotal = materialCostMarkedUp + serviceCost + totalLabor + installationCost;

                // Tax
                const taxAmount = applyTax ? subtotal * (taxRate / 100) : 0;
                
                // Grand Total
                const grandTotal = subtotal + taxAmount;

                // Business Calculations for display
                const doubleMaterialCost = materialCost * 2;
                document.getElementById('doubleMaterialCostDisplay').textContent = doubleMaterialCost.toFixed(2);

                // Profit Breakdown Calculations
                const totalRevenueAfterTax = grandTotal; // Revenue is the final price to customer
                const dayBasedOperatingExpenses = (dayPercentage / 100) * BASE_OPERATING_EXPENSE;
                
                const netProfit = totalRevenueAfterTax - 
                                  dayBasedOperatingExpenses - 
                                  materialCost - // actual material cost
                                  totalLabor - 
                                  serviceCost -
                                  installationCost -
                                  quoteOperatingExpenses; // quote specific op ex

                const profitPercentage = totalRevenueAfterTax > 0 ? (netProfit / totalRevenueAfterTax) * 100 : 0;

                // Markup Target (Example: Aim for profit to be 20-30% of total costs)
                // This is a simplified example, real logic could be more complex
                const totalCostsForMarkup = materialCost + serviceCost + totalLabor + installationCost + dayBasedOperatingExpenses + quoteOperatingExpenses;
                const markupTargetLower = totalCostsForMarkup * 1.20; // 20% markup
                const markupTargetUpper = totalCostsForMarkup * 1.30; // 30% markup


                // --- Update Preview Pane ---
                setText('preview_clientName', clientName, false);
                setText('preview_projectName', projectName, false);

                setText('preview_materialCost', materialCost);
                setText('preview_materialMarkupValue', materialMarkupValue);
                document.getElementById('preview_materialMarkupValue').previousElementSibling.textContent = `+ Material Markup (${MATERIAL_MARKUP_PERCENTAGE}%)`;
                setText('preview_materialCostMarkedUp', materialCostMarkedUp);
                setText('preview_serviceCost', serviceCost);
                
                document.getElementById('preview_laborHours').textContent = laborHours.toFixed(1);
                document.getElementById('preview_laborRate').textContent = laborRate.toFixed(2);
                setText('preview_totalLabor', totalLabor);
                
                setText('preview_installationCost', installationCost);
                setText('preview_subtotal', subtotal);
                
                document.getElementById('preview_taxRate').textContent = taxRate.toFixed(2);
                setText('preview_taxAmount', taxAmount);
                setText('preview_grandTotal', grandTotal);

                // Business Analysis Preview
                setPercentageText('preview_dayPercentage', dayPercentage);
                setText('preview_quoteOperatingExpenses', quoteOperatingExpenses); // Display quote specific OpEx
                setText('preview_doubleMaterialCost', doubleMaterialCost);
                setText('preview_markupTarget', `$${markupTargetLower.toFixed(2)} - $${markupTargetUpper.toFixed(2)}`, false);
                setPercentageText('preview_profitPercentage', profitPercentage);

                // Profit Breakdown Preview
                setText('preview_profit_totalRevenue', totalRevenueAfterTax);
                setText('preview_profit_operatingExpenses', dayBasedOperatingExpenses);
                setText('preview_profit_materialCosts', materialCost);
                setText('preview_profit_laborCosts', totalLabor);
                setText('preview_profit_serviceCosts', serviceCost);
                setText('preview_profit_installationCosts', installationCost);
                setText('preview_profit_quoteSpecificOpEx', quoteOperatingExpenses);
                setText('preview_netProfit', netProfit);
            }

            function resetFormAndPreview() {
                quoteForm.reset(); // Resets form fields
                // Manually reset display fields and trigger a calculation to clear preview
                document.getElementById('totalLaborCostDisplay').textContent = '0.00';
                document.getElementById('doubleMaterialCostDisplay').textContent = '0.00';
                applyTaxCheckbox.checked = true; // Default tax to be applied
                calculateQuote(); // Recalculate with zeroed/default values
                updateDate(); // Update date on reset
                setText('preview_quoteId', 'QT-GEM-001', false); // Reset quote ID if it changes
            }

            // --- Event Listeners ---
            if (calculateQuoteBtn) {
                calculateQuoteBtn.addEventListener('click', calculateQuote);
            }
            
            // Auto-calculate Total Labor Cost and Double Material Cost on input
            [laborHoursInput, laborRateInput].forEach(el => {
                if(el) el.addEventListener('input', () => {
                    const laborHours = getNumValue(laborHoursInput);
                    const laborRate = getNumValue(laborRateInput);
                    document.getElementById('totalLaborCostDisplay').textContent = (laborHours * laborRate).toFixed(2);
                });
            });
            if(materialCostInput) {
                materialCostInput.addEventListener('input', () => {
                     const materialCost = getNumValue(materialCostInput);
                     document.getElementById('doubleMaterialCostDisplay').textContent = (materialCost * 2).toFixed(2);
                });
            }


            if (resetBtn) {
                resetBtn.addEventListener('click', resetFormAndPreview);
            }
            if (newQuoteBtn) {
                newQuoteBtn.addEventListener('click', resetFormAndPreview);
            }
            
            // --- Initial Setup ---
            updateDate();
            calculateQuote(); // Initial calculation to populate preview with $0.00
        });
    </script>
