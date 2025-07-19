  const images = [
        { src: "images/Chan/z6815849117951_88baae4c80be3194552a9bb404748621.jpg", caption: "08-03-2025" },
        { src: "images/Chan/z6815794207393_f4905b299125b96780f49b51368b398f.jpg", caption: "12-03-2025" },
        { src: "images/Chan/z6815794197133_79cd3bbad124e93bd0786f92db4b8ff5.jpg", caption: "15-03-2025" },
        { src: "images/Chan/z6815794190879_f55d440ec54310be503a6e09c7551444.jpg", caption: "16-04-2025" },
        { src: "images/Chan/z6815794190880_29a420ee9fcdf1f6224d80e46cf7f5be.jpg", caption: "20-04-2025" },
        { src: "images/Chan/z6815794149763_dafa0e5b83dda792a9740b565654fd45.jpg", caption: "25-04-2025" },
        { src: "images/Chan/z6815794174052_1ac1ed731d37f6bdcde2a1e71d5e95f4.jpg", caption: "07-05-2025" },
        { src: "images/Chan/z6815794146812_45353733efa2b1edb11e642c39da92eb.jpg", caption: "10-05-2025" },
        { src: "images/Chan/z6815794167268_124bdb8c0fcfa7d0b4c67ab0c57e23cf.jpg", caption: "08-06-2025" },
        { src: "images/Chan/z6815794161102_b6726361989e193adc9b627af8bc5701.jpg", caption: "22-06-2025" },
        { src: "images/Chan/z6815794161104_5a4196babcd9643c291fbef794c274c5.jpg", caption: "23-06-2025" },
        { src: "images/Chan/z6815794161103_5073f3c96d36b9c331f661754803d300.jpg", caption: "02-07-2025" },
        { src: "images/Chan/z6815794147756_40ab0714be8e37f0166960aae894c13a.jpg", caption: "11-07-2025" },
    ];

    const galleryRow = document.getElementById("gallery-row");

    images.forEach((img, index) => {
        galleryRow.innerHTML += `
        <div class="col-lg-3 col-sm-6 wow fadeInUp animated" data-wow-delay="0.3s">
            <div class="gallery-img-container" data-index="${index % 4}">
                <img src="${img.src}" alt="">
                <div class="gallery-caption">${img.caption}</div>
            </div>
        </div>`;
    });
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
