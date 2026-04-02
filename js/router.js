/**
 * Simple Router System
 * Handles dynamic page routing and rendering
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = 'home';
    this.currentProjectId = null;
    this.init();
  }

  /**
   * Register a route
   */
  register(path, component) {
    this.routes[path] = component;
  }

  /**
   * Initialize router
   */
  init() {
    // Handle hash-based routing
    window.addEventListener('hashchange', () => this.navigate());
  }

  /**
   * Start the router (call after routes are registered and data loaded)
   */
  start() {
    // Initial navigation
    this.navigate();
  }

  /**
   * Navigate to route
   */
  navigate(path = null) {
    const hash = path || window.location.hash.slice(1) || 'home';
    
    // Default to home if hash is empty
    const route = hash.split('/')[0] || 'home';
    
    if (this.routes[route]) {
      this.currentRoute = route;
      this.render(route, hash);
    } else if (route !== 'home') {
      // 404 - render home
      window.location.hash = '#home';
    }
  }

  /**
   * Render route component
   */
  render(route, fullHash) {
    // Update active nav link
    this.updateActiveNavLink(route);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    const component = this.routes[route];
    if (typeof component === 'function') {
      component(fullHash);
    }
  }

  /**
   * Update active nav link styling
   */
  updateActiveNavLink(route) {
    const navLinks = document.querySelectorAll('.nav-links:not(.lang-switch) a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${route}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

// Create global router instance
const router = new Router();

/**
 * Page Components
 */

// Home Page
function renderHome() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1 data-i18n="hero.title">CAPTURING MOMENTS</h1>
        <p data-i18n="hero.subtitle"></p>
      </div>
    </section>

    <!-- Portfolio Section -->
    <section class="gallery" id="portfolio-preview">
      <h2 class="section-title" data-i18n="portfolio.title">Portfolio</h2>
      <div class="gallery-grid" id="home-gallery"></div>
    </section>

    <!-- About Preview Section -->
    <section class="about" id="about">
      <div class="about-container">
        <h2 data-i18n="about.title">About</h2>
        <p data-i18n="about.bio"></p>
        <h3 data-i18n="about.equipment">Equipment</h3>
        <p data-i18n="about.equipmentList"></p>
        <h3 data-i18n="about.editing">Editing</h3>
        <p data-i18n="about.editingList"></p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
      <h2 data-i18n="contact.title">Contact</h2>
      <div class="contact-info" id="social-links"></div>
    </section>
  `;

  // Re-apply translations after rendering
  i18n.updateDOMTranslations();
  
  // Load gallery thumbnails
  loadPortfolioPreview();
  
  // Load social links
  loadSocialLinks();
}

// Portfolio Page - Full gallery view
function renderPortfolio(hash) {
  const projectId = hash.split('/')[1];
  
  // If no project ID specified, show portfolio listing
  if (!projectId) {
    renderPortfolioListing();
    return;
  }
  
  // Store current project ID for language change updates
  router.currentProjectId = projectId;
  
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="portfolio-detail">
      <div class="portfolio-header">
        <a href="#portfolio" class="back-link" data-i18n="common.backToPortfolio">Back to Portfolio</a>
        <h2 id="project-title"></h2>
        <p id="project-desc"></p>
      </div>
      <div class="gallery-grid" id="project-gallery"></div>
    </section>
    <div id="lightbox" class="lightbox">
      <span id="lightbox-close" class="lightbox-close">&times;</span>
      <img id="lightbox-image" src="" alt="">
      <button id="lightbox-prev" class="lightbox-prev">&#10094;</button>
      <button id="lightbox-next" class="lightbox-next">&#10095;</button>
    </div>
  `;

  i18n.updateDOMTranslations();
  loadProjectGallery(projectId);
}

// Portfolio Listing - Show all projects
function renderPortfolioListing() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="portfolio-listing">
      <div class="portfolio-header">
        <h2 data-i18n="portfolio.title">Portfolio</h2>
        <p data-i18n="portfolio.subtitle">Browse my photography projects</p>
      </div>
      <div class="gallery-grid" id="portfolio-gallery-list"></div>
    </section>
  `;

  i18n.updateDOMTranslations();
  loadPortfolioListing();
}

// Shop Page
function renderShop() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="shop" id="shop">
      <h2 class="section-title" data-i18n="shop.title">Shop</h2>
      <p class="coming-soon" data-i18n="shop.comingSoon">Coming Soon</p>
    </section>
  `;

  i18n.updateDOMTranslations();
}

