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

// 3D Cake with Three.js
function initCake() {
  const canvas = document.getElementById('cake-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, parent.clientWidth / parent.clientHeight, 0.1, 100);
  camera.position.set(0, 3.5, 7);
  camera.lookAt(0, 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(4, 6, 4);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0xe0b1ff, 0.4);
  rimLight.position.set(-4, 2, -4);
  scene.add(rimLight);

  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // Plate
  const plateGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.15, 64);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.y = -0.08;
  plate.receiveShadow = true;
  cakeGroup.add(plate);

  // Cake base
  const cakeGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.4, 64);
  const cakeMat = new THREE.MeshStandardMaterial({ color: 0xf3d9fa, roughness: 0.6 });
  const cake = new THREE.Mesh(cakeGeo, cakeMat);
  cake.position.y = 0.7;
  cake.castShadow = true;
  cake.receiveShadow = true;
  cakeGroup.add(cake);

  // Icing layer
  const icingGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.25, 64);
  const icingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const icing = new THREE.Mesh(icingGeo, icingMat);
  icing.position.y = 1.45;
  icing.castShadow = true;
  cakeGroup.add(icing);

  // Drip details
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const dripGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const drip = new THREE.Mesh(dripGeo, icingMat);
    drip.position.set(Math.cos(angle) * 1.78, 1.35, Math.sin(angle) * 1.78);
    cakeGroup.add(drip);
  }

  // Candles
  const flames = [];
  const candlePositions = [
    { x: 0, z: 0 },
    { x: 0.7, z: 0.4 },
    { x: -0.7, z: 0.4 }
  ];

  candlePositions.forEach((pos) => {
    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0x9d4edd, roughness: 0.3 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(pos.x, 1.85, pos.z);
    candle.castShadow = true;
    cakeGroup.add(candle);

    const flameGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(pos.x, 2.3, pos.z);
    flame.scale.set(1, 1.6, 1);
    cakeGroup.add(flame);

    const light = new THREE.PointLight(0xffaa33, 0, 4);
    light.position.set(pos.x, 2.4, pos.z);
    cakeGroup.add(light);

    flames.push({ mesh: flame, light, baseY: 2.3, phase: Math.random() * Math.PI * 2 });
  });

  // Confetti
  const confetti = [];
  const confettiColors = [0xc77dff, 0xe0b1ff, 0x9d4edd, 0xffd6ff, 0xffffff];
  for (let i = 0; i < 80; i++) {
    const geo = new THREE.PlaneGeometry(0.08, 0.08);
    const mat = new THREE.MeshBasicMaterial({
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      side: THREE.DoubleSide
    });
    const p = new THREE.Mesh(geo, mat);
    p.position.set((Math.random() - 0.5) * 3, 2 + Math.random() * 2, (Math.random() - 0.5) * 3);
    p.userData = {
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, Math.random() * 0.1 + 0.05, (Math.random() - 0.5) * 0.1),
      rotationSpeed: new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2)
    };
    p.visible = false;
    cakeGroup.add(p);
    confetti.push(p);
  }

  // Wish particles
  let wishPoints = null;
  function createWishParticles() {
    if (wishPoints) return wishPoints;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0 });
    wishPoints = new THREE.Points(geometry, material);
    cakeGroup.add(wishPoints);
    return wishPoints;
  }

  let candlesLit = false;
  let celebrating = false;

  // Controls
  const lightBtn = document.getElementById('light-btn');
  const wishBtn = document.getElementById('wish-btn');
  const blowBtn = document.getElementById('blow-btn');
  const finalMessage = document.getElementById('final-message');

  if (lightBtn && wishBtn && blowBtn) {
    lightBtn.addEventListener('click', () => {
      candlesLit = true;
      flames.forEach(f => {
        f.mesh.material.opacity = 0.9;
        f.light.intensity = 1.2;
      });
      lightBtn.disabled = true;
      wishBtn.disabled = false;
      lightBtn.classList.add('active');
    });

    wishBtn.addEventListener('click', () => {
      celebrating = true;
      wishBtn.disabled = true;
      blowBtn.disabled = false;
      wishBtn.classList.add('active');
      createWishParticles();

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
      candlesLit = false;
      celebrating = false;
      blowBtn.disabled = true;
      blowBtn.classList.add('active');

      flames.forEach(f => {
        f.mesh.material.opacity = 0;
        f.light.intensity = 0;
      });

      if (wishPoints) wishPoints.material.opacity = 0;

      confetti.forEach(p => {
        p.visible = true;
        p.position.set((Math.random() - 0.5) * 2.5, 2.5 + Math.random() * 1.5, (Math.random() - 0.5) * 2.5);
        p.userData.velocity.set((Math.random() - 0.5) * 0.12, Math.random() * 0.1 + 0.06, (Math.random() - 0.5) * 0.12);
      });

      setTimeout(() => finalMessage.classList.add('show'), 800);
    });
  }

  // Mouse rotation
  let targetRotationY = 0;
  let targetRotationX = 0;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetRotationY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
    targetRotationX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    cakeGroup.rotation.y += 0.003;
    cakeGroup.rotation.y += (targetRotationY - cakeGroup.rotation.y) * 0.03;
    cakeGroup.rotation.x += (targetRotationX - cakeGroup.rotation.x) * 0.03;

    flames.forEach(f => {
      if (candlesLit || f.mesh.material.opacity > 0.01) {
        const flicker = 1 + Math.sin(time * 10 + f.phase) * 0.08;
        f.mesh.scale.set(1 * flicker, 1.6 * flicker, 1 * flicker);
        f.mesh.position.y = f.baseY + Math.sin(time * 12 + f.phase) * 0.02;
        if (!candlesLit) f.mesh.material.opacity -= 0.04;
      }
    });

    if (wishPoints) {
      if (celebrating && wishPoints.material.opacity < 0.7) wishPoints.material.opacity += 0.01;
      if (!celebrating && wishPoints.material.opacity > 0) wishPoints.material.opacity -= 0.02;
      const positions = wishPoints.geometry.attributes.position.array;
      for (let i = 0; i < 60; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
      }
      wishPoints.geometry.attributes.position.needsUpdate = true;
    }

    confetti.forEach(p => {
      if (!p.visible) return;
      p.position.add(p.userData.velocity);
      p.rotation.x += p.userData.rotationSpeed.x;
      p.rotation.y += p.userData.rotationSpeed.y;
      p.rotation.z += p.userData.rotationSpeed.z;
      p.userData.velocity.y -= 0.002;
      if (p.position.y < -2) p.visible = false;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parent.clientWidth, parent.clientHeight);
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
