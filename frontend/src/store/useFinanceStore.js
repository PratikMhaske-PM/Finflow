import { create } from 'zustand';
import api from '../services/api';

const useFinanceStore = create((set, get) => ({
    incomes: [],
    expenses: [],
    isLoading: false,
    error: null,

    // Incomes
    fetchIncomes: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/incomes');
            set({ incomes: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addIncome: async (incomeData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/incomes', incomeData);
            set((state) => ({ incomes: [res.data.data, ...state.incomes], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    deleteIncome: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/incomes/${id}`);
            set((state) => ({ 
                incomes: state.incomes.filter(income => income.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Expenses
    fetchExpenses: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/expenses');
            set({ expenses: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addExpense: async (expenseData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/expenses', expenseData);
            set((state) => ({ expenses: [res.data.data, ...state.expenses], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    deleteExpense: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/expenses/${id}`);
            set((state) => ({ 
                expenses: state.expenses.filter(expense => expense.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Get Analytics
    getTotals: () => {
        const { incomes, expenses, bills, subscriptions, loans } = get();
        const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        
        const baseExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        const billsTotal = bills.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
        const subsTotal = subscriptions.reduce((acc, curr) => acc + Number(curr.cost || curr.amount || 0), 0);
        const loansTotal = loans.reduce((acc, curr) => acc + Number(curr.emi || 0), 0);
        
        const totalExpense = baseExpense + billsTotal + subsTotal + loansTotal;

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    },

    // Budgets
    budgets: [],
    fetchBudgets: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/budgets');
            set({ budgets: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    addBudget: async (budgetData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/budgets', budgetData);
            set((state) => ({ budgets: [res.data.data, ...state.budgets], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    deleteBudget: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/budgets/${id}`);
            set((state) => ({ 
                budgets: state.budgets.filter(b => b.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Wallets
    wallets: [],
    fetchWallets: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/wallets');
            set({ wallets: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    addWallet: async (walletData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/wallets', walletData);
            set((state) => ({ wallets: [res.data.data, ...state.wallets], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    deleteWallet: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/wallets/${id}`);
            set((state) => ({ 
                wallets: state.wallets.filter(w => w.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    // Goals
    goals: [],
    fetchGoals: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/goals');
            set({ goals: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    addGoal: async (goalData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/goals', goalData);
            set((state) => ({ goals: [res.data.data, ...state.goals], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    deleteGoal: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/goals/${id}`);
            set((state) => ({ 
                goals: state.goals.filter(g => g.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    // Investments
    investments: [],
    fetchInvestments: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/investments');
            set({ investments: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    addInvestment: async (invData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/investments', invData);
            set((state) => ({ investments: [res.data.data, ...state.investments], isLoading: false }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    deleteInvestment: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`/investments/${id}`);
            set((state) => ({ 
                investments: state.investments.filter(i => i.id !== id),
                isLoading: false 
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },
    // Analytics & Reports
    analytics: null,
    fetchAnalytics: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/reports/analytics');
            set({ analytics: res.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
    
    // AI Suggestions Chat
    getSuggestions: async (message, history) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/suggestions', { message, history });
            set({ isLoading: false });
            return { success: true, data: res.data.data };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Extended Modules (Bills, Subscriptions, Loans)
    bills: [],
    fetchBills: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/extended/bills');
            set({ bills: res.data.data, isLoading: false });
        } catch (error) { set({ error: error.message, isLoading: false }); }
    },
    addBill: async (data) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/extended/bills', data);
            set((state) => ({ bills: [res.data.data, ...state.bills], isLoading: false }));
            return { success: true };
        } catch (error) { return { success: false, error: error.message }; }
    },
    deleteBill: async (id) => {
        try {
            await api.delete(`/extended/bills/${id}`);
            set((state) => ({ bills: state.bills.filter(i => i.id !== id) }));
        } catch (error) { console.error(error); }
    },

    subscriptions: [],
    fetchSubscriptions: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/extended/subscriptions');
            set({ subscriptions: res.data.data, isLoading: false });
        } catch (error) { set({ error: error.message, isLoading: false }); }
    },
    addSubscription: async (data) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/extended/subscriptions', data);
            set((state) => ({ subscriptions: [res.data.data, ...state.subscriptions], isLoading: false }));
            return { success: true };
        } catch (error) { return { success: false, error: error.message }; }
    },
    deleteSubscription: async (id) => {
        try {
            await api.delete(`/extended/subscriptions/${id}`);
            set((state) => ({ subscriptions: state.subscriptions.filter(i => i.id !== id) }));
        } catch (error) { console.error(error); }
    },

    loans: [],
    fetchLoans: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/extended/loans');
            set({ loans: res.data.data, isLoading: false });
        } catch (error) { set({ error: error.message, isLoading: false }); }
    },
    addLoan: async (data) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/extended/loans', data);
            set((state) => ({ loans: [res.data.data, ...state.loans], isLoading: false }));
            return { success: true };
        } catch (error) { return { success: false, error: error.message }; }
    },
    deleteLoan: async (id) => {
        try {
            await api.delete(`/extended/loans/${id}`);
            set((state) => ({ loans: state.loans.filter(i => i.id !== id) }));
        } catch (error) { console.error(error); }
    }
}));

export default useFinanceStore;
