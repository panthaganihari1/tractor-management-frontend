import api from "./api";

export const getSummary = () => api.get("/finance/summary");

export const getExpenses = () => api.get("/finance/expenses");

export const addExpense = (expense) =>
  api.post("/finance/expenses", expense);

export const deleteExpense = (id) =>
  api.delete(`/finance/expenses/${id}`);

export const getIncomeRecords = () =>
  api.get("/finance/income");