// Blog Page
function renderBlog() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="blog" id="blog">
      <h2 class="section-title" data-i18n="blog.title">Blog</h2>
      <p class="coming-soon" data-i18n="blog.comingSoon">Coming Soon</p>
    </section>
  `;

  i18n.updateDOMTranslations();
}

// About Page
function renderAboutPage() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="about-detail">
      <h2 data-i18n="about.title">About Me</h2>
      <div class="about-container">
        <p data-i18n="about.bio"></p>
        <h3 data-i18n="about.equipment">Equipment</h3>
        <p data-i18n="about.equipmentList"></p>
        <h3 data-i18n="about.editing">Editing Software</h3>
        <p data-i18n="about.editingList"></p>
      </div>
    </section>
  `;

  i18n.updateDOMTranslations();
}

// Contact Page
function renderContactPage() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section class="contact-detail">
      <h2 data-i18n="contact.title">Contact</h2>
      <div class="contact-info" id="contact-links"></div>
    </section>
  `;

  i18n.updateDOMTranslations();
  loadSocialLinks();
}

/**
 * Helper Functions
 */

async function loadPortfolioPreview() {
  try {
    const data = await fetch('data/portfolio.json').then(r => r.json());
    const container = document.getElementById('home-gallery');
    if (!container) return;

    container.innerHTML = '';

    data.projects.forEach(project => {
      const translations = i18n.getNamespace('portfolio');
      const projectTrans = translations.projects[project.id];
      
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${project.thumbnail}" alt="${projectTrans?.name || project.id}" loading="lazy">
        <div class="gallery-overlay">
          <h3>${projectTrans?.name || project.id}</h3>
        </div>
      `;
      
      item.addEventListener('click', () => {
        window.location.hash = `#portfolio/${project.id}`;
      });
      
      container.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading portfolio:', error);
  }
}

async function loadPortfolioListing() {
  try {
    const data = await fetch('data/portfolio.json').then(r => r.json());
    const container = document.getElementById('portfolio-gallery-list');
    if (!container) return;

    container.innerHTML = '';

    data.projects.forEach(project => {
      const translations = i18n.getNamespace('portfolio');
      const projectTrans = translations.projects[project.id];
      
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${project.thumbnail}" alt="${projectTrans?.name || project.id}" loading="lazy">
        <div class="gallery-overlay">
          <h3>${projectTrans?.name || project.id}</h3>
        </div>
      `;
      
      item.addEventListener('click', () => {
        window.location.hash = `#portfolio/${project.id}`;
      });
      
      container.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading portfolio listing:', error);
  }
}

async function loadProjectGallery(projectId) {
  try {
    const data = await fetch('data/portfolio.json').then(r => r.json());
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) {
      window.location.hash = '#home';
      return;
    }

    const translations = i18n.getNamespace('portfolio');
    const projectTrans = translations.projects[projectId];

    document.getElementById('project-title').textContent = projectTrans?.name || projectId;
    document.getElementById('project-desc').textContent = projectTrans?.description || '';

    const container = document.getElementById('project-gallery');
    container.innerHTML = '';

    // Load gallery items from the images array in portfolio.json
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((imageUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img src="${imageUrl}" alt="Gallery image ${index + 1}" loading="lazy" data-image-index="${index}">
          <div class="gallery-overlay"></div>
        `;
        
        container.appendChild(item);
      });
    }

    // Reinitialize lazy loading for new images
    setupImageLazyLoading();
  } catch (error) {
    console.error('Error loading project gallery:', error);
  }
}

async function loadSocialLinks() {
  try {
    const config = await fetch('data/config.json').then(r => r.json());
    const container = document.getElementById('social-links') || document.getElementById('contact-links');
    if (!container || !config.social.instagram) return;

    const links = config.social.instagram.map(account => `
      <a href="${account.url}" class="contact-item" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#666" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="#666" stroke-width="2"/><circle cx="17" cy="7" r="1" fill="#666"/></svg>
        ${account.username}
      </a>
    `).join('');

    container.innerHTML = links;
  } catch (error) {
    console.error('Error loading social links:', error);
  }
}

// Register routes and start router
document.addEventListener('DOMContentLoaded', () => {
  router.register('home', renderHome);
  router.register('portfolio', renderPortfolio);
  router.register('shop', renderShop);
  router.register('blog', renderBlog);
  router.register('about', renderAboutPage);
  router.register('contact', renderContactPage);
  
  // Start router after routes are registered and translations are loaded
  // Give i18n a moment to finish loading translations
  setTimeout(() => {
    router.start();
  }, 100);
  
  // Reload current gallery when language changes
  if (window.i18n) {
    i18n.onChange((lang) => {
      if (router.currentProjectId) {
        loadProjectGallery(router.currentProjectId);
      }
    });
  }
});
