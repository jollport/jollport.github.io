// Admin Authentication System
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true' && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Protect admin pages
    protectAdminPages();
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    
    // Default credentials (change these in production!)
    const defaultCredentials = {
        username: 'admin',
        password: 'patrick2023'
    };
    
    // Get stored credentials or use defaults
    const storedCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || defaultCredentials;
    
    if (username === storedCredentials.username && password === storedCredentials.password) {
        // Successful login
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        
        // Store in localStorage if "Remember me" is checked
        if (remember) {
            localStorage.setItem('adminRemember', 'true');
            localStorage.setItem('adminUsername', username);
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'flex';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
        
        // Clear password field
        document.getElementById('password').value = '';
    }
}

// Handle logout
function handleLogout() {
    // Clear session
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    
    // Clear "Remember me" data
    if (localStorage.getItem('adminRemember') !== 'true') {
        localStorage.removeItem('adminUsername');
    }
    
    // Redirect to login
    window.location.href = 'index.html';
}

// Protect admin pages
function protectAdminPages() {
    // Check if we're on an admin page (not login page)
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname.includes('admin/')) {
        
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            // Redirect to login
            window.location.href = 'index.html';
        } else {
            // Update username display
            const username = sessionStorage.getItem('adminUsername') || localStorage.getItem('adminUsername');
            const usernameElements = document.querySelectorAll('.admin-username');
            
            usernameElements.forEach(element => {
                element.textContent = username || 'Admin';
            });
        }
    }
}

// Change admin password
function changeAdminPassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;
    
    // Get stored credentials
    const storedCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || {
        username: 'admin',
        password: 'patrick2023'
    };
    
    // Verify current password
    if (currentPassword !== storedCredentials.password) {
        alert('Current password is incorrect!');
        return;
    }
    
    // Get new password
    const newPassword = prompt('Enter new password:');
    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    const confirmPassword = prompt('Confirm new password:');
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Update credentials
    storedCredentials.password = newPassword;
    localStorage.setItem('adminCredentials', JSON.stringify(storedCredentials));
    
    alert('Password changed successfully!');
    
    // Log out and redirect to login
    handleLogout();
}

// Initialize dashboard data
function initDashboard() {
    // Load stats
    loadDashboardStats();
    
    // Load recent activities
    loadRecentActivities();
    
    // Load recent bookings
    loadRecentBookings();
    
    // Initialize charts
    initCharts();
}

// Load dashboard statistics
function loadDashboardStats() {
    // Get data from localStorage
    const bookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
    const contacts = JSON.parse(localStorage.getItem('patrickContacts')) || [];
    
    // Calculate stats
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const totalCustomers = new Set(bookings.map(b => b.email).concat(contacts.map(c => c.email))).size;
    
    // Calculate revenue (simulated - $100 per completed booking)
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = completedBookings * 100;
    
    // Update DOM
    updateElementText('#totalBookings', totalBookings);
    updateElementText('#totalRevenue', `$${totalRevenue}`);
    updateElementText('#totalCustomers', totalCustomers);
    updateElementText('#pendingBookings', pendingBookings);
}

// Load recent activities
function loadRecentActivities() {
    const activities = [
        {
            type: 'booking',
            title: 'New Booking',
            description: 'Sarah Johnson booked electrical service',
            time: '10 minutes ago',
            icon: 'fas fa-calendar-plus'
        },
        {
            type: 'payment',
            title: 'Payment Received',
            description: 'Payment of $150 received from Michael Chen',
            time: '1 hour ago',
            icon: 'fas fa-dollar-sign'
        },
        {
            type: 'service',
            title: 'Service Completed',
            description: 'Computer repair completed for Robert Williams',
            time: '2 hours ago',
            icon: 'fas fa-check-circle'
        },
        {
            type: 'booking',
            title: 'New Booking',
            description: 'Lisa Brown booked smart TV installation',
            time: '3 hours ago',
            icon: 'fas fa-calendar-plus'
        },
        {
            type: 'payment',
            title: 'Payment Pending',
            description: 'Payment reminder sent to David Miller',
            time: '5 hours ago',
            icon: 'fas fa-clock'
        }
    ];
    
    const activitiesContainer = document.getElementById('recentActivities');
    if (activitiesContainer) {
        activitiesContainer.innerHTML = activities.map(activity => `
            <div class="activity-item ${activity.type}">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }
}

// Load recent bookings
function loadRecentBookings() {
    const bookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
    
    // Sort by date (newest first)
    bookings.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Take latest 5 bookings
    const recentBookings = bookings.slice(0, 5);
    
    const bookingsTable = document.getElementById('recentBookingsTable');
    if (bookingsTable) {
        bookingsTable.innerHTML = recentBookings.map(booking => `
            <tr>
                <td>${booking.name}</td>
                <td>${getServiceName(booking.serviceType)}</td>
                <td>${new Date(booking.submittedAt).toLocaleDateString()}</td>
                <td><span class="status-badge status-${booking.status || 'pending'}">${booking.status || 'Pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewBooking('${booking.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="editBooking('${booking.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize charts
function initCharts() {
    // Booking trends chart
    initBookingChart();
    
    // Revenue chart
    initRevenueChart();
}

function initBookingChart() {
    const ctx = document.getElementById('bookingChart');
    if (!ctx) return;
    
    // Sample data for chart
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Bookings',
            data: [12, 19, 15, 25, 22, 30],
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            borderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    };
    
    // Create chart
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    // Sample data for chart
    const data = {
        labels: ['Electrical', 'Computer', 'TV', 'Internet'],
        datasets: [{
            label: 'Revenue ($)',
            data: [3500, 2200, 1800, 1200],
            backgroundColor: [
                'rgba(255, 215, 0, 0.2)',
                'rgba(33, 150, 243, 0.2)',
                'rgba(156, 39, 176, 0.2)',
                'rgba(76, 175, 80, 0.2)'
            ],
            borderColor: [
                'rgba(255, 215, 0, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(76, 175, 80, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Helper functions
function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function getServiceName(serviceType) {
    const services = {
        'electrical': 'Electrical Service',
        'computer': 'Computer Service',
        'tv': 'Smart TV Service',
        'internet': 'Internet Service',
        'emergency': 'Emergency Repair'
    };
    return services[serviceType] || serviceType;
}

// Booking management functions
function viewBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking) {
        alert(`Booking Details:\n
Name: ${booking.name}\n
Email: ${booking.email}\n
Phone: ${booking.phone}\n
Service: ${getServiceName(booking.serviceType)}\n
Date: ${booking.preferredDate || 'Not specified'}\n
Status: ${booking.status || 'Pending'}\n
Message: ${booking.message || 'No message'}\n
Submitted: ${new Date(booking.submittedAt).toLocaleString()}`);
    }
}

function editBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.id == bookingId);
    
    if (bookingIndex !== -1) {
        const newStatus = prompt('Enter new status (pending/confirmed/completed/cancelled):');
        if (newStatus && ['pending', 'confirmed', 'completed', 'cancelled'].includes(newStatus)) {
            bookings[bookingIndex].status = newStatus;
            localStorage.setItem('patrickBookings', JSON.stringify(bookings));
            alert('Booking status updated!');
            loadRecentBookings();
            loadDashboardStats();
        }
    }
}

function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
        const filteredBookings = bookings.filter(b => b.id != bookingId);
        localStorage.setItem('patrickBookings', JSON.stringify(filteredBookings));
        alert('Booking deleted!');
        loadRecentBookings();
        loadDashboardStats();
    }
}
