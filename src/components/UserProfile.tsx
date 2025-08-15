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
  Clock,
  Bookmark,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Camera,
  Mail,
  Shield,
  Bell,
  Trash2
} from 'lucide-react';
import { userInteractionService, UserFavorite, UserComment } from '../services/userInteractionService';
import { useAuth } from '../contexts/AuthContext';
import ToolCard from './ToolCard';
import LoadingSpinner from './ui/LoadingSpinner';

interface UserStats {
  total_favorites: number;
  total_comments: number;
  total_submissions: number;
  total_views: number;
  join_date: string;
}

interface NotificationSettings {
  email_new_tools: boolean;
  email_comments: boolean;
  email_newsletter: boolean;
  push_enabled: boolean;
}

interface PrivacySettings {
  profile_public: boolean;
  show_email: boolean;
  show_activity: boolean;
}

export function UserProfile() {
  const { t } = useTranslation();
  const { user: authUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'comments' | 'activity' | 'settings'>('favorites');
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_new_tools: true,
    email_comments: false,
    email_newsletter: false,
    push_enabled: false
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profile_public: true,
    show_email: false,
    show_activity: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    // 处理哈希路由，设置默认活动标签
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['favorites', 'comments', 'activity', 'settings'].includes(hash)) {
        setActiveTab(hash as 'favorites' | 'comments' | 'activity' | 'settings');
      }
    };

    // 初始化时检查哈希
    handleHashChange();

    // 监听哈希变化
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 单独的 useEffect 来处理用户数据加载，依赖于 authUser
  useEffect(() => {
    if (authUser) {
      loadUserData();
    }
  }, [authUser]);

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
    if (!authUser) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Loading user profile data...');

      // 并行加载用户数据
      const [profileData, stats, recommendationsData, recentlyViewedData] = await Promise.all([
        userInteractionService.getUserProfile().catch((error) => {
          console.error('Failed to load profile data:', error);
          return null;
        }),
        userInteractionService.getUserStats().catch(() => ({
          total_favorites: 0,
          total_comments: 0,
          total_submissions: 0,
          total_views: 0,
          join_date: new Date().toISOString()
        })),
        userInteractionService.getRecommendations(6).catch(() => []),
        userInteractionService.getRecentlyViewed(6).catch(() => [])
      ]);

      // 使用从API获取的用户数据，如果失败则使用authUser数据
      if (profileData) {
        setEditData({
          username: profileData.username,
          full_name: profileData.name,
          email: profileData.email,
          bio: profileData.bio || '',
          website: profileData.website || '',
          company: profileData.company || '',
          position: profileData.position || ''
        });
      } else {
        // 回退到使用authUser数据
        setEditData({
          username: authUser.username,
          full_name: authUser.full_name,
          email: authUser.email,
          bio: '',
          website: '',
          company: '',
          position: ''
        });
      }

      setUserStats(stats);
      setRecommendations(recommendationsData);
      setRecentlyViewed(recentlyViewedData);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(t('profile.error.loadFailed', 'Failed to load profile data'));
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await userInteractionService.getUserFavorites(1, 20);
      console.log('loadFavorites', response);
      setFavorites(response.favorites || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to localStorage - Mock favorites data
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 实现获取用户评论的 API
      // const userComments = await userInteractionService.getUserComments(1, 20);
      // setComments(userComments.comments);

      // 临时使用空数组
      setComments([]);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError(t('profile.error.commentsFailed', 'Failed to load comments'));
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      await userInteractionService.getUserActivity(1, 20);
      // Handle activity data
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      setSuccess(null);

      await userInteractionService.updateProfile(editData);
      setEditMode(false);
      setSuccess(t('profile.success.updated', 'Profile updated successfully'));

      // 自动隐藏成功消息
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(t('profile.error.updateFailed', 'Failed to update profile'));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型和大小
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(t('profile.error.invalidFileType', 'Please select a valid image file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError(t('profile.error.fileTooLarge', 'File size must be less than 5MB'));
      return;
    }

    try {
      setUploadingAvatar(true);
      setError(null);

      const response = await userInteractionService.uploadAvatar(file);
      setSuccess(t('profile.success.avatarUploaded', 'Avatar updated successfully'));

      // 自动隐藏成功消息
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(t('profile.error.avatarFailed', 'Failed to upload avatar'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeFavorite = async (toolId: number) => {
    try {
      setError(null);
      await userInteractionService.removeFromFavorites(toolId);
      setFavorites(prev => prev.filter(fav => fav.tool.id !== toolId));
      setSuccess(t('profile.success.favoriteRemoved', 'Removed from favorites'));
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError(t('profile.error.removeFavoriteFailed', 'Failed to remove from favorites'));
    }
  };

  const handleNotificationSettingsChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      const newSettings = { ...notificationSettings, [key]: value };
      setNotificationSettings(newSettings);

      // TODO: 调用 API 保存通知设置
      // await userInteractionService.updateNotificationSettings(newSettings);

      setSuccess(t('profile.success.settingsUpdated', 'Settings updated'));
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError(t('profile.error.settingsFailed', 'Failed to update settings'));
    }
  };

  const handlePrivacySettingsChange = async (key: keyof PrivacySettings, value: boolean) => {
    try {
      const newSettings = { ...privacySettings, [key]: value };
      setPrivacySettings(newSettings);

      // TODO: 调用 API 保存隐私设置
      // await userInteractionService.updatePrivacySettings(newSettings);

      setSuccess(t('profile.success.settingsUpdated', 'Settings updated'));
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setError(t('profile.error.settingsFailed', 'Failed to update settings'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t('profile.confirm.deleteAccount', 'Are you sure you want to delete your account? This action cannot be undone.'))) {
      return;
    }

    try {
      setError(null);
      // TODO: 实现删除账户 API
      // await userInteractionService.deleteAccount();
      alert(t('profile.info.deleteAccountNotImplemented', 'Account deletion is not yet implemented'));
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(t('profile.error.deleteAccountFailed', 'Failed to delete account'));
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const tabs = [
    { id: 'favorites', label: t('profile.tabs.favorites', 'Favorites'), icon: Heart },
    { id: 'comments', label: t('profile.tabs.comments', 'Comments'), icon: MessageSquare },
    { id: 'activity', label: t('profile.tabs.activity', 'Activity'), icon: Clock },
    { id: 'settings', label: t('profile.tabs.settings', 'Settings'), icon: Settings }
  ];

  // 检查认证状态
  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('profile.notLoggedIn', 'Please log in to view your profile')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('profile.loginRequired', 'You need to be logged in to access this page')}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 消息提示 */}
      {(error || success) && (
        <div className="mb-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
              <button onClick={clearMessages} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-800 dark:text-green-200">{success}</span>
              </div>
              <button onClick={clearMessages} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                {authUser.avatar_url ? (
                  <img
                    src={authUser.avatar_url}
                    alt={authUser.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-white text-3xl font-bold">
                      {(authUser.full_name || authUser.username || authUser.email)[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  {uploadingAvatar ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              )}
            </div>

            <div className="mt-4 text-center lg:text-left">
              {editMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.full_name || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder={t('profile.form.fullName', 'Full Name')}
                    className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-center lg:text-left"
                  />
                  <input
                    type="text"
                    value={editData.username || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder={t('profile.form.username', 'Username')}
                    className="text-lg bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-center lg:text-left"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {authUser.full_name || authUser.username}
                  </h1>
                  {authUser.full_name && authUser.username && (
                    <p className="text-lg text-gray-600 dark:text-gray-400">@{authUser.username}</p>
                  )}
                </div>
              )}
              <div className="flex items-center justify-center lg:justify-start mt-2 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>{authUser.email}</span>
              </div>
              {authUser.role && authUser.role !== 'user' && (
                <div className="flex items-center justify-center lg:justify-start mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    {authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('profile.sections.information', 'Profile Information')}
              </h2>
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {t('common.save', 'Save')}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData({
                        username: authUser.username,
                        full_name: authUser.full_name,
                        email: authUser.email,
                        bio: '',
                        website: '',
                        company: '',
                        position: ''
                      });
                      clearMessages();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {t('common.cancel', 'Cancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {t('profile.actions.edit', 'Edit Profile')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('profile.form.bio', 'Bio')}
                </label>
                {editMode ? (
                  <textarea
                    value={editData.bio || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder={t('profile.form.bioPlaceholder', 'Tell us about yourself...')}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white min-h-[3rem] flex items-center">
                    {editData.bio || t('profile.form.noBio', 'No bio provided')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  {t('profile.form.website', 'Website')}
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {editData.website ? (
                      <a href={editData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                        {editData.website}
                        <Globe className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      t('profile.form.noWebsite', 'No website provided')
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  {t('profile.form.company', 'Company')}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.company || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder={t('profile.form.companyPlaceholder', 'Your company')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {editData.company || t('profile.form.noCompany', 'No company provided')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  {t('profile.form.position', 'Position')}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.position || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder={t('profile.form.positionPlaceholder', 'Your job title')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {editData.position || t('profile.form.noPosition', 'No position provided')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('profile.form.joined', 'Member Since')}
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()} {/* TODO: 使用真实的注册时间 */}
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
                onClick={() => {
                  setActiveTab(tab.id as any);
                  window.history.pushState(null, '', `#${tab.id}`);
                }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
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
          {activeTab === 'favorites' && favorites && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('profile.favorites.title', 'My Favorites')} ({favorites.length})
                </h3>
                {favorites.length > 0 && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    {t('profile.favorites.viewAll', 'View All')}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="relative group">
                      <ToolCard tool={favorite.tool} variant="compact" />
                      <button
                        onClick={() => removeFavorite(favorite.tool.id)}
                        className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 text-red-500 rounded-lg shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        title={t('profile.favorites.remove', 'Remove from favorites')}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('profile.favorites.empty.title', 'No favorites yet')}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {t('profile.favorites.empty.description', 'Start exploring tools and add them to your favorites to see them here.')}
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('profile.favorites.empty.explore', 'Explore Tools')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('profile.comments.title', 'My Comments')} ({comments.length})
                </h3>
                {comments.length > 0 && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    {t('profile.comments.viewAll', 'View All')}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {comment.rating && (
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= comment.rating!
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
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {comment.likes}
                          </span>
                          <span>{comment.dislikes} dislikes</span>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          {t('profile.comments.viewTool', 'View Tool')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('profile.comments.empty.title', 'No comments yet')}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {t('profile.comments.empty.description', 'Share your thoughts on tools to help the community and see your comments here.')}
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('profile.comments.empty.explore', 'Explore Tools')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.activity.title', 'Activity & Recommendations')}
              </h3>

              {/* Recently Viewed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    {t('profile.activity.recentlyViewed', 'Recently Viewed')}
                  </h4>
                  {recentlyViewed.length > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      {t('profile.activity.clearHistory', 'Clear History')}
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : recentlyViewed.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentlyViewed.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {t('profile.activity.noRecentlyViewed', 'No recently viewed tools')}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <div className="flex items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-gray-500" />
                    {t('profile.activity.recommendations', 'Recommended for You')}
                  </h4>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Star className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {t('profile.activity.noRecommendations', 'No recommendations available yet')}
                    </p>
                  </div>
                )}
              </div>

              {/* Activity Stats */}
              {userStats && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-gray-500" />
                    {t('profile.activity.stats', 'Activity Statistics')}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {userStats.total_views}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.stats.totalViews', 'Total Views')}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {userStats.total_favorites}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.stats.totalFavorites', 'Favorites')}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {userStats.total_comments}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.stats.totalComments', 'Comments')}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {userStats.total_submissions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.stats.totalSubmissions', 'Submissions')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.settings.title', 'Account Settings')}
              </h3>

              {/* Privacy Settings */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('profile.settings.privacy.title', 'Privacy Settings')}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {t('profile.settings.privacy.description', 'Control how your profile and activity are visible to others.')}
                </p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.privacy.publicProfile', 'Make my profile public')}
                    </span>
                    <input
                      type="checkbox"
                      checked={privacySettings.profile_public}
                      onChange={(e) => handlePrivacySettingsChange('profile_public', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.privacy.showEmail', 'Show email address')}
                    </span>
                    <input
                      type="checkbox"
                      checked={privacySettings.show_email}
                      onChange={(e) => handlePrivacySettingsChange('show_email', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.privacy.showActivity', 'Show activity history')}
                    </span>
                    <input
                      type="checkbox"
                      checked={privacySettings.show_activity}
                      onChange={(e) => handlePrivacySettingsChange('show_activity', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('profile.settings.notifications.title', 'Notification Settings')}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {t('profile.settings.notifications.description', 'Choose what notifications you\'d like to receive.')}
                </p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.notifications.newTools', 'Email notifications for new tools')}
                    </span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email_new_tools}
                      onChange={(e) => handleNotificationSettingsChange('email_new_tools', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.notifications.comments', 'Email notifications for comments')}
                    </span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email_comments}
                      onChange={(e) => handleNotificationSettingsChange('email_comments', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.notifications.newsletter', 'Newsletter and updates')}
                    </span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email_newsletter}
                      onChange={(e) => handleNotificationSettingsChange('email_newsletter', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('profile.settings.notifications.push', 'Push notifications')}
                    </span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.push_enabled}
                      onChange={(e) => handleNotificationSettingsChange('push_enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Account Management */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('profile.settings.account.title', 'Account Management')}
                  </h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.settings.account.dataExport', 'Export Your Data')}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {t('profile.settings.account.dataExportDescription', 'Download a copy of your data including favorites, comments, and activity.')}
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      {t('profile.settings.account.exportData', 'Export Data')}
                    </button>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.settings.account.changePassword', 'Change Password')}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {t('profile.settings.account.changePasswordDescription', 'Update your account password for better security.')}
                    </p>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      {t('profile.settings.account.changePasswordButton', 'Change Password')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <h4 className="font-medium text-red-900 dark:text-red-200">
                    {t('profile.settings.danger.title', 'Danger Zone')}
                  </h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  {t('profile.settings.danger.description', 'These actions cannot be undone. Please be careful.')}
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  {t('profile.settings.danger.deleteAccount', 'Delete Account')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}