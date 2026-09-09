/**
 * MUHAMMED SINAN KP - PORTFOLIO INTERACTIVITY SCRIPT
 * Clean, Futuristic & Interactive Web Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize all interactive modules
  initAmbientCanvas();
  initNavigation();
  initScrollAnimations();
  initTiltEffect();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. AMBIENT WARM PARTICLE CANVAS
   ========================================================================== */
let particleControls = {
  enabled: true,
  count: window.innerWidth < 768 ? 22 : 45,
  speed: 1
};

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.45 * (particleControls.speed || 1);
      this.speedY = (Math.random() - 0.5) * 0.45 * (particleControls.speed || 1);
      const palette = ['rgba(201, 168, 76, ', 'rgba(160, 120, 48, ', 'rgba(224, 187, 114, '];
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.opacity = Math.random() * 0.35 + 0.1;
    }

    update() {
      this.x += this.speedX * (particleControls.speed || 1);
      this.y += this.speedY * (particleControls.speed || 1);

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse repulsion / interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 1.5;
          this.y -= directionY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticles(num) {
    particles = [];
    for (let i = 0; i < num; i++) {
      particles.push(new Particle());
    }
  }

  initParticles(particleControls.count);

  function connectParticles() {
    const maxDist = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 140, 60, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!particleControls.enabled) {
      canvas.style.display = 'none';
      requestAnimationFrame(animate);
      return;
    }
    canvas.style.display = 'block';
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.updateParticleSettings = function(enabled, count, speed) {
    if (typeof enabled === 'boolean') particleControls.enabled = enabled;
    if (typeof speed === 'number') particleControls.speed = speed;
    if (typeof count === 'number' && count !== particles.length) {
      particleControls.count = count;
      initParticles(count);
    }
  };
}

/* ==========================================================================
   2. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Class Toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy Active Link
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      const iconOpen = mobileToggle.querySelector('.icon-open');
      const iconClose = mobileToggle.querySelector('.icon-close');
      
      if (iconOpen && iconClose) {
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close mobile nav on click of any link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          const iconOpen = mobileToggle.querySelector('.icon-open');
          const iconClose = mobileToggle.querySelector('.icon-close');
          if (iconOpen && iconClose) {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
          }
        }
      });
    });
  }
}

/* ==========================================================================
   3. SCROLL REVEAL & PROGRESS BAR ANIMATION
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  const progressBars = document.querySelectorAll('.progress-bar');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Progress bars trigger
  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));
}

/* ==========================================================================
   4. 3D CARD TILT EFFECT (Subtle & Futuristic)
   ========================================================================== */
window.portfolioTiltEnabled = true;

function initTiltEffect() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    if (card._hasTiltAttached) return;
    card._hasTiltAttached = true;

    card.addEventListener('mousemove', (e) => {
      if (window.portfolioTiltEnabled === false) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

window.setTiltEnabled = function(enabled) {
  window.portfolioTiltEnabled = enabled;
  if (!enabled) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.style.transform = 'none';
    });
  }
};

/* ==========================================================================
   5. CONTACT FORM VALIDATION & INTERACTIVE FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const subjectInput = document.getElementById('contact-subject');

  function getRecipientEmail() {
    try {
      const saved = localStorage.getItem('sinankp_master_config_v2');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg.contactEmail) return cfg.contactEmail;
        if (cfg.content && cfg.content.contactEmail) return cfg.content.contactEmail;
      }
    } catch (e) {}
    return 'sinankp3518@gmail.com';
  }

  function openMailtoFallback(recipient, subject, name, email, message) {
    const bodyText = `Hi Muhammed Sinan,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n--\nSent from your Portfolio contact form.`;
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
  }

  function setError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  [nameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput);
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      setError(emailInput);
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput);
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const defaultText = submitBtn.querySelector('.btn-default-text');
      const loadingText = submitBtn.querySelector('.btn-loading-text');
      const sendIcon = submitBtn.querySelector('.btn-send-icon');

      if (defaultText && loadingText) {
        defaultText.style.display = 'none';
        loadingText.style.display = 'inline';
      }
      if (sendIcon) sendIcon.style.display = 'none';
      submitBtn.disabled = true;

      const recipient = getRecipientEmail();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = (subjectInput ? subjectInput.value.trim() : '') || `Portfolio Inquiry from ${name}`;
      const message = messageInput.value.trim();

      const payload = {
        name: name,
        email: email,
        _replyto: email,
        subject: `[Portfolio Inquiry] ${subject}`,
        message: message,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok && (result.success === 'true' || result.success === true)) {
          showToast(`Thank you, ${name}! Your email has been delivered directly to ${recipient}.`);
          form.reset();
        } else {
          // If response not ok or needs one-time activation
          const msg = result.message || 'Form submission processed.';
          showToast(`Note: ${msg}`);
          if (result.message && result.message.toLowerCase().includes('activate')) {
            showToast(`Please check ${recipient} inbox to complete 1-time activation.`);
          } else {
            openMailtoFallback(recipient, subject, name, email, message);
          }
          form.reset();
        }
      } catch (err) {
        console.warn('Direct delivery error, launching email client:', err);
        showToast(`Connecting to your email client for ${recipient}...`);
        openMailtoFallback(recipient, subject, name, email, message);
      } finally {
        if (defaultText && loadingText) {
          defaultText.style.display = 'inline';
          loadingText.style.display = 'none';
        }
        if (sendIcon) sendIcon.style.display = 'inline';
        submitBtn.disabled = false;
      }
    }
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <i data-lucide="check-circle" class="toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Remove toast after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Global hook for dynamic CMS re-render
window.reInitPortfolioModules = function() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  initScrollAnimations();
  initTiltEffect();
};
