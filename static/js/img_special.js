// ============================================================
// STATE CHO PHẦN ĐẶC BIỆT (Phân trang, Pinch-to-Zoom & Kéo sát mép)
// ============================================================
let currentAlbum = null;
let currentLimit = 12; // Số lượng ảnh hiển thị ban đầu mỗi khi mở album
const stepLimit = 12;  // Số lượng ảnh hiện thêm mỗi khi bấm nút "Xem thêm"
let lbIdx = 0;

// Trạng thái phục vụ Zoom & Kéo đa điểm
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0, startY = 0;
let initialDistance = 0;
let initialScale = 1;

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
// LIGHTBOX (Xem ảnh lớn, Zoom 2 ngón tay & Kéo sát mép)
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
    resetZoomState();

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
    resetZoomState();
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    
    const albumPage = document.getElementById('album-page');
    if (albumPage) albumPage.style.overflow = 'auto';
    
    lbOpen = false;
}

function lbNav(d) {
    resetZoomState();
    if (!currentAlbum) return;
    const next = lbIdx + d;
    if (next < 0 || next >= currentAlbum.media.length) return;
    const track = document.getElementById('lb-track');
    if (!track) return;
    const slideW = track.offsetWidth + 24;
    track.scrollTo({ left: next * slideW, behavior: 'smooth' });
}

// ============================================================
// HỆ THỐNG XỬ LÝ ZOOM ĐA ĐIỂM (PINCH-TO-ZOOM) & PAN CHUẨN XÁC
// ============================================================
function getDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

function updateTransform(img) {
    // Giới hạn scale từ 1x đến 4x
    scale = Math.max(1, Math.min(scale, 4));

    if (scale === 1) {
        translateX = 0;
        translateY = 0;
        img.classList.remove('zoomed');
        const track = document.getElementById('lb-track');
        if (track) track.style.overflowX = 'scroll';
    } else {
        img.classList.add('zoomed');
        const track = document.getElementById('lb-track');
        if (track) track.style.overflowX = 'hidden';

        // Tự động tính biên độ dựa trên kích thước thực để mép ảnh chạm khít mép màn hình
        const maxX = (img.clientWidth * (scale - 1)) / 2;
        const maxY = (img.clientHeight * (scale - 1)) / 2;
        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }

    requestAnimationFrame(() => {
        img.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px) scale(${scale})`;
    });
}

// --- Xử lý sự kiện chuột (Desktop) ---
document.addEventListener('mousedown', e => {
    const img = document.querySelector('#lb-track .lb-slide img');
    if (img && e.target === img && scale > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const img = document.querySelector('#lb-track .lb-slide img.zoomed');
    if (!img) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform(img);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Double click để phóng to/thu nhỏ nhanh trên máy tính
document.addEventListener('dblclick', e => {
    const img = document.querySelector('#lb-track .lb-slide img');
    if (img && e.target === img) {
        if (scale === 1) {
            scale = 2.5;
            translateX = 0;
            translateY = 0;
        } else {
            scale = 1;
            translateX = 0;
            translateY = 0;
        }
        updateTransform(img);
    }
});

// --- Xử lý sự kiện cảm ứng đa điểm (Mobile Pinch-to-Zoom & Drag) ---
document.addEventListener('touchstart', e => {
    const img = document.querySelector('#lb-track .lb-slide img');
    if (!img || e.target !== img) return;

    if (e.touches.length === 2) {
        // Bắt đầu chụm 2 ngón tay để zoom
        isDragging = false;
        initialDistance = getDistance(e.touches);
        initialScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
        // Kéo di chuyển ảnh khi đang zoom
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
});

document.addEventListener('touchmove', e => {
    const img = document.querySelector('#lb-track .lb-slide img');
    if (!img || e.target !== img) return;

    if (e.touches.length === 2) {
        // Đang dùng 2 ngón tay phóng to/thu nhỏ
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        if (initialDistance > 0) {
            scale = initialScale * (currentDistance / initialDistance);
            updateTransform(img);
        }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
        // Đang kéo di chuyển 1 ngón tay khi đã zoom
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform(img);
    }
}, { passive: false });

document.addEventListener('touchend', e => {
    if (e.touches.length < 2) {
        initialDistance = 0;
    }
    if (e.touches.length === 0) {
        isDragging = false;
    }
});

function resetZoomState() {
    const imgs = document.querySelectorAll('#lb-track .lb-slide img');
    imgs.forEach(img => {
        img.classList.remove('zoomed');
        img.style.transform = '';
    });
    scale = 1;
    translateX = 0;
    translateY = 0;
    isDragging = false;
    const track = document.getElementById('lb-track');
    if (track) track.style.overflowX = 'scroll';
}

document.getElementById('lightbox')?.addEventListener('click', function (e) {
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