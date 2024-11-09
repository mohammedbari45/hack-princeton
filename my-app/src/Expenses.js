import React, {useState} from 'react'
function Expenses() {
    <h2>This is the Expense Tracker Page</h2>;

  // holding credit lim & expense with a state
  const [creditLimit, setCreditLimit] = useState(0);
  const [expense, setExpense] = useState('');
  const [remainingCredit, setRemainingCredit] = useState(0);

  // func handling credit lim and input
  const handleCreditLimitChange = (e) => {
    setCreditLimit(Number(e.target.value));
    setRemainingCredit(Number(e.target.value));
  };

  // func handling expense input
  const handleExpenseChange = (e) => {
    setExpense(e.target.value);
  };

  // func to update the remaining creds after expense input
  const handleExpenseSubmit = () => {
    if (expense && !isNaN(expense)) {
        const newRemainingCredit = remainingCredit - Number(expense);
        if (newRemainingCredit >= 0) {
            setRemainingCredit(newRemainingCredit);
        } else {
            alert("Insufficient credit limit.");
        }
        setExpense('');
    } else {
        alert("Please enter a valid expense amount.");
    }
};

return (
    <div className="App">
      <h1>Credit Limit Tracker</h1>
      <div>
        <label>
          Enter your Credit Limit: 
          <input
            type="number"
            value={creditLimit}
            onChange={handleCreditLimitChange}
            placeholder="Enter credit limit"
          />
        </label>
      </div>

      <div>
        <label>
          Enter your Expense: 
          <input
            type="number"
            value={expense}
            onChange={handleExpenseChange}
            placeholder="Enter expense"
          />
        </label>
      </div>

      <button onClick={handleExpenseSubmit}>Add Expense</button>

      <div>
        <h2>Remaining Credit: ${remainingCredit}</h2>
      </div>
    </div>
  );
}





export default Expenses;

