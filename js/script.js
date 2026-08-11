/* ==========================================================================
   MARY RENGEL SOSAI - PORTFOLIO INTERACTIVE SCRIPT
   Navbar scroll sync, Dark Mode, Scroll-Reveal, Lightbox, Form handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 0. Theme / Dark Mode Toggle ──────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('portfolioTheme');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
    localStorage.setItem('portfolioTheme', theme);
  };

  // Default: use saved preference or system preference
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── 1. Mobile Menu Toggle ─────────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ── 2. Navbar Scroll Class + Active Section Highlight ────────────────────
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    // Scrolled glass effect
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    // Scroll-to-top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }

    // Active section
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });

  // ── 3. Scroll-to-top Button ───────────────────────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 4. Scroll-Reveal Animation (IntersectionObserver) ────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── 5. Certificate Lightbox Modal Handler ─────────────────────────────────
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('active-hover-demo'));
    });

    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.cert-name');

      if (certModal && modalImg && modalTitle) {
        modalImg.src = img ? img.src : '';
        modalTitle.textContent = title ? title.textContent : 'Certificate Preview';
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && certModal) {
    const closeModal = () => {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    };
    modalClose.addEventListener('click', closeModal);
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── 6. Contact Form Submission Handler ────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const messageInput = document.getElementById('senderMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('⚠️ Please fill out all fields before sending.', 'warning');
        return;
      }

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... ✈️';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast(`🎉 Thank you ${nameInput.value}! Mary will get back to you soon.`, 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // ── 7. CV Modal & Download/View Handlers ──────────────────────────────────
  const cvModal = document.getElementById('cvModal');
  const cvModalClose = document.getElementById('cvModalClose');
  const printCvBtn = document.getElementById('printCvBtn');

  document.querySelectorAll('.download-cv-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvModal) {
        cvModal.style.display = 'flex';
        showToast('📄 Opening Mary Rengel Sosai\'s Official CV...');
      }
    });
  });

  if (cvModalClose && cvModal) {
    cvModalClose.addEventListener('click', () => {
      cvModal.style.display = 'none';
    });
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        cvModal.style.display = 'none';
      }
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ── 8. Contact Email Card Copy Handler ────────────────────────────────────
  const emailCard = document.getElementById('emailCard');
  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      const copyVal = emailCard.getAttribute('data-copy');
      if (copyVal && navigator.clipboard) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`📋 Copied: ${copyVal}`);
        }).catch(() => {});
      }
    });
  }

  // ── 9. Project Cards Flip Handler ─────────────────────────────────────────
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-project-action')) {
        return;
      }
      card.classList.toggle('flipped');
    });
  });

  // ── 10. Toast Notification Helper ─────────────────────────────────────────
  function showToast(message, type = 'default') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '5rem',
        right: '2rem',
        padding: '12px 22px',
        borderRadius: '14px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '0.88rem',
        fontWeight: '600',
        zIndex: '10000',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: '0',
        transform: 'translateY(20px) scale(0.9)',
        maxWidth: '320px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.15)',
      });
      document.body.appendChild(toast);
    }

    const colors = {
      success: 'rgba(22, 163, 74, 0.95)',
      warning: 'rgba(202, 138, 4, 0.95)',
      default: 'rgba(22, 42, 69, 0.95)',
    };
    toast.style.background = colors[type] || colors.default;
    toast.style.color = '#ffffff';
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px) scale(0.9)';
    }, 3500);
  }

  // ── 11. Staggered reveal for hero content on load ─────────────────────────
  const heroElements = document.querySelectorAll('.hero-content > *');
  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.transitionDelay = `${0.1 + i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80);
  });

});
