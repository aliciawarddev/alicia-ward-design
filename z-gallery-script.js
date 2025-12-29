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
        url: `https://lh3.googleusercontent.com/d/${file.id}`  // changed: use lh3 thumbnail URL
    };
}

// ===================================
// GALLERY RENDERING
// ===================================

function renderGallery(images) {
    gallery.innerHTML = '';
    
    if (images.length === 0) {
        gallery.innerHTML = '<p class="loading">No images found in the gallery.</p>';
        return;
    }
    
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.format = image.format;
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy'; // Native lazy loading
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}

function filterGallery(format) {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        if (format === 'all' || item.dataset.format === format) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// ===================================
// EVENT LISTENERS
// ===================================

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Apply filter
        const filter = button.dataset.filter;
        filterGallery(filter);
    });
});

// ===================================
// INITIALIZATION
// ===================================

async function init() {
    // Check if API key is configured
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