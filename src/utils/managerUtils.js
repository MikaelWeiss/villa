// Utility functions for managing manager roles
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../authentication/firebase';

/**
 * Add a manager to the managers collection
 * @param {string} email - The manager's email address
 * @param {object} additionalData - Additional data to store with the manager
 * @returns {Promise<boolean>} - Success status
 */
export const addManager = async (email, additionalData = {}) => {
  try {
    const managerData = {
      email,
      ...additionalData,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'managers', email), managerData);
    console.log(`Manager ${email} added successfully`);
    return true;
  } catch (error) {
    console.error('Error adding manager:', error);
    return false;
  }
};

/**
 * Remove a manager from the managers collection
 * @param {string} email - The manager's email address
 * @returns {Promise<boolean>} - Success status
 */
export const removeManager = async (email) => {
  try {
    await deleteDoc(doc(db, 'managers', email));
    console.log(`Manager ${email} removed successfully`);
    return true;
  } catch (error) {
    console.error('Error removing manager:', error);
    return false;
  }
};

/**
 * Check if a user is a manager
 * @param {string} email - The user's email address
 * @returns {Promise<boolean>} - True if user is a manager
 */
export const isManager = async (email) => {
  try {
    const managerDoc = await getDoc(doc(db, 'managers', email));
    return managerDoc.exists();
  } catch (error) {
    console.error('Error checking manager status:', error);
    return false;
  }
};

/**
 * Get manager information
 * @param {string} email - The manager's email address
 * @returns {Promise<object|null>} - Manager data or null if not found
 */
export const getManagerInfo = async (email) => {
  try {
    const managerDoc = await getDoc(doc(db, 'managers', email));
    if (managerDoc.exists()) {
      return { id: managerDoc.id, ...managerDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting manager info:', error);
    return null;
  }
};
