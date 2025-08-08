'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Archive, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Filter,
  Plus
} from 'lucide-react'
import Layout from '../../src/components/Layout'
import LoadingSpinner from '../../src/components/ui/LoadingSpinner'
import { useAuth, useAuthenticatedFetch } from '../../src/contexts/AuthContext'

interface Submission {
  id: number
  name: string
  description: string
  url: string
  category_name: string
  category_icon: string
  tags: string[]
  pricing: 'free' | 'paid' | 'freemium'
  platform: 'web' | 'desktop' | 'mobile' | 'api'
  status: 'pending' | 'approved' | 'rejected' | 'archived'
  rejection_reason?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MySubmissionsPage() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // 加载申请记录
  const loadSubmissions = async (page = 1, status = statusFilter) => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (status !== 'all') {
        params.append('status', status)
      }

      const response = await authenticatedFetch(`/api/tools/my-submissions?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to load submissions')
      }

      setSubmissions(result.data.submissions)
      setPagination(result.data.pagination)

    } catch (error) {
      console.error('Load submissions error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  // 删除申请
  const deleteSubmission = async (id: number) => {
    if (!confirm(t('mySubmissions.confirmDelete', 'Are you sure you want to delete this submission?'))) {
      return
    }

    try {
      const response = await authenticatedFetch(`/api/tools/submissions/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete submission')
      }

      // 重新加载当前页面
      loadSubmissions(pagination.page, statusFilter)

    } catch (error) {
      console.error('Delete submission error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete submission')
    }
  }

  // 状态变化处理
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    loadSubmissions(1, status)
  }

  // 页面变化处理
  const handlePageChange = (page: number) => {
    loadSubmissions(page, statusFilter)
  }

  // 初始加载
  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
    }
  }, [isAuthenticated])

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'archived':
        return <Archive className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {t('mySubmissions.loginRequired', 'Sign In Required')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('mySubmissions.loginDescription', 'Please sign in to view your submissions')}
            </p>
            <a
              href="/submit-tool"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('mySubmissions.signIn', 'Sign In')}
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('mySubmissions.title', 'My Submissions')}
              </h1>
              <p className="text-muted-foreground">
                {t('mySubmissions.subtitle', 'Track and manage your tool submissions')}
              </p>
            </div>
            
            <a
              href="/submit-tool"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('mySubmissions.submitNew', 'Submit New Tool')}
            </a>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('mySubmissions.filterBy', 'Filter by status:')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: t('mySubmissions.all', 'All') },
                { key: 'pending', label: t('mySubmissions.pending', 'Pending') },
                { key: 'approved', label: t('mySubmissions.approved', 'Approved') },
                { key: 'rejected', label: t('mySubmissions.rejected', 'Rejected') },
                { key: 'archived', label: t('mySubmissions.archived', 'Archived') }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => handleStatusFilter(filter.key)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    statusFilter === filter.key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : submissions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="mb-4">
                <Plus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {statusFilter === 'all' 
                    ? t('mySubmissions.noSubmissions', 'No submissions yet')
                    : t('mySubmissions.noSubmissionsFiltered', `No ${statusFilter} submissions`)
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter === 'all'
                    ? t('mySubmissions.noSubmissionsDesc', 'Start by submitting your first tool for review')
                    : t('mySubmissions.tryDifferentFilter', 'Try a different filter or submit a new tool')
                  }
                </p>
              </div>
              <a
                href="/submit-tool"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('mySubmissions.submitFirst', 'Submit Your First Tool')}
              </a>
            </div>
          ) : (
            /* Submissions List */
            <div className="space-y-6">
              {submissions.map(submission => (
                <div
                  key={submission.id}
                  className="bg-background/80 backdrop-blur rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1 truncate">
                            {submission.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {submission.description}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              {submission.category_icon} {submission.category_name}
                            </span>
                            <span className="capitalize">{submission.pricing}</span>
                            <span className="capitalize">{submission.platform}</span>
                            <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusStyle(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="capitalize">{submission.status}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {submission.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {submission.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {submission.status === 'rejected' && submission.rejection_reason && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>{t('mySubmissions.rejectionReason', 'Rejection Reason')}:</strong> {submission.rejection_reason}
                          </p>
                          {submission.admin_notes && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                              <strong>{t('mySubmissions.adminNotes', 'Admin Notes')}:</strong> {submission.admin_notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        title={t('mySubmissions.visitTool', 'Visit Tool')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      {(submission.status === 'pending' || submission.status === 'rejected') && (
                        <>
                          <button
                            onClick={() => window.location.href = `/edit-submission/${submission.id}`}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                            title={t('mySubmissions.editSubmission', 'Edit Submission')}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteSubmission(submission.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t('mySubmissions.deleteSubmission', 'Delete Submission')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.previous', 'Previous')}
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.next', 'Next')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}