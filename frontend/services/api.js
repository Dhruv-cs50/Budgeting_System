/**
 * API Service Module
 * 
 * This module provides a centralized interface for making API calls to the backend server.
 * It uses axios for HTTP requests and handles error cases consistently.
 * 
 */

import axios from 'axios';

const API_BASE_URL = 'http://192.168.55.153:5001';

const api = {
  /**
   * Get user data by ID
   * @param {number} userId - The ID of the user to fetch
   * @returns {Promise<Object>} User data object
   * @throws {Error} If the request fails
   */
  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Get user data by email address
   * @param {string} email - The email address of the user to fetch
   * @returns {Promise<Object>} User data object
   * @throws {Error} If the request fails
   */
  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  /**
   * Get all users in the system
   * @returns {Promise<Array>} Array of user objects
   * @throws {Error} If the request fails
   */
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  /**
   * Get all transactions for a user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} Array of transaction objects
   * @throws {Error} If the request fails
   */
  getTransactions: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Get all financial goals for a user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} Array of goal objects
   * @throws {Error} If the request fails
   */
  getFinancialGoals: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/goals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial goals:', error);
      throw error;
    }
  },

  /**
   * Get all deposits for a user
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} Array of deposit objects
   * @throws {Error} If the request fails
   */
  getDeposits: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/deposits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  },

  /**
   * Delete a transaction
   * @param {number} purchaseId - The ID of the purchase to delete
   * @param {number} userId - The ID of the user
   * @returns {Promise<Object>} Success message
   * @throws {Error} If the request fails
   */
  deleteTransaction: async (purchaseId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/data/purchase/${userId}`, {
        data: { purchaseId },
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  /**
   * Update the amount of a financial goal
   * @param {number} userId - The ID of the user
   * @param {number} goalId - The ID of the goal to update
   * @param {number} amountToAdd - The amount to add to the goal
   * @returns {Promise<Object>} Updated goal data
   * @throws {Error} If the request fails
   */
  updateGoalAmount: async (userId, goalId, amountToAdd) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${userId}/goals/${goalId}`, {
        amountToAdd,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating goal amount:', error);
      throw error;
    }
  }
};

export default api;
export { API_BASE_URL }; 