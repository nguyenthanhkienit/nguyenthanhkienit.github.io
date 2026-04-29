let currentIndex = 0;
const tripsPerLoad = 3;

const tripsGrid = document.getElementById('trips-grid');
const tripsLoadMoreBtn = document.getElementById('trips-load-more-btn');

// ====================== RESET SCROLL MẠNH (Fix lỗi scroll cũ) ======================
function resetScrollStrong() {
    const container = document.getElementById('trip-gallery-container');
    if (!container) return;

    container.scrollTop = 0;
    setTimeout(() => container.scrollTop = 0, 10);
    setTimeout(() => container.scrollTo({ top: 0, behavior: 'instant' }), 50);
    setTimeout(() => container.scrollTop = 0, 100);
}

// ====================== TẠO CARD ======================
function createTripCard(trip, isNew = false) {
    const card = document.createElement('div');
    card.className = 'trip-card';
    card.setAttribute('data-trip', trip.id);

    card.innerHTML = `
        <img src="${trip.cover}" alt="${trip.title}">
        <h2>${trip.title}</h2>
        <p>${trip.date}</p>
    `;

    // Chỉ thêm hiệu ứng wow cho card mới khi bấm "Xem thêm"
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

    // Trigger animation chỉ cho card mới
    setTimeout(() => {
        newCards.forEach(card => {
            card.style.opacity = '1';
            card.classList.add('animated');
        });
    }, 10);
}

// ====================== MỞ MODAL (ĐÃ FIX SCROLL) ======================
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
        // Reset scroll về đầu mỗi khi mở modal
        resetScrollStrong();
        
        // Reset thêm lần nữa sau khi modal hiện
        setTimeout(resetScrollStrong, 150);
    }
}

// ====================== KHỞI TẠO TRIPS ======================
function initTrips() {
    if (!tripsGrid || !allTrips) return;

    tripsGrid.innerHTML = '';

    // Load 3 card đầu tiên (không hiệu ứng)
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
    initGallery();     // Gallery KH
    initTrips();       // Trips
});