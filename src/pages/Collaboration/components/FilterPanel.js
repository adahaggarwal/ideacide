import React, { useState } from 'react';
import { ModernInput, ModernButton } from '../../../components';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFiltersChange, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const collaborationTypes = [
    { value: '', label: 'All Types' },
    { value: 'funding', label: '💰 Funding' },
    { value: 'co_founder', label: '🤝 Co-founder' },
    { value: 'mentor', label: '👨‍🏫 Mentor' },
    { value: 'advisor', label: '💡 Advisor' },
    { value: 'partner', label: '🤝 Partner' },
    { value: 'developer', label: '💻 Developer' },
    { value: 'designer', label: '🎨 Designer' },
    { value: 'marketer', label: '📈 Marketer' },
    { value: 'other', label: '🔧 Other' }
  ];

  const urgencyLevels = [
    { value: '', label: 'Any Urgency' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFiltersChange({ ...localFilters, search: value });
    }, 500);
  };

  const clearFilters = () => {
    const clearedFilters = {
      collaboration_type: '',
      industry: '',
      location: '',
      remote_friendly: undefined,
      urgency: '',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== undefined
  );

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">🔍 Filter Requests</h3>
        <div className="filter-actions">
          {hasActiveFilters && (
            <ModernButton
              variant="ghost"
              size="small"
              onClick={clearFilters}
              disabled={loading}
            >
              Clear All
            </ModernButton>
          )}
          <ModernButton
            variant="ghost"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            className="toggle-filters"
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </ModernButton>
        </div>
      </div>

      <div className="filter-content">
        {/* Search */}
        <div className="filter-row">
          <ModernInput
            placeholder="Search requests..."
            value={localFilters.search}
            onChange={handleSearchChange}
            icon="🔍"
            className="search-input"
          />
        </div>

        {/* Primary Filters */}
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              value={localFilters.collaboration_type}
              onChange={(e) => handleFilterChange('collaboration_type', e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              {collaborationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Urgency</label>
            <select
              value={localFilters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              {urgencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Remote</label>
            <select
              value={localFilters.remote_friendly === undefined ? '' : localFilters.remote_friendly.toString()}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : e.target.value === 'true';
                handleFilterChange('remote_friendly', value);
              }}
              className="filter-select"
              disabled={loading}
            >
              <option value="">Any</option>
              <option value="true">Remote Friendly</option>
              <option value="false">On-site Only</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="expanded-filters">
            <div className="filter-row">
              <div className="filter-group">
                <ModernInput
                  label="Industry"
                  placeholder="e.g., FinTech, EdTech..."
                  value={localFilters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  icon="🏢"
                />
              </div>

              <div className="filter-group">
                <ModernInput
                  label="Location"
                  placeholder="e.g., San Francisco, Remote..."
                  value={localFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  icon="📍"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="filter-loading">
          <div className="loading-spinner small"></div>
          <span>Filtering...</span>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;