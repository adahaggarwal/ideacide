import React from 'react';
import { ModernCard, ModernButton } from '../../../components';
import './CollaborationCard.css';

const CollaborationCard = ({ request, onView, currentUser }) => {
  const getTypeIcon = (type) => {
    const icons = {
      funding: '💰',
      co_founder: '🤝',
      mentor: '👨‍🏫',
      advisor: '💡',
      partner: '🤝',
      developer: '💻',
      designer: '🎨',
      marketer: '📈',
      other: '🔧'
    };
    return icons[type] || '🔧';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      urgent: '#DC2626'
    };
    return colors[urgency] || '#F59E0B';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isOwner = currentUser && currentUser.uid === request.user_id;

  return (
    <ModernCard variant="glass" hover className="collaboration-card">
      <div className="card-header">
        <div className="card-type">
          <span className="type-icon">{getTypeIcon(request.collaboration_type)}</span>
          <span className="type-label">
            {request.collaboration_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className="card-urgency">
          <span 
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(request.urgency) }}
          >
            {request.urgency.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{request.title}</h3>
        <p className="card-description">
          {truncateText(request.description)}
        </p>

        <div className="card-details">
          {request.industry && (
            <div className="detail-item">
              <span className="detail-icon">🏢</span>
              <span className="detail-text">{request.industry}</span>
            </div>
          )}
          
          {request.location && (
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text">{request.location}</span>
            </div>
          )}
          
          {request.remote_friendly && (
            <div className="detail-item">
              <span className="detail-icon">🌐</span>
              <span className="detail-text">Remote Friendly</span>
            </div>
          )}

          {request.budget_range && (
            <div className="detail-item">
              <span className="detail-icon">💵</span>
              <span className="detail-text">{request.budget_range}</span>
            </div>
          )}

          {request.equity_offered && (
            <div className="detail-item">
              <span className="detail-icon">📊</span>
              <span className="detail-text">{request.equity_offered} equity</span>
            </div>
          )}
        </div>

        {request.skills_required && request.skills_required.length > 0 && (
          <div className="card-skills">
            <div className="skills-label">Required Skills:</div>
            <div className="skills-list">
              {request.skills_required.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {request.skills_required.length > 3 && (
                <span className="skill-tag more-skills">
                  +{request.skills_required.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {request.tags && request.tags.length > 0 && (
          <div className="card-tags">
            {request.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span className="meta-text">
              {request.user_profiles?.full_name || 'Anonymous'}
            </span>
          </div>
          
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">
              {formatDate(request.created_at)}
            </span>
          </div>
        </div>

        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-number">{request.views_count || 0}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <span className="stat-number">{request.applications_count || 0}</span>
          </div>
        </div>

        <div className="card-actions">
          <ModernButton
            variant="primary"
            size="small"
            onClick={onView}
          >
            {isOwner ? 'Manage' : 'View Details'}
          </ModernButton>
        </div>
      </div>
    </ModernCard>
  );
};

export default CollaborationCard;