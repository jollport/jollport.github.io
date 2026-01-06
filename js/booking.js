// Booking Form Handling for Patrick Technician Website

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.getElementById('closeModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
});

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        serviceType: document.getElementById('service-type').value,
        message: document.getElementById('message').value,
        preferredDate: document.getElementById('preferred-date').value,
        submittedAt: new Date().toISOString()
    };
    
    // Validate form
    if (!validateBookingForm(formData)) {
        return;
    }
    
    // In a real application, you would send this data to a server
    // For demo purposes, we'll simulate a successful submission
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show confirmation modal
        const confirmationModal = document.getElementById('confirmationModal');
        if (confirmationModal) {
            confirmationModal.style.display = 'flex';
            
            // Update modal with service details
            updateModalContent(formData);
        }
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Log booking (in real app, this would go to server)
        console.log('Booking submitted:', formData);
        saveToLocalStorage(formData);
        
        // Send notification email (simulated)
        sendBookingNotification(formData);
    }, 1500);
}

// Validate booking form
function validateBookingForm(formData) {
    // Check required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.serviceType) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone (basic validation)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

// Format phone number as user types
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    // Format as (XXX) XXX-XXXX
    if (value.length > 6) {
        value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length > 3) {
        value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    
    e.target.value = value;
}

// Update modal content with booking details
function updateModalContent(formData) {
    const serviceNames = {
        'electrical': 'Electrical Service',
        'computer': 'Computer Service',
        'tv': 'Smart TV Service',
        'internet': 'Internet Service',
        'emergency': 'Emergency Repair'
    };
    
    const serviceName = serviceNames[formData.serviceType] || 'Service';
    
    // Update modal text
    const modalText = document.querySelector('.modal-content p');
    if (modalText) {
        modalText.innerHTML = `
            Thank you <strong>${formData.name}</strong> for booking our ${serviceName}. 
            We have received your request and will contact you at <strong>${formData.phone}</strong> 
            within 2 hours to confirm your appointment.
        `;
    }
}

// Save booking to localStorage (for demo purposes)
function saveToLocalStorage(bookingData) {
    try {
        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('patrickBookings')) || [];
        
        // Add new booking
        existingBookings.push({
            ...bookingData,
            id: Date.now(),
            status: 'pending'
        });
        
        // Save back to localStorage (limit to last 10 bookings)
        const recentBookings = existingBookings.slice(-10);
        localStorage.setItem('patrickBookings', JSON.stringify(recentBookings));
        
        console.log('Booking saved to localStorage.');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Simulate sending booking notification
function sendBookingNotification(formData) {
    // In a real application, this would be an API call to your backend
    const serviceNames = {
        'electrical': 'Electrical Service',
        'computer': 'Computer Service',
        'tv': 'Smart TV Service',
        'internet': 'Internet Service',
        'emergency': 'Emergency Repair'
    };
    
    const serviceName = serviceNames[formData.serviceType] || 'Service';
    const date = formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString() : 'ASAP';
    
    const emailBody = `
        New Booking Request:
        
        Name: ${formData.name}
        Phone: ${formData.phone}
        Email: ${formData.email}
        Service: ${serviceName}
        Preferred Date: ${date}
        Message: ${formData.message}
        
        Submitted: ${new Date().toLocaleString()}
    `;
    
    console.log('Booking notification email:', emailBody);
    
    // If you want to actually send an email, you would use:
    // fetch('/api/send-booking-email', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(formData)
    // });
}
