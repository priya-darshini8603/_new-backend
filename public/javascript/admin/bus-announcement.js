// Enhanced Bus Management Announcement System
class BusAnnouncementManager {
    constructor() {
        this.announcements = this.loadAnnouncements();
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.currentCategory = 'all';
        this.currentRoute = 'all';
        this.currentTarget = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderAnnouncements();
        this.updateNotificationCount();
        this.checkScheduledAnnouncements();
        this.initializeRealTimeUpdates();
    }

    // Enhanced bus announcement model structure
    createAnnouncementModel(data) {
        return {
            id: data.id || this.generateId(),
            title: data.title || '',
            message: data.message || '',
            
            // Bus-specific categories
            category: data.category || 'general', // schedule, route, fee, general
            priority: data.priority || 'medium', // low, medium, high, urgent
            
            // Bus-specific targeting
            targetAudience: data.targetAudience || 'all', // all, students, drivers, staff
            affectedRoutes: data.affectedRoutes || ['all'], // specific route IDs
            busNumbers: data.busNumbers || [], // specific bus numbers if applicable
            
            // Location and route specific
            pickupPoints: data.pickupPoints || [], // affected pickup points
            stopNames: data.stopNames || [], // specific bus stops
            
            // Timing and scheduling
            effectiveDate: data.effectiveDate || new Date().toISOString(),
            expiryDate: data.expiryDate || null,
            scheduledTime: data.scheduledTime || null,
            isScheduled: data.isScheduled || false,
            
            // Bus operation specific
            operationalImpact: data.operationalImpact || 'none', // none, delay, cancellation, reroute
            alternativeArrangement: data.alternativeArrangement || '',
            estimatedDuration: data.estimatedDuration || null, // in minutes
            
            // Emergency features
            isEmergency: data.isEmergency || false,
            requiresAcknowledgment: data.requiresAcknowledgment || false,
            emergencyContact: data.emergencyContact || '',
            
            // Notification settings
            sendPushNotification: data.sendPushNotification || false,
            sendSMS: data.sendSMS || false,
            sendEmail: data.sendEmail || false,
            showOnDashboard: data.showOnDashboard || true,
            
            // Status tracking
            status: data.status || 'active', // draft, active, resolved, archived
            createdBy: data.createdBy || 'Admin',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            
            // Engagement
            acknowledgments: data.acknowledgments || [],
            views: data.views || 0,
            reactions: data.reactions || { helpful: 0, notHelpful: 0 }
        };
    }

    // Route and bus specific data
    getRouteData() {
        return {
            'route1': {
                name: 'Route 1 - Jayanagar',
                stops: ['Jayanagar 4th Block', 'BTM Layout', 'Silk Board', 'College'],
                buses: ['BUS001', 'BUS002'],
                timing: '7:30 AM - 6:30 PM'
            },
            'route2': {
                name: 'Route 2 - Malleshwaram',
                stops: ['Malleshwaram', 'Seshadripuram', 'Cantonment', 'College'],
                buses: ['BUS003', 'BUS004'],
                timing: '7:45 AM - 6:45 PM'
            },
            'route3': {
                name: 'Route 3 - Devaiah Park',
                stops: ['Devaiah Park', 'Wilson Garden', 'Shanthinagar', 'College'],
                buses: ['BUS005', 'BUS006'],
                timing: '8:00 AM - 7:00 PM'
            },
            'route4': {
                name: 'Route 4 - Yelahanka',
                stops: ['Yelahanka', 'Hebbal', 'RT Nagar', 'College'],
                buses: ['BUS007', 'BUS008'],
                timing: '7:15 AM - 6:15 PM'
            },
            'route5': {
                name: 'Route 5 - Electronic City',
                stops: ['Electronic City', 'Bommanahalli', 'BTM Layout', 'College'],
                buses: ['BUS009', 'BUS010'],
                timing: '7:00 AM - 6:00 PM'
            }
        };
    }

