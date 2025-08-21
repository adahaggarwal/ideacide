import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const profileService = {
  // Get user profile
  async getProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
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
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!profileData) {
        throw new Error('Profile data is required');
      }

      // Validate required fields
      const requiredFields = ['full_name', 'user_type', 'has_active_startup', 'platform_purpose'];
      for (const field of requiredFields) {
        if (!profileData[field] || 
            (field === 'platform_purpose' && profileData[field].length === 0) ||
            (field === 'has_active_startup' && profileData[field] === null)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

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
        console.error('Supabase upsert error:', error);
        throw new Error(`Database error: ${error.message}`);
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