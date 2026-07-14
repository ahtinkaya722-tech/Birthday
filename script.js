// Age calculation
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
  return age;
}

const ageDisplay = document.getElementById('age-display');
if (ageDisplay) {
  ageDisplay.textContent = `Turning ${calculateAge('2002-07-15')} years old today ✨`;
}

// Three.js soft particle background
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count = 80;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color('#c77dff'),
    new THREE.Color('#e0b1ff'),
    new THREE.Color('#9d4edd'),
    new THREE.Color('#ffffff')
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 5;

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004;
    particles.rotation.x += mouseY * 0.0003;
    particles.rotation.y += mouseX * 0.0003;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

initBackground();

// CSS Cake interaction
function initCake() {
  const lightBtn = document.getElementById('light-btn');
  const wishBtn = document.getElementById('wish-btn');
  const blowBtn = document.getElementById('blow-btn');
  const finalMessage = document.getElementById('final-message');
  const flames = document.querySelectorAll('.flame');

  if (!lightBtn || !wishBtn || !blowBtn || flames.length === 0) return;

  lightBtn.addEventListener('click', () => {
    flames.forEach(flame => {
      flame.classList.remove('blown');
      flame.classList.add('lit');
    });
    lightBtn.disabled = true;
    wishBtn.disabled = false;
    lightBtn.classList.add('active');
  });

  wishBtn.addEventListener('click', () => {
    wishBtn.disabled = true;
    blowBtn.disabled = false;
    wishBtn.classList.add('active');

    const overlay = document.createElement('div');
    overlay.textContent = '✨ Make a wish... ✨';
    overlay.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-family: 'Dancing Script', cursive; font-size: 3rem; color: #fff;
      text-shadow: 0 0 30px rgba(157,78,221,0.6); z-index: 1000;
      pointer-events: none; opacity: 0; transition: opacity 0.5s ease;
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.style.opacity = '1', 50);
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    }, 2000);
  });

  blowBtn.addEventListener('click', () => {
    flames.forEach(flame => {
      flame.classList.remove('lit');
      flame.classList.add('blown');
    });
    blowBtn.disabled = true;
    blowBtn.classList.add('active');
    setTimeout(() => finalMessage.classList.add('show'), 800);
  });
}

initCake();

// Scroll reveal
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-title, .section-subtitle, .reason-card, .flip-card, .gallery-item, .cake-stage, .ending-content, .final-message').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    observer.observe(el);
  });
}

initScrollReveal();

// Floating hearts
function createFloatingHeart() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;
  const heart = document.createElement('div');
  heart.textContent = ['❤️', '💖', '💕', '💗', '💝'][Math.floor(Math.random() * 5)];
  heart.style.cssText = `
    position: absolute; font-size: ${Math.random() * 1.2 + 0.8}rem;
    left: ${Math.random() * 100}%; bottom: -50px; opacity: 0.35;
    animation: float-up ${Math.random() * 6 + 6}s linear forwards;
    pointer-events: none;
  `;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

setInterval(createFloatingHeart, 2200);

const style = document.createElement('style');
style.textContent = `
  @keyframes float-up {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
    100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(style);
