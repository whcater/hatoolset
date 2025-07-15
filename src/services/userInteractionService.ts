import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/constants';

export interface UserInteraction {
  user_id: string;
  tool_id: number;
  type: 'favorite' | 'view' | 'click' | 'share';
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  tool_id: number;
  tool: any; // Tool object
  created_at: string;
}

export interface UserComment {
  id: string;
  user_id: string;
  tool_id: number;
  content: string;
  rating?: number;
  parent_id?: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  replies?: UserComment[];
}

class UserInteractionService {
  // Favorites
  async addToFavorites(toolId: number): Promise<void> {
    return apiClient.post(`${API_ENDPOINTS.tools.list}/${toolId}/favorite`);
  }

  async removeFromFavorites(toolId: number): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.tools.list}/${toolId}/favorite`);
  }

  async getUserFavorites(page: number = 1, limit: number = 20): Promise<{
    favorites: UserFavorite[];
    total: number;
    page: number;
    pages: number;
  }> {
    return apiClient.get(`${API_ENDPOINTS.users.profile}/favorites?page=${page}&limit=${limit}`);
  }

  async isFavorite(toolId: number): Promise<boolean> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.tools.list}/${toolId}/favorite/status`);
      return response.is_favorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Comments and Reviews
  async addComment(toolId: number, content: string, rating?: number, parentId?: string): Promise<UserComment> {
    return apiClient.post(`${API_ENDPOINTS.tools.list}/${toolId}/comments`, {
      content,
      rating,
      parent_id: parentId
    });
  }

  async getComments(toolId: number, page: number = 1, limit: number = 10, sort: string = 'newest'): Promise<{
    comments: UserComment[];
    total: number;
    page: number;
    pages: number;
  }> {
    return apiClient.get(`${API_ENDPOINTS.tools.list}/${toolId}/comments?page=${page}&limit=${limit}&sort=${sort}`);
  }

  async updateComment(commentId: string, content: string, rating?: number): Promise<UserComment> {
    return apiClient.put(`/api/comments/${commentId}`, { content, rating });
  }

  async deleteComment(commentId: string): Promise<void> {
    return apiClient.delete(`/api/comments/${commentId}`);
  }

  async likeComment(commentId: string): Promise<void> {
    return apiClient.post(`/api/comments/${commentId}/like`);
  }

  async unlikeComment(commentId: string): Promise<void> {
    return apiClient.delete(`/api/comments/${commentId}/like`);
  }

  async dislikeComment(commentId: string): Promise<void> {
    return apiClient.post(`/api/comments/${commentId}/dislike`);
  }

  async undislikeComment(commentId: string): Promise<void> {
    return apiClient.delete(`/api/comments/${commentId}/dislike`);
  }

  // User Activity
  async getUserActivity(page: number = 1, limit: number = 20): Promise<{
    activities: UserInteraction[];
    total: number;
    page: number;
    pages: number;
  }> {
    return apiClient.get(`${API_ENDPOINTS.users.profile}/activity?page=${page}&limit=${limit}`);
  }

  async getRecentlyViewed(limit: number = 10): Promise<any[]> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.users.profile}/recently-viewed?limit=${limit}`);
      return response.tools || [];
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      // Fallback to localStorage
      const recentlyViewed = JSON.parse(localStorage.getItem('toolset_recently_viewed') || '[]');
      return recentlyViewed.slice(0, limit);
    }
  }

  async addToRecentlyViewed(toolId: number): Promise<void> {
    try {
      await apiClient.post(`${API_ENDPOINTS.users.profile}/recently-viewed`, { tool_id: toolId });
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
      // Fallback to localStorage
      const recentlyViewed = JSON.parse(localStorage.getItem('toolset_recently_viewed') || '[]');
      const updatedViewed = [toolId, ...recentlyViewed.filter((id: number) => id !== toolId)].slice(0, 20);
      localStorage.setItem('toolset_recently_viewed', JSON.stringify(updatedViewed));
    }
  }

  // User Profile
  async updateProfile(data: {
    username?: string;
    bio?: string;
    website?: string;
    company?: string;
    position?: string;
  }): Promise<any> {
    return apiClient.put(API_ENDPOINTS.users.updateProfile, data);
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post(`${API_ENDPOINTS.users.profile}/avatar`, formData);
  }

  // Search History
  async getSearchHistory(limit: number = 10): Promise<string[]> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.users.profile}/search-history?limit=${limit}`);
      return response.queries || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      // Fallback to localStorage
      const searchHistory = JSON.parse(localStorage.getItem('toolset_search_history') || '[]');
      return searchHistory.slice(0, limit);
    }
  }

  async addToSearchHistory(query: string): Promise<void> {
    try {
      await apiClient.post(`${API_ENDPOINTS.users.profile}/search-history`, { query });
    } catch (error) {
      console.error('Error adding to search history:', error);
      // Fallback to localStorage
      const searchHistory = JSON.parse(localStorage.getItem('toolset_search_history') || '[]');
      const updatedHistory = [query, ...searchHistory.filter((q: string) => q !== query)].slice(0, 50);
      localStorage.setItem('toolset_search_history', JSON.stringify(updatedHistory));
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.users.profile}/search-history`);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
    localStorage.removeItem('toolset_search_history');
  }

  // Tool Recommendations
  async getRecommendations(limit: number = 10): Promise<any[]> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.users.profile}/recommendations?limit=${limit}`);
      return response.tools || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  // User Statistics
  async getUserStats(): Promise<{
    total_favorites: number;
    total_comments: number;
    total_submissions: number;
    total_views: number;
    join_date: string;
  }> {
    try {
      return await apiClient.get(`${API_ENDPOINTS.users.profile}/stats`);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        total_favorites: 0,
        total_comments: 0,
        total_submissions: 0,
        total_views: 0,
        join_date: new Date().toISOString()
      };
    }
  }

  // Local Storage Helpers (for offline functionality)
  getFavoritesFromStorage(): number[] {
    return JSON.parse(localStorage.getItem('toolset_favorites') || '[]');
  }

  addFavoriteToStorage(toolId: number): void {
    const favorites = this.getFavoritesFromStorage();
    if (!favorites.includes(toolId)) {
      favorites.push(toolId);
      localStorage.setItem('toolset_favorites', JSON.stringify(favorites));
    }
  }

  removeFavoriteFromStorage(toolId: number): void {
    const favorites = this.getFavoritesFromStorage();
    const updatedFavorites = favorites.filter(id => id !== toolId);
    localStorage.setItem('toolset_favorites', JSON.stringify(updatedFavorites));
  }

  isFavoriteInStorage(toolId: number): boolean {
    const favorites = this.getFavoritesFromStorage();
    return favorites.includes(toolId);
  }

  // Sync with server (for when user comes back online)
  async syncFavorites(): Promise<void> {
    try {
      const localFavorites = this.getFavoritesFromStorage();
      const serverFavorites = await this.getUserFavorites(1, 1000);
      const serverFavoriteIds = serverFavorites.favorites.map(f => f.tool_id);

      // Add local favorites to server
      for (const toolId of localFavorites) {
        if (!serverFavoriteIds.includes(toolId)) {
          try {
            await this.addToFavorites(toolId);
          } catch (error) {
            console.error(`Error syncing favorite ${toolId}:`, error);
          }
        }
      }

      // Update local storage with server data
      localStorage.setItem('toolset_favorites', JSON.stringify(serverFavoriteIds));
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  }
}

export const userInteractionService = new UserInteractionService();
export default userInteractionService;