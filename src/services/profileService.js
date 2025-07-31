import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const profileService = {
  // Get user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Create or update user profile
  async createOrUpdateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }
  },

  // Check if profile is completed
  async isProfileCompleted(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_completed')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.profile_completed || false;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  },

  // Delete user profile (if needed)
  async deleteProfile(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
};