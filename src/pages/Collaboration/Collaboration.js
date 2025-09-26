import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Header, 
  Footer, 
  ModernCard, 
  ModernButton, 
  AnimatedSection,
  ParticleBackground,
  Toast
} from '../../components';
import { collaborationService } from '../../services/collaborationService';
import { CollaborationCard, CreateRequestModal, FilterPanel } from './components';
import './Collaboration.css';

const Collaboration = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    collaboration_type: '',
    industry: '',
    location: '',
    remote_friendly: undefined,
    urgency: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    count: 0
  });
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalApplications: 0
  });

  useEffect(() => {
    loadRequests();
    loadStats();
  }, [filters, pagination.page]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await collaborationService.getRequests(
        filters, 
        pagination.page, 
        pagination.limit
      );
      
      setRequests(result.data);
      setPagination(prev => ({
        ...prev,
        totalPages: result.totalPages,
        count: result.count
      }));
    } catch (error) {
      console.error('Error loading collaboration requests:', error);
      setError('Failed to load collaboration requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await collaborationService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const showToast = (type, message) => {
    const id = Date.now();
    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateRequest = () => {
    if (!currentUser) {
      showToast('warning', 'Please sign in to create a collaboration request.');
      navigate('/signin');
      return;
    }
    setShowCreateModal(true);
  };

  const handleRequestCreated = (newRequest) => {
    setRequests(prev => [newRequest, ...prev]);
    setShowCreateModal(false);
    showToast('success', 'Collaboration request created successfully!');
    loadStats(); // Refresh stats
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewRequest = (requestId) => {
    navigate(`/collaboration/${requestId}`);
  };

  return (
    <div className="collaboration-page">
      <ParticleBackground density={20} speed={0.3} />
      <Header />
      
      <div className="collaboration-container">
        {/* Hero Section */}
        <AnimatedSection animation="fade-in">
          <div className="collaboration-hero">
            <div className="hero-content">
              <h1 className="hero-title">Find Your Perfect Collaboration</h1>
              <p className="hero-subtitle">
                Connect with co-founders, investors, mentors, and partners to bring your ideas to life
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalRequests}</span>
                  <span className="stat-label">Active Requests</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.totalApplications}</span>
                  <span className="stat-label">Total Applications</span>
                </div>
              </div>
              
              <div className="hero-actions">
                <ModernButton 
                  variant="primary" 
                  size="large"
                  onClick={handleCreateRequest}
                >
                  🚀 Post a Request
                </ModernButton>
                <ModernButton 
                  variant="secondary" 
                  size="large"
                  onClick={() => document.getElementById('requests-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  🔍 Browse Requests
                </ModernButton>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Filter Section */}
        <AnimatedSection animation="slide-up" delay={200}>
          <ModernCard variant="glass" className="filter-section">
            <FilterPanel 
              filters={filters}
              onFiltersChange={handleFilterChange}
              loading={loading}
            />
          </ModernCard>
        </AnimatedSection>

        {/* Requests Section */}
        <section id="requests-section" className="requests-section">
          <AnimatedSection animation="slide-up" delay={300}>
            <div className="section-header">
              <h2 className="section-title">Collaboration Requests</h2>
              <p className="section-subtitle">
                {pagination.count > 0 
                  ? `Showing ${requests.length} of ${pagination.count} requests`
                  : 'No requests found'
                }
              </p>
            </div>
          </AnimatedSection>

          {error && (
            <AnimatedSection animation="slide-up" delay={400}>
              <ModernCard variant="default" className="error-container">
                <p className="error-message">{error}</p>
                <ModernButton variant="secondary" onClick={loadRequests}>
                  Try Again
                </ModernButton>
              </ModernCard>
            </AnimatedSection>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading collaboration requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <>
              <div className="requests-grid">
                {requests.map((request, index) => (
                  <AnimatedSection 
                    key={request.id} 
                    animation="scale-in" 
                    delay={400 + (index * 100)}
                  >
                    <CollaborationCard 
                      request={request}
                      onView={() => handleViewRequest(request.id)}
                      currentUser={currentUser}
                    />
                  </AnimatedSection>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <AnimatedSection animation="fade-in" delay={600}>
                  <div className="pagination">
                    <ModernButton
                      variant="ghost"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      ← Previous
                    </ModernButton>
                    
                    <div className="pagination-info">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    
                    <ModernButton
                      variant="ghost"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next →
                    </ModernButton>
                  </div>
                </AnimatedSection>
              )}
            </>
          ) : !loading && (
            <AnimatedSection animation="fade-in" delay={400}>
              <ModernCard variant="glass" className="empty-state">
                <div className="empty-icon">🤝</div>
                <h3>No Collaboration Requests Found</h3>
                <p>Be the first to post a collaboration request and start building something amazing!</p>
                <ModernButton variant="primary" onClick={handleCreateRequest}>
                  Create First Request
                </ModernButton>
              </ModernCard>
            </AnimatedSection>
          )}
        </section>
      </div>

      <Footer />

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRequestCreated={handleRequestCreated}
        currentUser={currentUser}
      />

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            position="top-right"
          />
        ))}
      </div>
    </div>
  );
};

export default Collaboration;