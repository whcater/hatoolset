'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Reply, MoreVertical } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  rating?: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  toolId: number;
}

export function CommentSection({ toolId }: CommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  useEffect(() => {
    loadComments();
  }, [toolId, sortBy]);

  const loadComments = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockComments: Comment[] = [
        {
          id: '1',
          user: {
            id: '1',
            name: 'John Doe',
            avatar: '/api/placeholder/40/40'
          },
          content: 'This tool is amazing! It really helped me streamline my workflow.',
          rating: 5,
          likes: 12,
          dislikes: 1,
          createdAt: '2024-01-15T10:30:00Z',
          replies: [
            {
              id: '2',
              user: {
                id: '2',
                name: 'Jane Smith',
                avatar: '/api/placeholder/40/40'
              },
              content: 'I agree! The interface is so intuitive.',
              likes: 3,
              dislikes: 0,
              createdAt: '2024-01-15T11:15:00Z'
            }
          ]
        },
        {
          id: '3',
          user: {
            id: '3',
            name: 'Bob Johnson',
            avatar: '/api/placeholder/40/40'
          },
          content: 'Good tool overall, but could use some improvements in the mobile version.',
          rating: 4,
          likes: 8,
          dislikes: 2,
          createdAt: '2024-01-14T15:45:00Z'
        }
      ];

      // Sort comments
      const sortedComments = mockComments.sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });

      setComments(sortedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      
      // Mock API call - replace with actual implementation
      const mockNewComment: Comment = {
        id: Date.now().toString(),
        user: {
          id: 'current-user',
          name: 'Current User',
          avatar: '/api/placeholder/40/40'
        },
        content: newComment,
        rating: newRating || undefined,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString()
      };

      setComments([mockNewComment, ...comments]);
      setNewComment('');
      setNewRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    // Mock implementation - replace with actual API call
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleDislike = async (commentId: string) => {
    // Mock implementation - replace with actual API call
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    ));
  };

  const renderStars = (rating: number, interactive: boolean = false, onClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
            onClick={() => interactive && onClick?.(star)}
          />
        ))}
      </div>
    );
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {comment.user.name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.user.name}
                </span>
                {comment.rating && renderStars(comment.rating)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {comment.content}
            </p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                {comment.likes}
              </button>
              
              <button
                onClick={() => handleDislike(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                {comment.dislikes}
              </button>
              
              {!isReply && (
                <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
            </div>
          </div>
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Leave a Review
        </h4>
        
        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating (optional)
            </label>
            {renderStars(newRating, true, setNewRating)}
          </div>
          
          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this tool..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h4>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}