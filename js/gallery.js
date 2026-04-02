/**
 * Gallery-specific functionality
 * Handles gallery item interactions and lightbox
 */

let currentGalleryImages = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
  setupImageLazyLoading();
});

/**
 * Initialize gallery functionality - now handles dynamically created items
 */
function initializeGallery() {
  // Use event delegation for dynamically created items
  document.addEventListener('click', function(e) {
    const galleryItem = e.target.closest('.gallery-item');
    if (!galleryItem) return;
    
    handleGalleryItemClick(galleryItem);
  });

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const galleryItem = e.target.closest('.gallery-item');
      if (galleryItem) {
        e.preventDefault();
        handleGalleryItemClick(galleryItem);
      }
    }
  });
}

/**
 * Handle gallery item clicks
 */
function handleGalleryItemClick(item) {
  const img = item.querySelector('img');
  if (!img) return;

  // Check if we're on home page or portfolio listing
  const hash = window.location.hash.slice(1) || 'home';
  const route = hash.split('/')[0];
  const isHomePage = route === 'home' || (route === 'portfolio' && !hash.split('/')[1]);

  if (isHomePage) {
    // Navigate to portfolio view
    const projectId = img.alt || img.dataset.category || '';
    if (projectId) {
      window.location.hash = `#portfolio/${projectId}`;
    }
    return;
  }

  // On gallery detail pages, open lightbox
  currentGalleryImages = Array.from(document.querySelectorAll('#project-gallery .gallery-item img'));
  currentImageIndex = currentGalleryImages.indexOf(img);
  if (window.openLightbox && currentImageIndex >= 0) {
    window.openLightbox(currentImageIndex);
  }
}

/**
 * Lazy loading for gallery images with performance optimizations
 */
function setupImageLazyLoading() {
  const images = document.querySelectorAll('.gallery-item img');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px', // Preload images 50px before entering viewport
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => loadImage(img));
  }
}

/**
 * Load image with error handling and Cloudinary optimization
 */
function loadImage(img) {
  let src = img.src || img.dataset.src;
  if (!src) return;

  // Already loaded
  if (img.classList.contains('loaded')) return;

  // Optimize Cloudinary images
  if (src.includes('res.cloudinary.com')) {
    // Add Cloudinary optimization parameters
    src = src.includes('?') ? src + '&' : src + '?';
    src += 'q=auto&f=auto&w=600'; // Auto quality, auto format, max 600px width
  }

  img.classList.add('loading');
  
  const newImg = new Image();
  
  newImg.onload = function() {
    img.src = newImg.src;
    img.classList.remove('loading');
    img.classList.add('loaded');
  };
  
  newImg.onerror = function() {
    img.classList.remove('loading');
    img.classList.add('error');
    // Fallback to placeholder
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="%23999" font-size="16">Image not found</text></svg>';
  };
  
  // Start loading
  newImg.src = src;
}

// Lightbox functionality
function setupLightbox() {
    // Get or create lightbox HTML
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        const lightboxDiv = document.createElement('div');
        lightboxDiv.id = 'lightbox';
        lightboxDiv.className = 'lightbox';
        lightboxDiv.style.display = 'none';
        lightboxDiv.innerHTML = `
            <span class="lightbox-arrow lightbox-arrow-left" id="lightbox-arrow-left">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <polyline points="20,8 12,16 20,24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <img class="lightbox-content" id="lightbox-img" src="" alt="">
            <span class="lightbox-arrow lightbox-arrow-right" id="lightbox-arrow-right">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <polyline points="12,8 20,16 12,24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="lightbox-close" id="lightbox-close">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <line x1="7" y1="7" x2="21" y2="21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="21" y1="7" x2="7" y2="21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </span>
        `;
        document.body.appendChild(lightboxDiv);
        lightbox = lightboxDiv;

        // Attach event listeners only once after creation
        document.getElementById('lightbox-arrow-left').onclick = function(e) {
            e.stopPropagation();
            showLightboxImage(currentImageIndex - 1);
        };
        document.getElementById('lightbox-arrow-right').onclick = function(e) {
            e.stopPropagation();
            showLightboxImage(currentImageIndex + 1);
        };
        document.getElementById('lightbox-close').onclick = function() {
            closeLightbox();
        };
        document.getElementById('lightbox').onclick = function(e) {
            if (e.target === this) closeLightbox();
        };
    }

    // Define and expose openLightbox function to window
    window.openLightbox = function(index) {
        const lightboxImg = document.getElementById('lightbox-img');
        const img = currentGalleryImages[index];
        if (img) {
            currentImageIndex = index;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    // Keyboard navigation (attach only once)
    if (!window._lightboxKeyboardListener) {
        window._lightboxKeyboardListener = true;
        document.addEventListener('keydown', function(e) {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox || lightbox.style.display !== 'flex') return;
            if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // Prevent right-click on the lightbox image
    if (!window._lightboxContextListener) {
        window._lightboxContextListener = true;
        document.body.addEventListener('contextmenu', function(e) {
            if (e.target.classList.contains('lightbox-content')) {
                e.preventDefault();
            }
        });
    }
}

function showLightboxImage(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!currentGalleryImages.length) return;
    if (index < 0) index = currentGalleryImages.length - 1;
    if (index >= currentGalleryImages.length) index = 0;
    currentImageIndex = index;
    const img = currentGalleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
    document.body.style.overflow = '';
}