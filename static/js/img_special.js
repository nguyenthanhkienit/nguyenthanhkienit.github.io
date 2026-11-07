// ============================================================
// STATE CHO PHẦN ĐẶC BIỆT (Phân trang, Zoom & Giới hạn vùng kéo ảnh)
// ============================================================
let currentAlbum = null;
let currentLimit = 12; // Số lượng ảnh hiển thị ban đầu mỗi khi mở album
const stepLimit = 12;  // Số lượng ảnh hiện thêm mỗi khi bấm nút "Xem thêm"
let lbIdx = 0;

// Trạng thái phục vụ tính năng kéo ảnh
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;
let downX = 0, downY = 0;

// ============================================================
// TRANG CHỦ ALBUM
// ============================================================
function renderAlbums() {
    const g = document.getElementById('album-grid');
    if (!g) return;
    g.innerHTML = ALBUMS.map(a => {
        const imgs = a.media.filter(m => m.type === 'img').slice(0, 4);
        const imgsCount = a.media.filter(m => m.type === 'img').length;
        const vidCount = a.media.filter(m => m.type === 'video').length;
        let thumb = '';
        if (imgs.length >= 4) {
            thumb = `<div class="album-thumb-grid">${imgs.map(i => `<img src="${i.src}" loading="lazy" alt="">`).join('')}</div>`;
        } else {
            const first = a.media[0];
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
// MỞ ALBUM (Reset về giới hạn ban đầu)
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

// ============================================================
// RENDER MEDIA THEO TỪNG PHẦN (CÓ NÚT XEM THÊM)
// ============================================================
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
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// ============================================================
// LIGHTBOX (Xem ảnh lớn, Zoom & Giới hạn biên độ kéo)
// ============================================================
let lbOpen = false;
let lbScrolling = false;

function mediaEl(m) {
    if (m.type === 'video') {
        return `<video src="${m.src}" poster="${m.poster}" controls style="max-width:100%;max-height:100%;border-radius:5px"></video>`;
    }
    return `<img src="${m.src}" alt="">`;
}

function renderLb() {
    const track = document.getElementById('lb-track');
    if (!track || !currentAlbum) return;
    track.innerHTML = currentAlbum.media.map((m, i) =>
        `<div class="lb-slide" data-idx="${i}">${mediaEl(m)}</div>`
    ).join('');

    const slideW = track.offsetWidth + 24;
    track.scrollLeft = lbIdx * slideW;

    updateHint();
    watchScroll();
}

function updateHint() {
    const hintEl = document.getElementById('lb-hint');
    if (hintEl && currentAlbum) {
        hintEl.textContent = `${lbIdx + 1} / ${currentAlbum.media.length}`;
    }
}

function watchScroll() {
    const track = document.getElementById('lb-track');
    if (!track) return;
    track.onscroll = () => {
        if (lbScrolling) return;
        lbScrolling = true;
        const check = () => {
            const slideW = track.offsetWidth + 24;
            const newIdx = Math.round(track.scrollLeft / slideW);
            if (currentAlbum && newIdx !== lbIdx && newIdx >= 0 && newIdx < currentAlbum.media.length) {
                lbIdx = newIdx;
                updateHint();
            }
            if (Math.abs(track.scrollLeft - lbIdx * slideW) < 2) {
                lbScrolling = false;
            } else {
                requestAnimationFrame(check);
            }
        };
        requestAnimationFrame(check);
    };
}

function openLb(idx) {
    lbIdx = idx;
    lbOpen = true;

    const track = document.getElementById('lb-track');
    if (track) track.style.visibility = 'hidden';

    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.add('open');
    
    const albumPage = document.getElementById('album-page');
    if (albumPage) albumPage.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            renderLb();
            if (track) track.style.visibility = '';
        });
    });
}

function closeLb() {
    resetZoom(); 
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    
    const albumPage = document.getElementById('album-page');
    if (albumPage) albumPage.style.overflow = 'auto';
    
    lbOpen = false;
}

