
    let currentIndex = 0;
    const tripsPerLoad = 3;

    const tripsGrid = document.getElementById('trips-grid');
    const tripsLoadMoreBtn = document.getElementById('trips-load-more-btn');

    // ====================== RESET SCROLL MẠNH ======================
    function resetScrollStrong() {
        const container = document.getElementById('trip-gallery-container');
        if (!container) return;

        container.scrollTop = 0;
        setTimeout(() => container.scrollTop = 0, 10);
        setTimeout(() => container.scrollTo({ top: 0, behavior: 'instant' }), 50);
        setTimeout(() => container.scrollTop = 0, 100);
    }

// ====================== TẠO CARD + CHIA 7:3 ======================
function createTripCard(trip, isNew = false) {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.setAttribute('data-trip', trip.id);
    
    const photoCount = trip.images.length;

    card.innerHTML = `
        <div class="trip-card-image-wrapper">
            <img src="${trip.cover}" alt="${trip.title}">
        </div>
        
        <div class="trip-card-content">
            <div class="trip-info">
                <h2>${trip.title}</h2>
                <p>${trip.date}</p>
            </div>
            <div class="trip-photo-count">
                <span>${photoCount}</span>
            </div>
        </div>
    `;

    if (isNew) {
        card.style.opacity = '0';
        card.classList.add('wow', 'fadeInUp');
        card.setAttribute('data-wow-delay', '0.05s');
    }

    card.addEventListener('click', () => openTripGallery(trip));
    return card;
}
    // ====================== LOAD MORE ======================
    function loadMoreTrips() {
        const endIndex = Math.min(currentIndex + tripsPerLoad, allTrips.length);
        const newCards = [];

        for (let i = currentIndex; i < endIndex; i++) {
            const card = createTripCard(allTrips[i], true);
            tripsGrid.appendChild(card);
            newCards.push(card);
        }

        currentIndex = endIndex;

        if (currentIndex >= allTrips.length && tripsLoadMoreBtn) {
            tripsLoadMoreBtn.style.display = 'none';
        }

        setTimeout(() => {
            newCards.forEach(card => {
                card.style.opacity = '1';
                card.classList.add('animated');
            });
        }, 10);
    }

    // ====================== MỞ MODAL ======================
    function openTripGallery(trip) {
        const tripModal = document.getElementById('trip-modal');
        const tripModalTitle = document.getElementById('trip-modal-title');
        const tripMasonryGallery = document.getElementById('trip-masonry-gallery');

        if (tripModalTitle) tripModalTitle.textContent = trip.title;

        if (tripMasonryGallery) {
            tripMasonryGallery.innerHTML = '';
            trip.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = trip.title;
                img.loading = "lazy";
                tripMasonryGallery.appendChild(img);
            });
        }

        if (tripModal) {
            tripModal.style.display = 'flex';
            resetScrollStrong();
            setTimeout(resetScrollStrong, 150);
        }
    }

    // ====================== KHỞI TẠO ======================
    function initTrips() {
        if (!tripsGrid || !allTrips) return;

        tripsGrid.innerHTML = '';

        const initialLoad = Math.min(tripsPerLoad, allTrips.length);
        for (let i = 0; i < initialLoad; i++) {
            const card = createTripCard(allTrips[i], false);
            tripsGrid.appendChild(card);
        }

        currentIndex = initialLoad;

        if (tripsLoadMoreBtn) {
            if (currentIndex >= allTrips.length) {
                tripsLoadMoreBtn.style.display = 'none';
            }
            tripsLoadMoreBtn.addEventListener('click', loadMoreTrips);
        }

        // Modal events
        const tripModal = document.getElementById('trip-modal');
        const closeBtnTrip = document.querySelector('.close-btn-trip');

        if (closeBtnTrip && tripModal) {
            closeBtnTrip.addEventListener('click', () => tripModal.style.display = 'none');
            tripModal.addEventListener('click', (e) => {
                if (e.target === tripModal) tripModal.style.display = 'none';
            });
        }
    }

    // ====================== KHỞI TẠO TOÀN BỘ ======================
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOMContentLoaded chạy...");
        initGallery();     // Gallery KH cũ của bạn
        initTrips();       // Trips
    });
