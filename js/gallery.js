// Gallery-specific functionality

let currentGalleryImages = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupImageLazyLoading();
    setupLightbox();
});

// Initialize gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Add click handler for each gallery item
        item.addEventListener('click', function() {
            handleGalleryItemClick(this, index);
        });

        // Add keyboard support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGalleryItemClick(this, index);
            }
        });

        // Make items focusable for accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View ${item.querySelector('h3').textContent} gallery`);
    });
}

// Handle gallery item clicks
function handleGalleryItemClick(item, index) {
    const img = item.querySelector('img');
    if (!img) return;
    const category = img.dataset.category;

    // If on homepage, redirect
    if (
        window.location.pathname.endsWith('/index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/Website/')
    ) {
        if (category) {
            window.location.href = `pages/gallery-${category}.html`;
        }
        return;
    }

    // On gallery pages, open lightbox with arrows
    currentGalleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    currentImageIndex = currentGalleryImages.indexOf(img);
    showLightboxImage(currentImageIndex);
}

// Lazy loading for gallery images
function setupImageLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img');
    
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => loadImage(img));
    }
}

// Load image function
function loadImage(img) {
    // Add loading class for smooth transition
    img.classList.add('loading');
    
    // Create new image to preload
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
    newImg.src = img.src;
}

// Gallery filter functionality (for future use)
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        const itemCategory = item.querySelector('img').dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

// Preload gallery images for better performance
function preloadGalleryImages() {
    const thumbnails = [
        'images/thumbnails/whysovertical.jpg',
        'images/thumbnails/anotimpuri.jpg',
        'images/thumbnails/aripi.jpg',
        'images/thumbnails/montan.jpg',
        'images/thumbnails/street.jpg',
        'images/thumbnails/tricolor.jpg'
    ];
    
    thumbnails.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading after a short delay
setTimeout(preloadGalleryImages, 1000);

// Lightbox functionality
function setupLightbox() {
    // Create lightbox HTML if it doesn't exist
    if (!document.getElementById('lightbox')) {
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