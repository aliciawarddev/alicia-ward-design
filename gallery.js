document.getElementById('size-filter').addEventListener('change', function() {
    const selectedSize = this.value;
    const articles = document.querySelectorAll('#gallery-grid article');

    articles.forEach(article => {
        if (selectedSize === 'all' || article.dataset.size === selectedSize) {
            article.style.display = 'block';
        } else {
            article.style.display ='none';
        }
    });
});