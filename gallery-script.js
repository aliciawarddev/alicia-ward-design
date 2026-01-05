// ===================================
// CONFIGURATION
// ===================================

const CONFIG = {
    API_KEY: 'AIzaSyA2393l0wXeQsb4zeo129uynW3TMnH0ZAA',
    FOLDER_ID: '1alCqX_5PHK1Go3ZSQknL-yR-TxwVXOF2'
};

// ===================================
// DOM ELEMENTS
// ===================================

const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

// Store all images for filtering
let allImages = [];

// ===================================
// GOOGLE DRIVE API
// ===================================

async function fetchImagesFromDrive() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${CONFIG.FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${CONFIG.API_KEY}&fields=files(id,name,mimeType)`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.files || [];
        
    } catch (err) {
        console.error('Error fetching from Drive:', err);
        throw err;
    }
}

// ===================================
// IMAGE PROCESSING
// ===================================

function parseImageData(file) {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const parts = nameWithoutExt.split('_');
    
    let format = 'square';
    let title = nameWithoutExt;
    
    if (parts.length >= 2) {
        const prefix = parts[0].toLowerCase();
        if (['square', 'landscape', 'portrait'].includes(prefix)) {
            format = prefix;
            title = parts.slice(1).join('_').replace(/-/g, ' ');
        }
    }
    
    return {
        id: file.id,
        name: file.name,
        format: format,
        title: title,
        url: `https://lh3.googleusercontent.com/d/${file.id}=w300-h300`,
        urlFull: `https://lh3.googleusercontent.com/d/${file.id}`
    };
}

// ===================================
// GALLERY RENDERING
// ===================================

function createGalleryItem(image) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.format = image.format;
    
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.title;
    img.loading = 'lazy';
    
    img.addEventListener('click', () => openLightbox(image.urlFull, image.title));
    
    item.appendChild(img);
    return item;
}

function renderGallery(images, filter = 'all') {
    gallery.innerHTML = '';
    
    if (images.length === 0) {
        gallery.innerHTML = '<p class="loading">No images found in the gallery.</p>';
        return;
    }
    
    if (filter === 'all') {
        const formats = ['square', 'landscape', 'portrait'];
        const formatLabels = { square: 'Square', landscape: 'Landscape', portrait: 'Portrait' };
        
        formats.forEach(format => {
            const formatImages = images.filter(img => img.format === format);
            if (formatImages.length === 0) return;
            
            const section = document.createElement('section');
            section.className = 'gallery-section';
            section.dataset.format = format;
            
            const heading = document.createElement('h2');
            heading.className = 'gallery-section-heading';
            heading.textContent = formatLabels[format];
            section.appendChild(heading);
            
            const grid = document.createElement('div');
            grid.className = 'gallery-grid';
            grid.dataset.format = format;
            
            formatImages.forEach(image => {
                grid.appendChild(createGalleryItem(image));
            });
            
            section.appendChild(grid);
            gallery.appendChild(section);
        });
    } else {
        const grid = document.createElement('div');
        grid.className = 'gallery-grid';
        grid.dataset.format = filter;
        
        images.forEach(image => {
            grid.appendChild(createGalleryItem(image));
        });
        
        gallery.appendChild(grid);
    }
}

function filterGallery(format) {
    const visibleImages = format === 'all' 
        ? allImages 
        : allImages.filter(img => img.format === format);
    renderGallery(visibleImages, format);
}

// ===================================
// LIGHTBOX
// ===================================

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ===================================
// EVENT LISTENERS
// ===================================

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        filterGallery(filter);
    });
});

// ===================================
// INITIALIZATION
// ===================================

async function init() {
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE' || CONFIG.FOLDER_ID === 'YOUR_FOLDER_ID_HERE') {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.innerHTML = `
            <p><strong>Setup required:</strong></p>
            <p>1. Create a Google Cloud project and enable the Drive API</p>
            <p>2. Create an API key</p>
            <p>3. Create a public folder in Google Drive</p>
            <p>4. Update CONFIG in gallery-script.js with your API key and folder ID</p>
        `;
        return;
    }
    
    try {
        const files = await fetchImagesFromDrive();
        allImages = files.map(parseImageData);
        
        loading.style.display = 'none';
        renderGallery(allImages);
        
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = 'Failed to load gallery. Check console for details.';
    }
}

// Start the app
init();