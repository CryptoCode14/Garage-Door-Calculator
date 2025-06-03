  <script>
        // script.js
        document.addEventListener('DOMContentLoaded', () => {
            // --- Constants ---
            const BASE_OPERATING_EXPENSE = 2000; 
            const MATERIAL_MARKUP_PERCENTAGE = 50; 

            // --- DOM Elements ---
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

            // Output Displays in Form
            const totalLaborCostDisplay = document.getElementById('totalLaborCostDisplay');
            const doubleMaterialCostDisplay = document.getElementById('doubleMaterialCostDisplay');
            
            // Buttons
            // const calculateQuoteBtn = document.getElementById('calculateQuoteBtn'); // Can be removed if not needed
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

            function setDisplayValue(element, value, isCurrency = true, decimals = 2) {
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

            function setPercentageDisplay(element, value, decimals = 1) {
                if(element) {
                    element.textContent = value.toFixed(decimals) + '%';
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
                const materialCost = getNumValue(materialCostInput);
                const serviceCost = getNumValue(serviceCostInput);
                const laborHours = getNumValue(laborHoursInput);
                const laborRate = getNumValue(laborRateInput);
                const dayPercentage = getNumValue(dayPercentageInput);
                const installationCost = getNumValue(installationCostInput);
                const quoteOperatingExpenses = getNumValue(quoteOperatingExpensesInput);
                const taxRate = getNumValue(taxRateInput);
                const applyTax = applyTaxCheckbox.checked;

                // --- Calculations ---
                // Labor (Live update in form section)
                const totalLabor = laborHours * laborRate;
                setDisplayValue(totalLaborCostDisplay, totalLabor);

                // Materials (Live update for double cost in form section)
                const doubleMaterialCost = materialCost * 2;
                setDisplayValue(doubleMaterialCostDisplay, doubleMaterialCost);
                
                // Material Markup (Automatic 50%)
                const materialMarkupValue = materialCost * (MATERIAL_MARKUP_PERCENTAGE / 100);
                const materialCostMarkedUp = materialCost + materialMarkupValue;

                // Subtotal
                const subtotal = materialCostMarkedUp + serviceCost + totalLabor + installationCost;

                // Tax
                const taxAmount = applyTax ? subtotal * (taxRate / 100) : 0;
                
                // Grand Total
                const grandTotal = subtotal + taxAmount;

                // Profit Breakdown Calculations
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

                // Markup Target (Suggested Price)
                const markupTargetLower = doubleMaterialCost + 300;
                const markupTargetUpper = doubleMaterialCost + 400;

                // --- Update Preview Pane ---
                // Client & Project Info
                setDisplayValue(document.getElementById('preview_clientName'), clientName, false);
                setDisplayValue(document.getElementById('preview_projectName'), projectName, false);

                // Costs & Totals
                setDisplayValue(document.getElementById('preview_materialCost'), materialCost);
                setDisplayValue(document.getElementById('preview_materialMarkupPercentage'), MATERIAL_MARKUP_PERCENTAGE, false, 0);
                setDisplayValue(document.getElementById('preview_materialMarkupValue'), materialMarkupValue);
                setDisplayValue(document.getElementById('preview_materialCostMarkedUp'), materialCostMarkedUp);
                setDisplayValue(document.getElementById('preview_serviceCost'), serviceCost);
                
                setDisplayValue(document.getElementById('preview_laborHours'), laborHours, false, 1);
                setDisplayValue(document.getElementById('preview_laborRate'), laborRate, true, 2); // Explicitly currency
                setDisplayValue(document.getElementById('preview_totalLabor'), totalLabor);
                
                setDisplayValue(document.getElementById('preview_installationCost'), installationCost);
                setDisplayValue(document.getElementById('preview_subtotal'), subtotal);
                
                setDisplayValue(document.getElementById('preview_taxRate'), taxRate, false, 2);
                setDisplayValue(document.getElementById('preview_taxAmount'), taxAmount);
                setDisplayValue(document.getElementById('preview_grandTotal'), grandTotal);

                // Business Analysis Preview
                setPercentageDisplay(document.getElementById('preview_dayPercentage'), dayPercentage);
                setDisplayValue(document.getElementById('preview_quoteOperatingExpenses'), quoteOperatingExpenses);
                setDisplayValue(document.getElementById('preview_doubleMaterialCost'), doubleMaterialCost);
                setDisplayValue(document.getElementById('preview_markupTarget'), `$${markupTargetLower.toFixed(2)} - $${markupTargetUpper.toFixed(2)}`, false);
                setPercentageDisplay(document.getElementById('preview_profitPercentage'), profitPercentageOfRevenue);

                // Profit Breakdown Preview
                setDisplayValue(document.getElementById('preview_profit_totalRevenue'), totalRevenueAfterTax);
                setDisplayValue(document.getElementById('preview_profit_operatingExpenses'), dayBasedOperatingExpenses);
                setDisplayValue(document.getElementById('preview_profit_materialCosts'), materialCost);
                setDisplayValue(document.getElementById('preview_profit_laborCosts'), totalLabor);
                setDisplayValue(document.getElementById('preview_profit_serviceCosts'), serviceCost);
                setDisplayValue(document.getElementById('preview_profit_installationCosts'), installationCost);
                setDisplayValue(document.getElementById('preview_profit_quoteSpecificOpEx'), quoteOperatingExpenses);
                setDisplayValue(document.getElementById('preview_netProfit'), netProfit);
            }

            function resetFormAndPreview() {
                quoteForm.reset(); 
                // Set default for taxRate as reset() might clear it
                if(taxRateInput) taxRateInput.value = "8.25"; 
                if(applyTaxCheckbox) applyTaxCheckbox.checked = true; 
                
                calculateAndUpdateAll(); 
                updateDate(); 
                setDisplayValue(document.getElementById('preview_quoteId'), 'QT-GEM-001', false);
            }

            // --- Event Listeners for Live Updates ---
            const inputsToWatch = [
                clientNameInput, projectNameInput, materialCostInput, serviceCostInput,
                laborHoursInput, laborRateInput, dayPercentageInput, installationCostInput,
                quoteOperatingExpensesInput, taxRateInput
            ];

            inputsToWatch.forEach(input => {
                if (input) {
                    input.addEventListener('input', calculateAndUpdateAll);
                }
            });

            if (applyTaxCheckbox) {
                applyTaxCheckbox.addEventListener('change', calculateAndUpdateAll);
            }
            
            // Removed explicit calculateQuoteBtn listener as updates are live.
            // If you want to keep it, you can add:
            // if (calculateQuoteBtn) calculateQuoteBtn.addEventListener('click', calculateAndUpdateAll);

            if (resetBtn) {
                resetBtn.addEventListener('click', resetFormAndPreview);
            }
            if (newQuoteBtn) {
                newQuoteBtn.addEventListener('click', resetFormAndPreview);
            }
            
            // --- Initial Setup ---
            updateDate();
            if(taxRateInput) taxRateInput.value = "8.25"; // Set default tax rate on load
            calculateAndUpdateAll(); // Initial calculation to populate everything
        });
    </script>
</body>
</html>
