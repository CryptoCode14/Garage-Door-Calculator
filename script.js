```javascript
// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = [
        { button: document.getElementById('tab-commercial'), content: document.getElementById('content-commercial') },
        { button: document.getElementById('tab-residential'), content: document.getElementById('content-residential') },
        { button: document.getElementById('tab-service'), content: document.getElementById('content-service') }
    ];

    tabs.forEach(tab => {
        if (tab.button) {
            tab.button.addEventListener('click', () => {
                tabs.forEach(t => {
                    if (t.button) t.button.classList.remove('active', 'text-blue-600');
                    if (t.button) t.button.classList.add('text-gray-500', 'hover:text-gray-700');
                    if (t.content) t.content.classList.add('hidden');
                });
                tab.button.classList.add('active', 'text-blue-600');
                tab.button.classList.remove('text-gray-500', 'hover:text-gray-700');
                if (tab.content) tab.content.classList.remove('hidden');
                
                // Trigger calculation for the newly active tab
                if (tab.button.id === 'tab-commercial') calculateCommercial();
                if (tab.button.id === 'tab-residential') calculateResidential(); // Ensure this is called
                if (tab.button.id === 'tab-service') calculateServiceCall();
            });
        }
    });

    // Helper to get numeric value from input
    function getNumValue(id, defaultValue = 0) {
        const element = document.getElementById(id);
        if (!element) {
            // console.warn(`Element with ID ${id} not found.`); // Keep this for debugging if needed
            return defaultValue;
        }
        const value = parseFloat(element.value);
        return isNaN(value) || value === '' ? defaultValue : value; // Treat empty string as default
    }

    // Helper to set text content of an element, formatting as currency or percentage
    function setText(id, value, formatType = 'currency', decimals = 2) {
        const element = document.getElementById(id);
        if (!element) {
            // console.warn(`Element with ID ${id} not found for setting text.`); // Keep for debugging
            return;
        }
        let displayValue = parseFloat(value);
        if (isNaN(displayValue)) displayValue = 0; // Default to 0 if value is not a number

        if (formatType === 'currency') {
            element.textContent = displayValue.toFixed(decimals);
        } else if (formatType === 'percentage') {
            element.textContent = displayValue.toFixed(decimals) + '%';
        } else {
            element.textContent = displayValue.toString();
        }
    }
    
    // --- Commercial Calculator Logic ---
    function calculateCommercial() {
        // Door Components (C11:C16)
        const com_c11 = getNumValue('com_c11');
        const com_c12 = getNumValue('com_c12');
        const com_c13 = getNumValue('com_c13');
        const com_c14 = getNumValue('com_c14');
        const com_c15 = getNumValue('com_c15');
        const com_c16 = getNumValue('com_c16');
        const com_calc_sum_c11_c16 = com_c11 + com_c12 + com_c13 + com_c14 + com_c15 + com_c16;
        setText('com_calc_sum_c11_c16', com_calc_sum_c11_c16);

        // Track Assembly (C17*A19)
        const com_c17_price = getNumValue('com_c17_price');
        const com_a19_qty = getNumValue('com_a19_qty', 1); 
        const com_calc_c17_times_a19 = com_c17_price * com_a19_qty;
        setText('com_calc_c17_times_a19', com_calc_c17_times_a19);

        // Spring Assembly (B21*A21)
        const com_b21_price = getNumValue('com_b21_price');
        const com_a21_qty = getNumValue('com_a21_qty', 1); 
        const com_calc_b21_times_a21 = com_b21_price * com_a21_qty;
        setText('com_calc_b21_times_a21', com_calc_b21_times_a21);

        // Misc Options (C19val * A23 where C19val is Total Track Assembly)
        const com_a23_multiplier = getNumValue('com_a23_multiplier');
        const com_calc_c19val_times_a23 = com_calc_c17_times_a19 * com_a23_multiplier;
        setText('com_calc_c19val_times_a23', com_calc_c19val_times_a23);
        
        // Subtotal (Track + Spring + Misc Options) (Formula C19+C21+C23)
        const com_calc_sum_c19_c21_c23_results = com_calc_c17_times_a19 + com_calc_b21_times_a21 + com_calc_c19val_times_a23;
        setText('com_calc_sum_c19_c21_c23_results', com_calc_sum_c19_c21_c23_results);

        // Labor Costs (C25:C30)
        const com_c25 = getNumValue('com_c25');
        const com_c26 = getNumValue('com_c26');
        const com_c27 = getNumValue('com_c27');
        const com_c28 = getNumValue('com_c28');
        const com_c29 = getNumValue('com_c29');
        const com_c30 = getNumValue('com_c30');
        const com_calc_sum_c25_c30 = com_c25 + com_c26 + com_c27 + com_c28 + com_c29 + com_c30;
        setText('com_calc_sum_c25_c30', com_calc_sum_c25_c30);

        // Operator Costs (C31*A33)
        const com_c31_price_operator = getNumValue('com_c31_price_operator');
        const com_a33_qty_operator = getNumValue('com_a33_qty_operator', 1); 
        const com_calc_c31val_times_a33 = com_c31_price_operator * com_a33_qty_operator;
        setText('com_calc_c31val_times_a33', com_calc_c31val_times_a33);

        // Total Labor + Operator (Formula SUM(C31+C33) where C31 is labor sum, C33 is operator total)
        // Based on the formulas provided, C31 is the *value* of operator price, not labor sum.
        // And C33 is the *quantity* of operators.
        // The formula "SUM(C31+C33)" seems to refer to the *results* of "Subtotal Labor" and "Total Operator Cost".
        // So, it should be: com_calc_sum_c25_c30 (Subtotal Labor) + com_calc_c31val_times_a33 (Total Operator Cost)
        const com_calc_sum_labor_plus_operator_results = com_calc_sum_c25_c30 + com_calc_c31val_times_a33;
        setText('com_calc_sum_c31_plus_c33_results', com_calc_sum_labor_plus_operator_results); // ID matches HTML for this specific output
        
        // Summary Calculations
        setText('com_total_door_components_cost', com_calc_sum_c11_c16);
        setText('com_total_track_spring_options_cost', com_calc_sum_c19_c21_c23_results);
        setText('com_total_labor_cost_summary', com_calc_sum_c25_c30);
        setText('com_total_operator_cost_summary', com_calc_c31val_times_a33);

        const com_total_direct_job_costs = com_calc_sum_c11_c16 + com_calc_sum_c19_c21_c23_results + com_calc_sum_c25_c30 + com_calc_c31val_times_a33;
        setText('com_total_direct_job_costs', com_total_direct_job_costs);

        const com_markup_percentage = getNumValue('com_markup_percentage');
        const com_markup_amount = com_total_direct_job_costs * (com_markup_percentage / 100);
        setText('com_markup_amount', com_markup_amount);

        const com_subtotal_before_tax = com_total_direct_job_costs + com_markup_amount; // This is C35
        setText('com_subtotal_before_tax', com_subtotal_before_tax);

        const com_tax_rate = getNumValue('com_tax_rate');
        const com_tax_amount = com_subtotal_before_tax * (com_tax_rate / 100);
        setText('com_tax_amount', com_tax_amount);

        const com_grand_total = com_subtotal_before_tax + com_tax_amount;
        setText('com_grand_total', com_grand_total);

        // Specific Profit Calculation (Formulas C35-C40)
        // C37 = Total Track Assembly (com_calc_c17_times_a19) + Total Spring Assembly (com_calc_b21_times_a21)
        // This matches user formula SUM(C19+C21) if C19 is track total and C21 is spring total
        const com_cost_for_profit_calc_c37 = com_calc_c17_times_a19 + com_calc_b21_times_a21;
        setText('com_cost_for_profit_calc_c37', com_cost_for_profit_calc_c37);

        // C35 is com_subtotal_before_tax
        const com_profit_c39 = com_subtotal_before_tax - com_cost_for_profit_calc_c37;
        setText('com_profit_c39', com_profit_c39);

        let com_profit_margin_c40 = 0;
        if (com_subtotal_before_tax !== 0) { // Avoid division by zero
            com_profit_margin_c40 = (com_profit_c39 / com_subtotal_before_tax) * 100;
        }
        setText('com_profit_margin_c40', com_profit_margin_c40, 'percentage');
    }

    // --- Residential Calculator Logic ---
    function calculateResidential() {
        // TODO: Fully implement residential calculations by:
        // 1. Ensuring all corresponding HTML fields are present in the Residential tab (similar to Commercial but with 'res_' prefix).
        // 2. Duplicating the logic from calculateCommercial(), changing 'com_' prefixes to 'res_'.
        // 3. Adjusting any specific formulas or fields unique to residential quotes.

        // Example: Get value from a residential field (ensure 'res_c11' exists in HTML)
        const res_c11 = getNumValue('res_c11'); 
        // ... get other res_ values ...

        // Perform calculations similar to commercial, e.g.:
        // const res_calc_sum_c11_c16 = res_c11 + res_c12 + ... ;
        // setText('res_calc_sum_c11_c16', res_calc_sum_c11_c16);
        
        // For now, a simple placeholder calculation for grand total:
        const res_grand_total_placeholder = res_c11 * 1.25; // Replace with actual calculation
        setText('res_grand_total', res_grand_total_placeholder); 
        
        // console.log("Residential calculation triggered. Grand Total (dummy):", res_grand_total_placeholder);
    }

    // --- Service Call Calculator Logic ---
    function calculateServiceCall() {
        const sc_service_call_fee = getNumValue('sc_service_call_fee');
        const sc_labor_hours = getNumValue('sc_labor_hours');
        const sc_labor_rate_per_hour = getNumValue('sc_labor_rate_per_hour');
        const sc_total_parts_cost = getNumValue('sc_total_parts_cost');

        const sc_total_labor_cost = sc_labor_hours * sc_labor_rate_per_hour;
        setText('sc_total_labor_cost', sc_total_labor_cost);

        const sc_subtotal_before_tax = sc_service_call_fee + sc_total_labor_cost + sc_total_parts_cost;
        setText('sc_subtotal_before_tax', sc_subtotal_before_tax);

        const sc_tax_rate = getNumValue('sc_tax_rate');
        const sc_tax_amount = sc_subtotal_before_tax * (sc_tax_rate / 100);
        setText('sc_tax_amount', sc_tax_amount);

        const sc_grand_total = sc_subtotal_before_tax + sc_tax_amount;
        setText('sc_grand_total', sc_grand_total);
    }

    // Attach event listeners to all input fields for dynamic calculation
    const allInputs = document.querySelectorAll('.input-field');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            const activeTabButton = tabs.find(tab => tab.button && tab.button.classList.contains('active'));
            if (activeTabButton && activeTabButton.button) { // Check if button exists
                if (activeTabButton.button.id === 'tab-commercial') calculateCommercial();
                else if (activeTabButton.button.id === 'tab-residential') calculateResidential();
                else if (activeTabButton.button.id === 'tab-service') calculateServiceCall();
            }
        });
    });

    // Initial calculation for the default active tab (Commercial)
    const initialActiveTab = tabs.find(tab => tab.button && tab.button.classList.contains('active'));
    if (initialActiveTab && initialActiveTab.button) { // Check if button exists
        if (initialActiveTab.button.id === 'tab-commercial') {
            calculateCommercial();
        } else if (initialActiveTab.button.id === 'tab-residential') {
            // calculateResidential(); // Call if residential is default and fully implemented
        } else if (initialActiveTab.button.id === 'tab-service') {
            // calculateServiceCall(); // Call if service is default and fully implemented
        }
    }
});