    // Enhanced event binding for bus management
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndRenderAnnouncements();
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const routeFilter = document.getElementById('routeFilter');
        const targetFilter = document.getElementById('targetFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.filterAndRenderAnnouncements();
            });
        }

        if (routeFilter) {
            routeFilter.addEventListener('change', (e) => {
                this.currentRoute = e.target.value;
                this.filterAndRenderAnnouncements();
            });
        }

        if (targetFilter) {
            targetFilter.addEventListener('change', (e) => {
                this.currentTarget = e.target.value;
                this.filterAndRenderAnnouncements();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterAndRenderAnnouncements();
            });
        });

        // Form submission
        const form = document.getElementById('announcementForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAnnouncement();
            });
        }

        // Character counter
        const messageTextarea = document.getElementById('announcementMessage');
        const charCount = document.getElementById('charCount');
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                charCount.textContent = messageTextarea.value.length;
            });
        }
    }

    // Enhanced filtering for bus management
    filterAndRenderAnnouncements() {
        let filteredAnnouncements = this.announcements.filter(announcement => {
            // Search filter
            const matchesSearch = !this.searchTerm || 
                announcement.title.toLowerCase().includes(this.searchTerm) ||
                announcement.message.toLowerCase().includes(this.searchTerm) ||
                announcement.affectedRoutes.some(route => route.toLowerCase().includes(this.searchTerm));

            // Category filter
            const matchesCategory = this.currentCategory === 'all' || 
                announcement.category === this.currentCategory;

            // Route filter
            const matchesRoute = this.currentRoute === 'all' || 
                announcement.affectedRoutes.includes(this.currentRoute) ||
                announcement.affectedRoutes.includes('all');

            // Target audience filter
            const matchesTarget = this.currentTarget === 'all' || 
                announcement.targetAudience === this.currentTarget ||
                announcement.targetAudience === 'all';

            // Priority filter for filter buttons
            const matchesPriority = this.currentFilter === 'all' || 
                announcement.category === this.currentFilter ||
                announcement.priority === this.currentFilter;

            return matchesSearch && matchesCategory && matchesRoute && matchesTarget && matchesPriority;
        });

        // Sort by priority and date
        filteredAnnouncements.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        this.renderAnnouncements(filteredAnnouncements);
    }

    // Enhanced announcement rendering with bus-specific features
    renderAnnouncements(announcements = null) {
        const container = document.querySelector('.announcements-grid');
        if (!container) return;

        const announcementsToRender = announcements || this.announcements;
        
        if (announcementsToRender.length === 0) {
            container.innerHTML = `
                <div class="no-announcements">
                    <i class="fas fa-bus"></i>
                    <h3>No Bus Announcements</h3>
                    <p>No announcements found for the selected filters.</p>
                    <button class="btn btn-primary" onclick="openAddModal()">
                        <i class="fas fa-plus"></i> Create First Announcement
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = announcementsToRender.map(announcement => 
            this.createAnnouncementCard(announcement)
        ).join('');
    }

    // Enhanced announcement card with bus management features
    createAnnouncementCard(announcement) {
        const priorityColors = {
            urgent: '#dc3545',
            high: '#fd7e14', 
            medium: '#ffc107',
            low: '#28a745'
        };

        const categoryIcons = {
            schedule: 'fa-clock',
            route: 'fa-route',
            fee: 'fa-money-bill-wave',
            general: 'fa-info-circle'
        };

        const routeNames = this.getRouteData();
        const affectedRouteNames = announcement.affectedRoutes
            .filter(route => route !== 'all')
            .map(route => routeNames[route]?.name || route)
            .join(', ') || 'All Routes';

        const isExpired = announcement.expiryDate && new Date(announcement.expiryDate) < new Date();
        const isUrgent = announcement.priority === 'urgent';

        return `
            <div class="announcement-card ${announcement.category} priority-${announcement.priority} ${isExpired ? 'expired' : ''} ${isUrgent ? 'urgent-card' : ''}" 
                 data-id="${announcement.id}">
                
                ${isUrgent ? '<div class="urgent-indicator"><i class="fas fa-exclamation-triangle"></i> URGENT</div>' : ''}
                
                <div class="announcement-header">
                    <div class="announcement-meta">
                        <span class="announcement-id">#${announcement.id}</span>
                        <span class="announcement-category">
                            <i class="fas ${categoryIcons[announcement.category] || 'fa-info-circle'}"></i>
                            ${announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </span>
                    </div>
                    <div class="priority-badge ${announcement.priority}" 
                         style="background-color: ${priorityColors[announcement.priority]}">
                        ${announcement.priority.toUpperCase()}
                    </div>
                </div>

                <h3 class="announcement-title">${announcement.title}</h3>
                
                <div class="announcement-message">${announcement.message}</div>

                <div class="bus-specific-info">
                    <div class="route-info">
                        <i class="fas fa-route"></i>
                        <span>Routes: ${affectedRouteNames}</span>
                    </div>
                    
                    <div class="target-info">
                        <i class="fas fa-users"></i>
                        <span>Target: ${announcement.targetAudience.charAt(0).toUpperCase() + announcement.targetAudience.slice(1)}</span>
                    </div>

                    ${announcement.operationalImpact !== 'none' ? `
                        <div class="impact-info">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>Impact: ${announcement.operationalImpact}</span>
                        </div>
                    ` : ''}

                    ${announcement.estimatedDuration ? `
                        <div class="duration-info">
                            <i class="fas fa-clock"></i>
                            <span>Duration: ${announcement.estimatedDuration} minutes</span>
                        </div>
                    ` : ''}
                </div>

                <div class="announcement-timing">
                    <div class="created-date">
                        <i class="fas fa-calendar-alt"></i>
                        Created: ${this.formatDate(announcement.createdAt)}
                    </div>
                    ${announcement.expiryDate ? `
                        <div class="expiry-date ${isExpired ? 'expired' : ''}">
                            <i class="fas fa-calendar-times"></i>
                            Expires: ${this.formatDate(announcement.expiryDate)}
                        </div>
                    ` : ''}
                </div>

                <div class="announcement-stats">
                    <span class="views">
                        <i class="fas fa-eye"></i> ${announcement.views}
                    </span>
                    <span class="acknowledgments">
                        <i class="fas fa-check"></i> ${announcement.acknowledgments.length}
                    </span>
                    <span class="reactions">
                        <i class="fas fa-thumbs-up"></i> ${announcement.reactions.helpful}
                    </span>
                </div>

                <div class="announcement-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="busAnnouncementManager.viewAnnouncement('${announcement.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="busAnnouncementManager.editAnnouncement('${announcement.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${announcement.status === 'active' ? `
                        <button class="btn btn-sm btn-outline-warning" onclick="busAnnouncementManager.resolveAnnouncement('${announcement.id}')">
                            <i class="fas fa-check"></i> Resolve
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-outline-danger" onclick="busAnnouncementManager.deleteAnnouncement('${announcement.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Save announcement with bus-specific validation
    saveAnnouncement() {
        const form = document.getElementById('announcementForm');
        const formData = new FormData(form);
        
        const announcementData = {
            title: document.getElementById('announcementTitle').value.trim(),
            message: document.getElementById('announcementMessage').value.trim(),
            category: document.getElementById('announcementCategory').value,
            priority: document.getElementById('announcementPriority').value,
            targetAudience: document.getElementById('announcementTarget').value,
            affectedRoutes: Array.from(document.getElementById('announcementRoute').selectedOptions)
                .map(option => option.value),
            effectiveDate: document.getElementById('announcementStartDate').value,
            expiryDate: document.getElementById('announcementEndDate').value
        };

        // Bus management specific validations
        if (!announcementData.title || !announcementData.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (announcementData.title.length < 5) {
            this.showNotification('Title must be at least 5 characters long', 'error');
            return;
        }

        if (announcementData.message.length < 10) {
            this.showNotification('Message must be at least 10 characters long', 'error');
            return;
        }

        // Create and save announcement
        const announcement = this.createAnnouncementModel(announcementData);
        
        const editId = document.getElementById('editAnnouncementId').value;
        if (editId) {
            // Update existing announcement
            const index = this.announcements.findIndex(a => a.id === editId);
            if (index !== -1) {
                announcement.id = editId;
                announcement.createdAt = this.announcements[index].createdAt;
                announcement.updatedAt = new Date().toISOString();
                this.announcements[index] = announcement;
                this.showNotification('Bus announcement updated successfully!', 'success');
            }
        } else {
            // Add new announcement
            this.announcements.unshift(announcement);
            this.showNotification('Bus announcement created successfully!', 'success');
        }

        this.saveAnnouncements();
        this.renderAnnouncements();
        this.closeModal();
        this.updateNotificationCount();
        
        // Send notifications if urgent
        if (announcement.priority === 'urgent') {
            this.sendUrgentNotifications(announcement);
        }
    }

    // Urgent notification system
    sendUrgentNotifications(announcement) {
        // Simulate sending push notifications, SMS, emails
        console.log('Sending urgent notifications for:', announcement.title);
        
        // In a real system, this would integrate with:
        // - Push notification service
        // - SMS gateway
        // - Email service
        // - Real-time WebSocket updates
        
        this.showNotification('Urgent notifications sent to all users!', 'warning');
    }

    // Real-time updates simulation
    initializeRealTimeUpdates() {
        // Simulate real-time bus updates
        setInterval(() => {
            this.checkScheduledAnnouncements();
        }, 60000); // Check every minute
    }

    // Check for scheduled announcements
    checkScheduledAnnouncements() {
        const now = new Date();
        let updated = false;

        this.announcements.forEach(announcement => {
            if (announcement.isScheduled && announcement.scheduledTime) {
                const scheduledTime = new Date(announcement.scheduledTime);
                if (scheduledTime <= now && announcement.status === 'draft') {
                    announcement.status = 'active';
                    announcement.isScheduled = false;
                    updated = true;
                    this.showNotification(`Scheduled announcement "${announcement.title}" is now active!`, 'info');
                }
            }

            // Check for expired announcements
            if (announcement.expiryDate) {
                const expiryDate = new Date(announcement.expiryDate);
                if (expiryDate <= now && announcement.status === 'active') {
                    announcement.status = 'expired';
                    updated = true;
                }
            }
        });

        if (updated) {
            this.saveAnnouncements();
            this.renderAnnouncements();
        }
    }

    // Load sample bus management announcements
    getDefaultAnnouncements() {
        return [
            {
                id: 'BUS001',
                title: 'Route 1 Schedule Change',
                message: 'Due to college event, Route 1 morning departure will be delayed by 15 minutes today. Please wait at your pickup points.',
                category: 'schedule',
                priority: 'high',
                targetAudience: 'students',
                affectedRoutes: ['route1'],
                operationalImpact: 'delay',
                estimatedDuration: 15,
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'BUS002',
                title: 'Bus Fee Payment Reminder',
                message: 'Monthly bus fee payment is due by 15th of this month. Please make payment to avoid service interruption.',
                category: 'fee',
                priority: 'medium',
                targetAudience: 'students',
                affectedRoutes: ['all'],
                operationalImpact: 'none',
                createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                status: 'active'
            },
            {
                id: 'BUS003',
                title: 'New Pickup Point Added - Route 2',
                message: 'A new pickup point has been added at Rajajinagar Metro Station for Route 2. Morning pickup time: 8:15 AM, Evening departure: 5:45 PM.',
                category: 'route',
                priority: 'medium',
                targetAudience: 'all',
                affectedRoutes: ['route2'],
                operationalImpact: 'none',
                effectiveDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                status: 'active'
            }
        ];
    }

    // Utility methods
    generateId() {
        return 'BUS' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    loadAnnouncements() {
        const stored = localStorage.getItem('busAnnouncements');
        return stored ? JSON.parse(stored) : this.getDefaultAnnouncements();
    }

    saveAnnouncements() {
        localStorage.setItem('busAnnouncements', JSON.stringify(this.announcements));
    }

    updateNotificationCount() {
        const activeCount = this.announcements.filter(a => 
            a.status === 'active' && 
            (a.priority === 'urgent' || a.priority === 'high')
        ).length;
        
        const countElement = document.getElementById('notification-count');
        if (countElement) {
            countElement.textContent = activeCount;
            countElement.style.display = activeCount > 0 ? 'block' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Modal management
    closeModal() {
        const modal = document.getElementById('announcementModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('announcementForm').reset();
        document.getElementById('editAnnouncementId').value = '';
        document.getElementById('charCount').textContent = '0';
    }

    // Additional methods for view, edit, delete, resolve
    viewAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (announcement) {
            announcement.views++;
            this.saveAnnouncements();
            // Open detailed view modal (implement as needed)
            alert(`Viewing announcement: ${announcement.title}`);
        }
    }

    editAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (announcement) {
            // Populate form with existing data
            document.getElementById('announcementTitle').value = announcement.title;
            document.getElementById('announcementMessage').value = announcement.message;
            document.getElementById('announcementCategory').value = announcement.category;
            document.getElementById('announcementPriority').value = announcement.priority;
            document.getElementById('announcementTarget').value = announcement.targetAudience;
            document.getElementById('editAnnouncementId').value = id;
            
            // Show modal
            openAddModal();
        }
    }

    deleteAnnouncement(id) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            this.announcements = this.announcements.filter(a => a.id !== id);
            this.saveAnnouncements();
            this.renderAnnouncements();
            this.showNotification('Announcement deleted successfully!', 'success');
        }
    }

    resolveAnnouncement(id) {
        const announcement = this.announcements.find(a => a.id === id);
        if (announcement) {
            announcement.status = 'resolved';
            announcement.updatedAt = new Date().toISOString();
            this.saveAnnouncements();
            this.renderAnnouncements();
            this.showNotification('Announcement marked as resolved!', 'success');
        }
    }
}

// Global functions for modal management
function openAddModal() {
    const modal = document.getElementById('announcementModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = document.getElementById('editAnnouncementId').value ? 
            'Edit Bus Announcement' : 'Add New Bus Announcement';
    }
}

function closeModal() {
    if (window.busAnnouncementManager) {
        window.busAnnouncementManager.closeModal();
    }
}

// Initialize the bus announcement manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.busAnnouncementManager = new BusAnnouncementManager();
});
