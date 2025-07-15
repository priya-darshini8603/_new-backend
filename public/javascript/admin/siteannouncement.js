class AnnouncementManager {
  constructor() {
    this.announcements =
      JSON.parse(localStorage.getItem("announcements")) || [];
    this.filteredAnnouncements = [...this.announcements];
    this.editingId = null;
    this.init();
  }

  init() {
    this.loadSampleData();
    this.setupEventListeners();
    this.renderAnnouncements();
    this.updateStatistics();
    this.initializeNotificationCount(); // Added for navbar notification
  }

  // Added method to initialize notification count
  initializeNotificationCount() {
    const urgentCount = this.announcements.filter(
      (a) => a.priority === "urgent"
    ).length;
    const notificationElement = document.getElementById("notification-count");
    if (notificationElement) {
      notificationElement.textContent = urgentCount;
      notificationElement.style.display = urgentCount > 0 ? "flex" : "none";
    }
  }

  loadSampleData() {
    if (this.announcements.length === 0) {
      const sampleData = [
        {
          id: this.generateId(),
          title: "Emergency Route Diversion - Route 3",
          message:
            "Due to ongoing road construction on MG Road, Route 3 will be temporarily diverted via Richmond Road from January 15-20. Please board from the temporary stop near Trinity Metro Station.",
          category: "emergency",
          priority: "urgent",
          targetAudience: "all",
          affectedRoutes: ["route3"],
          status: "active",
          createdAt: new Date().toISOString(),
          publishDate: new Date().toISOString(),
          expiryDate: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notifications: { email: true, push: true },
          views: 245,
          sent: 189,
        },
        {
          id: this.generateId(),
          title: "Bus Fee Payment Reminder - January 2024",
          message:
            "Dear students, this is a friendly reminder that bus fee payment for January 2024 is due by January 25th. Late payments will incur additional charges.",
          category: "fee",
          priority: "high",
          targetAudience: "students",
          affectedRoutes: ["all"],
          status: "active",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          publishDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          expiryDate: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          notifications: { email: true, push: false },
          views: 892,
          sent: 1250,
        },
        {
          id: this.generateId(),
          title: "New Route Launch - Route 7 HSR Layout",
          message:
            "We're excited to announce the launch of Route 7 serving HSR Layout area, starting February 1st. New stops include Agara Lake, HSR BDA Complex, and 27th Main.",
          category: "route",
          priority: "medium",
          targetAudience: "all",
          affectedRoutes: ["route7"],
          status: "scheduled",
          createdAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          publishDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          expiryDate: null,
          notifications: { email: true, push: true },
          views: 0,
          sent: 0,
        },
      ];

      this.announcements = sampleData;
      this.saveToStorage();
      this.filteredAnnouncements = [...this.announcements];
    }
  }

  generateId() {
    return (
      "ANN_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    );
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce(() => this.applyFilters(), 300)
      );
    }

    // Filter dropdowns
    ["priorityFilter", "statusFilter", "categoryFilter"].forEach((filterId) => {
      const element = document.getElementById(filterId);
      if (element) {
        element.addEventListener("change", () => this.applyFilters());
      }
    });

    // Character counters
    const titleInput = document.getElementById("title");
    const messageInput = document.getElementById("message");

    if (titleInput) {
      titleInput.addEventListener("input", () =>
        this.updateCharCounter("title", "titleCount", 100)
      );
    }

    if (messageInput) {
      messageInput.addEventListener("input", () =>
        this.updateCharCounter("message", "messageCount", 500)
      );
    }

    // Publish option toggle
    document
      .querySelectorAll('input[name="publishOption"]')
      .forEach((radio) => {
        radio.addEventListener("change", this.toggleScheduleSection.bind(this));
      });

    // Form submission
    const form = document.getElementById("announcementForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveAnnouncement();
      });
    }
  }

  updateCharCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);

    if (!input || !counter) return;

    const length = input.value.length;

    counter.textContent = length;
    counter.parentElement.classList.toggle("warning", length > maxLength * 0.8);
    counter.parentElement.classList.toggle("danger", length > maxLength);
  }

  toggleScheduleSection() {
    const scheduleSection = document.getElementById("scheduleSection");
    const scheduleLater = document.getElementById("scheduleLater");

    if (scheduleSection && scheduleLater) {
      scheduleSection.style.display = scheduleLater.checked ? "block" : "none";
    }
  }

  applyFilters() {
    const searchInput = document.getElementById("searchInput");
    const priorityFilter = document.getElementById("priorityFilter");
    const statusFilter = document.getElementById("statusFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const priority = priorityFilter ? priorityFilter.value : "";
    const status = statusFilter ? statusFilter.value : "";
    const category = categoryFilter ? categoryFilter.value : "";

    this.filteredAnnouncements = this.announcements.filter((announcement) => {
      const matchesSearch =
        !searchTerm ||
        announcement.title.toLowerCase().includes(searchTerm) ||
        announcement.message.toLowerCase().includes(searchTerm);

      const matchesPriority = !priority || announcement.priority === priority;
      const matchesStatus = !status || announcement.status === status;
      const matchesCategory = !category || announcement.category === category;

      return (
        matchesSearch && matchesPriority && matchesStatus && matchesCategory
      );
    });

    this.renderAnnouncements();
  }

  clearFilters() {
    const searchInput = document.getElementById("searchInput");
    const priorityFilter = document.getElementById("priorityFilter");
    const statusFilter = document.getElementById("statusFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    if (searchInput) searchInput.value = "";
    if (priorityFilter) priorityFilter.value = "";
    if (statusFilter) statusFilter.value = "";
    if (categoryFilter) categoryFilter.value = "";

    this.applyFilters();
  }

  renderAnnouncements() {
    const container = document.getElementById("announcementsList");
    const emptyState = document.getElementById("emptyState");

    if (!container) return;

    if (this.filteredAnnouncements.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = this.filteredAnnouncements
      .map(
        (announcement) => `
            <div class="announcement-card ${announcement.priority}" data-id="${
          announcement.id
        }">
                <div class="announcement-meta">
                    <span class="priority-badge priority-${
                      announcement.priority
                    }">
                        ${this.getPriorityIcon(announcement.priority)} ${
          announcement.priority
        }
                    </span>
                    <span class="status-badge status-${announcement.status}">
                        ${this.getStatusIcon(announcement.status)} ${
          announcement.status
        }
                    </span>
                    <span class="badge bg-light text-dark">
                        ${this.getCategoryIcon(announcement.category)} ${
          announcement.category
        }
                    </span>
                    <small class="text-muted">
                        <i class="fas fa-calendar"></i> ${this.formatDate(
                          announcement.createdAt
                        )}
                    </small>
                </div>

                <h5 class="announcement-title mb-2">${announcement.title}</h5>
                <p class="announcement-message mb-3">${this.truncateText(
                  announcement.message,
                  200
                )}</p>

                <div class="row g-3 mb-3">
                    <div class="col-md-3">
                        <small class="text-muted d-block">Target Audience</small>
                        <span><i class="fas fa-users"></i> ${this.formatAudience(
                          announcement.targetAudience
                        )}</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">Affected Routes</small>
                        <span><i class="fas fa-route"></i> ${this.formatRoutes(
                          announcement.affectedRoutes
                        )}</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">Views</small>
                        <span><i class="fas fa-eye"></i> ${
                          announcement.views || 0
                        }</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">Sent To</small>
                        <span><i class="fas fa-paper-plane"></i> ${
                          announcement.sent || 0
                        }</span>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                    <div class="notification-badges">
                        ${
                          announcement.notifications?.email
                            ? '<span class="badge bg-info me-1"><i class="fas fa-envelope"></i> Email</span>'
                            : ""
                        }
                        ${
                          announcement.notifications?.push
                            ? '<span class="badge bg-warning me-1"><i class="fas fa-bell"></i> Push</span>'
                            : ""
                        }
                    </div>

                    <div class="announcement-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="announcementManager.viewAnnouncement('${
                          announcement.id
                        }')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="announcementManager.editAnnouncement('${
                          announcement.id
                        }')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="announcementManager.duplicateAnnouncement('${
                          announcement.id
                        }')">
                            <i class="fas fa-copy"></i>
                        </button>
                        ${
                          announcement.status === "active"
                            ? `<button class="btn btn-sm btn-outline-warning" onclick="announcementManager.toggleStatus('${announcement.id}')">
                                <i class="fas fa-pause"></i>
                            </button>`
                            : `<button class="btn btn-sm btn-outline-success" onclick="announcementManager.toggleStatus('${announcement.id}')">
                                <i class="fas fa-play"></i>
                            </button>`
                        }
                        <button class="btn btn-sm btn-outline-danger" onclick="announcementManager.deleteAnnouncement('${
                          announcement.id
                        }')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                ${
                  announcement.expiryDate
                    ? `
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="fas fa-calendar-times"></i> Expires: ${this.formatDate(
                              announcement.expiryDate
                            )}
                        </small>
                    </div>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");
  }

  openCreateModal() {
    this.editingId = null;
    const modalTitle = document.getElementById("modalTitle");
    const form = document.getElementById("announcementForm");
    const editId = document.getElementById("editId");

    if (modalTitle) {
      modalTitle.innerHTML =
        '<i class="fas fa-bullhorn"></i> Create Announcement';
    }
    if (form) form.reset();
    if (editId) editId.value = "";

    // Set defaults
    const priority = document.getElementById("priority");
    const targetAudience = document.getElementById("targetAudience");
    const publishNow = document.getElementById("publishNow");
    const sendEmail = document.getElementById("sendEmail");
    const sendPush = document.getElementById("sendPush");

    if (priority) priority.value = "medium";
    if (targetAudience) targetAudience.value = "all";
    if (publishNow) publishNow.checked = true;
    if (sendEmail) sendEmail.checked = true;
    if (sendPush) sendPush.checked = true;

    this.toggleScheduleSection();

    const modal = document.getElementById("announcementModal");
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }

  editAnnouncement(id) {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return;

    this.editingId = id;
    const modalTitle = document.getElementById("modalTitle");

    if (modalTitle) {
      modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Announcement';
    }

    // Populate form
    const editId = document.getElementById("editId");
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const category = document.getElementById("category");
    const priority = document.getElementById("priority");
    const targetAudience = document.getElementById("targetAudience");
    const sendEmail = document.getElementById("sendEmail");
    const sendPush = document.getElementById("sendPush");

    if (editId) editId.value = announcement.id;
    if (title) title.value = announcement.title;
    if (message) message.value = announcement.message;
    if (category) category.value = announcement.category;
    if (priority) priority.value = announcement.priority;
    if (targetAudience) targetAudience.value = announcement.targetAudience;

    // Set notifications
    if (sendEmail)
      sendEmail.checked = announcement.notifications?.email || false;
    if (sendPush) sendPush.checked = announcement.notifications?.push || false;

    // Update character counters
    this.updateCharCounter("title", "titleCount", 100);
    this.updateCharCounter("message", "messageCount", 500);

    const modal = document.getElementById("announcementModal");
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }

  saveAnnouncement() {
    if (!this.validateForm()) return;

    const publishOption = document.querySelector(
      'input[name="publishOption"]:checked'
    );
    if (!publishOption) return;

    const formData = this.getFormData();

    if (this.editingId) {
      // Update existing
      const index = this.announcements.findIndex(
        (a) => a.id === this.editingId
      );
      if (index !== -1) {
        this.announcements[index] = {
          ...this.announcements[index],
          ...formData,
        };
        this.showToast("Announcement updated successfully!", "success");
      }
    } else {
      // Create new
      const newAnnouncement = {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        views: 0,
        sent: 0,
        ...formData,
      };
      this.announcements.unshift(newAnnouncement);
      this.showToast("Announcement created successfully!", "success");
    }

    this.saveToStorage();
    this.filteredAnnouncements = [...this.announcements];
    this.renderAnnouncements();
    this.updateStatistics();
    this.initializeNotificationCount(); // Update notification count

    const modal = document.getElementById("announcementModal");
    if (modal) {
      bootstrap.Modal.getInstance(modal).hide();
    }

    // Simulate sending notifications
    if (formData.status === "active") {
      this.simulateNotificationSending(formData);
    }
  }

  saveDraft() {
    const saveDraft = document.getElementById("saveDraft");
    if (saveDraft) {
      saveDraft.checked = true;
      this.saveAnnouncement();
    }
  }

  deleteAnnouncement(id) {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return;

    if (confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      this.announcements = this.announcements.filter((a) => a.id !== id);
      this.filteredAnnouncements = this.filteredAnnouncements.filter(
        (a) => a.id !== id
      );
      this.saveToStorage();
      this.renderAnnouncements();
      this.updateStatistics();
      this.initializeNotificationCount(); // Update notification count
      this.showToast("Announcement deleted successfully!", "success");
    }
  }

  duplicateAnnouncement(id) {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return;

    const duplicate = {
      ...announcement,
      id: this.generateId(),
      title: announcement.title + " (Copy)",
      status: "draft",
      createdAt: new Date().toISOString(),
      views: 0,
      sent: 0,
    };

    this.announcements.unshift(duplicate);
    this.filteredAnnouncements = [...this.announcements];
    this.saveToStorage();
    this.renderAnnouncements();
    this.updateStatistics();
    this.showToast("Announcement duplicated successfully!", "success");
  }

  toggleStatus(id) {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return;

    announcement.status = announcement.status === "active" ? "draft" : "active";
    this.saveToStorage();
    this.renderAnnouncements();
    this.updateStatistics();
    this.initializeNotificationCount(); // Update notification count

    const action = announcement.status === "active" ? "activated" : "paused";
    this.showToast(`Announcement ${action} successfully!`, "success");
  }

  viewAnnouncement(id) {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) return;

    // Simulate view increment
    announcement.views = (announcement.views || 0) + 1;
    this.saveToStorage();
    this.renderAnnouncements();

    // Create a better modal view instead of alert
    const modalHtml = `
      <div class="modal fade" id="viewModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${announcement.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p><strong>Category:</strong> ${announcement.category}</p>
              <p><strong>Priority:</strong> ${announcement.priority}</p>
              <p><strong>Target Audience:</strong> ${this.formatAudience(
                announcement.targetAudience
              )}</p>
              <p><strong>Affected Routes:</strong> ${this.formatRoutes(
                announcement.affectedRoutes
              )}</p>
              <hr>
              <p>${announcement.message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing view modal if any
    const existingModal = document.getElementById("viewModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Add new modal
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    new bootstrap.Modal(document.getElementById("viewModal")).show();
  }

  getFormData() {
    const publishOption = document.querySelector(
      'input[name="publishOption"]:checked'
    );
    if (!publishOption) return null;

    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const category = document.getElementById("category");
    const priority = document.getElementById("priority");
    const targetAudience = document.getElementById("targetAudience");
    const publishDate = document.getElementById("publishDate");
    const expiryDate = document.getElementById("expiryDate");
    const sendEmail = document.getElementById("sendEmail");
    const sendPush = document.getElementById("sendPush");

    return {
      title: title ? title.value.trim() : "",
      message: message ? message.value.trim() : "",
      category: category ? category.value : "",
      priority: priority ? priority.value : "",
      targetAudience: targetAudience ? targetAudience.value : "all",
      affectedRoutes: this.getSelectedRoutes(),
      status:
        publishOption.value === "draft"
          ? "draft"
          : publishOption.value === "schedule"
          ? "scheduled"
          : "active",
      publishDate:
        publishOption.value === "schedule" && publishDate
          ? publishDate.value
          : new Date().toISOString(),
      expiryDate: expiryDate && expiryDate.value ? expiryDate.value : null,
      notifications: {
        email: sendEmail ? sendEmail.checked : false,
        push: sendPush ? sendPush.checked : false,
      },
    };
  }

  getSelectedRoutes() {
    const select = document.getElementById("affectedRoutes");
    if (!select) return ["all"];

    const selected = Array.from(select.selectedOptions).map(
      (option) => option.value
    );
    return selected.length > 0 ? selected : ["all"];
  }

  validateForm() {
    const title = document.getElementById("title");
    const message = document.getElementById("message");
    const category = document.getElementById("category");
    const priority = document.getElementById("priority");

    const titleValue = title ? title.value.trim() : "";
    const messageValue = message ? message.value.trim() : "";
    const categoryValue = category ? category.value : "";
    const priorityValue = priority ? priority.value : "";

    if (!titleValue || !messageValue || !categoryValue || !priorityValue) {
      this.showToast("Please fill in all required fields", "error");
      return false;
    }

    return true;
  }

  updateStatistics() {
    const total = this.announcements.length;
    const active = this.announcements.filter(
      (a) => a.status === "active"
    ).length;
    const scheduled = this.announcements.filter(
      (a) => a.status === "scheduled"
    ).length;
    const urgent = this.announcements.filter(
      (a) => a.priority === "urgent"
    ).length;

    const totalCount = document.getElementById("totalCount");
    const activeCount = document.getElementById("activeCount");
    const scheduledCount = document.getElementById("scheduledCount");
    const urgentCount = document.getElementById("urgentCount");

    if (totalCount) totalCount.textContent = total;
    if (activeCount) activeCount.textContent = active;
    if (scheduledCount) scheduledCount.textContent = scheduled;
    if (urgentCount) urgentCount.textContent = urgent;
  }

  simulateNotificationSending(announcement) {
    let recipients = 0;
    if (announcement.notifications.email) recipients += 500;
    if (announcement.notifications.push) recipients += 300;

    setTimeout(() => {
      this.showToast(`Notifications sent to ${recipients} recipients`, "info");
    }, 1000);
  }

  saveToStorage() {
    localStorage.setItem("announcements", JSON.stringify(this.announcements));
  }

  // Utility functions
  getPriorityIcon(priority) {
    const icons = { urgent: "🔴", high: "🟠", medium: "🟡", low: "🟢" };
    return icons[priority] || "🟡";
  }

  getStatusIcon(status) {
    const icons = { active: "✅", scheduled: "⏰", draft: "📝" };
    return icons[status] || "📝";
  }

  getCategoryIcon(category) {
    const icons = {
      emergency: "🚨",
      schedule: "📅",
      route: "🛣️",
      fee: "💰",
      maintenance: "🔧",
      general: "📢",
    };
    return icons[category] || "📢";
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatAudience(audience) {
    const audiences = {
      all: "All Users",
      students: "Students",
      staff: "Staff",
      drivers: "Drivers",
    };
    return audiences[audience] || audience;
  }

  formatRoutes(routes) {
    if (routes.includes("all")) return "All Routes";
    return routes.length > 2 ? `${routes.length} routes` : routes.join(", ");
  }

  truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  showToast(message, type = "info") {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const toastId = "toast_" + Date.now();

    const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" data-bs-autohide="true" data-bs-delay="5000">
                <div class="toast-header">
                    <i class="fas fa-${
                      type === "success"
                        ? "check-circle text-success"
                        : type === "error"
                        ? "exclamation-circle text-danger"
                        : "info-circle text-info"
                    }"></i>
                    <strong class="me-auto ms-2">Notification</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        `;

    toastContainer.insertAdjacentHTML("beforeend", toastHtml);
    const toastElement = document.getElementById(toastId);
    new bootstrap.Toast(toastElement).show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }
}

// Global functions
function openCreateModal() {
  if (window.announcementManager) {
    window.announcementManager.openCreateModal();
  }
}

function saveAnnouncement() {
  if (window.announcementManager) {
    window.announcementManager.saveAnnouncement();
  }
}

function saveDraft() {
  if (window.announcementManager) {
    window.announcementManager.saveDraft();
  }
}

function clearFilters() {
  if (window.announcementManager) {
    window.announcementManager.clearFilters();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.announcementManager = new AnnouncementManager();
});
