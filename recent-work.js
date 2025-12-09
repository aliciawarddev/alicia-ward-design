// recent-work.js

async function loadRecentWork() {
  const container = document.querySelector('.featured-grid');
  container.innerHTML = ''; // clear placeholder images
  
  try {
    const response = await fetch('digital-gallery.html');
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const items = doc.querySelectorAll('.gallery-item');
    
    for (let i = 0; i < 3 && i < items.length; i++) {
      const img = items[i].querySelector('img');
      
      const link = document.createElement('a');
      link.href = 'digital-gallery.html';
      
      const clonedImg = img.cloneNode(true);
      clonedImg.classList.add('thumbnail', 'thumbnail-hover'); // ensure classes carry over
      
      link.appendChild(clonedImg);
      container.appendChild(link);
    }
  } catch (error) {
    console.error('Failed to load recent work:', error);
  }
}

loadRecentWork();