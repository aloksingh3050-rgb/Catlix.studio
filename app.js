// Catlix studio - Virtual Model Photoshoot App

// Data from JSON
const packagesData = {
    "starter": {"name": "Starter", "price": 4000, "photos": 5, "outfits": 2, "backgrounds": "Basic", "delivery": "48 hours"},
    "growth": {"name": "Growth", "price": 8000, "photos": 12, "outfits": 4, "backgrounds": "Premium", "delivery": "24 hours", "popular": true},
    "premium": {"name": "Premium", "price": 15000, "photos": 25, "outfits": 8, "backgrounds": "Custom", "delivery": "12 hours"}
};

const traditionalCosts = {
    "model_fee": [5000, 8000, 12000, 15000, 18000],
    "studio_rent": [3000, 4000, 5000, 6000, 8000],
    "photographer": [8000, 12000, 15000, 20000, 25000],
    "editing": [2000, 3000, 4000, 5000, 6000],
    "other": [2000, 3000, 4000, 4000, 5000]
};

const virtualCosts = [4000, 6000, 8000, 12000, 15000];

let costChart = null;
let selectedPackage = 'growth';

// Navigation Functions
function showMagic() {
    document.getElementById('cost-section').classList.remove('hidden');
    document.getElementById('cost-section').scrollIntoView({ behavior: 'smooth' });
    
    // Initialize cost calculator after showing
    setTimeout(() => {
        initializeCostCalculator();
    }, 500);
}

function showPackages() {
    document.getElementById('packages-section').classList.remove('hidden');
    document.getElementById('packages-section').scrollIntoView({ behavior: 'smooth' });
}

function showBenefits() {
    document.getElementById('benefits-section').classList.remove('hidden');
    document.getElementById('benefits-section').scrollIntoView({ behavior: 'smooth' });
}

function showGallery() {
    document.getElementById('gallery-section').classList.remove('hidden');
    document.getElementById('gallery-section').scrollIntoView({ behavior: 'smooth' });
}

function showContact() {
    document.getElementById('contact-section').classList.remove('hidden');
    document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
}

// Cost Calculator Functions
function initializeCostCalculator() {
    const photoSlider = document.getElementById('photo-count');
    const selectedPhotos = document.getElementById('selected-photos');
    
    // Initialize with default value
    updateCostCalculation(10);
    
    photoSlider.addEventListener('input', function() {
        const photoCount = parseInt(this.value);
        selectedPhotos.textContent = photoCount;
        updateCostCalculation(photoCount);
    });
}

function updateCostCalculation(photoCount) {
    const index = (photoCount / 5) - 1; // Convert photos to array index
    
    // Update traditional costs
    const modelFee = traditionalCosts.model_fee[index];
    const studioRent = traditionalCosts.studio_rent[index];
    const photographerFee = traditionalCosts.photographer[index];
    const editingFee = traditionalCosts.editing[index];
    const otherCosts = traditionalCosts.other[index];
    
    const traditionalTotal = modelFee + studioRent + photographerFee + editingFee + otherCosts;
    const virtualTotal = virtualCosts[index];
    
    // Update DOM elements
    document.getElementById('model-fee').textContent = `₹${modelFee.toLocaleString('en-IN')}`;
    document.getElementById('studio-rent').textContent = `₹${studioRent.toLocaleString('en-IN')}`;
    document.getElementById('photographer-fee').textContent = `₹${photographerFee.toLocaleString('en-IN')}`;
    document.getElementById('editing-fee').textContent = `₹${editingFee.toLocaleString('en-IN')}`;
    document.getElementById('other-costs').textContent = `₹${otherCosts.toLocaleString('en-IN')}`;
    
    document.getElementById('traditional-total').textContent = `₹${traditionalTotal.toLocaleString('en-IN')}`;
    document.getElementById('virtual-total').textContent = `₹${virtualTotal.toLocaleString('en-IN')}`;
    
    // Calculate savings
    const savings = traditionalTotal - virtualTotal;
    const savingsPercent = Math.round((savings / traditionalTotal) * 100);
    
    document.getElementById('savings-amount').textContent = savings.toLocaleString('en-IN');
    document.getElementById('savings-percent').textContent = savingsPercent;
    
    // Update chart
    updateCostChart(photoCount, traditionalTotal, virtualTotal);
}

