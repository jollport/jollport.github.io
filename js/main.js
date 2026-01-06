// Main JavaScript for Patrick Technician Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Set min date for booking forms to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.includes('tel:') || href.includes('mailto:')) return;
            
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Service type selector for booking form
    const serviceTypeSelect = document.getElementById('service-type');
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            const service = this.value;
            
            // Pre-fill message based on service type
            const suggestions = {
                'electrical': 'Describe your electrical issue (e.g., lights not working, circuit breaker tripping, outlet installation needed)...',
                'computer': 'Describe your computer issue (e.g., slow performance, virus/malware, won\'t turn on, data recovery)...',
                'tv': 'Describe your TV issue (e.g., mounting needed, setup assistance, no picture/sound, smart features not working)...',
                'internet': 'Describe your internet issue (e.g., slow WiFi, connection drops, network setup, range extender needed)...',
                'emergency': 'Describe your emergency (e.g., no power, electrical hazard, critical computer failure, no internet for work)...'
            };
            
            if (suggestions[service]) {
                messageField.placeholder = suggestions[service];
            }
        });
    }
    
    // Initialize testimonial slider if exists
    initTestimonialSlider();
    
    // Initialize service tabs if exists
    initServiceTabs();
});

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    // Function to show testimonial
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Initialize
    showTestimonial(0);
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// Service Tabs Functionality
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceSections = document.querySelectorAll('.service-section');
    
    if (tabButtons.length === 0) return;
    
    // Function to show service section
    function showServiceSection(category) {
        // Hide all sections
        serviceSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${category}-services`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Update active tab
        tabButtons.forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showServiceSection(category);
        });
    });
    
    // Show first tab by default
    if (tabButtons.length > 0) {
        const firstCategory = tabButtons[0].getAttribute('data-category');
        showServiceSection(firstCategory);
    }
}
