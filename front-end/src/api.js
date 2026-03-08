import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginUser    = (data) => API.post("/auth/login",    data);
export const registerUser = (data) => API.post("/auth/register", data);

// Transactions
export const getTransactions   = (params) => API.get("/transactions",      { params });
export const createTransaction = (data)   => API.post("/transactions",     data);
export const deleteTransaction = (id)     => API.delete(`/transactions/${id}`);
export const getSummary        = (params) => API.get("/transactions/summary", { params });

// Budgets
export const getBudgets   = (params)   => API.get("/budgets",        { params });
export const createBudget = (data)     => API.post("/budgets",       data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`,  data);

// Goals
export const getGoals    = ()          => API.get("/goals");
export const createGoal  = (data)      => API.post("/goals",              data);
export const updateGoal  = (id, data)  => API.put(`/goals/${id}`,         data);
export const depositGoal = (id, data)  => API.patch(`/goals/${id}/deposit`, data);
export const deleteGoal  = (id)        => API.delete(`/goals/${id}`);

// Accounts
export const getAccounts = () => API.get("/accounts");

// Analytics
export const getOverview     = () => API.get("/analytics/overview");
export const getCategories   = () => API.get("/analytics/categories");
export const getTopMerchants = () => API.get("/analytics/top-merchants");
export const getWeekly       = () => API.get("/analytics/weekly");

export default API;