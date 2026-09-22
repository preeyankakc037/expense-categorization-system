import { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { expenseCategoryGroups } from '../constants/categories';


const categoryOptions =
  expenseCategoryGroups.flatMap(
    (group) => group.categories
  );

export function Expenses() {

  // ADD NOW — real backend approach
  const [expenses, setExpenses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

// ==============================
// GET EXPENSES FROM BACKEND
// ==============================

useEffect(() => {

  // Ask FastAPI for all expenses
  fetch("http://localhost:8000/expenses")

    // Convert the HTTP response into JavaScript data
    .then((response) => response.json())

    // Put the backend data into React state
    .then((data) => {
      setExpenses(data);
    });

}, []);



  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.transaction_date
      });
    } else {
      setEditingExpense(null);
      setFormData({ description: '', amount: '', category: '', date: '' });
    }
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveExpense = async () => {
    try {
      const url = editingExpense 
        ? `http://localhost:8000/expenses/${editingExpense.id}`
        : "http://localhost:8000/expenses";
      
      const method = editingExpense ? "PUT" : "POST";
      
      const payload = {
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        category: formData.category,
        transaction_date: formData.date
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (editingExpense) {
          setExpenses(expenses.map(exp => exp.id === data.id ? data : exp));
        } else {
          setExpenses([...expenses, data]);
        }
        setIsModalOpen(false);
      } else {
        console.error("Failed to save expense");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      const response = await fetch(`http://localhost:8000/expenses/${expenseToDelete.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setExpenses(expenses.filter(exp => exp.id !== expenseToDelete.id));
        setIsDeleteDialogOpen(false);
        setExpenseToDelete(null);
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
          <p className="text-slate-500 mt-1">Track and manage your expenses</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search expenses..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="">All Categories</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input 
            type="date" 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-600"
          />
        </div>
      </Card>

      {/* Expense List - Desktop Table */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-800">{expense.description}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-medium">Rs. {expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{expense.transaction_date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(expense)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirm(expense)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Expense List - Mobile Cards */}
      <div className="md:hidden space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-slate-800">{expense.description}</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600 mt-1">
                  {expense.category}
                </span>
              </div>
              <p className="font-semibold text-slate-900">Rs. {expense.amount.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">{expense.transaction_date}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(expense)}
                  className="p-1.5 text-slate-400 hover:text-primary-600 bg-slate-50 rounded-md"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDeleteConfirm(expense)}
                  className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
      >
        <div className="space-y-4">
          <Input 
            label="Description" 
            placeholder="e.g. Lunch at Cafe"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <Input 
            label="Amount (Rs.)" 
            type="number" 
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
          <Select 
            label="Category" 
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
          <Input 
            label="Date" 
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveExpense}>
            {editingExpense ? 'Save Changes' : 'Save Expense'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Expense"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        {expenseToDelete && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm">
            <p><span className="font-medium">Description:</span> {expenseToDelete.description}</p>
            <p><span className="font-medium">Amount:</span> Rs. {expenseToDelete.amount}</p>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteExpense}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
