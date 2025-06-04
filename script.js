
        // --- DOM Elements ---
        const doorCostInput = document.getElementById('doorCost');
        const glassCostInput = document.getElementById('glassCost');
        const miscCostInput = document.getElementById('miscCost');
        const multiplierInput = document.getElementById('multiplier');
        const installTimePercentInput = document.getElementById('installTimePercent');
        const installationChargeInput = document.getElementById('installationCharge');
        const fuelTravelTimeInput = document.getElementById('fuelTravelTime');

        const displayTotalDoorCost = document.getElementById('displayTotalDoorCost');
        const displayOverheadCost = document.getElementById('displayOverheadCost');
        const displayJobCost = document.getElementById('displayJobCost');
        const displayMarkup1 = document.getElementById('displayMarkup1');
        const displaySubtotalAfterMarkup1 = document.getElementById('displaySubtotalAfterMarkup1');
        const displaySubtotalAfterInstallAndTravel = document.getElementById('displaySubtotalAfterInstallAndTravel');
        const displayMarkup2 = document.getElementById('displayMarkup2');
        const displayGrandTotal = document.getElementById('displayGrandTotal');
        const displayTotalExpenses = document.getElementById('displayTotalExpenses');
        const displayNetProfit = document.getElementById('displayNetProfit');
        const displayProfitPercentage = document.getElementById('displayProfitPercentage');

        // --- Constants ---
        const DAILY_OPERATION_COST = 2000;
        const MARKUP_1_PERCENTAGE = 0.40; // 40%
        const MARKUP_2_PERCENTAGE = 0.10; // 10%

        // --- Helper Function to get numeric value from input ---
        function getNumValue(element, defaultValue = 0) {
            const value = parseFloat(element.value);
            return isNaN(value) ? defaultValue : value;
        }

        // --- Main Calculation Function ---
        function calculatePrice() {
            // 1. Door Cost Calculation
            const doorCost = getNumValue(doorCostInput);
            const glassCost = getNumValue(glassCostInput); // Optional, defaults to 0 if empty
            const miscCost = getNumValue(miscCostInput);
            const multiplier = getNumValue(multiplierInput, 1); // Default multiplier to 1 if not set

            const totalDoorCost = (doorCost + glassCost + miscCost) * multiplier;
            displayTotalDoorCost.textContent = `$${totalDoorCost.toFixed(2)}`;

            // 2. Overhead Cost Calculation
            const installTimePercent = getNumValue(installTimePercentInput);
            const overheadCost = DAILY_OPERATION_COST * (installTimePercent / 100);
            displayOverheadCost.textContent = `$${overheadCost.toFixed(2)}`;

            // 3. Job Cost (Total Door Cost + Overhead Cost)
            const jobCost = totalDoorCost + overheadCost;
            displayJobCost.textContent = `$${jobCost.toFixed(2)}`;

            // 4. Markup 1 (40%)
            const markup1Amount = jobCost * MARKUP_1_PERCENTAGE;
            displayMarkup1.textContent = `$${markup1Amount.toFixed(2)}`;
            const subtotalAfterMarkup1 = jobCost + markup1Amount;
            displaySubtotalAfterMarkup1.textContent = `$${subtotalAfterMarkup1.toFixed(2)}`;

            // 5. Installation & Travel Costs
            const installationCharge = getNumValue(installationChargeInput);
            const fuelTravelTime = getNumValue(fuelTravelTimeInput);
            const subtotalAfterInstallAndTravel = subtotalAfterMarkup1 + installationCharge + fuelTravelTime;
            displaySubtotalAfterInstallAndTravel.textContent = `$${subtotalAfterInstallAndTravel.toFixed(2)}`;

            // 6. Markup 2 (10%)
            const markup2Amount = subtotalAfterInstallAndTravel * MARKUP_2_PERCENTAGE;
            displayMarkup2.textContent = `$${markup2Amount.toFixed(2)}`;
            const grandTotal = subtotalAfterInstallAndTravel + markup2Amount;
            displayGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;

            // 7. Profit Calculation
            // Total expenses are the actual costs incurred before any markups for profit
            const totalExpenses = doorCost + glassCost + miscCost + overheadCost + installationCharge + fuelTravelTime;
            displayTotalExpenses.textContent = `$${totalExpenses.toFixed(2)}`;

            const netProfit = grandTotal - totalExpenses;
            displayNetProfit.textContent = `$${netProfit.toFixed(2)}`;

            let profitPercentage = 0;
            if (grandTotal > 0) { // Avoid division by zero
                profitPercentage = (netProfit / grandTotal) * 100;
            }
            displayProfitPercentage.textContent = `${profitPercentage.toFixed(2)}%`;
        }

        // --- Event Listeners ---
        const inputs = [
            doorCostInput, glassCostInput, miscCostInput, multiplierInput,
            installTimePercentInput, installationChargeInput, fuelTravelTimeInput
        ];

        inputs.forEach(input => {
            input.addEventListener('input', calculatePrice);
        });

        // --- Initial Calculation on Load ---
        calculatePrice();
   
