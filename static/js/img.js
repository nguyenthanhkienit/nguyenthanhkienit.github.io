const galleryContainers = document.querySelectorAll('.gallery-img-container');
  const overlay = document.getElementById('overlay');
  const overlayImage = document.getElementById('overlayImage');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentIndex_img = 0;

  function showImage(index, direction = 'none') {
    const newSrc = galleryContainers[index].querySelector('img').src;

    // Add animation effect
    overlayImage.style.opacity = 0;
    overlayImage.style.transform = direction === 'left' ? 'translateX(-50px)' : 
                                   direction === 'right' ? 'translateX(50px)' : 'translateX(0)';

    setTimeout(() => {
      overlayImage.src = newSrc;
      overlayImage.style.transform = 'translateX(0)';
      overlayImage.style.opacity = 1;
    }, 200);
  }

function openOverlay(index) {
  overlay.classList.add('active');
  showImage(index);
  currentIndex_img = index;
  document.documentElement.classList.add('no-scroll');            // khóa body
}

function closeOverlay() {
  overlay.classList.remove('active');
  document.documentElement.classList.remove('no-scroll');
}

  galleryContainers.forEach((container, index) => {
    container.addEventListener('click', () => openOverlay(index));
  });

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex_img = (currentIndex_img - 1 + galleryContainers.length) % galleryContainers.length;
    showImage(currentIndex_img, 'left');
  });

  nextBtn.addEventListener('click', () => {
    currentIndex_img = (currentIndex_img + 1) % galleryContainers.length;
    showImage(currentIndex_img, 'right');
  });

  // Swipe Detection
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
    else prevBtn.click(); // swipe right
  }