// ============================================================
// STATE CHO PHẦN ĐẶC BIỆT (Zoom nét căng & Kéo mượt không reset)
// ============================================================
let currentAlbum = null;
let currentLimit = 12;
const stepLimit = 12;
let lbIdx = 0;
let lbOpen = false;

// Trạng thái Zoom & Pan
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0, startY = 0;
let pointerHasMoved = false;

// ============================================================
// TRANG CHỦ ALBUM
// ============================================================
function renderAlbums() {
    const g = document.getElementById('album-grid');
    if (!g) return;
    if (typeof ALBUMS === 'undefined' || !ALBUMS.length) return;
    
    g.innerHTML = ALBUMS.map(a => {
        const imgs = a.media.filter(m => m.type === 'img').slice(0, 4);
        const imgsCount = a.media.filter(m => m.type === 'img').length;
        const vidCount = a.media.filter(m => m.type === 'video').length;
        let thumb = '';
        if (imgs.length >= 4) {
            thumb = `<div class="album-thumb-grid">${imgs.map(i => `<img src="${i.src}" loading="lazy" alt="">`).join('')}</div>`;
        } else {
            const first = a.media[0] || { src: '' };
            thumb = `<img class="album-thumb" src="${first.poster || first.src}" loading="lazy" alt="">`;
        }
        return `
      <div class="album-card" onclick="openAlbum(${a.id})">
        ${thumb}
        <div class="album-info">
          <h3>${a.name}</h3>
          <div class="meta">${a.date}</div>
          <div class="meta">
            <i class="ti ti-photo" style="font-size:13px;vertical-align:-1px"></i>
            ${imgsCount} ảnh ${vidCount > 0 ? ' · ' + vidCount + ' video' : ''}
          </div>
        </div>
      </div>`;
    }).join('');
}

// ============================================================
// MỞ ALBUM & PHÂN TRANG
// ============================================================
function openAlbum(id) {
    currentAlbum = ALBUMS.find(a => a.id === id);
    if (!currentAlbum) return;
    currentLimit = 12; 
    document.getElementById('album-title').textContent = currentAlbum.name;
    document.getElementById('album-sub').textContent = currentAlbum.media.length + ' mục';
    
    renderMedia();

    document.getElementById('album-page').scrollTop = 0;
    document.getElementById('album-page').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function showHome() {
    document.getElementById('album-page').classList.remove('open');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        const mediaGrid = document.getElementById('media-grid');
        if (mediaGrid) mediaGrid.innerHTML = '';
        const btn = document.getElementById('special-load-more');
        if (btn) btn.remove();
    }, 400);
}

