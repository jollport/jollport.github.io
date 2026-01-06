// Bookings Management System
let allBookings = [];
let filteredBookings = [];
let currentPage = 1;
const bookingsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    // Load bookings
    loadAllBookings();
    
    // Initialize table
    updateBookingsTable();
});

// Load all bookings from localStorage
function loadAllBookings() {
    allBookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
    
    // Sort by date (newest first)
    allBookings.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Add IDs if not present
    allBookings.forEach((booking, index) => {
        if (!booking.id) {
            booking.id = Date.now() + index;
        }
        if (!booking.status) {
            booking.status = 'pending';
        }
    });
    
    // Save back to localStorage
    localStorage.setItem('patrickBookings', JSON.stringify(allBookings));
    
    // Initialize filtered bookings
    filteredBookings = [...allBookings];
}

// Update bookings table
function updateBookingsTable() {
    const tableBody = document.getElementById('bookingsTable');
    const tableInfo = document.getElementById('tableInfo');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!tableBody) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    const pageBookings = filteredBookings.slice(startIndex, endIndex);
    
    // Update table
    tableBody.innerHTML = pageBookings.map(booking => `
        <tr>
            <td>#${String(booking.id).slice(-6)}</td>
            <td>
                <strong>${booking.name}</strong><br>
                <small>${booking.email}</small>
            </td>
            <td>${booking.phone}</td>
            <td>${getServiceName(booking.serviceType)}</td>
            <td>
                ${booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'Not set'}<br>
                <small>${new Date(booking.submittedAt).toLocaleDateString()}</small>
            </td>
            <td>
                <select class="status-select" data-id="${booking.id}" onchange="updateBookingStatus(${booking.id}, this.value)">
                    <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewBookingDetails(${booking.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editBookingDetails(${booking.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteBookingConfirm(${booking.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update table info
    if (tableInfo) {
        const total = filteredBookings.length;
        const start = total === 0 ? 0 : startIndex + 1;
        const end = Math.min(endIndex, total);
        tableInfo.textContent = `Showing ${start}-${end} of ${total} bookings`;
    }
    
    // Update page info
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    // Update buttons
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Filter bookings
function filterBookings() {
    const statusFilter = document.getElementById('statusFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    filteredBookings = allBookings.filter(booking => {
        // Status filter
        if (statusFilter && booking.status !== statusFilter) {
            return false;
        }
        
        // Service filter
        if (serviceFilter && booking.serviceType !== serviceFilter) {
            return false;
        }
        
        // Date range filter
        if (dateFrom) {
            const bookingDate = booking.preferredDate ? new Date(booking.preferredDate) : new Date(booking.submittedAt);
            const fromDate = new Date(dateFrom);
            if (bookingDate < fromDate) {
                return false;
            }
        }
        
        if (dateTo) {
            const bookingDate = booking.preferredDate ? new Date(booking.preferredDate) : new Date(booking.submittedAt);
            const toDate = new Date(dateTo);
            if (bookingDate > toDate) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    updateBookingsTable();
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('serviceFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('searchBookings').value = '';
    
    filteredBookings = [...allBookings];
    currentPage = 1;
    updateBookingsTable();
}

// Search bookings
function searchBookings() {
    const searchTerm = document.getElementById('searchBookings').value.toLowerCase();
    
    if (!searchTerm) {
        filteredBookings = [...allBookings];
    } else {
        filteredBookings = allBookings.filter(booking => 
            booking.name.toLowerCase().includes(searchTerm) ||
            booking.email.toLowerCase().includes(searchTerm) ||
            booking.phone.toLowerCase().includes(searchTerm) ||
            booking.serviceType.toLowerCase().includes(searchTerm) ||
            booking.message?.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    updateBookingsTable();
}

// Pagination
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateBookingsTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateBookingsTable();
    }
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
    const bookingIndex = allBookings.findIndex(b => b.id == bookingId);
    
    if (bookingIndex !== -1) {
        allBookings[bookingIndex].status = newStatus;
        
        // Update in localStorage
        localStorage.setItem('patrickBookings', JSON.stringify(allBookings));
        
        // Update filtered bookings
        const filteredIndex = filteredBookings.findIndex(b => b.id == bookingId);
        if (filteredIndex !== -1) {
            filteredBookings[filteredIndex].status = newStatus;
        }
        
        // Show notification
        showNotification(`Booking status updated to ${newStatus}`, 'success');
        
        // Update dashboard if exists
        if (typeof updateNotifications === 'function') {
            updateNotifications();
        }
    }
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    
    if (booking) {
        const modalContent = `
            <div class="booking-details">
                <div class="detail-row">
                    <span class="label">Booking ID:</span>
                    <span class="value">#${String(booking.id).slice(-6)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Customer Name:</span>
                    <span class="value">${booking.name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${booking.email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">${booking.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Service Type:</span>
                    <span class="value">${getServiceName(booking.serviceType)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Preferred Date:</span>
                    <span class="value">${booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'Not specified'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span class="value status-badge status-${booking.status}">${booking.status}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Submitted:</span>
                    <span class="value">${new Date(booking.submittedAt).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Message:</span>
                    <div class="value message-box">${booking.message || 'No message provided'}</div>
                </div>
            </div>
        `;
        
        document.getElementById('bookingDetails').innerHTML = modalContent;
        document.getElementById('bookingModal').style.display = 'flex';
    }
}

// Edit booking details
function editBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id == bookingId);
    
    if (booking) {
        const editForm = `
            <form id="editBookingForm">
                <div class="form-group">
                    <label>Customer Name</label>
                    <input type="text" class="form-control" value="${booking.name}" id="editName">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" value="${booking.email}" id="editEmail">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" class="form-control" value="${booking.phone}" id="editPhone">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Service Type</label>
                    <select class="form-control" id="editService">
                        <option value="electrical" ${booking.serviceType === 'electrical' ? 'selected' : ''}>Electrical Service</option>
                        <option value="computer" ${booking.serviceType === 'computer' ? 'selected' : ''}>Computer Service</option>
                        <option value="tv" ${booking.serviceType === 'tv' ? 'selected' : ''}>Smart TV Service</option>
                        <option value="internet" ${booking.serviceType === 'internet' ? 'selected' : ''}>Internet Service</option>
                        <option value="emergency" ${booking.serviceType === 'emergency' ? 'selected' : ''}>Emergency Repair</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Preferred Date</label>
                    <input type="date" class="form-control" value="${booking.preferredDate || ''}" id="editDate">
                </div>
                
                <div class="form-group">
                    <label>Status</label>
                    <select class="form-control" id="editStatus">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Notes/Message</label>
                    <textarea class="form-control" rows="4" id="editMessage">${booking.message || ''}</textarea>
                </div>
                
                <button type="button" class="btn btn-primary" onclick="saveBookingChanges(${bookingId})">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </form>
        `;
        
        document.getElementById('bookingDetails').innerHTML = editForm;
        document.getElementById('bookingModal').style.display = 'flex';
    }
}

// Save booking changes
function saveBookingChanges(bookingId) {
    const bookingIndex = allBookings.findIndex(b => b.id == bookingId);
    
    if (bookingIndex !== -1) {
        allBookings[bookingIndex] = {
            ...allBookings[bookingIndex],
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            serviceType: document.getElementById('editService').value,
            preferredDate: document.getElementById('editDate').value,
            status: document.getElementById('editStatus').value,
            message: document.getElementById('editMessage').value,
            updatedAt: new Date().toISOString()
        };
        
        // Update in localStorage
        localStorage.setItem('patrickBookings', JSON.stringify(allBookings));
        
        // Update filtered bookings
        const filteredIndex = filteredBookings.findIndex(b => b.id == bookingId);
        if (filteredIndex !== -1) {
            filteredBookings[filteredIndex] = allBookings[bookingIndex];
        }
        
        // Close modal and update table
        closeModal();
        updateBookingsTable();
        
        showNotification('Booking updated successfully!', 'success');
    }
}

// Delete booking confirmation
function deleteBookingConfirm(bookingId) {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
        deleteBooking(bookingId);
    }
}

// Delete booking
function deleteBooking(bookingId) {
    // Remove from allBookings
    allBookings = allBookings.filter(b => b.id != bookingId);
    
    // Remove from filteredBookings
    filteredBookings = filteredBookings.filter(b => b.id != bookingId);
    
    // Update localStorage
    localStorage.setItem('patrickBookings', JSON.stringify(allBookings));
    
    // Update table
    updateBookingsTable();
    
    showNotification('Booking deleted successfully!', 'success');
    
    // Update dashboard if exists
    if (typeof updateNotifications === 'function') {
        updateNotifications();
    }
}

// Export bookings to CSV
function exportBookings() {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Preferred Date', 'Status', 'Submitted Date', 'Message'];
    
    const csvData = [
        headers.join(','),
        ...filteredBookings.map(booking => [
            booking.id,
            `"${booking.name}"`,
            `"${booking.email}"`,
            `"${booking.phone}"`,
            `"${getServiceName(booking.serviceType)}"`,
            `"${booking.preferredDate || ''}"`,
            `"${booking.status}"`,
            `"${new Date(booking.submittedAt).toLocaleString()}"`,
            `"${(booking.message || '').replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Bookings exported successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background-color: var(--admin-success);
    }
    
    .notification-error {
        background-color: var(--admin-danger);
    }
    
    .notification-info {
        background-color: var(--admin-info);
    }
    
    .booking-details .detail-row {
        margin-bottom: 15px;
        display: flex;
        align-items: flex-start;
    }
    
    .booking-details .label {
        font-weight: bold;
        color: #666;
        width: 150px;
        min-width: 150px;
    }
    
    .booking-details .value {
        flex: 1;
    }
    
    .booking-details .message-box {
        background-color: var(--admin-bg);
        padding: 15px;
        border-radius: 6px;
        margin-top: 5px;
        white-space: pre-wrap;
    }
    
    .status-select {
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid var(--admin-border);
        background-color: white;
        cursor: pointer;
        min-width: 120px;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
