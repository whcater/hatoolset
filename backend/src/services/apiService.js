// 简单的API服务
export const apiService = () => {
  // Sample data for gallery avatars
  const sampleAvatars = [
    {
      id: 'avt_001',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Professional',
      createdAt: '2023-07-15T10:30:00Z',
      likes: 42,
      tags: ['professional', 'business', 'corporate']
    },
    {
      id: 'avt_002',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Executive',
      createdAt: '2023-07-10T14:45:00Z',
      likes: 38,
      tags: ['executive', 'business', 'formal']
    },
    {
      id: 'avt_003',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Creative',
      createdAt: '2023-07-05T09:20:00Z',
      likes: 56,
      tags: ['creative', 'professional', 'modern']
    },
    {
      id: 'avt_004',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Industry',
      createdAt: '2023-07-01T16:15:00Z',
      likes: 29,
      tags: ['industry', 'tech', 'specialist']
    },
    {
      id: 'avt_005',
      url: 'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Professional',
      createdAt: '2023-06-28T11:50:00Z',
      likes: 47,
      tags: ['professional', 'corporate', 'portrait']
    },
    {
      id: 'avt_006',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      style: 'Creative',
      createdAt: '2023-06-25T13:40:00Z',
      likes: 63,
      tags: ['creative', 'casual', 'friendly']
    }
  ];
  
  const getUserProfile = async (userId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      uid: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Marketing professional with 10+ years of experience in digital strategy.',
      company: 'Acme Corporation',
      position: 'Marketing Director',
      website: 'https://johndoe.com',
      photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: '2023-01-15T10:00:00Z',
      subscription: {
        plan: 'pro',
        nextBillingDate: '2023-08-15T00:00:00Z'
      },
      usage: {
        used: 18,
        total: 30
      },
      settings: {
        emailNotifications: {
          updates: true,
          billing: true,
          tips: false
        }
      },
      billingHistory: [
        {
          date: '2023-07-15T00:00:00Z',
          description: 'Professional Plan - Monthly',
          amount: 9.99,
          status: 'paid',
          invoiceUrl: '#'
        },
        {
          date: '2023-06-15T00:00:00Z',
          description: 'Professional Plan - Monthly',
          amount: 9.99,
          status: 'paid',
          invoiceUrl: '#'
        }
      ]
    };
  };
  
  const updateUserProfile = async (userId, profileData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      ...profileData,
      uid: userId,
      updatedAt: new Date().toISOString()
    };
  };
  
  const getUserAvatars = async (userId, options = { limit: 10 }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate some random avatars for the user
    return sampleAvatars.slice(0, options.limit).map(avatar => ({
      ...avatar,
      userId
    }));
  };
  
  const getGalleryAvatars = async (options = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredAvatars = [...sampleAvatars];
    
    // Apply style filter if provided
    if (options.style && options.style !== 'all') {
      filteredAvatars = filteredAvatars.filter(avatar => 
        avatar.style.toLowerCase() === options.style.toLowerCase()
      );
    }
    
    // Apply sorting
    if (options.sort) {
      switch (options.sort) {
        case 'newest':
          filteredAvatars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          filteredAvatars.sort((a, b) => b.likes - a.likes);
          break;
        case 'trending':
          // Simulate trending algorithm (combination of recency and popularity)
          filteredAvatars.sort((a, b) => {
            const aScore = a.likes * (1 / (1 + (Date.now() - new Date(a.createdAt).getTime()) / 86400000));
            const bScore = b.likes * (1 / (1 + (Date.now() - new Date(b.createdAt).getTime()) / 86400000));
            return bScore - aScore;
          });
          break;
      }
    }
    
    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAvatars = filteredAvatars.slice(startIndex, endIndex);
    
    // Generate more avatars if needed
    if (paginatedAvatars.length < limit && page < 3) {
      const additionalAvatars = Array(limit - paginatedAvatars.length).fill(0).map((_, index) => ({
        id: `avt_${Math.random().toString(36).substring(2, 9)}`,
        url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        style: ['Professional', 'Executive', 'Creative', 'Industry'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 100),
        tags: ['professional', 'business', 'portrait']
      }));
      
      paginatedAvatars.push(...additionalAvatars);
    }
    
    return {
      avatars: paginatedAvatars,
      hasMore: page < 3 // For demo, limit to 3 pages
    };
  };
  
  const getDashboardStats = async (userId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      avatarsGenerated: 24,
      avatarsRemaining: 6,
      totalAvatars: 30,
      popularStyle: 'Professional'
    };
  };
  
  const getGenerationHistory = async (userId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: 'gen_001',
        avatarId: 'avt_001',
        style: 'Professional',
        createdAt: '2023-07-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: 'gen_002',
        avatarId: 'avt_002',
        style: 'Executive',
        createdAt: '2023-07-10T14:45:00Z',
        status: 'completed'
      },
      {
        id: 'gen_003',
        avatarId: 'avt_003',
        style: 'Creative',
        createdAt: '2023-07-05T09:20:00Z',
        status: 'completed'
      },
      {
        id: 'gen_004',
        style: 'Industry',
        createdAt: '2023-07-01T16:15:00Z',
        status: 'processing'
      }
    ];
  };
  
  const deleteAvatar = async (avatarId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  };
  
  return {
    getUserProfile,
    updateUserProfile,
    getUserAvatars,
    getGalleryAvatars,
    getDashboardStats,
    getGenerationHistory,
    deleteAvatar
  };
}
