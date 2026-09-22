import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';


const CATEGORY_GROUPS = {
  Food: ['Restaurants', 'Groceries'],

  Living: ['Housing', 'Utilities'],

  Transportation: ['Transportation'],

  Healthcare: ['Healthcare'],

  Insurance: ['Insurance'],

  Education: ['Education'],

  Lifestyle: [
    'Entertainment',
    'Shopping',
    'Subscription',
    'Personal Care',
    'Travel',
  ],

  'Fees & Charges': ['Fees'],
};

const GROUP_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#64748b',
];

const API_URL = 'http://localhost:8000/expenses';

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
}

function formatDate(date) {
  if (!date) {
    return '';
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getGroupForCategory(category) {
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.includes(category)) {
      return group;
    }
  }

  return 'Other';
}

function getMonthKey(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return `${parsedDate.getFullYear()}-${String(
    parsedDate.getMonth() + 1
  ).padStart(2, '0')}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');

  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      year: 'numeric',
    }
  );
}

export function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /*
    ============================================================
    FETCH REAL EXPENSE DATA
    ============================================================
  */

  useEffect(() => {
    async function fetchExpenses() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        console.error('Dashboard expense fetch error:', err);
        setError('Unable to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  /*
    ============================================================
    SUMMARY STATISTICS
    ============================================================
  */

  const totalSpending = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const expenseCount = expenses.length;

  const averageExpense =
    expenseCount > 0 ? totalSpending / expenseCount : 0;

  /*
    ============================================================
    CATEGORY TOTALS
    ============================================================
  */

  const categoryTotals = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const category = expense.category;

      if (!category) {
        return;
      }

      totals[category] =
        (totals[category] || 0) + Number(expense.amount || 0);
    });

    return totals;
  }, [expenses]);

  /*
    ============================================================
    GROUP TOTALS
    ============================================================
  */

  const groupTotals = useMemo(() => {
    const totals = {};

    Object.keys(CATEGORY_GROUPS).forEach((group) => {
      totals[group] = 0;
    });

    expenses.forEach((expense) => {
      const group = getGroupForCategory(expense.category);

      if (!totals[group]) {
        totals[group] = 0;
      }

      totals[group] += Number(expense.amount || 0);
    });

    return totals;
  }, [expenses]);

  /*
    ============================================================
    TOP CATEGORY
    ============================================================
  */

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryTotals);

    if (entries.length === 0) {
      return '—';
    }

    entries.sort((a, b) => b[1] - a[1]);

    return entries[0][0];
  }, [categoryTotals]);

  /*
    ============================================================
    PIE CHART DATA — HIGH LEVEL GROUPS
    ============================================================
  */

  const pieData = useMemo(() => {
    return Object.entries(groupTotals)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [groupTotals]);

  /*
    ============================================================
    CATEGORY BREAKDOWN DATA
    ============================================================
  */

  const categoryData = useMemo(() => {
    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        group: getGroupForCategory(name),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [categoryTotals]);

  /*
    ============================================================
    MONTHLY SPENDING TREND
    ============================================================
  */

  const barData = useMemo(() => {
    const monthlyTotals = {};

    expenses.forEach((expense) => {
      const monthKey = getMonthKey(expense.transaction_date);

      if (!monthKey) {
        return;
      }

      monthlyTotals[monthKey] =
        (monthlyTotals[monthKey] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(monthlyTotals)
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .slice(-6)
      .map(([month, amount]) => ({
        name: formatMonthLabel(month),
        amount,
      }));
  }, [expenses]);

  /*
    ============================================================
    RECENT EXPENSES
    ============================================================
  */

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort(
        (a, b) =>
          new Date(b.transaction_date) - new Date(a.transaction_date)
      )
      .slice(0, 5);
  }, [expenses]);

  /*
    ============================================================
    LOADING STATE
    ============================================================
  */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Loading your spending overview...
          </p>
        </div>

        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            Loading dashboard data...
          </CardContent>
        </Card>

        <Footer />
      </div>
    );
  }

  /*
    ============================================================
    ERROR STATE
    ============================================================
  */

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Your spending overview
          </p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <p className="text-sm text-slate-500 mt-2">
              Make sure the FastAPI backend is running.
            </p>
          </CardContent>
        </Card>

        <Footer />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            Your spending overview
          </p>
        </div>
      </div>

      {/* ======================================================
          SUMMARY CARDS
          ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Spending
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalSpending)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Number of Expenses
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {expenseCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Average Expense
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(averageExpense)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Top Category
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {topCategory}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          MAIN CHARTS
          ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by GROUP */}

        <Card>
          <CardHeader>
            <CardTitle>Spending by Group</CardTitle>
          </CardHeader>

          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-slate-500">
                No expense data yet.
              </div>
            ) : (
              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            GROUP_COLORS[index % GROUP_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>

                    <RechartsTooltip
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Trend */}

        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>

          <CardContent>
            {barData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-slate-500">
                No expense data yet.
              </div>
            ) : (
              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#64748b',
                        fontSize: 12,
                      }}
                      dy={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#64748b',
                        fontSize: 12,
                      }}
                    />

                    <RechartsTooltip
                      cursor={{
                        fill: '#f1f5f9',
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />

                    <Bar
                      dataKey="amount"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          CATEGORY / SUBCATEGORY BREAKDOWN
          ====================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          {categoryData.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No expense categories yet.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div
                  key={category.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">
                        {category.name}
                      </span>

                      <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                        {category.group}
                      </span>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${
                            totalSpending > 0
                              ? Math.min(
                                  (category.amount / totalSpending) * 100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="font-semibold text-slate-800">
                    {formatCurrency(category.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ======================================================
          GROUP → SUBCATEGORY STRUCTURE
          ====================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Spending Groups</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(CATEGORY_GROUPS).map(
              ([group, categories]) => (
                <div
                  key={group}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-slate-800">
                      {group}
                    </h3>

                    <span className="text-sm font-medium text-slate-600">
                      {formatCurrency(groupTotals[group] || 0)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-500">
                          {category}
                        </span>

                        <span className="font-medium text-slate-700">
                          {formatCurrency(
                            categoryTotals[category] || 0
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* ======================================================
          RECENT EXPENSES
          ====================================================== */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Expenses</CardTitle>

          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">
                  Description
                </th>

                <th className="px-6 py-3 font-medium">
                  Category
                </th>

                <th className="px-6 py-3 font-medium">
                  Group
                </th>

                <th className="px-6 py-3 font-medium">
                  Amount
                </th>

                <th className="px-6 py-3 font-medium">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No expenses yet.
                  </td>
                </tr>
              ) : (
                recentExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {expense.description}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                        {expense.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {getGroupForCategory(expense.category)}
                    </td>

                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {formatCurrency(expense.amount)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(expense.transaction_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ======================================================
          FOOTER
          ====================================================== */}

      <Footer />
    </div>
  );
}