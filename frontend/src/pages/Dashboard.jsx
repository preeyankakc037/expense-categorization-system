import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Mock data (replace with API calls later)
const pieData = [
  { name: 'Housing', value: 12000 },
  { name: 'Food', value: 5000 },
  { name: 'Transport', value: 3000 },
  { name: 'Entertainment', value: 2000 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const barData = [
  { name: 'Jul', amount: 18000 },
  { name: 'Aug', amount: 22000 },
  { name: 'Sep', amount: 15000 },
  { name: 'Oct', amount: 25000 },
  { name: 'Nov', amount: 20000 },
  { name: 'Dec', amount: 28000 },
];

const recentExpenses = [
  { id: 1, description: 'Grocery Store', category: 'Food', amount: 4500, date: '2026-09-15' },
  { id: 2, description: 'Uber Ride', category: 'Transport', amount: 800, date: '2026-09-14' },
  { id: 3, description: 'Netflix Subscription', category: 'Entertainment', amount: 1200, date: '2026-09-12' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">Your spending overview</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Spending</p>
            <p className="text-2xl font-bold text-slate-900">Rs. 30,590</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">Number of Expenses</p>
            <p className="text-2xl font-bold text-slate-900">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">Average Expense</p>
            <p className="text-2xl font-bold text-slate-900">Rs. 3,824</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">Top Category</p>
            <p className="text-2xl font-bold text-slate-900">Housing</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => `Rs. ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `Rs. ${value}`} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Expenses</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No expenses yet.
                  </td>
                </tr>
              ) : (
                recentExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{expense.description}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">Rs. {expense.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">{expense.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
