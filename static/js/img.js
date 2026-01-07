// gallery-control.js

/* ===============================
   1. GOM ẢNH THEO NGÀY
================================ */
const groupedByDate = {};

images.forEach(img => {
  if (!groupedByDate[img.caption]) {
    groupedByDate[img.caption] = [];
  }
  groupedByDate[img.caption].push(img);
});

/* ===============================
   2. ẢNH HIỂN THỊ NGOÀI GALLERY
   (mỗi ngày 1 ảnh)
================================ */
const displayImages = [];
Object.keys(groupedByDate).forEach(date => {
  displayImages.push(groupedByDate[date][0]); // ảnh đại diện
});

/* ===============================
   3. TẤT CẢ ẢNH CHO OVERLAY
================================ */
const overlayImages = Object.values(groupedByDate).flat();

/* ===============================
   4. MAP: NGÀY → INDEX ĐẦU TIÊN
================================ */
const firstIndexOfDate = {};
let runningIndex = 0;

Object.keys(groupedByDate).forEach(date => {
  firstIndexOfDate[date] = runningIndex;
  runningIndex += groupedByDate[date].length;
});

/* ===============================
   5. RENDER GALLERY
================================ */
const galleryRow = document.getElementById("gallery-row");

displayImages.forEach((img, index) => {
  const count = groupedByDate[img.caption].length;

  galleryRow.innerHTML += `
    <div class="col-lg-3 col-sm-6 wow fadeInUp animated">
      <div class="gallery-img-container" data-index="${index}">

        ${count > 1 
          ? `<div class="img-count-badge">${count}</div>` 
          : ``}

        <img src="${img.src}" alt="">
        <div class="gallery-caption">${img.caption}</div>
      </div>
    </div>`;
});

/* ===============================
   6. OVERLAY CONTROL
================================ */
const galleryContainers = document.querySelectorAll('.gallery-img-container');
const overlay = document.getElementById('overlay');
const overlayImage = document.getElementById('overlayImage');
const overlayDate = document.getElementById('overlayDate');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex_img = 0;

function showImage(index, direction = 'none') {
  const imgData = overlayImages[index];

  // preload ảnh trước
  const tempImg = new Image();
  tempImg.src = imgData.src;

  const offset =
    direction === 'left' ? 50 :
    direction === 'right' ? -50 : 0;

  // B1: animate ảnh hiện tại ra ngoài
  overlayImage.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  overlayImage.style.opacity = 0;
  overlayImage.style.transform = `translateX(${offset}px)`;

  tempImg.onload = () => {
    // B2: đổi ảnh khi đã load xong
    overlayImage.src = imgData.src;
    overlayDate.textContent = imgData.caption;

    // reset vị trí để chuẩn bị animate vào
    overlayImage.style.transition = 'none';
    overlayImage.style.transform = `translateX(${-offset}px)`;

    // force reflow để browser nhận trạng thái mới
    overlayImage.offsetHeight;

    // B3: animate ảnh mới vào
    overlayImage.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    overlayImage.style.opacity = 1;
    overlayImage.style.transform = 'translateX(0)';
    preloadNeighborImages(index);
  };
}
function preloadNeighborImages(index){
  const next = (index + 1) % overlayImages.length;
  const prev = (index - 1 + overlayImages.length) % overlayImages.length;

  [next, prev].forEach(i => {
    const img = new Image();
    img.src = overlayImages[i].src;
  });
}
function openOverlay(index) {
  overlay.classList.add('active');
  currentIndex_img = index;
  showImage(index);
  document.documentElement.classList.add('no-scroll');
}

function closeOverlay() {
  overlay.classList.remove('active');
  document.documentElement.classList.remove('no-scroll');
}

/* ===============================
   7. CLICK ẢNH ĐẠI DIỆN
================================ */
galleryContainers.forEach((container, index) => {
  container.addEventListener('click', () => {
    const date = displayImages[index].caption;
    currentIndex_img = firstIndexOfDate[date];
    openOverlay(currentIndex_img);
  });
});

/* ===============================
   8. NÚT ĐIỀU KHIỂN
================================ */
closeBtn.addEventListener('click', closeOverlay);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeOverlay();
});

prevBtn.addEventListener('click', () => {
  currentIndex_img =
    (currentIndex_img - 1 + overlayImages.length) % overlayImages.length;
  showImage(currentIndex_img, 'left');
});

nextBtn.addEventListener('click', () => {
  currentIndex_img =
    (currentIndex_img + 1) % overlayImages.length;
  showImage(currentIndex_img, 'right');
});

/* ===============================
   9. SWIPE MOBILE
================================ */
let touchStartX = 0;
let touchEndX = 0;

overlay.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

overlay.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const delta = touchStartX - touchEndX;
  if (Math.abs(delta) < 50) return;

  if (delta > 0) nextBtn.click(); // swipe left
  else prevBtn.click();         // swipe right
}
