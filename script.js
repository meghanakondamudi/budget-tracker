document.addEventListener('DOMContentLoaded', function() {
    // Get all input elements
    const incomeInputs = document.querySelectorAll('.income-input');
    const expenseInputs = document.querySelectorAll('.expense-input');
    const goalInputs = document.querySelectorAll('.goal-input');
    const lastMonthBalanceInput = document.getElementById('last-month-balance');
    
    // Get button elements
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const printBtn = document.getElementById('print-btn');
    const allocateBtn = document.getElementById('allocate-btn');
    
    // Add event listeners to all money inputs
    incomeInputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    expenseInputs.forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    lastMonthBalanceInput.addEventListener('input', calculateTotals);
    
    // Button event listeners
    saveBtn.addEventListener('click', saveBudget);
    resetBtn.addEventListener('click', resetBudget);
    printBtn.addEventListener('click', printBudget);
    allocateBtn.addEventListener('click', allocateSavings);
    
    // Load saved data if available
    loadSavedData();
    
    function calculateTotals() {
        // Calculate total income
        let totalIncome = 0;
        incomeInputs.forEach(input => {
            totalIncome += parseFloat(input.value) || 0;
        });
        document.getElementById('total-income').textContent = formatCurrency(totalIncome);
        
        // Calculate total expenses
        let totalExpenses = 0;
        expenseInputs.forEach(input => {
            totalExpenses += parseFloat(input.value) || 0;
        });
        document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
        
        // Calculate total savings
        const totalSavings = totalIncome - totalExpenses;
        document.getElementById('total-savings').textContent = formatCurrency(totalSavings);
        
        // Calculate total amount in bank
        const lastMonthBalance = parseFloat(lastMonthBalanceInput.value) || 0;
        const totalAmount = totalSavings + lastMonthBalance;
        document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
        
        return totalSavings;
    }
    
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    function saveBudget() {
        const budgetData = {
            month: document.getElementById('month').value,
            income: {},
            expenses: {},
            goals: {},
            lastMonthBalance: lastMonthBalanceInput.value || 0
        };
        
        // Collect income data
        incomeInputs.forEach(input => {
            budgetData.income[input.id] = input.value || 0;
        });
        
        // Collect expense data
        expenseInputs.forEach(input => {
            budgetData.expenses[input.id] = input.value || 0;
        });
        
        // Collect goal data
        goalInputs.forEach(input => {
            budgetData.goals[input.id] = input.value || 0;
        });
        
        // Save to localStorage
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
        
        alert('Budget saved successfully!');
    }
    
    function loadSavedData() {
        const savedData = localStorage.getItem('budgetData');
        if (savedData) {
            const budgetData = JSON.parse(savedData);
            
            // Set month
            document.getElementById('month').value = budgetData.month || '';
            
            // Set income values
            for (const [id, value] of Object.entries(budgetData.income)) {
                const input = document.getElementById(id);
                if (input) input.value = value;
            }
            
            // Set expense values
            for (const [id, value] of Object.entries(budgetData.expenses)) {
                const input = document.getElementById(id);
                if (input) input.value = value;
            }
            
            // Set goal values
            for (const [id, value] of Object.entries(budgetData.goals)) {
                const input = document.getElementById(id);
                if (input) input.value = value;
            }
            
            // Set last month balance
            lastMonthBalanceInput.value = budgetData.lastMonthBalance || 0;
            
            // Recalculate totals
            calculateTotals();
        }
    }
    
    function resetBudget() {
        if (confirm('Are you sure you want to reset all values?')) {
            // Clear all inputs
            document.getElementById('month').value = '';
            
            incomeInputs.forEach(input => {
                input.value = '';
            });
            
            expenseInputs.forEach(input => {
                input.value = '';
            });
            
            goalInputs.forEach(input => {
                input.value = '';
            });
            
            lastMonthBalanceInput.value = '';
            
            // Reset totals
            document.getElementById('total-income').textContent = '$0.00';
            document.getElementById('total-expenses').textContent = '$0.00';
            document.getElementById('total-savings').textContent = '$0.00';
            document.getElementById('total-amount').textContent = '$0.00';
            
            // Reset progress indicators
            document.querySelectorAll('.goal-progress').forEach(el => {
                el.textContent = '0%';
            });
        }
    }
    
    function printBudget() {
        window.print();
    }
    
    function allocateSavings() {
        const totalSavings = calculateTotals();
        if (totalSavings <= 0) {
            alert('No savings available to allocate!');
            return;
        }
        
        const goalElements = document.querySelectorAll('.goal');
        let totalAllocated = 0;
        
        // First pass to calculate total requested allocation
        goalElements.forEach(goal => {
            const input = goal.querySelector('.goal-input');
            const requested = parseFloat(input.value) || 0;
            totalAllocated += requested;
        });
        
        if (totalAllocated > totalSavings) {
            if (!confirm(`You've requested to allocate $${totalAllocated.toFixed(2)} but only have $${totalSavings.toFixed(2)} available. Proceed with proportional allocation?`)) {
                return;
            }
            
            // Proportional allocation
            goalElements.forEach(goal => {
                const input = goal.querySelector('.goal-input');
                const progress = goal.querySelector('.goal-progress');
                const requested = parseFloat(input.value) || 0;
                
                if (requested > 0) {
                    const allocated = (requested / totalAllocated) * totalSavings;
                    input.value = allocated.toFixed(2);
                    progress.textContent = Math.round((allocated / requested) * 100) + '%';
                } else {
                    progress.textContent = '0%';
                }
            });
        } else {
            // Full allocation
            goalElements.forEach(goal => {
                const input = goal.querySelector('.goal-input');
                const progress = goal.querySelector('.goal-progress');
                const requested = parseFloat(input.value) || 0;
                
                if (requested > 0) {
                    progress.textContent = '100%';
                } else {
                    progress.textContent = '0%';
                }
            });
        }
        
        alert('Savings allocated to goals!');
    }
});
