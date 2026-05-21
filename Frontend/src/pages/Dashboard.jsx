import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await api.get('/api/expenses');
                setExpenses(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [navigate]);

    // Data Preparation
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate This Month's Spending
    const now = new Date();
    const thisMonthExpenses = expenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlySpent = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categories = [...new Set(expenses.map(exp => exp.category))];
    const categoryTotals = categories.map(cat => ({
        category: cat,
        total: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
    })).sort((a, b) => b.total - a.total);

    const topCategory = categoryTotals.length > 0 ? categoryTotals[0].category : 'N/A';

    const pieData = {
        labels: categoryTotals.map(ct => ct.category),
        datasets: [{
            data: categoryTotals.map(ct => ct.total),
            backgroundColor: [
                '#2563eb', // blue
                '#10b981', // green
                '#f59e0b', // amber
                '#ef4444', // red
                '#8b5cf6', // violet
                '#ec4899', // pink
                '#06b6d4', // cyan
            ],
            borderWidth: 0,
        }]
    };

    // Monthly Data Aggregation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((month, index) => {
        const total = expenses
            .filter(exp => {
                const d = new Date(exp.date);
                return d.getMonth() === index && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, exp) => sum + exp.amount, 0);
        return total;
    });

    const monthlyChartData = {
        labels: months,
        datasets: [{
            label: 'Monthly Spending',
            data: monthlyData,
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
            borderColor: '#2563eb',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    // Yearly Data Aggregation
    const years = [...new Set(expenses.map(exp => new Date(exp.date).getFullYear()))].sort();
    const yearlyData = years.map(year => {
        const total = expenses
            .filter(exp => new Date(exp.date).getFullYear() === year)
            .reduce((sum, exp) => sum + exp.amount, 0);
        return total;
    });

    const yearlyChartData = {
        labels: years,
        datasets: [{
            label: 'Yearly Spending',
            data: yearlyData,
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (loading) return <div className="container">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Financial Dashboard</h1>
                    <p className="text-light">Welcome back! Here's your spending overview.</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/add-expense')} className="btn btn-primary">
                        + Add Expense
                    </button>
                </div>
            </header>

            {/* Summary Row */}
            <div className="summary-grid">
                <div className="summary-card">
                    <span className="summary-label">Total Spent</span>
                    <span className="summary-value">${totalSpent.toFixed(2)}</span>
                    <span className="summary-subtext">All time data</span>
                </div>
                <div className="summary-card primary">
                    <span className="summary-label">This Month</span>
                    <span className="summary-value">${monthlySpent.toFixed(2)}</span>
                    <span className="summary-subtext">Current billing cycle</span>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Transactions</span>
                    <span className="summary-value">{expenses.length}</span>
                    <span className="summary-subtext">Total records</span>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Top Category</span>
                    <span className="summary-value">{topCategory}</span>
                    <span className="summary-subtext">Most frequent spending</span>
                </div>
            </div>

            <div className="dashboard-main">
                {/* Category Pie Chart Section */}
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>Spending Distribution</h3>
                    </div>
                    <div className="chart-wrapper">
                        {expenses.length > 0 ? (
                            <Pie
                                data={pieData}
                                options={{
                                    plugins: {
                                        legend: { position: 'bottom' }
                                    },
                                    maintainAspectRatio: false
                                }}
                            />
                        ) : (
                            <div className="empty-state">No data to display</div>
                        )}
                    </div>
                </div>

                {/* Category Summary Table Section */}
                <div className="dashboard-card list-card">
                    <div className="card-header">
                        <h3>Spending by Category</h3>
                        <div className="badge">{categoryTotals.length} Categories</div>
                    </div>
                    <div className="table-container">
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th className="text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryTotals.map((ct) => (
                                    <tr key={ct.category}>
                                        <td>
                                            <div className="category-cell">
                                                <span className="category-dot" style={{ backgroundColor: pieData.datasets[0].backgroundColor[categoryTotals.indexOf(ct) % 7] }}></span>
                                                {ct.category}
                                            </div>
                                        </td>
                                        <td className="text-right font-600">${ct.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {categoryTotals.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="text-center py-4 text-light">No category data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Trend Charts Section */}
            <div className="trends-grid" style={{ marginTop: '2rem' }}>
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>Monthly Spending ({now.getFullYear()})</h3>
                    </div>
                    <div className="chart-wrapper">
                        <Bar
                            data={monthlyChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }}
                        />
                    </div>
                </div>
                <div className="dashboard-card chart-card">
                    <div className="card-header">
                        <h3>Yearly Spending Overview</h3>
                    </div>
                    <div className="chart-wrapper">
                        <Bar
                            data={yearlyChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Activities Section - Moved to Bottom */}
            <div className="dashboard-card recent-activity-wide" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                    <h3>Recent Transactions</h3>
                    <button onClick={() => navigate('/expenses')} className="link-btn">View All History</button>
                </div>
                <div className="transaction-grid-wide">
                    {recentExpenses.length > 0 ? (
                        recentExpenses.map((exp) => (
                            <div key={exp._id} className="transaction-item-wide">
                                <div className="transaction-main">
                                    <div className="transaction-icon-box">
                                        {exp.category.charAt(0)}
                                    </div>
                                    <div className="transaction-details">
                                        <span className="transaction-title-text">{exp.title || 'Untitled Expense'}</span>
                                        <span className="transaction-category-tag">{exp.category}</span>
                                    </div>
                                </div>
                                <div className="transaction-meta">
                                    <span className="transaction-date-text">
                                        {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="transaction-amount-text">
                                        -${exp.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">No recent transactions to list</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
