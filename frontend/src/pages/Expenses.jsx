import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

// Mock data (replace with API calls later)
const initialExpenses = [
  { id: 1, description: 'Grocery Store', category: 'Food', amount: 4500, date: '2026-09-15' },
  { id: 2, description: 'Uber Ride', category: 'Transport', amount: 800, date: '2026-09-14' },
  { id: 3, description: 'Netflix Subscription', category: 'Entertainment', amount: 1200, date: '2026-09-12' },
  { id: 4, description: 'Electricity Bill', category: 'Housing', amount: 3500, date: '2026-09-10' },
  { id: 5, description: 'Coffee Shop', category: 'Food', amount: 450, date: '2026-09-09' },
];

const categoryOptions = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Utilities', label: 'Utilities' },
];

export function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

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
        date: expense.date
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
                  <td className="px-6 py-4 text-slate-500">{expense.date}</td>
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
              <span className="text-xs text-slate-500">{expense.date}</span>
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
          <Button>
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
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
