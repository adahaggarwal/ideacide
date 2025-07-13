import { supabase } from './supabase';
import { auth } from './firebase';

const STORIES_TABLE = 'stories';

export const storiesService = {
  // Create a new story (without images for now)
  async createStory(storyData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to create a story');
      }

      console.log('Creating story with data:', storyData);

      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .insert([{
          ...storyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          views: 0,
          likes: 0,
          status: 'published'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Story created successfully:', data);
      return data.id;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  // Convert images to base64 (temporary solution)
  async processImages(images) {
    if (!images || images.length === 0) {
      return [];
    }

    const imagePromises = images.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      return base64Images;
    } catch (error) {
      console.error('Error processing images:', error);
      throw error;
    }
  },

  // Get all stories with pagination
  async getStories(limitCount = 10, offset = 0) {
    try {
      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limitCount - 1);

      if (error) throw error;

      return data.map(story => ({
        ...story,
        createdAt: new Date(story.created_at),
        updatedAt: new Date(story.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  },

  // Get stories by a specific user
  async getUserStories(userId) {
    try {
      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(story => ({
        ...story,
        createdAt: new Date(story.created_at),
        updatedAt: new Date(story.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching user stories:', error);
      throw error;
    }
  },

  // Get a single story by ID
  async getStoryById(storyId) {
    try {
      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .select('*')
        .eq('id', storyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Story not found');
        }
        throw error;
      }

      return {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },

  // Update a story
  async updateStory(storyId, updateData) {
    try {
      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', storyId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  },

  // Delete a story
  async deleteStory(storyId) {
    try {
      const { error } = await supabase
        .from(STORIES_TABLE)
        .delete()
        .eq('id', storyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },

  // Increment story views
  async incrementViews(storyId) {
    try {
      const story = await this.getStoryById(storyId);
      await supabase
        .from(STORIES_TABLE)
        .update({ views: story.views + 1 })
        .eq('id', storyId);
      return true;
    } catch (error) {
      console.error('Error incrementing views:', error);
      return false;
    }
  },

  // Like/Unlike a story
  async toggleLike(storyId, increment = true) {
    try {
      const story = await this.getStoryById(storyId);
      const newLikes = increment ? story.likes + 1 : Math.max(0, story.likes - 1);
      
      const { error } = await supabase
        .from(STORIES_TABLE)
        .update({ likes: newLikes })
        .eq('id', storyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Search stories
  async searchStories(searchTerm, limitCount = 10) {
    try {
      const { data, error } = await supabase
        .from(STORIES_TABLE)
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (error) throw error;

      return data.map(story => ({
        ...story,
        createdAt: new Date(story.created_at),
        updatedAt: new Date(data.updated_at)
      }));
    } catch (error) {
      console.error('Error searching stories:', error);
      throw error;
    }
  }
};

export default storiesService;