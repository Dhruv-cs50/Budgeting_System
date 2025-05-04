import axios from 'axios';

// Updated to match backend's actual IP and port
const API_BASE_URL = 'http://192.168.4.63:5001';

const api = {
  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  getTransactions: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  getFinancialGoals: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/goals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial goals:', error);
      throw error;
    }
  },

  getDeposits: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/deposits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  }
};

export default api; 