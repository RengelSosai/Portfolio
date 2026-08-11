/* ==========================================================================
   MARY RENGEL SOSAI - PORTFOLIO INTERACTIVE SCRIPT
   Navbar scroll sync, Dark Mode, Scroll-Reveal, Lightbox, Form handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 0. Mobile Menu Toggle ─────────────────────────────────────────────────
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

  // ── 1. Dark / Light Theme Toggle ──────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';

  // Apply saved theme on load
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolioTheme', newTheme);

      // Spin animation on click
      themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => { themeToggle.style.transform = ''; }, 400);
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
      } else {
        entry.target.classList.remove('visible'); // Re-triggers animation every time element scrolls into view!
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── 5. Certificate Lightbox Modal Handler ─────────────────────────────────
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const viewFullBtn = document.getElementById('viewFullBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('active-hover-demo'));
    });

    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.cert-name');

      if (certModal && modalImg && modalTitle) {
        // Debug: log click and image source
        const src = img ? img.getAttribute('src') : '';
        console.log('cert-card clicked:', { src, title: title ? title.textContent : null });
        // Fallback: check data-src attribute if present
        const finalSrc = src || (img && img.dataset && img.dataset.src) || '';
        modalImg.src = finalSrc;
        modalTitle.textContent = title ? title.textContent : 'Certificate Preview';
        // Set view and download links
        if (viewFullBtn) viewFullBtn.href = finalSrc;
        if (downloadBtn) {
          downloadBtn.href = finalSrc;
          // Attempt to set a sensible filename for download
          try {
            const parts = finalSrc.split('/');
            downloadBtn.setAttribute('download', parts[parts.length - 1]);
          } catch (e) { console.warn('download name set failed', e); }
        }
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
  const backCvBtn = document.getElementById('backCvBtn');
  const viewCvBtn = document.getElementById('viewCvBtn');
  const heroViewCvBtn = document.getElementById('heroViewCvBtn');
  const downloadCvBtn = document.getElementById('downloadCvBtn');
  const cvFileName = 'Mary_Rengel_Sosai_CV.pdf';

  const openCvModal = () => {
    if (!cvModal) return;
    cvModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCvModal = () => {
    if (!cvModal) return;
    cvModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (viewCvBtn) viewCvBtn.addEventListener('click', openCvModal);
  if (heroViewCvBtn) heroViewCvBtn.addEventListener('click', openCvModal);

  if (cvModalClose && cvModal) {
    cvModalClose.addEventListener('click', closeCvModal);
    cvModal.addEventListener('click', (e) => { if (e.target === cvModal) closeCvModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cvModal.classList.contains('active')) closeCvModal();
    });
  }

  if (backCvBtn) {
    backCvBtn.addEventListener('click', () => {
      closeCvModal();
      const cvSection = document.getElementById('cv');
      if (cvSection) setTimeout(() => cvSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => { window.print(); });
  }

  // Build a simple multi-page PDF from plain text (works with file:// — no server needed)
  const buildTextPdf = (rawLines) => {
    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 48;
    const fontSize = 10;
    const lineHeight = 13;
    const maxChars = 90;

    const wrapLine = (line) => {
      const out = [];
      const text = String(line || '');
      if (!text) {
        out.push('');
        return out;
      }
      let remaining = text;
      while (remaining.length > maxChars) {
        let breakAt = remaining.lastIndexOf(' ', maxChars);
        if (breakAt < 20) breakAt = maxChars;
        out.push(remaining.slice(0, breakAt));
        remaining = remaining.slice(breakAt).trimStart();
      }
      out.push(remaining);
      return out;
    };

    const wrapped = rawLines.flatMap(wrapLine);
    const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
    const pages = [];
    for (let i = 0; i < wrapped.length; i += linesPerPage) {
      pages.push(wrapped.slice(i, i + linesPerPage));
    }
    if (!pages.length) pages.push(['']);

    const escapePdf = (s) => s
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E]/g, '?');

    const objects = [];
    const addObj = (content) => {
      objects.push(content);
      return objects.length;
    };

    const fontId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const boldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

    const pageIds = [];
    pages.forEach((pageLines) => {
      let stream = 'BT\n';
      pageLines.forEach((line, idx) => {
        const y = pageHeight - margin - (idx * lineHeight);
        const isHeading = line.trim() === 'MARY RENGEL SOSAI' ||
          /^(PROFESSIONAL SUMMARY|EDUCATION|TECHNICAL SKILLS|PROJECTS|EXPERIENCE|CERTIFICATIONS)/i.test(line.trim());
        const size = isHeading ? 12 : fontSize;
        const font = isHeading ? '/F2' : '/F1';
        stream += font + ' ' + size + ' Tf\n';
        stream += '1 0 0 1 ' + margin + ' ' + y + ' Tm\n';
        stream += '(' + escapePdf(line) + ') Tj\n';
      });
      stream += 'ET';

      const contentId = addObj('<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream');
      const pageId = addObj(
        '<< /Type /Page /Parent PAGES_ID 0 R /MediaBox [0 0 ' + pageWidth + ' ' + pageHeight + '] ' +
        '/Contents ' + contentId + ' 0 R /Resources << /Font << /F1 ' + fontId + ' 0 R /F2 ' + boldId + ' 0 R >> >> >>'
      );
      pageIds.push(pageId);
    });

    const kids = pageIds.map((id) => id + ' 0 R').join(' ');
    const pagesId = addObj('<< /Type /Pages /Kids [' + kids + '] /Count ' + pageIds.length + ' >>');
    const catalogId = addObj('<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>');

    // Patch parent pages reference
    objects.forEach((obj, i) => {
      if (typeof obj === 'string' && obj.includes('PAGES_ID')) {
        objects[i] = obj.replace(/PAGES_ID/g, String(pagesId));
      }
    });

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((obj, i) => {
      offsets.push(pdf.length);
      pdf += (i + 1) + ' 0 obj\n' + obj + '\nendobj\n';
    });
    const xrefPos = pdf.length;
    pdf += 'xref\n0 ' + (objects.length + 1) + '\n';
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i++) {
      pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    pdf += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root ' + catalogId + ' 0 R >>\n';
    pdf += 'startxref\n' + xrefPos + '\n%%EOF';
    return new Blob([pdf], { type: 'application/pdf' });
  };

  const collectCvLines = () => {
    const paper = document.querySelector('.cv-paper');
    if (!paper) {
      return [
        'MARY RENGEL SOSAI',
        'Aspiring UI/UX Designer | BICT Undergraduate',
        'Mannar, Sri Lanka | maryrengelsosai@gmail.com'
      ];
    }
    const lines = [];
    const push = (text) => {
      const cleaned = (text || '').replace(/\s+/g, ' ').trim();
      if (cleaned) lines.push(cleaned);
    };
    push(paper.querySelector('.cv-paper-name')?.textContent);
    push(paper.querySelector('.cv-paper-title')?.textContent);
    push(Array.from(paper.querySelectorAll('.cv-paper-contact span')).map((el) => el.textContent).join(' | '));
    lines.push('');
    paper.querySelectorAll('.cv-section').forEach((section) => {
      push(section.querySelector('.cv-section-title')?.textContent);
      section.querySelectorAll('.cv-item').forEach((item) => {
        const headerParts = Array.from(item.querySelectorAll('.cv-item-header span')).map((el) => el.textContent.trim());
        if (headerParts.length) push(headerParts.join(' — '));
        push(item.querySelector('.cv-item-sub')?.textContent);
        item.querySelectorAll('.cv-bullets li').forEach((li) => push('• ' + li.textContent));
        lines.push('');
      });
      section.querySelectorAll(':scope > .cv-bullets li').forEach((li) => push('• ' + li.textContent));
      const summary = section.querySelector(':scope > p');
      if (summary) push(summary.textContent);
      lines.push('');
    });
    return lines;
  };

  const triggerBlobDownload = (blob, fileName) => {
    const fileBlob = new Blob([blob], { type: 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  };

  const saveWithPicker = async (blob, fileName) => {
    if (!window.showSaveFilePicker) return false;
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: 'PDF file', accept: { 'application/pdf': ['.pdf'] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  };

  const downloadCvPdf = async () => {
    let pdfBlob = null;

    // Prefer the real PDF file when the site is served over http(s)
    try {
      const cvUrl = new URL(cvFileName, window.location.href).href;
      const response = await fetch(cvUrl, { cache: 'no-store' });
      if (response.ok) {
        const blob = await response.blob();
        if (blob && blob.size > 0) pdfBlob = blob;
      }
    } catch (_) {
      // file:// blocks fetch — fall through to generated PDF
    }

    // Offline / file:// fallback: generate a PDF from the on-page CV content
    if (!pdfBlob) {
      pdfBlob = buildTextPdf(collectCvLines());
    }

    try {
      const saved = await saveWithPicker(pdfBlob, cvFileName);
      if (saved) {
        showToast(`✅ Saved: ${cvFileName}`, 'success');
        return;
      }
    } catch (pickerErr) {
      if (pickerErr && pickerErr.name === 'AbortError') return;
    }

    triggerBlobDownload(pdfBlob, cvFileName);
    showToast(`✅ Download started: ${cvFileName}`, 'success');
  };

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      downloadCvBtn.disabled = true;
      try {
        await downloadCvPdf();
      } catch {
        showToast('⚠️ Could not download CV. Please try again.', 'warning');
      } finally {
        downloadCvBtn.disabled = false;
      }
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