function lbNav(d) {
    resetZoom(); 
    if (!currentAlbum) return;
    const next = lbIdx + d;
    if (next < 0 || next >= currentAlbum.media.length) return;
    const track = document.getElementById('lb-track');
    if (!track) return;
    const slideW = track.offsetWidth + 24;
    track.scrollTo({ left: next * slideW, behavior: 'smooth' });
}

// ============================================================
// XỬ LÝ KÉO CÓ GIỚI HẠN BIÊN (CHỈ CHO PHÉP LƯỚT VỪA PHẢI)
// ============================================================
document.addEventListener('mousedown', e => {
    downX = e.clientX;
    downY = e.clientY;
    
    const img = document.querySelector('#lb-track .lb-slide img.zoomed');
    if (img && e.target === img) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const sensitivity = 0.6;
    const dx = (e.clientX - startX) * sensitivity;
    const dy = (e.clientY - startY) * sensitivity;
    
    translateX += dx;
    translateY += dy;
    
    // GIỚI HẠN BIÊN (CLAMP): Chỉ cho phép lướt lệch tối đa khoảng 150px - 200px (tương đương ~1/2 hình)
    const maxLimitX = 180;
    const maxLimitY = 180;
    translateX = Math.max(-maxLimitX, Math.min(maxLimitX, translateX));
    translateY = Math.max(-maxLimitY, Math.min(maxLimitY, translateY));
    
    startX = e.clientX;
    startY = e.clientY;
    
    const img = document.querySelector('#lb-track .lb-slide img.zoomed');
    if (img) {
        requestAnimationFrame(() => {
            img.style.transform = `scale(2.5) translate3d(${translateX}px, ${translateY}px, 0px)`;
        });
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Click để phóng to hoặc thu nhỏ lại
document.addEventListener('click', function(e) {
    if (e.target.matches('#lb-track .lb-slide img')) {
        if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) return;
        
        const track = document.getElementById('lb-track');
        if (!track) return;

        if (e.target.classList.contains('zoomed')) {
            resetZoom();
        } else {
            e.target.classList.add('zoomed');
            track.style.overflowX = 'hidden'; 
        }
    }
});

// Hỗ trợ cảm ứng vuốt trên điện thoại
document.addEventListener('touchstart', function(e) {
    downX = e.touches[0].clientX;
    downY = e.touches[0].clientY;

    const img = document.querySelector('#lb-track .lb-slide img.zoomed');
    if (img && e.target === img && e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function(e) {
    if (!isDragging || e.touches.length !== 1) return;
    
    const sensitivity = 0.7;
    const dx = (e.touches[0].clientX - startX) * sensitivity;
    const dy = (e.touches[0].clientY - startY) * sensitivity;
    
    translateX += dx;
    translateY += dy;
    
    // Giới hạn biên trên mobile
    const maxLimitX = 180;
    const maxLimitY = 180;
    translateX = Math.max(-maxLimitX, Math.min(maxLimitX, translateX));
    translateY = Math.max(-maxLimitY, Math.min(maxLimitY, translateY));
    
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    
    const img = document.querySelector('#lb-track .lb-slide img.zoomed');
    if (img) {
        requestAnimationFrame(() => {
            img.style.transform = `scale(2.5) translate3d(${translateX}px, ${translateY}px, 0px)`;
        });
    }
});

document.addEventListener('touchend', function() {
    isDragging = false;
});

function resetZoom() {
    const zoomedImgs = document.querySelectorAll('#lb-track .lb-slide img.zoomed');
    zoomedImgs.forEach(img => {
        img.classList.remove('zoomed');
        img.style.transform = '';
    });
    translateX = 0;
    translateY = 0;
    isDragging = false;
    const track = document.getElementById('lb-track');
    if (track) track.style.overflowX = 'scroll';
}

document.getElementById('lightbox')?.addEventListener('click', function (e) {
    if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) return;
    if (e.target === this || e.target.classList.contains('lb-slide')) { 
        closeLb(); 
    }
});

document.addEventListener('keydown', e => {
    if (!lbOpen) return;
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'Escape') closeLb();
});

// Khởi chạy khi tải trang
renderAlbums();