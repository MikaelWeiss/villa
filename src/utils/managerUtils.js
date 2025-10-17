// Utility functions for managing manager roles
import { supabase } from '../authentication';

/**
 * IMPORTANT: These functions are intended for administrative use only.
 *
 * The managers table has Row Level Security (RLS) policies that prevent
 * regular users from modifying manager records. These functions will fail
 * unless called with proper administrative credentials.
 *
 * For production use, manage roles via:
 * 1. Supabase Dashboard > Table Editor > managers table
 * 2. Supabase SQL Editor with appropriate admin credentials
 * 3. Backend service with service role key (never exposed to client)
 *
 * These client-side functions are provided for convenience during development
 * but should NOT be relied upon in production environments.
 */

/**
 * Add a manager to the managers collection
 * NOTE: This requires admin privileges due to RLS policies.
 * @param {string} email - The manager's email address
 * @param {object} additionalData - Additional data to store with the manager
 * @returns {Promise<boolean>} - Success status
 */
export const addManager = async (email, additionalData = {}) => {
  try {
    const managerData = {
      email,
      ...additionalData,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('managers')
      .insert(managerData);

    if (error) throw error;

    console.log(`Manager ${email} added successfully`);
    return true;
  } catch (error) {
    console.error('Error adding manager:', error);
    return false;
  }
};

/**
 * Remove a manager from the managers collection
 * NOTE: This requires admin privileges due to RLS policies.
 * @param {string} email - The manager's email address
 * @returns {Promise<boolean>} - Success status
 */
export const removeManager = async (email) => {
  try {
    const { error } = await supabase
      .from('managers')
      .delete()
      .eq('email', email);

    if (error) throw error;

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
    const { data, error } = await supabase.rpc('is_manager', {
      user_email: email
    });

    if (error) throw error;
    return data || false;
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
    const { data, error } = await supabase
      .from('managers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting manager info:', error);
    return null;
  }
};
