// Main JavaScript functionality

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (
            e.key.toLowerCase() === 's' || // Save
            e.key.toLowerCase() === 'u' || // View Source
            e.key.toLowerCase() === 'p' || // Print
            e.key.toLowerCase() === 'a'    // Select All
        )) {
            e.preventDefault();
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Contact form handling (if you add a form later)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simple validation
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Here you would typically send the data to your server
    console.log('Form data:', data);
    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 300;
        letter-spacing: 1px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #4CAF50;' : ''}
        ${type === 'error' ? 'background: #f44336;' : ''}
        ${type === 'info' ? 'background: #2196F3;' : ''}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Lazy loading for images (optional enhancement)
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Disable right-click on images
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.addEventListener('dragstart', e => e.preventDefault());
    });
});

// Force download for links with data-download attribute
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.download-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            const fileName = url.split('/').pop();
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const staticHighlightPages = ['shop-page', 'gallery-page']; // Add more as needed

    if (!document.body.id || !staticHighlightPages.includes(document.body.id)) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        function onScroll() {
            let found = false;
            let scrollMiddle = window.scrollY + window.innerHeight / 2;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (
                    sectionTop <= scrollMiddle &&
                    sectionBottom > scrollMiddle
                ) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').replace('#', '') === section.id) {
                            link.classList.add('active');
                            found = true;
                        }
                    });
                }
            });

            // If at (or near) the bottom of the page, highlight the last nav link (CONTACT)
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
            ) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks.length > 0) {
                    navLinks[navLinks.length - 1].classList.add('active');
                }
                found = true;
            }

            // If no section is found and not at bottom, remove all highlights
            if (!found) {
                navLinks.forEach(link => link.classList.remove('active'));
            }
        }

        window.addEventListener('scroll', onScroll);
        onScroll();
    } else {
        // Always highlight the correct nav link for static pages
        document.querySelectorAll('.nav-links a').forEach(link => {
            // For shop page
            if (document.body.id === 'shop-page' && link.textContent.trim().toUpperCase() === 'SHOP') {
                link.classList.add('active');
            }
            // For gallery pages
            else if (document.body.id === 'gallery-page' && link.textContent.trim().toUpperCase() === 'GALLERY') {
                link.classList.add('active');
            }
            else {
                link.classList.remove('active');
            }
        });
    }
});