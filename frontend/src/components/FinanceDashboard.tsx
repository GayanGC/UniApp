import React from 'react';
import FinanceSummaryReport from './finance/FinanceSummaryReport';
import AddIncomeForm from './finance/AddIncomeForm';
import AddExpenseForm from './finance/AddExpenseForm';
import TransactionHistoryBreakdown from './finance/TransactionHistoryBreakdown';
import BudgetSetting from './finance/BudgetSetting';

export default function FinanceDashboard() {
  // State for modals (income/expense)
  const [showIncomeModal, setShowIncomeModal] = React.useState(false);
  const [showExpenseModal, setShowExpenseModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Finance Dashboard</h1>
        <FinanceSummaryReport />
        <div className="flex gap-4 justify-center mt-6 mb-8">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow" onClick={() => setShowIncomeModal(true)}>
            + Add Income
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow" onClick={() => setShowExpenseModal(true)}>
            + Add Expense
          </button>
        </div>
        <TransactionHistoryBreakdown />
        <div className="flex justify-end mt-8">
          <BudgetSetting />
        </div>
      </div>
      {showIncomeModal && <AddIncomeForm onClose={() => setShowIncomeModal(false)} />}
      {showExpenseModal && <AddExpenseForm onClose={() => setShowExpenseModal(false)} />}
    </div>
  );
}