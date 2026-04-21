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
    <section id="shop-section">
      <div class="container">
        <div class="section-header">
          <h2 data-i18n="shop.title">Shop</h2>
          <p data-i18n="shop.subtitle"></p>
        </div>
        <div class="shop-grid" id="shop-products"></div>
      </div>
    </section>
  `;

  i18n.updateDOMTranslations();
  loadShopProducts();
}

// Blog Page
function renderBlog() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section id="blog-section">
      <div class="container">
        <div class="section-header">
          <h2 data-i18n="blog.title">Blog</h2>
          <p data-i18n="blog.subtitle"></p>
        </div>
        <div class="blog-grid" id="blog-posts"></div>
      </div>
    </section>
  `;

  i18n.updateDOMTranslations();
  loadBlogPosts();
}

// About Page
function renderAboutPage() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <section id="about-section">
      <div class="container about-content">
        <div class="section-header">
          <h2 data-i18n="about.title">About</h2>
        </div>
        <div class="about-grid">
          <div class="about-text">
            <p data-i18n="about.bio"></p>
            <h3 data-i18n="about.equipment"></h3>
            <p data-i18n="about.equipmentList"></p>
            <h3 data-i18n="about.editing"></h3>
            <p data-i18n="about.editingList"></p>
          </div>
          <div class="about-image">
            <img src="https://res.cloudinary.com/drvo7bgzt/image/upload/v1775158124/background_qpb7gg.jpg" alt="About">
          </div>
        </div>
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
    <section id="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 data-i18n="contact.title">Contact</h2>
          <p data-i18n="contact.description"></p>
        </div>
        <div class="contact-content">
          <form class="newsletter-form" id="contact-form">
            <div class="form-group">
              <label for="contact-name" data-i18n="contact.name">Name</label>
              <input type="text" id="contact-name" name="name" required>
            </div>
            <div class="form-group">
              <label for="contact-email" data-i18n="contact.email">Email</label>
              <input type="email" id="contact-email" name="email" required>
            </div>
            <div class="form-group">
              <label for="contact-subject" data-i18n="contact.subject">Subject</label>
              <input type="text" id="contact-subject" name="subject" required>
            </div>
            <div class="form-group">
              <label for="contact-message" data-i18n="contact.message">Message</label>
              <textarea id="contact-message" name="message" rows="6" required></textarea>
            </div>
            <button type="submit" class="submit-btn" data-i18n="contact.send">Send</button>
          </form>
        </div>
        <div class="social-links" id="social-links"></div>
      </div>
    </section>
  `;

  i18n.updateDOMTranslations();
  loadSocialLinks();
  setupContactForm();
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
    const container = document.getElementById('social-links');
    if (!container || !config.social.instagram) return;

    const links = config.social.instagram.map(account => `
      <a href="${account.url}" class="contact-item" target="_blank" rel="noopener" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/><circle cx="17" cy="7" r="1" fill="white"/></svg>
        ${account.username}
      </a>
    `).join('');

    container.innerHTML = links;
  } catch (error) {
    console.error('Error loading social links:', error);
  }
}

async function loadBlogPosts() {
  try {
    const data = await fetch('data/blog.json').then(r => r.json());
    const container = document.getElementById('blog-posts');
    if (!container) return;

    container.innerHTML = '';

    data.posts.forEach(post => {
      const date = new Date(post.date).toLocaleDateString(i18n.getLanguage() === 'ro' ? 'ro-RO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const item = document.createElement('div');
      item.className = 'blog-card';
      item.innerHTML = `
        <div class="blog-image">
          <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-content">
          <div class="blog-date">${date}</div>
          <h3>${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="#blog/${post.slug}" class="read-more" data-i18n="blog.readMore">Read More</a>
        </div>
      `;
      
      container.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

async function loadShopProducts() {
  try {
    const data = await fetch('data/products.json').then(r => r.json());
    const container = document.getElementById('shop-products');
    if (!container) return;

    container.innerHTML = '';

    data.products.forEach(product => {
      const priceDisplay = product.inStock ? `${product.price} ${product.currency}` : i18n.t('shop.outOfStock');
      
      const item = document.createElement('div');
      item.className = 'product-card';
      item.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${priceDisplay}</div>
        <button class="add-to-cart" ${product.inStock ? '' : 'disabled'} data-i18n="shop.addToCart">Add to Cart</button>
      `;
      
      container.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading shop products:', error);
  }
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('contact-name').value,
      email: document.getElementById('contact-email').value,
      subject: document.getElementById('contact-subject').value,
      message: document.getElementById('contact-message').value
    };

    // Simulate form submission (in production, send to backend)
    console.log('Form submitted:', formData);
    
    // Show success message
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent! Thank you.';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
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
