// ===================================
// COLLECTION FILTERING
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

if (filterButtons.length && cards.length) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Show/hide cards
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.collection === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===================================
// MOBILE NAV TOGGLE
// ===================================

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}