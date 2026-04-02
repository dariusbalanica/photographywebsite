/**
 * Main Application JavaScript
 * Core functionality for navigation, scrolling, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  setupScrollBehavior();
  setupAccessibility();
  setupImageProtection();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Update navbar state on scroll
  window.addEventListener('scroll', () => {
    updateNavbarState();
  });
}

/**
 * Update navbar state on scroll
 */
function updateNavbarState() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/**
 * Setup scroll behavior
 */
function setupScrollBehavior() {
  // Scroll position for sections
  const sections = document.querySelectorAll('section[id]');
  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
  // Prevent certain keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (
      e.key.toLowerCase() === 's' || // Save
      e.key.toLowerCase() === 'u' || // View Source
      e.key.toLowerCase() === 'p'    // Print
    )) {
      e.preventDefault();
    }
  });

  // Add skip to main content link if it doesn't exist
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

/**
 * Protect images from dragging
 */
function setupImageProtection() {
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
  });
}

/**
 * Notification system
 */
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
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
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

/**
 * Email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}