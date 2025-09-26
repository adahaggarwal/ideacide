import { supabase } from './supabase';

export const collaborationService = {
  // Create a new collaboration request
  async createRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating collaboration request:', error);
      throw error;
    }
  },

  // Get all active collaboration requests with pagination
  async getRequests(filters = {}, page = 1, limit = 10) {
    try {
      let query = supabase
        .from('collaboration_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.collaboration_type) {
        query = query.eq('collaboration_type', filters.collaboration_type);
      }
      if (filters.industry) {
        query = query.ilike('industry', `%${filters.industry}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.remote_friendly !== undefined) {
        query = query.eq('remote_friendly', filters.remote_friendly);
      }
      if (filters.urgency) {
        query = query.eq('urgency', filters.urgency);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
      throw error;
    }
  },

  // Get a single collaboration request by ID
  async getRequestById(id) {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await this.incrementViews(id);

      return data;
    } catch (error) {
      console.error('Error fetching collaboration request:', error);
      throw error;
    }
  },

  // Get user's own collaboration requests
  async getUserRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  },

  // Update a collaboration request
  async updateRequest(id, updates) {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating collaboration request:', error);
      throw error;
    }
  },

  // Delete a collaboration request
  async deleteRequest(id) {
    try {
      const { error } = await supabase
        .from('collaboration_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting collaboration request:', error);
      throw error;
    }
  },

  // Increment view count
  async incrementViews(requestId) {
    try {
      const { error } = await supabase.rpc('increment_collaboration_views', {
        request_id: requestId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw error for view counting
    }
  },

  // Apply to a collaboration request
  async applyToRequest(applicationData) {
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;

      // Increment applications count
      await supabase.rpc('increment_applications_count', {
        request_id: applicationData.request_id
      });

      return data;
    } catch (error) {
      console.error('Error applying to collaboration request:', error);
      throw error;
    }
  },

  // Get applications for a request (for request owner)
  async getRequestApplications(requestId) {
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching request applications:', error);
      throw error;
    }
  },

  // Get user's applications
  async getUserApplications(userId) {
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select('*')
        .eq('applicant_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId, status) {
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get collaboration statistics
  async getStats() {
    try {
      const { data: totalRequests, error: error1 } = await supabase
        .from('collaboration_requests')
        .select('id', { count: 'exact' })
        .eq('status', 'active');

      const { data: totalApplications, error: error2 } = await supabase
        .from('collaboration_applications')
        .select('id', { count: 'exact' });

      if (error1 || error2) throw error1 || error2;

      return {
        totalRequests: totalRequests?.length || 0,
        totalApplications: totalApplications?.length || 0
      };
    } catch (error) {
      console.error('Error fetching collaboration stats:', error);
      throw error;
    }
  }
};