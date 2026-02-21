import { auth } from './localStorage-auth';

const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
    const token = auth.getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
        const json = await response.json();

        if (!response.ok || !json.success) {
            return { data: null, error: json.error || `Request failed with status ${response.status}` };
        }

        return { data: json.data, error: null };
    } catch (err: any) {
        return { data: null, error: err.message || 'Network error' };
    }
}

export const api = {
    // Income
    getIncomes: (month?: number, year?: number) => {
        let query = '';
        if (month && year) query = `?month=${month}&year=${year}`;
        return request<{ incomes: any[] }>('/get-income' + query);
    },
    addIncome: (data: { amount: number; month: number; year: number; source: string }) =>
        request('/add-income', { method: 'POST', body: JSON.stringify(data) }),

    // Expenses
    getExpenses: (params?: { category?: string; from?: string; to?: string }) => {
        const q = new URLSearchParams(params as any).toString();
        return request<{ expenses: any[]; total: number }>('/get-expenses' + (q ? `?${q}` : ''));
    },
    addExpense: (data: { title: string; amount: number; category: string; date: string; note?: string }) =>
        request('/add-expense', { method: 'POST', body: JSON.stringify(data) }),
    deleteExpense: (id: string) =>
        request(`/delete-expense?id=${id}`, { method: 'DELETE' }),

    // Budgets
    getBudgets: (month?: number, year?: number) => {
        let query = '';
        if (month && year) query = `?month=${month}&year=${year}`;
        return request<{ budgets: any[] }>('/get-budgets' + query);
    },
    addBudget: (data: { category: string; allocatedAmount: number; month: number; year: number }) =>
        request('/add-budget', { method: 'POST', body: JSON.stringify(data) }),
    deleteBudget: (id: string) =>
        request(`/delete-budget?id=${id}`, { method: 'DELETE' }),

    // Reminders
    getReminders: (status?: string) => {
        let query = '';
        if (status) query = `?status=${status}`;
        return request<{ reminders: any[] }>('/get-reminders' + query);
    },
    addReminder: (data: { title: string; dueDate: string; amount?: number }) =>
        request('/add-reminder', { method: 'POST', body: JSON.stringify(data) }),
    deleteReminder: (id: string) =>
        request(`/delete-reminder?id=${id}`, { method: 'DELETE' }),
    toggleReminder: (id: string) =>
        request('/update-reminder', { method: 'POST', body: JSON.stringify({ id, toggleStatus: true }) }),
};
