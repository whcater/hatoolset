'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Heart, 
  MessageSquare, 
  Eye, 
  Upload, 
  Settings, 
  Calendar,
  Globe,
  Building,
  Briefcase,
  Edit3,
  Star,
  TrendingUp,
  Clock,
  Bookmark
} from 'lucide-react';
import { userInteractionService, UserFavorite, UserComment } from '../services/userInteractionService';
import { ToolCard } from './ToolCard';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  company?: string;
  position?: string;
  joined_at: string;
}

interface UserStats {
  total_favorites: number;
  total_comments: number;
  total_submissions: number;
  total_views: number;
  join_date: string;
}

export function UserProfile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'favorites' | 'comments' | 'activity' | 'settings'>('favorites');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case 'favorites':
        loadFavorites();
        break;
      case 'comments':
        loadComments();
        break;
      case 'activity':
        loadActivity();
        break;
    }
  }, [activeTab]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Mock user data - replace with actual API call
      const mockUser: UserProfile = {
        id: '1',
        username: 'JohnDoe',
        email: 'john@example.com',
        avatar: '/api/placeholder/100/100',
        bio: 'Passionate about productivity tools and automation.',
        website: 'https://johndoe.dev',
        company: 'Tech Solutions Inc.',
        position: 'Product Manager',
        joined_at: '2023-06-15T00:00:00Z'
      };

      setUser(mockUser);
      setEditData(mockUser);

      // Load user stats
      const stats = await userInteractionService.getUserStats();
      setUserStats(stats);

      // Load recommendations and recently viewed
      const [recommendationsData, recentlyViewedData] = await Promise.all([
        userInteractionService.getRecommendations(6),
        userInteractionService.getRecentlyViewed(6)
      ]);

      setRecommendations(recommendationsData);
      setRecentlyViewed(recentlyViewedData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await userInteractionService.getUserFavorites(1, 20);
      setFavorites(response.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to localStorage
      const localFavorites = userInteractionService.getFavoritesFromStorage();
      // Mock favorites data
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      // Mock comments data - replace with actual API call
      const mockComments: UserComment[] = [
        {
          id: '1',
          user_id: '1',
          tool_id: 1,
          content: 'This tool is amazing! Really helped me with my workflow.',
          rating: 5,
          likes: 12,
          dislikes: 1,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          user: {
            id: '1',
            username: 'JohnDoe',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: '2',
          user_id: '1',
          tool_id: 2,
          content: 'Great design tool, but could use some performance improvements.',
          rating: 4,
          likes: 8,
          dislikes: 2,
          created_at: '2024-01-14T15:45:00Z',
          updated_at: '2024-01-14T15:45:00Z',
          user: {
            id: '1',
            username: 'JohnDoe',
            avatar: '/api/placeholder/40/40'
          }
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await userInteractionService.getUserActivity(1, 20);
      // Handle activity data
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await userInteractionService.updateProfile(editData);
      setUser(prev => ({ ...prev!, ...editData }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await userInteractionService.uploadAvatar(file);
        setUser(prev => ({ ...prev!, avatar: response.avatar_url }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  const removeFavorite = async (toolId: number) => {
    try {
      await userInteractionService.removeFromFavorites(toolId);
      setFavorites(prev => prev.filter(fav => fav.tool_id !== toolId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="mt-4 text-center lg:text-left">
              {editMode ? (
                <input
                  type="text"
                  value={editData.username || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h1>
              )}
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData(user);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Bio
                </label>
                {editMode ? (
                  <textarea
                    value={editData.bio || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.bio || 'No bio provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.website}
                      </a>
                    ) : (
                      'No website provided'
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  Company
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.company || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.company || 'No company provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Position
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.position || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.position || 'No position provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Joined
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.joined_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {userStats && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mx-auto mb-2">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.total_favorites}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.total_comments}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Comments</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                  <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.total_submissions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Submissions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats.total_views}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                My Favorites ({favorites.length})
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="relative">
                      <ToolCard tool={favorite.tool} variant="compact" />
                      <button
                        onClick={() => removeFavorite(favorite.tool_id)}
                        className="absolute top-2 right-2 p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No favorites yet. Start exploring tools to add them to your favorites!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                My Comments ({comments.length})
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {comment.rating && (
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= comment.rating! 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{comment.likes} likes</span>
                        <span>{comment.dislikes} dislikes</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No comments yet. Share your thoughts on tools to help the community!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-8">
              {/* Recently Viewed */}
              {recentlyViewed.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recently Viewed
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentlyViewed.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recommended for You
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Control how your profile and activity are visible to others.
                  </p>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Make my profile public</span>
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Choose what notifications you'd like to receive.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Email notifications for new tools</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Email notifications for comments</span>
                    </label>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 dark:text-red-200 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    These actions cannot be undone.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}