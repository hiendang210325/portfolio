// ===== GSAP & ScrollTrigger Setup =====
gsap.registerPlugin(ScrollTrigger);

// ===== LOADING SCREEN =====
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");

  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 0.8, // Giảm thời gian loading
    delay: 1.5, // Giảm delay loading
    onComplete: () => {
      loadingScreen.style.display = "none";
      initAnimations(); // Typewriter sẽ bắt đầu ngay lập tức
    },
  });
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  cursorFollower.style.left = e.clientX + "px";
  cursorFollower.style.top = e.clientY + "px";
});

// Cursor hover effects
document
  .querySelectorAll("a, button, .project-card, .skill-item")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)";
      cursorFollower.style.transform = "scale(1.5)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursorFollower.style.transform = "scale(1)";
    });
  });

// ===== NAVIGATION =====
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-link");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Native smooth scroll - hoạt động tốt trên mọi browser hiện đại
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close mobile menu
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// ===== THREE.JS HERO BACKGROUND =====
let scene, camera, renderer, particles, geometryShapes;

function initHeroBackground() {
  const canvas = document.getElementById("hero-canvas");
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create subtle particle system (smaller, more transparent)
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 150;
    positions[i + 1] = (Math.random() - 0.5) * 150;
    positions[i + 2] = (Math.random() - 0.5) * 50;

    colors[i] = 0;
    colors[i + 1] = 0.96;
    colors[i + 2] = 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.15,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Create floating geometric shapes
  geometryShapes = [];
  const shapes = ["box", "sphere", "torus"];

  for (let i = 0; i < 15; i++) {
    let geometry, material, mesh;
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];

    switch (shapeType) {
      case "box":
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(0.3, 8, 8);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
        break;
    }

    material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0, 0.96, 1),
      transparent: true,
      opacity: 0.05,
      wireframe: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 30
    );

    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    geometryShapes.push(mesh);
    scene.add(mesh);
  }

  camera.position.z = 50;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Subtle particle movement
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;

    // Animate geometric shapes
    geometryShapes.forEach((shape, index) => {
      shape.rotation.x += 0.005 + index * 0.001;
      shape.rotation.y += 0.003 + index * 0.0005;
      shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();
}

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
  // Khởi tạo typewriter effect cho hero text
  createTypewriterEffect();

  // Hero visual animation with spectacular entrance
  gsap.from(".hero-visual", {
    duration: 2,
    x: 100,
    opacity: 0,
    scale: 0.8,
    rotation: 10,
    delay: 0.5,
    ease: "back.out(1.7)",
  });

  // Buttons animation sau khi typewriter hoàn thành
  gsap.from(".hero-buttons", {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 3, // Giảm delay vì typewriter bắt đầu sớm hơn
    ease: "power2.out",
  });

  // Section animations
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
      y: 100,
      opacity: 0,
      duration: 1,
    });
  });

  // About section animations
  gsap.from(".about-card", {
    scrollTrigger: {
      trigger: ".about-card",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
    x: -100,
    opacity: 0,
    duration: 1,
  });

  gsap.from(".tech-showcase", {
    scrollTrigger: {
      trigger: ".tech-showcase",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
    x: 100,
    opacity: 0,
    duration: 1,
  });

  // Stats counter animation
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    const endValue = parseInt(stat.textContent);
    gsap.from(stat, {
      scrollTrigger: {
        trigger: stat,
        start: "top 80%",
      },
      textContent: 0,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      stagger: 0.2,
    });
  });

  // Skills animation
  gsap.utils.toArray(".skill-item").forEach((skill, index) => {
    gsap.from(skill, {
      scrollTrigger: {
        trigger: skill,
        start: "top 80%",
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
    });

    const progressBar = skill.querySelector(".skill-progress");
    const skillLevel = skill.getAttribute("data-skill");

    gsap.to(progressBar, {
      scrollTrigger: {
        trigger: skill,
        start: "top 80%",
      },
      width: skillLevel + "%",
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out",
    });
  });

  // Projects animation
  gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.2,
    });
  });

  // Contact animation
  gsap.utils.toArray(".contact-item").forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
    });
  });

  gsap.from(".contact-form", {
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 80%",
    },
    x: 50,
    opacity: 0,
    duration: 1,
  });
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
  const floatingElements = document.querySelectorAll(".floating-element");

  floatingElements.forEach((element) => {
    const speed = element.getAttribute("data-speed");

    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: -100 * speed,
      ease: "none",
    });
  });
}

