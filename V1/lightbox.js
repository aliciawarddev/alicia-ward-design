// Get the lightbox container and its image element
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// Add click behaviour to each gallery thumbnail
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';           // visual hint that images are clickable
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;          // set lightbox image to clicked image
        lightboxImg.alt=img.alt;            // copy alt text for accessibility
        lightbox.classList.add('active');   // show the lightbox
    });
});

// Close lightbox when clicking anywhere on it
lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});