function renderMedia() {
    const g = document.getElementById('media-grid');
    if (!g || !currentAlbum) return;
    const itemsToDisplay = currentAlbum.media.slice(0, currentLimit);

    g.innerHTML = itemsToDisplay.map((m, i) => {
        if (m.type === 'video') {
            return `
        <div class="media-item" onclick="openLb(${i})">
          <video src="${m.src}" poster="${m.poster}" preload="none"></video>
          <div class="vid-badge"><i class="ti ti-player-play" style="font-size:10px"></i> Video</div>
        </div>`;
        }
        return `
      <div class="media-item" onclick="openLb(${i})">
        <img src="${m.src}" loading="lazy">
      </div>`;
    }).join('');

    let loadMoreBtn = document.getElementById('special-load-more');
    if (currentLimit < currentAlbum.media.length) {
        if (!loadMoreBtn) {
            loadMoreBtn = document.createElement('button');
            loadMoreBtn.id = 'special-load-more';
            loadMoreBtn.className = 'btn btn-primary w-100 my-4';
            loadMoreBtn.style.cssText = 'background: #1d1d1d; color: #EB2F8C; border: none; padding: 12px; font-size: 18px; border-radius: 5px; cursor: pointer; grid-column: 1 / -1;';
            loadMoreBtn.textContent = 'Xem thêm';
            loadMoreBtn.onclick = () => {
                currentLimit += stepLimit;
                renderMedia();
            };
            g.parentNode.appendChild(loadMoreBtn);
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } else {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

// ============================================================
// LIGHTBOX: HIỂN THỊ VÀ ZOOM NÉT CĂNG
// ============================================================
function openLb(idx) {
    lbIdx = idx;
    lbOpen = true;
    resetZoomState();

    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    renderCurrentLbItem();
}

function closeLb() {
    resetZoomState();
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbOpen = false;
}

function lbNav(d) {
    if (!currentAlbum) return;
    const next = lbIdx + d;
    if (next < 0 || next >= currentAlbum.media.length) return;
    lbIdx = next;
    resetZoomState();
    renderCurrentLbItem();
}

function renderCurrentLbItem() {
    const container = document.getElementById('lb-content-wrapper');
    const hintEl = document.getElementById('lb-hint');
    if (!container || !currentAlbum) return;

    const m = currentAlbum.media[lbIdx];
    if (!m) return;

    if (m.type === 'video') {
        container.innerHTML = `<video src="${m.src}" poster="${m.poster}" controls autoplay style="max-width:85vw;max-height:85vh;border-radius:5px"></video>`;
    } else {
        // Thêm thuộc tính srcset hoặc ép trình duyệt nhận diện file ảnh gốc với kích thước tối đa
        container.innerHTML = `<img src="${m.src}" alt="Media Item" style="width: auto; height: auto; max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 5px;">`;
    }

    if (hintEl) {
        hintEl.textContent = `${lbIdx + 1} / ${currentAlbum.media.length}`;
    }
}

function resetZoomState() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    isDragging = false;
    pointerHasMoved = false;
    
    const img = document.querySelector('#lb-content-wrapper img');
    if (img) {
        img.classList.remove('zoomed');
        img.style.transform = '';
        img.style.width = '';
        img.style.height = '';
    }
}

function updateImageTransform(img) {
    if (!img) return;

    if (scale === 1) {
        translateX = 0;
        translateY = 0;
        img.classList.remove('zoomed');
        img.style.transform = '';
    } else {
        img.classList.add('zoomed');
        
        // Tính toán khoảng không gian vượt quá màn hình khi zoom để cho phép kéo tới tận cùng các mép
        const overflowX = Math.max(0, (img.offsetWidth * scale - window.innerWidth) / 2);
        const overflowY = Math.max(0, (img.offsetHeight * scale - window.innerHeight) / 2);
        
        // Cho phép kéo dư ra một chút (thêm 150px) để dễ dàng nhìn thấy phần trên và dưới cùng
        const maxX = overflowX + 150;
        const maxY = overflowY + 150;
        
        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));

        requestAnimationFrame(() => {
            img.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`;
        });
    }
}

// ============================================================
// XỬ LÝ SỰ KIỆN CLICK & KÉO
// ============================================================
document.addEventListener('dblclick', e => {
    if (!lbOpen) return;
    const img = document.querySelector('#lb-content-wrapper img');
    if (img && e.target === img) {
        if (scale === 1) {
            scale = 1.3; // Tỷ lệ zoom vừa phải, nét căng
            translateX = 0;
            translateY = 0;
        } else {
            scale = 1;
            translateX = 0;
            translateY = 0;
        }
        updateImageTransform(img);
    }
});

document.addEventListener('mousedown', e => {
    if (!lbOpen) return;
    const img = document.querySelector('#lb-content-wrapper img');
    if (img && e.target === img && scale > 1) {
        isDragging = true;
        pointerHasMoved = false;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', e => {
    if (!isDragging || !lbOpen) return;
    const img = document.querySelector('#lb-content-wrapper img');
    if (!img) return;

    pointerHasMoved = true;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform(img);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('touchstart', e => {
    if (!lbOpen) return;
    const img = document.querySelector('#lb-content-wrapper img');
    if (img && e.target === img && e.touches.length === 1 && scale > 1) {
        isDragging = true;
        pointerHasMoved = false;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
});

document.addEventListener('touchmove', e => {
    if (!isDragging || !lbOpen || e.touches.length !== 1) return;
    const img = document.querySelector('#lb-content-wrapper img');
    if (!img) return;

    pointerHasMoved = true;
    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    updateImageTransform(img);
}, { passive: true });

document.addEventListener('touchend', () => {
    isDragging = false;
});

document.addEventListener('keydown', e => {
    if (!lbOpen) return;
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'Escape') closeLb();
});

// Khởi chạy
renderAlbums();