// ===== ADVANCED INTERACTIONS =====
function initInteractions() {
  // Tech particles interaction
  document.querySelectorAll(".tech-particle").forEach((particle) => {
    particle.addEventListener("click", () => {
      // Create ripple effect
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 10px;
        background: rgba(0, 245, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: rippleExpand 0.6s ease-out forwards;
        pointer-events: none;
      `;
      particle.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);

      // Pause particle animation temporarily
      particle.style.animationPlayState = "paused";
      setTimeout(() => {
        particle.style.animationPlayState = "running";
      }, 1000);
    });
  });

  // Project card 3D tilt effect
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });

  // Skill items hover effect
  document.querySelectorAll(".skill-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Button hover effects
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

// ===== FORM HANDLING =====
function initFormHandling() {
  const form = document.querySelector(".contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML =
      '<span>Đang gửi...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      submitBtn.innerHTML = '<span>Đã gửi!</span><i class="fas fa-check"></i>';
      submitBtn.style.background = "var(--gradient-4)";

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = "";
        form.reset();
      }, 2000);
    }, 2000);
  });
}

// ===== TYPEWRITER EFFECT =====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ===== PARTICLE SYSTEM FOR SECTIONS =====
function createParticles(container, count = 50) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.6;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
    container.appendChild(particle);
  }
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: var(--gradient-3);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = scrollPercent + "%";
  });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in")
    .forEach((el) => {
      observer.observe(el);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// ===== RESIZE HANDLER =====
function handleResize() {
  if (renderer && camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
  // Throttle scroll events
  let ticking = false;

  function updateScrollEffects() {
    // Update scroll-based effects here
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });

  // Debounce resize events
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
}

// ===== EASTER EGGS =====
function initEasterEggs() {
  // Konami code
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let userInput = [];

  document.addEventListener("keydown", (e) => {
    userInput.push(e.keyCode);
    if (userInput.length > konamiCode.length) {
      userInput.shift();
    }

    if (userInput.join(",") === konamiCode.join(",")) {
      // Activate special effect
      document.body.style.animation = "rainbow 2s infinite";
      setTimeout(() => {
        document.body.style.animation = "";
      }, 5000);
    }
  });

  // Click counter on logo
  let clickCount = 0;
  const logo = document.querySelector(".nav-logo");

  logo.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 10) {
      createFireworks();
      clickCount = 0;
    }
  });
}

// ===== FIREWORKS EFFECT =====
function createFireworks() {
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

  for (let i = 0; i < 50; i++) {
    const firework = document.createElement("div");
    firework.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            animation: explode 2s ease-out forwards;
        `;

    document.body.appendChild(firework);

    setTimeout(() => {
      firework.remove();
    }, 2000);
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initHeroBackground();
  initParallax();
  initInteractions();
  initFormHandling();
  initScrollProgress();
  initIntersectionObserver();
  initEasterEggs();
  optimizePerformance();
  initImageModal();

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
      @keyframes explode {
          0% {
              transform: scale(0);
              opacity: 1;
          }
          100% {
              transform: scale(1) translate(${Math.random() * 200 - 100}px, ${
    Math.random() * 200 - 100
  }px);
              opacity: 0;
          }
      }
      
      @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
      }
      
      @keyframes rippleExpand {
          0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
          }
          100% {
              transform: translate(-50%, -50%) scale(8);
              opacity: 0;
          }
      }
      
      .particle {
          pointer-events: none;
      }
  `;
  document.head.appendChild(style);
});

// ===== TYPEWRITER EFFECT FOR HERO TEXT =====
function createTypewriterEffect() {
  const titleLine = document.querySelector(".title-line");
  const titleName = document.querySelector(".title-name");
  const titleSubtitle = document.querySelector(".title-subtitle");
  const heroDescription = document.querySelector(".hero-description");

  // Ẩn tất cả text ban đầu
  gsap.set([titleLine, titleName, titleSubtitle, heroDescription], {
    opacity: 0,
  });

  // Typewriter bắt đầu ngay lập tức - không delay
  typewriterAnimation(titleLine, "Hello, I am", 0, () => {
    // Sau khi xong dòng 1, bắt đầu dòng 2 ngay
    typewriterAnimation(titleName, "Dang Van Hien", 0, () => {
      // Sau khi xong tên, bắt đầu subtitle ngay
      typewriterAnimation(titleSubtitle, "Software Engineer", 0, () => {
        // Cuối cùng là description
        typewriterAnimation(
          heroDescription,
          "I create unique web experiences with modern technology and creative design",
          0
        );
      });
    });
  });
}

function typewriterAnimation(element, text, delay, callback) {
  // Delay trước khi bắt đầu (rất ngắn)
  setTimeout(() => {
    element.innerHTML = "";
    element.style.opacity = "1";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML =
          text.slice(0, i + 1) + '<span class="typewriter-cursor">|</span>';
        i++;
      } else {
        clearInterval(timer);
        // Ẩn cursor sau khi hoàn thành (nhanh hơn)
        setTimeout(() => {
          element.innerHTML = text;
          if (callback) callback();
        }, 200); // Giảm từ 500ms xuống 200ms
      }
    }, 50); // Tăng tốc độ gõ: từ 80ms xuống 50ms
  }, delay * 1000);
}

// ===== ADDITIONAL GSAP ANIMATIONS =====
gsap.set(".hero-avatar", { scale: 0.8, opacity: 0 });
gsap.to(".hero-avatar", {
  scale: 1,
  opacity: 1,
  duration: 1.5,
  delay: 1.5,
  ease: "elastic.out(1, 0.5)",
});

// Continuous rotation for avatar ring
gsap.to(".avatar-ring", {
  rotation: 360,
  duration: 10,
  repeat: -1,
  ease: "none",
});

// Floating animation for hero elements
gsap.to(".hero-avatar", {
  y: -10,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power2.inOut",
});

// Text reveal animation
gsap.utils.toArray(".section-title").forEach((title) => {
  const chars = title.textContent.split("");
  title.innerHTML = chars
    .map(
      (char) =>
        `<span style="display: inline-block; opacity: 1; transform: translateY(0); color: #00f5ff;">${
          char === " " ? "&nbsp;" : char
        }</span>`
    )
    .join("");

  gsap.fromTo(
    title.querySelectorAll("span"),
    {
      opacity: 0,
      y: 50,
    },
    {
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
      },
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "back.out(1.7)",
    }
  );
});

// Magnetic effect for buttons
document
  .querySelectorAll(".btn, .project-link, .social-link")
  .forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

console.log("🚀 Portfolio loaded successfully! Made with ❤️ by Hiền Đặng");

// ===== IMAGE MODAL (PROJECT PREVIEW) =====
function initImageModal() {
  // Inject minimal CSS once
  const existing = document.getElementById("image-modal-styles");
  if (!existing) {
    const css = document.createElement("style");
    css.id = "image-modal-styles";
    css.textContent = `
      .image-modal{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:9998}
      .image-modal.is-open{display:flex}
      .image-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(2px)}
      .image-modal__dialog{position:relative;max-width:90vw;max-height:90vh;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:10px}
      .image-modal__img{display:block;max-width:100%;max-height:80vh;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.6)}
      .image-modal__caption{margin-top:4px;text-align:center;color:#e6faff;font-weight:600}
      .image-modal__close{position:absolute;top:-14px;right:-14px;background:#111;border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}
      .image-modal__close:hover{transform:scale(1.05)}
      .image-modal__nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.25);color:#fff;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer}
      .image-modal__nav--prev{left:-54px}
      .image-modal__nav--next{right:-54px}
      .image-modal__thumbs{display:flex;gap:8px;max-width:90vw;overflow-x:auto;padding:4px}
      .image-modal__thumbs img{width:64px;height:48px;object-fit:cover;border-radius:6px;opacity:.7;cursor:pointer;border:2px solid transparent}
      .image-modal__thumbs img.is-active{opacity:1;border-color:#00f5ff}
    `;
    document.head.appendChild(css);
  }

  const modal = document.getElementById("image-modal");
  const modalImg = modal.querySelector(".image-modal__img");
  const caption = modal.querySelector(".image-modal__caption");
  const thumbs = modal.querySelector(".image-modal__thumbs");
  const btnPrev = modal.querySelector(".image-modal__nav--prev");
  const btnNext = modal.querySelector(".image-modal__nav--next");

  let currentIndex = 0;
  let currentImages = [];

  function renderThumbs() {
    thumbs.innerHTML = "";
    currentImages.forEach((src, i) => {
      const t = document.createElement("img");
      t.src = src;
      if (i === currentIndex) t.classList.add("is-active");
      t.addEventListener("click", () => showIndex(i));
      thumbs.appendChild(t);
    });
  }

  function showIndex(idx) {
    currentIndex = (idx + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
    thumbs.querySelectorAll("img").forEach((el, i) => {
      el.classList.toggle("is-active", i === currentIndex);
    });
  }

  function openModal(images, text, startIndex = 0) {
    currentImages =
      images && images.length ? images : [modalImg.src].filter(Boolean);
    currentIndex = Math.min(Math.max(startIndex, 0), currentImages.length - 1);
    modalImg.src = currentImages[currentIndex];
    caption.textContent = text || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderThumbs();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Clear image to free memory on mobile
    setTimeout(() => (modalImg.src = ""), 200);
  }

  modal.addEventListener("click", (e) => {
    if (
      e.target.dataset.close === "modal" ||
      e.target.closest("[data-close='modal']")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (modal.classList.contains("is-open")) {
      if (e.key === "ArrowRight") btnNext.click();
      if (e.key === "ArrowLeft") btnPrev.click();
    }
  });

  btnPrev.addEventListener("click", () => {
    if (currentImages.length > 1) showIndex(currentIndex - 1);
  });

  btnNext.addEventListener("click", () => {
    if (currentImages.length > 1) showIndex(currentIndex + 1);
  });

  // Bind project cards
  document.querySelectorAll(".project-card").forEach((card) => {
    const img = card.querySelector("img.project-img");
    const title = card.querySelector(".project-title")?.textContent?.trim();

    // Accept multiple images via data-images (comma separated) on project card or image
    const dataImages = (
      card.getAttribute("data-images") ||
      img?.getAttribute("data-images") ||
      ""
    )
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const images = dataImages.length
      ? dataImages
      : img && img.src
      ? [img.src]
      : [];

    card.addEventListener("click", (e) => {
      // If user clicked on a link inside the card, do not open modal
      if (e.target.closest && e.target.closest(".project-links a")) {
        return;
      }
      if (images.length) {
        openModal(images, title, 0);
      }
    });
  });
}
