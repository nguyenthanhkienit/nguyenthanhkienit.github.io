const bgMusic = document.getElementById('bgMusic');
  const giftBox = document.getElementById('giftBox');
  const container = document.getElementById('container');
  const message = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  const messageGif = document.getElementById('messageGif');

  // Mảng chứa các tin nhắn và ảnh tương ứng
  const messages = [
  {
    text: "Anh thích em nhiều lắm! 💖",
    gif: "https://i.pinimg.com/originals/d9/4e/ef/d94eef3fc4f4af08ac6ed201017cd4c6.gif"
  },
  {
    text: "Em là món quà quý giá nhất đời anh 🎀",
    gif: "https://i.pinimg.com/originals/33/76/db/3376dbdfc1b6e8b71a2ea7353e4fc0f2.gif"
  },
  {
    text: "Mỗi ngày bên em đều là ngày hạnh phúc! 🥰",
    gif: "https://i.pinimg.com/originals/3a/fc/12/3afc12d6744a68594d29eb565c62244c.gif"
  },
  {
    text: "Em làm cuộc sống anh trở nên rực rỡ hơn! 🌟",
    gif: "https://i.pinimg.com/originals/6a/ec/ee/6aecee875e4844f34a1539054bf8aa8a.gif"
  },
  {
    text: "Mãi bên nhau nhé, em yêu! 💕",
    gif: "https://i.pinimg.com/originals/be/39/be/be39be7b9b6a02e06f892798063406c8.gif"
  }
];


  let currentIndex = 0;
  let intervalId;

  // Hàm gõ chữ từng ký tự với delay
  function typeWriter(text, element, delay = 100) {
    return new Promise((resolve) => {
      element.textContent = "";
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, delay);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  async function showMessage(index) {
  const msg = messages[index];
  messageGif.src = msg.gif;

  // Hiện message, xóa fade-out nếu có, bật active để hiện
  message.classList.remove('fade-out');
  message.classList.add('active');

  // Gõ chữ
  await typeWriter(msg.text, messageText, 100);

  // // Dừng 3s để xem tin nhắn
  // await new Promise(r => setTimeout(r, 3000));

  // Bắt đầu hiệu ứng mờ dần
  message.classList.add('fade-out');

  // Chờ hiệu ứng fadeOut 0.5s
  await new Promise(r => setTimeout(r, 500));

  // Ẩn message trước khi chuyển sang tin nhắn kế tiếp
  message.classList.remove('active');
}
async function startMessageRotation() {
  currentIndex = 0;

  while (currentIndex < messages.length) {
    await showMessage(currentIndex);
    currentIndex++;
  }
}



  giftBox.addEventListener('click', () => {
  countdown();
  startHeart();
  });

  function countdown() {
  const countdownEl = document.getElementById('countdown');

  // Thu nhỏ hộp quà
  giftBox.classList.add('shrink');

  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.display = 'block';

  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(interval);
      countdownEl.style.display = 'none';
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);

}


function resetGiftBox() {
  giftBox.classList.remove('shrink');
  giftBox.style.display = 'flex';
  currentIndex = 0;
  message.classList.remove('active'); // Ẩn tin nhắn & ảnh
}
function startHeart() {

  // Đợi 3 giây trước khi bắt đầu
setTimeout(() => {
  // Tạo 20 trái tim nhỏ
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '❤️';

    // Vị trí start: giữa hộp quà
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transformOrigin = 'center';

    // Random góc bay ra và khoảng cách
    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 100;

    const x = (Math.cos(angle) * distance).toFixed(2) + 'px';
    const y = (Math.sin(angle) * distance).toFixed(2) + 'px';

    heart.style.setProperty('--x', x);
    heart.style.setProperty('--y', y);

    container.appendChild(heart);

    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }

  // Ẩn hộp quà sau 600ms
  setTimeout(() => {
    giftBox.style.display = 'none';

    // Gọi startMessageRotation sau 1.5s
    setTimeout(() => {
      startMessageRotation();
      
      // Sau 10 giây gọi resetGiftBox
      setTimeout(() => {
        resetGiftBox();
      }, 22000);

    }, 1000);

  }, 600);

}, 3000);
}