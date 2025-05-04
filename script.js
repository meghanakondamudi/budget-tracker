document.addEventListener('DOMContentLoaded', function() {
    // Get all input elements
    const incomeInputs = document.querySelectorAll('.income-input');
    const expenseInputs = document.querySelectorAll('.expense-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    
    // Add hover animation to buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px)';
        });
    });
    
    // Calculate totals
    calculateBtn.addEventListener('click', function() {
        // Calculate total income
        let totalIncome = 0;
        incomeInputs.forEach(input => {
            totalIncome += parseFloat(input.value) || 0;
        });
        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        
        // Calculate total expenses
        let totalExpenses = 0;
        expenseInputs.forEach(input => {
            totalExpenses += parseFloat(input.value) || 0;
        });
        document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
        
        // Calculate savings and bank total
        const lastMonthBalance = parseFloat(document.getElementById('last-month-balance').value) || 0;
        const totalSavings = totalIncome - totalExpenses;
        const totalBank = totalSavings + lastMonthBalance;
        
        document.getElementById('total-savings').textContent = totalSavings.toFixed(2);
        document.getElementById('total-bank').textContent = totalBank.toFixed(2);
        
        // Add success animation
        this.textContent = 'Calculated!';
        this.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            this.textContent = 'Calculate';
            this.style.backgroundColor = '';
        }, 1500);
    });
    
    // Reset all fields
    resetBtn.addEventListener('click', function() {
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            input.value = '';
        });
        
        const allTotals = document.querySelectorAll('.total span');
        allTotals.forEach(total => {
            total.textContent = '0.00';
        });
        
        // Add reset animation
        this.textContent = 'Cleared!';
        setTimeout(() => {
            this.textContent = 'Reset';
        }, 1500);
    });
    
    // Save data (simplified - would need backend for real implementation)
    saveBtn.addEventListener('click', function() {
        const month = document.getElementById('month').value || 'Untitled';
        localStorage.setItem('budgetData', JSON.stringify({
            month: month,
            // Add other data to save here
        }));
        
        // Add save animation
        this.textContent = 'Saved!';
        setTimeout(() => {
            this.textContent = 'Save Data';
        }, 1500);
    });
});
