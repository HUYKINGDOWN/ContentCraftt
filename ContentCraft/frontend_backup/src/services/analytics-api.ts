import { api } from './api-client'
import { AnalyticsSummary, AnalyticsEvent } from '../types'

export const analyticsApi = {
  getSummary: () => api<AnalyticsSummary>('/analytics/summary'),
  getEvents: () => api<AnalyticsEvent[]>('/analytics/events'),
}
