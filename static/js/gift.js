const bgMusic = document.getElementById('bgMusic');
  const giftBox = document.getElementById('giftBox');
  const container = document.getElementById('container');
  const message = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  const messageGif = document.getElementById('messageGif');

  // Mảng chứa các tin nhắn và ảnh tương ứng
  const messages = [
  {
    text: "Làm biếng nấu cơm thì hay ăn mì.",
    gif: "images//gift//an.gif"
  },
  {
    text: "Sợ mập nhưng trà sữa vẫn đều đều .",
    gif: "images//gift//uong.gif"
  },
  {
    text: "Em là người lì nhất anh từng gặp.",
    gif: "images//gift//li.gif"
  },
  {
    text: "Mà lại còn hay khóc nữa.",
    gif: "images//gift//khoc.gif"
  },
  {
    text: "Hay bị anh kí đầu.",
    gif: "images//gift/kidau.gif"
  },
  {
    text: "À em còn ham ngủ nữa chứ.",
    gif: "images//gift//ngu.gif"
  },
  {
    text: "Nhưng... anh vẫn thương em 💕",
    gif: "images//gift//hon.gif"
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
  countdownEl.style.marginTop = '-20px';
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
      }, 25000);

    }, 1000);

  }, 600);

}, 3000);
}