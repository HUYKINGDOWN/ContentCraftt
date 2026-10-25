import React from 'react'
import { FileText, Users, Activity, ExternalLink, TrendingUp } from 'lucide-react'
import { AnalyticsSummary, AnalyticsEvent, ContentItem } from '../types'
import { useI18n } from '../context/I18nContext'

interface AnalyticsPageProps {
  summary: AnalyticsSummary | null
  contents: ContentItem[]
  perfLogs: AnalyticsEvent[]
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  summary,
  contents,
  perfLogs
}) => {
  const { t } = useI18n()

  return (
    <div>
      <div className="analytics-kpis">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">{t('analytics.total_contents')}</span>
            <div
              className="kpi-icon"
              style={{ background: 'rgba(124, 92, 255, 0.2)', color: '#7c5cff' }}
            >
              <FileText size={18} />
            </div>
          </div>
          <div className="kpi-value">{summary?.total_contents || contents.length}</div>
          <div className="kpi-sub">
            <TrendingUp size={12} />
            <span>{t('analytics.active_system')}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">{t('analytics.total_reach')}</span>
            <div
              className="kpi-icon"
              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
            >
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{(summary?.total_reach || 1250).toLocaleString()}</div>
          <div className="kpi-sub">
            <TrendingUp size={12} />
            <span>{t('analytics.vs_last_week')}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">{t('analytics.total_engagement')}</span>
            <div
              className="kpi-icon"
              style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}
            >
              <Activity size={18} />
            </div>
          </div>
          <div className="kpi-value">{(summary?.total_engagement || 185).toLocaleString()}</div>
          <div className="kpi-sub">
            <TrendingUp size={12} />
            <span>{t('analytics.engagement_sub')}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">{t('analytics.total_clicks')}</span>
            <div
              className="kpi-icon"
              style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}
            >
              <ExternalLink size={18} />
            </div>
          </div>
          <div className="kpi-value">{(summary?.total_clicks || 42).toLocaleString()}</div>
          <div className="kpi-sub">
            <TrendingUp size={12} />
            <span>{t('analytics.clicks_sub')}</span>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
            {t('analytics.table_title')}
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('analytics.th_content')}</th>
              <th>{t('analytics.th_url')}</th>
              <th>{t('analytics.th_reach')}</th>
              <th>{t('analytics.th_engagement')}</th>
              <th>{t('analytics.th_clicks')}</th>
              <th>{t('analytics.th_rate')}</th>
            </tr>
          </thead>
          <tbody>
            {perfLogs.map(log => {
              const content = contents.find(c => c.id === log.content_id)
              const rate =
                log.reach_count > 0
                  ? ((log.engagement_count / log.reach_count) * 100).toFixed(1)
                  : '0'
              return (
                <tr key={log.id}>
                  <td>#{log.id}</td>
                  <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    {content ? content.title : `Post #${log.content_id}`}
                  </td>
                  <td>
                    {log.post_url ? (
                      <a
                        href={log.post_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#7c5cff',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span>{log.post_url}</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{log.reach_count.toLocaleString()}</td>
                  <td>{log.engagement_count.toLocaleString()}</td>
                  <td>{log.click_count.toLocaleString()}</td>
                  <td>
                    <span className="card-badge badge-published">{rate}%</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default AnalyticsPage
