let currentIndex = 0;
    const tripsPerLoad = 3;

    const tripsGrid = document.getElementById('trips-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const tripModal = document.getElementById('trip-modal');
    const tripModalTitle = document.getElementById('trip-modal-title');
    const tripGalleryContainer = document.getElementById('trip-gallery-container');
    const tripMasonryGallery = document.getElementById('trip-masonry-gallery');
    const closeBtnTrip = document.querySelector('.close-btn-trip');

    // ====================== RESET SCROLL MẠNH ======================
    function resetScrollStrong() {
        if (!tripGalleryContainer) return;
        
        tripGalleryContainer.scrollTop = 0;
        
        // Reset nhiều lần để chắc chắn
        setTimeout(() => tripGalleryContainer.scrollTop = 0, 10);
        setTimeout(() => tripGalleryContainer.scrollTo({ top: 0, behavior: 'instant' }), 30);
        setTimeout(() => tripGalleryContainer.scrollTop = 0, 100);
    }

    // ====================== MỞ GALLERY ======================
    function openTripGallery(trip) {
        tripModalTitle.textContent = trip.title;
        tripMasonryGallery.innerHTML = '';

        // Thêm ảnh
        trip.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = trip.title;
            img.loading = "lazy";
            tripMasonryGallery.appendChild(img);
        });

        // Reset scroll trước khi hiện modal
        resetScrollStrong();

        tripModal.style.display = 'flex';
    }

    // ====================== TẠO CARD ======================
    function createTripCard(trip) {
        const card = document.createElement('div');
        card.className = 'trip-card';
        card.setAttribute('data-trip', trip.id);

        card.innerHTML = `
            <img src="${trip.cover}" alt="${trip.title}">
            <h2>${trip.title}</h2>
            <p>${trip.date}</p>
        `;

        card.addEventListener('click', () => openTripGallery(trip));
        return card;
    }

    // ====================== LOAD MORE ======================
    function loadMoreTrips() {
        const endIndex = Math.min(currentIndex + tripsPerLoad, allTrips.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
            const card = createTripCard(allTrips[i]);
            tripsGrid.appendChild(card);
        }

        currentIndex = endIndex;

        if (currentIndex >= allTrips.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // ====================== KHỞI TẠO TRIPS ======================
function initTrips() {
    const tripsLoadMoreBtn = document.getElementById('trips-load-more-btn');

    loadMoreTrips();   // Load lần đầu

    if (tripsLoadMoreBtn) {
        tripsLoadMoreBtn.addEventListener('click', loadMoreTrips);
    }

    // Nút đóng modal
    if (closeBtnTrip) {
        closeBtnTrip.addEventListener('click', () => {
            tripModal.style.display = 'none';
        });
    }

    if (tripModal) {
        tripModal.addEventListener('click', (e) => {
            if (e.target === tripModal) {
                tripModal.style.display = 'none';
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initGallery();   // Gallery KH
    initTrips();     // Phần Trips
});