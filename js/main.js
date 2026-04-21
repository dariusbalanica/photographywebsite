/**
 * Main Application JavaScript
 * Core functionality for navigation, scrolling, and interactions
 */

/**
 * Load footer social links
 */
async function loadFooterSocialLinks() {
  try {
    const config = await fetch('data/config.json').then(r => r.json());
    const container = document.getElementById('footer-social');
    if (!container || !config.social.instagram) return;

    container.innerHTML = config.social.instagram.map(account => `
      <a href="${account.url}" target="_blank" rel="noopener" aria-label="Instagram: ${account.username}" title="${account.username}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.148-3.226 1.663-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
      </a>
    `).join('');
  } catch (error) {
    console.error('Error loading footer social links:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  setupScrollBehavior();
  setupAccessibility();
  setupImageProtection();
  loadFooterSocialLinks();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Handle main nav links - let hash navigation work naturally
  const navLinks = document.querySelectorAll('.nav-links:not(.lang-switch) a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Hash change will be handled by router's hashchange listener
    });
  });

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