// ============================================================
        // DỮ LIỆU ALBUM — thay src bằng ảnh/video thực của bạn
        // ============================================================
        

        // ============================================================
        // STATE
        // ============================================================
        let currentAlbum = null;
        let lbIdx = 0;

        // ============================================================
        // TRANG CHỦ
        // ============================================================
        function renderAlbums() {
            const g = document.getElementById('album-grid');
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
        // TRANG ALBUM
        // ============================================================
        function openAlbum(id) {
            currentAlbum = ALBUMS.find(a => a.id === id);
            document.getElementById('album-title').textContent = currentAlbum.name;
            document.getElementById('album-sub').textContent = currentAlbum.media.length + ' mục';
            renderMedia();

            document.getElementById('album-page').scrollTop = 0;
            document.getElementById('album-page').classList.add('open');

            // Khóa scroll trang ngoài
            document.body.style.overflow = 'hidden';
        }

        function showHome() {
            document.getElementById('album-page').classList.remove('open');

            // Mở lại scroll trang ngoài
            document.body.style.overflow = '';
        }

        function renderMedia() {
    const g = document.getElementById('media-grid');
    const loadingEl = document.getElementById('media-grid-loading');

    g.classList.add('loading-state');
    loadingEl.classList.add('active');

    g.innerHTML = currentAlbum.media.map((m, i) => {
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

    // Đợi N ảnh đầu load xong rồi mới ẩn loading
    const imgs = g.querySelectorAll('img');
    const eagerCount = Math.min(8, imgs.length); // số ảnh trong viewport ban đầu, chỉnh theo layout của bạn

    if (eagerCount === 0) {
        // Không có ảnh nào (toàn video) -> ẩn loading ngay
        loadingEl.classList.remove('active');
        g.classList.remove('loading-state');
        return;
    }

    let loadedCount = 0;
    function checkDone() {
        loadedCount++;
        if (loadedCount >= eagerCount) {
            loadingEl.classList.remove('active');
            g.classList.remove('loading-state');
        }
    }

    for (let i = 0; i < eagerCount; i++) {
        const img = imgs[i];
        if (img.complete) {
            // Ảnh đã có trong cache -> tính luôn
            checkDone();
        } else {
            img.onload = checkDone;
            img.onerror = checkDone;
        }
    }

    // Lưới an toàn, tránh kẹt loading nếu mạng chậm/lỗi
    setTimeout(() => {
        loadingEl.classList.remove('active');
        g.classList.remove('loading-state');
    }, 8000);
}

        // ============================================================
        // LIGHTBOX
        // ============================================================
        // LIGHTBOX — CSS scroll snap, mượt như browser native
        // ============================================================
        let lbOpen = false;
        let lbScrolling = false; // chống hint update liên tục
        let dragStartX = 0, dragCurX = 0;

        function mediaEl(m) {
            if (m.type === 'video') {
                return `<video src="${m.src}" poster="${m.poster}" controls
      style="max-width:100%;max-height:100%;border-radius:5px"></video>`;
            }
            return `<img src="${m.src}">`;
        }

        function renderLb() {
    const track = document.getElementById('lb-track');
    track.innerHTML = currentAlbum.media.map((m, i) =>
        `<div class="lb-slide" data-idx="${i}">${mediaEl(m)}</div>`
    ).join('');

    const slideW = track.offsetWidth + 24;
    track.scrollLeft = lbIdx * slideW;

    updateHint();
    watchScroll();
    watchCurrentSlideLoading(); // mới thêm
}
// Theo dõi slide hiện tại đã load xong chưa, hiện/ẩn loading tương ứng
function watchCurrentSlideLoading() {
    const loadingEl = document.getElementById('lb-loading');
    const track = document.getElementById('lb-track');

    function checkSlide() {
        const slide = track.querySelector(`.lb-slide[data-idx="${lbIdx}"]`);
        if (!slide) return;

        const media = slide.querySelector('img, video');
        if (!media) {
            loadingEl.classList.remove('active');
            return;
        }

        const isLoaded = media.tagName === 'IMG'
            ? media.complete
            : media.readyState >= 2; // video đã có data để hiển thị frame đầu

        if (isLoaded) {
            loadingEl.classList.remove('active');
        } else {
            loadingEl.classList.add('active');
            media.addEventListener(media.tagName === 'IMG' ? 'load' : 'loadeddata', () => {
                if (slide.dataset.idx == lbIdx) loadingEl.classList.remove('active');
            }, { once: true });
            media.addEventListener('error', () => loadingEl.classList.remove('active'), { once: true });
        }
    }

    checkSlide();
}
        function updateHint() {
            const m = currentAlbum.media[lbIdx];
            document.getElementById('lb-hint').textContent =
                `${lbIdx + 1} / ${currentAlbum.media.length}`;
        }

        function watchScroll() {
    const track = document.getElementById('lb-track');
    track.onscroll = () => {
        if (lbScrolling) return;
        lbScrolling = true;
        const check = () => {
            const slideW = track.offsetWidth + 24;
            const newIdx = Math.round(track.scrollLeft / slideW);
            if (newIdx !== lbIdx && newIdx >= 0 && newIdx < currentAlbum.media.length) {
                lbIdx = newIdx;
                updateHint();
                watchCurrentSlideLoading(); // thêm dòng này
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
            track.style.visibility = 'hidden';

            document.getElementById('lightbox').classList.add('open');

            // Khóa scroll album-page khi xem hình
            document.getElementById('album-page').style.overflow = 'hidden';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    renderLb();
                    track.style.visibility = '';
                });
            });
        }

        function closeLb() {
            document.getElementById('lightbox').classList.remove('open');

            // Mở lại scroll album-page
            document.getElementById('album-page').style.overflow = 'auto';

            lbOpen = false;
        }

        function lbNav(d) {
    const next = lbIdx + d;
    if (next < 0 || next >= currentAlbum.media.length) return;
    lbIdx = next; // cập nhật ngay để loading check đúng slide
    updateHint();
    watchCurrentSlideLoading();
    const track = document.getElementById('lb-track');
    const slideW = track.offsetWidth + 24;
    track.scrollTo({ left: next * slideW, behavior: 'smooth' });
}

        // Click ngoài đóng
        document.getElementById('lightbox').addEventListener('mousedown', e => {
            dragStartX = e.clientX;
        });

        document.getElementById('lightbox').addEventListener('click', function (e) {
            if (Math.abs(e.clientX - dragStartX) > 5) return;

            // Nếu click đúng vào lightbox (vùng đen trên/dưới) thì đóng
            if (e.target === this) { closeLb(); return; }

            // Nếu click vào lb-slide (vùng 2 bên hình) thì đóng
            if (e.target.classList.contains('lb-slide')) { closeLb(); return; }

            // Còn lại (img, video, nút) thì không đóng
        });

        // Phím tắt
        document.addEventListener('keydown', e => {
            if (!lbOpen) return;
            if (e.key === 'ArrowRight') lbNav(1);
            if (e.key === 'ArrowLeft') lbNav(-1);
            if (e.key === 'Escape') closeLb();
        });

        // Khởi động
        renderAlbums();