function updateCostChart(photoCount, traditionalTotal, virtualTotal) {
    const ctx = document.getElementById('costChart').getContext('2d');
    
    if (costChart) {
        costChart.destroy();
    }
    
    const index = (photoCount / 5) - 1;
    
    costChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [`${photoCount} Photos Package`],
            datasets: [
                {
                    label: 'Model Fee',
                    data: [traditionalCosts.model_fee[index]],
                    backgroundColor: '#FF5459',
                    stack: 'traditional'
                },
                {
                    label: 'Studio Rent',
                    data: [traditionalCosts.studio_rent[index]],
                    backgroundColor: '#E68161',
                    stack: 'traditional'
                },
                {
                    label: 'Photographer',
                    data: [traditionalCosts.photographer[index]],
                    backgroundColor: '#B4413C',
                    stack: 'traditional'
                },
                {
                    label: 'Editing',
                    data: [traditionalCosts.editing[index]],
                    backgroundColor: '#964325',
                    stack: 'traditional'
                },
                {
                    label: 'Other Costs',
                    data: [traditionalCosts.other[index]],
                    backgroundColor: '#944454',
                    stack: 'traditional'
                },
                {
                    label: 'Virtual Model Shoot',
                    data: [virtualTotal],
                    backgroundColor: '#1FB8CD',
                    stack: 'virtual'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Cost Comparison: Traditional vs Virtual Photography',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Package Selection Functions
function initializePackageSelection() {
    const packageButtons = document.querySelectorAll('.select-package');
    packageButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedPackage = this.dataset.package.toLowerCase();
            updateServiceInterest();
            showBenefits();
        });
    });
}

function updateServiceInterest() {
    const serviceSelect = document.getElementById('serviceInterest');
    if (serviceSelect) {
        serviceSelect.value = selectedPackage;
    }
}

// Contact Form Functions
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
    
    // Initialize WhatsApp buttons
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    });
}

function handleFormSubmission() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        businessName: document.getElementById('businessName').value,
        whatsappNumber: document.getElementById('whatsappNumber').value,
        serviceInterest: document.getElementById('serviceInterest').value,
        freeSample: document.getElementById('freeSample').checked
    };
    
    // Validate form
    if (!formData.fullName || !formData.businessName || !formData.whatsappNumber) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    const cleanNumber = formData.whatsappNumber.replace(/\D/g, '');
    if (!phoneRegex.test(cleanNumber)) {
        alert('Please enter a valid Indian mobile number.');
        return;
    }
    
    // Show success modal
    document.getElementById('successModal').classList.remove('hidden');
    
    // Send WhatsApp message
    setTimeout(() => {
        sendWhatsAppMessage(formData);
    }, 1000);
    
    // Reset form
    document.getElementById('contactForm').reset();
}

function sendWhatsAppMessage(formData) {
    const packageInfo = packagesData[formData.serviceInterest];
    const message = encodeURIComponent(
        `Hello! I'm interested in Catlix studio services.\n\n` +
        `Name: ${formData.fullName}\n` +
        `Business: ${formData.businessName}\n` +
        `Package Interest: ${packageInfo ? packageInfo.name : 'Custom'} (₹${packageInfo ? packageInfo.price.toLocaleString('en-IN') : 'TBD'})\n` +
        `${formData.freeSample ? 'I want a FREE sample of 2 photos first!' : ''}\n\n` +
        `Please contact me to discuss further.`
    );
    
    const whatsappUrl = `https://wa.me/918533995183?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function openWhatsApp() {
    const message = encodeURIComponent(
        `Hello! I'm interested in your Catlix Studio virtual model photoshoot services. Can you tell me more about your packages?`
    );
    
    const whatsappUrl = `https://wa.me/918533995183?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Smooth scrolling enhancement
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Animation on scroll (simple version)
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card, .package-card, .benefit-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91-${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
    }
    return phone;
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Catlix studio App Initialized');
    
    // Initialize all components
    initializePackageSelection();
    initializeContactForm();
    initializeScrollAnimations();
    
    // Add loading states
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.textContent = originalText;
                }, 1000);
            }
        });
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.cost-card, .package-card, .benefit-card, .gallery-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize form validation
    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#FF5459';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === '#FF5459' || this.style.borderColor === 'rgb(255, 84, 89)') {
                if (this.value.trim() !== '') {
                    this.style.borderColor = '';
                }
            }
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('whatsappNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            if (value.length === 10) {
                this.value = `+91-${value.substring(0, 5)}-${value.substring(5)}`;
            } else {
                this.value = value;
            }
        });
    }
    
    // Add click tracking for analytics (placeholder)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            console.log('Button clicked:', e.target.textContent, 'at', new Date().toISOString());
        }
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('successModal');
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });
    
    // Initialize intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add loading styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn.loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .lazy {
        filter: blur(5px);
        transition: filter 0.3s;
    }
    
    .lazy.loaded {
        filter: blur(0);
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .loading {
        animation: pulse 1.5s infinite;
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Page loaded in', performance.now(), 'ms');
});
