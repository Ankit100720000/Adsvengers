if (typeof gsap !== 'undefined') { document.documentElement.classList.add('gsap-ready'); }
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, Flip);

// ── CURSOR (desktop fine-pointer only) ───────
const cursorEl = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && dot && ring) {
  document.body.classList.add('custom-cursor');
  
  // Set initial position centered
  gsap.set([dot, ring], { x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Use gsap.quickTo for high-performance spring dynamics
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

  window.addEventListener('mousemove', e => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  const interactiveSelector = 'a, button, input, textarea, .stat-card, .testi-card, .client-card, .service-card, .case-card, .db-stat-card, .feed-item, .bento-tile, .hamburger';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, {
        scale: 1.6,
        borderColor: 'var(--red)',
        backgroundColor: 'rgba(224, 0, 0, 0.08)',
        duration: 0.3,
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: 'var(--red-bright)',
        duration: 0.3,
        overwrite: 'auto'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(224, 0, 0, 0.5)',
        backgroundColor: 'rgba(224, 0, 0, 0)',
        duration: 0.3,
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: 'var(--red)',
        duration: 0.3,
        overwrite: 'auto'
      });
    });
  });
}

// ── CURVE SWIPE PAGE TRANSITION ──────────────
const curtain = document.getElementById('page-curtain');
let heroStarted = false;
let transitioning = false;

function revealPage() {
  if (curtain) {
    gsap.set(curtain, { yPercent: 0, pointerEvents: 'all' });
    gsap.to(curtain, {
      yPercent: -110,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(curtain, { yPercent: 100, pointerEvents: 'none' }); // park below for next transition
        if (!heroStarted) {
          heroStarted = true;
          startHeroAnim();
          startSubpageHeroAnim();
        }
      }
    });
  } else if (!heroStarted) {
    heroStarted = true;
    startHeroAnim();
    startSubpageHeroAnim();
  }
}

// Animated curtain sweep-in, then navigate
function coverAndNavigate(href) {
  if (!curtain) { window.location.href = href; return; }
  if (transitioning) return;
  transitioning = true;
  gsap.set(curtain, { yPercent: 100, pointerEvents: 'all' });
  gsap.to(curtain, {
    yPercent: 0,
    duration: 0.55,
    ease: 'power3.inOut',
    onComplete: () => { window.location.href = href; }
  });
}

// Intercept internal page links for the curve transition
document.querySelectorAll('a[href$=".html"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    coverAndNavigate(href);
  });
});

revealPage();
// Handle back/forward cache so the curtain never stays stuck
window.addEventListener('pageshow', e => { if (e.persisted) revealPage(); });
// Hard failsafe: never let the curtain trap the page
setTimeout(() => {
  if (curtain) gsap.set(curtain, { yPercent: 100, pointerEvents: 'none' });
  if (!heroStarted) {
    heroStarted = true;
    startHeroAnim();
    startSubpageHeroAnim();
  }
}, 2200);

// ── HERO ANIMATION ──────────────────────────
function startHeroAnim() {
  const tl = gsap.timeline();
  const headline = document.getElementById('hero-headline');
  if (headline) {
    splitTextIntoSpans(headline);
  }

  // Nav staggers
  tl.from('#main-nav .nav-logo', { opacity: 0, x: -25, duration: 0.8, ease: 'power3.out' })
    .from('.nav-links-pill', { opacity: 0, y: -25, scale: 0.95, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.nav-cta-pill-container', { opacity: 0, x: 25, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    
    // Hero badge
    .from('#hero-badge', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4');

  if (headline) {
    const chars = headline.querySelectorAll('.char');
    tl.from(chars, {
      opacity: 0,
      y: 30,
      rotateX: -25,
      stagger: 0.008,
      duration: 0.8,
      ease: 'power3.out',
      transformOrigin: 'top center'
    }, '-=0.6');
  } else {
    tl.from('#hero-headline', {
      opacity: 0, y: 40, duration: 1.0, ease: 'power3.out'
    }, '-=0.6');
  }

  tl.from('#hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.btn-pill-primary', { opacity: 0, scale: 0.9, y: 15, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.avatar-group .avatar', { opacity: 0, scale: 0.5, stagger: 0.08, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.4')
    .from('.stars-trust > *', { opacity: 0, y: 10, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('#hero-clients .strip-label', { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('#hero-clients .logo-item', { opacity: 0, y: 15, scale: 0.9, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, '-=0.4');
}

// ── SUBPAGE HERO ANIMATION ──────────────────
function startSubpageHeroAnim() {
  const pageHero = document.querySelector('.page-hero');
  if (!pageHero) return;

  const tl = gsap.timeline();
  const bgGrid = pageHero.querySelector('.hero-bg-grid');
  const bgGlow = pageHero.querySelector('.hero-bg-glow');
  if (bgGrid) tl.from(bgGrid, { opacity: 0, scale: 1.05, duration: 1.2, ease: 'power3.out' }, 0);
  if (bgGlow) tl.from(bgGlow, { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out' }, 0);

  const title = pageHero.querySelector('h1');
  if (title) {
    splitTextIntoSpans(title);
  }

  const breadcrumb = pageHero.querySelector('.breadcrumb');
  const label = pageHero.querySelector('.sec-label');
  const paragraph = pageHero.querySelector('p');

  if (breadcrumb) tl.from(breadcrumb, { opacity: 0, y: 15, duration: 0.6, ease: 'power3.out' }, '-=0.8');
  if (label) tl.from(label, { opacity: 0, x: -20, duration: 0.6, ease: 'power3.out' }, '-=0.5');

  if (title) {
    const chars = title.querySelectorAll('.char');
    tl.from(chars, {
      opacity: 0,
      y: 40,
      rotateX: -30,
      stagger: 0.01,
      duration: 0.7,
      ease: 'power3.out',
      transformOrigin: 'top center'
    }, '-=0.4');
  }

  if (paragraph) tl.from(paragraph, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4');
}

// ── NAV scroll ──────────────────────────────
const nav = document.getElementById('main-nav');
ScrollTrigger.create({
  start: 'top -60',
  onToggle: self => nav.classList.toggle('scrolled', self.isActive)
});

// ── SCROLL PROGRESS BAR ─────────────────────
const progressBar = document.getElementById('scroll-progress');
const updateProgress = () => {
  const h = document.documentElement;
  const scrolled = h.scrollHeight - h.clientHeight;
  const pct = scrolled > 0 ? (h.scrollTop / scrolled) * 100 : 0;
  progressBar.style.width = pct + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── NAV smooth scroll ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      gsap.to(window, { duration: 1.2, scrollTo: { y: id, offsetY: 80 }, ease: 'power3.inOut' });
    }
  });
});

// ── ABOUT ───────────────────────────────────
const aboutSec = document.getElementById('about');
if (aboutSec) {
  gsap.from('#about .about-photo', {
    scrollTrigger: { trigger: '#about', start: 'top 70%' },
    x: -60, opacity: 0, duration: 1.1, ease: 'power3.out'
  });
  gsap.from('#about .about-text > *', {
    scrollTrigger: { trigger: '#about', start: 'top 65%' },
    y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out'
  });
  gsap.from('#about .about-tag', {
    scrollTrigger: { trigger: '#about .about-tags', start: 'top 85%' },
    scale: 0.8, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(1.7)'
  });
  const photoInner = aboutSec.querySelector('.about-photo-inner');
  if (photoInner) {
    gsap.to(photoInner, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }
}

// ── NUMBERS — counter animation ─────────────
const numbersSec = document.getElementById('numbers');
if (numbersSec) {
  const statsGrid = numbersSec.querySelector('.stats-grid');
  if (statsGrid) {
    const cards = statsGrid.querySelectorAll('.stat-card');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsGrid,
        start: 'top 80%',
        once: true
      }
    });

    tl.from(cards, {
      y: 50,
      opacity: 0,
      stagger: {
        each: 0.1,
        onStart: function() {
          const card = this.targets()[0];
          const el = card.querySelector('.stat-num[data-count]');
          if (el) {
            const target = parseFloat(el.dataset.count);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const decimals = parseInt(el.dataset.decimals || 0);
            let obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 1.8, ease: 'power2.out',
              onUpdate: () => { el.textContent = prefix + obj.val.toFixed(decimals) + suffix; }
            });
          }
        }
      },
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  // Watermark parallax
  const wm = numbersSec.querySelector('.numbers-wm');
  if (wm) {
    gsap.to(wm, {
      x: 60, ease: 'none',
      scrollTrigger: { trigger: numbersSec, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }

  // Title reveal
  // const numTitle = numbersSec.querySelector('.sec-title');
  // if (numTitle) {
  //   gsap.from(numTitle, {
  //     scrollTrigger: { trigger: numbersSec, start: 'top 0%', once: true },
  //     duration: 1, ease: 'power3.out',
  //     y: 60, opacity: 0
  //   });
  // }
}

// ── SERVICES horizontal scroll ───────────────
const isMobile = window.innerWidth <= 900;
if (!isMobile && document.getElementById('services-track')) {
  const track = document.getElementById('services-track');
  const cards = gsap.utils.toArray('.service-card');
  const totalWidth = () => track.scrollWidth - window.innerWidth + 120;

  const horizScroll = gsap.to(track, {
    x: () => -totalWidth(),
    ease: 'none',
    scrollTrigger: {
      trigger: '#services-pin',
      start: 'top top',
      end: () => `+=${totalWidth() + 200}`,
      scrub: 1,
      pin: '#services-sticky',
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // each card reveals as it enters view
  cards.forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      x: 80,
      scrollTrigger: {
        trigger: card,
        containerAnimation: horizScroll,
        start: 'left 95%',
        end: 'left 70%',
        scrub: 0.5,
      }
    });
  });
}

// ── CLIENTS ─────────────────────────────────
const clientsSec = document.getElementById('clients');
if (clientsSec) {
  const clientsGrid = clientsSec.querySelector('.clients-grid');
  if (clientsGrid) {
    gsap.from('#clients .client-card', {
      scrollTrigger: { trigger: clientsGrid, start: 'top 80%' },
      y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out'
    });
  }
  const clientsHeader = clientsSec.querySelector('.clients-header');
  if (clientsHeader) {
    gsap.from(clientsHeader.children, {
      scrollTrigger: { trigger: clientsHeader, start: 'top 85%' },
      y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
    });
  }
}

// ── CASE STUDIES ────────────────────────────
const casesSec = document.getElementById('cases');
if (casesSec) {
  const casesList = casesSec.querySelector('.cases-list');
  if (casesList) {
    gsap.utils.toArray('.case-card').forEach((card, i) => {
      const caseNum = card.querySelector('.case-num');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 80%' }
      });
      tl.from(card, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
      if (caseNum) {
        tl.from(caseNum, {
          x: -30, opacity: 0, duration: 0.9, ease: 'power3.out'
        }, '-=0.5');
      }
    });
  }
}

// ── TESTIMONIALS ────────────────────────────
const testimonialsSec = document.getElementById('testimonials');
if (testimonialsSec) {
  gsap.from('#testimonials .testi-card', {
    scrollTrigger: { trigger: '#testimonials .testimonials-slider, #testimonials .testimonials-grid', start: 'top 75%' },
    y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out'
  });
}

document.querySelectorAll('.testimonials-slider').forEach((slider) => {
  const track = slider.querySelector('.testimonials-track');
  const cards = Array.from(slider.querySelectorAll('.testi-card'));
  const prevBtn = slider.querySelector('.testimonials-prev');
  const nextBtn = slider.querySelector('.testimonials-next');
  const dotsWrap = slider.parentElement.querySelector('.testimonials-dots');
  if (!track || cards.length <= 1) return;

  let index = 0;
  let autoplay;
  let dots = [];

  const getVisibleCount = () => window.innerWidth <= 900 ? 1 : 3;

  const maxIndex = () => Math.max(0, cards.length - getVisibleCount());

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    dots = Array.from({ length: maxIndex() + 1 }, (_, dotIndex) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to testimonial group ${dotIndex + 1}`);
      dot.addEventListener('click', () => {
        goTo(dotIndex);
        startAutoplay();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
  };

  const syncSlider = () => {
    const gap = window.innerWidth <= 900 ? 0 : 12;
    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    gsap.to(track, {
      x: -index * cardWidth,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: true
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });

    if (prevBtn) prevBtn.disabled = maxIndex() === 0;
    if (nextBtn) nextBtn.disabled = maxIndex() === 0;
  };

  const goTo = (nextIndex) => {
    index = Math.max(0, Math.min(nextIndex, maxIndex()));
    syncSlider();
  };

  const startAutoplay = () => {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      index = index >= maxIndex() ? 0 : index + 1;
      syncSlider();
    }, 4200);
  };

  prevBtn?.addEventListener('click', () => {
    goTo(index <= 0 ? maxIndex() : index - 1);
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    goTo(index >= maxIndex() ? 0 : index + 1);
    startAutoplay();
  });

  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', () => {
    buildDots();
    index = Math.min(index, maxIndex());
    syncSlider();
    startAutoplay();
  });

  buildDots();
  syncSlider();
  startAutoplay();
});

// ── CONTACT ─────────────────────────────────
const contactSec = document.getElementById('contact');
if (contactSec) {
  const leftContent = contactSec.querySelector('.contact-left');
  const rightContent = contactSec.querySelector('.contact-right');
  if (leftContent) {
    gsap.from(leftContent.children, {
      scrollTrigger: { trigger: contactSec, start: 'top 75%' },
      y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out'
    });
  }
  if (rightContent) {
    gsap.from(rightContent, {
      scrollTrigger: { trigger: contactSec, start: 'top 75%' },
      x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15
    });
  }
}

// ── SUBPAGE GRID STAGGERS ───────────────────
const servicesGrid = document.querySelector('.services-grid');
if (servicesGrid) {
  gsap.from('.svc-cell', {
    scrollTrigger: { trigger: servicesGrid, start: 'top 80%' },
    y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
  });
}

const processGrid = document.querySelector('.process-grid');
if (processGrid) {
  gsap.from('.process-step', {
    scrollTrigger: { trigger: processGrid, start: 'top 80%' },
    y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out'
  });
}

// Helper to recursively split text nodes into individual character spans, wrapping words in inline-block containers to prevent mid-word wrapping.
// Trims and normalizes HTML indentation whitespaces to prevent alignment shifting.
function splitTextIntoSpans(element) {
  const nodes = Array.from(element.childNodes);
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      // Normalize leading and trailing HTML source newlines and spaces
      if (text.includes('\n') || text.includes('\r')) {
        text = text.replace(/^[\r\n\s]+/, '').replace(/[\r\n\s]+$/, '');
        text = text.replace(/[\r\n\s]+/g, ' ');
      }
      
      // If the node becomes empty after normalisation (e.g. it was only indentation), skip it
      if (text === '') {
        node.parentNode.removeChild(node);
        return;
      }
      
      const container = document.createDocumentFragment();
      // Split by words, maintaining whitespaces
      const words = text.split(/(\s+)/);
      
      words.forEach(word => {
        if (word.trim() === '') {
          // Whitespace node
          for (let char of word) {
            const span = document.createElement('span');
            span.className = 'char space';
            span.style.display = 'inline-block';
            span.innerHTML = '&nbsp;';
            container.appendChild(span);
          }
        } else {
          // Word node, wrap to prevent mid-word wrap
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          
          for (let char of word) {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.display = 'inline-block';
            span.textContent = char;
            wordSpan.appendChild(span);
          }
          container.appendChild(wordSpan);
        }
      });
      node.parentNode.replaceChild(container, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName !== 'BR' && !node.classList.contains('char') && !node.classList.contains('word')) {
        splitTextIntoSpans(node);
      }
    }
  });
}

// ── SECTION TITLES — split char reveal ──────
gsap.utils.toArray('.sec-title').forEach(title => {
  splitTextIntoSpans(title);
  const chars = title.querySelectorAll('.char');
  if (chars.length > 0) {
    gsap.from(chars, {
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
      opacity: 0,
      y: 40,
      rotateX: -35,
      stagger: 0.015,
      duration: 0.8,
      ease: 'power3.out',
      transformOrigin: 'top center'
    });
  }
});

// ── SEC LABELS slide in ──────────────────────
gsap.utils.toArray('.sec-label').forEach(label => {
  gsap.from(label, {
    scrollTrigger: { trigger: label, start: 'top 90%', once: true },
    x: -20, opacity: 0, duration: 0.6, ease: 'power3.out'
  });
});

// ── NUMBERS section title type effect ────────
gsap.from('#numbers .sec-title', {
  scrollTrigger: { trigger: '#numbers', start: 'top 70%', once: true },
  duration: 1.2, ease: 'power3.out',
  y: 60, opacity: 0
});

// ── PARALLAX on glow elements ────────────────
const heroSec = document.getElementById('hero');
if (heroSec) {
  const glow = heroSec.querySelector('.hero-bg-glow');
  const glow2 = heroSec.querySelector('.hero-bg-glow2');
  const headline = heroSec.querySelector('.hero-headline');
  if (glow) {
    gsap.to(glow, {
      yPercent: 40, ease: 'none',
      scrollTrigger: { trigger: heroSec, start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
  if (glow2) {
    gsap.to(glow2, {
      yPercent: -30, ease: 'none',
      scrollTrigger: { trigger: heroSec, start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
  if (headline) {
    gsap.from(headline, {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: heroSec, start: 'top top', end: 'center top', scrub: 0.8 }
    });
  }
}

// ── METRIC CARDS float ───────────────────────
// (Removed as we now use the interactive live dashboard console)

// ── FOOTER animate ───────────────────────────
gsap.from('footer > *', {
  scrollTrigger: { trigger: 'footer', start: 'top 90%', once: true },
  y: 20, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out'
});

// ── FORM submit ──────────────────────────────
const formSubmitBtn = document.getElementById('form-submit');
if (formSubmitBtn) {
  formSubmitBtn.addEventListener('click', function () {
    const btn = this;
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    gsap.to(btn, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
    setTimeout(() => {
      btn.textContent = '✓ Sent! Our team will reply within 24h';
      btn.style.background = '#1a7a1a';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }, 1000);
  });
}

// ── MOBILE MENU ─────────────────────────────
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerBtn = document.getElementById('hamburger');
let isMenuOpen = false;
let menuTimeline;

if (mobileMenu && hamburgerBtn) {
  const spans = hamburgerBtn.querySelectorAll('span');
  const menuLinks = mobileMenu.querySelectorAll('a');

  // Set initial states
  gsap.set(mobileMenu, { yPercent: -100, opacity: 0 });
  gsap.set(menuLinks, { opacity: 0, y: 20 });

  menuTimeline = gsap.timeline({ paused: true });

  menuTimeline
    .to(mobileMenu, {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.inOut'
    })
    .to(spans[0], { y: 6, rotate: 45, duration: 0.3, ease: 'power2.inOut' }, 0)
    .to(spans[1], { opacity: 0, scaleX: 0, duration: 0.2, ease: 'power2.inOut' }, 0)
    .to(spans[2], { y: -6, rotate: -45, duration: 0.3, ease: 'power2.inOut' }, 0)
    .to(menuLinks, {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.4,
      ease: 'back.out(1.5)'
    }, '-=0.15');

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    isMenuOpen = true;
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    menuTimeline.play();
  }

  function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    menuTimeline.reverse();
  }

  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  hamburgerBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMobileMenu(); }
  });

  menuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Expose globally
  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
}



// ── CLIENT cards stagger wave ────────────────
gsap.utils.toArray('.client-card').forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
});

// ── STAT card tilt on hover ──────────────────
document.querySelectorAll('.stat-card, .db-stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width * 6;
    const y = -(e.clientY - r.top - r.height / 2) / r.height * 6;
    gsap.to(card, { rotateY: x, rotateX: y, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
  });
});

// ── VELOCITY SKEW (scroll-velocity driven) ───
(function () {
  const targets = gsap.utils.toArray('.bento-tile, .case-title');
  if (!targets.length) return;
  gsap.set(targets, { transformOrigin: 'right center', force3D: true });
  const skewSetter = gsap.quickSetter(targets, 'skewY', 'deg');
  const clamp = gsap.utils.clamp(-7, 7);
  const proxy = { skew: 0 };

  ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -380);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0, duration: 0.7, ease: 'power3',
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew)
        });
      }
    }
  });
})();

// ── CURSOR-TRACKING IMAGE PREVIEW ────────────
// Modern GSAP polish: magnetic CTAs, cursor spotlights, and scroll depth.
(function () {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const spotlightTargets = document.querySelectorAll('.stat-card, .service-card, .case-card, .testi-card, .client-card, .bento-tile');
  const magneticTargets = document.querySelectorAll('.btn-pill-primary, .nav-cta-pill, .btn-cta-white, .form-submit, .testimonials-nav');

  spotlightTargets.forEach((card) => {
    card.classList.add('motion-spotlight');
    if (!canHover) return;

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  if (canHover) {
    magneticTargets.forEach((el) => {
      el.classList.add('magnetic-target');
      el.addEventListener('mousemove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x * 0.18,
          y: y * 0.22,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: true
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.45)',
          overwrite: true
        });
      });
    });
  }

  gsap.utils.toArray('section').forEach((section) => {
    section.classList.add('section-depth');
    gsap.fromTo(section,
      { opacity: 0.88, y: 18 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          end: 'top 58%',
          scrub: true
        }
      }
    );
  });
})();

(function () {
  const canHover = window.matchMedia('(hover: hover)').matches && window.innerWidth > 900;
  const triggers = document.querySelectorAll('.client-card, .case-card');
  if (!canHover || !triggers.length) return;

  // on-brand gradient "thumbnails" (offline-safe, luxe look)
  const palettes = [
    'linear-gradient(135deg,#E00000,#360000)',
    'linear-gradient(135deg,#1a1a1a,#000)',
    'linear-gradient(135deg,#2b0000,#E00000)',
    'linear-gradient(135deg,#111,#3a0000)',
    'linear-gradient(135deg,#E00000,#7a0000)',
    'linear-gradient(135deg,#000,#222)',
    'linear-gradient(135deg,#4a0000,#E00000)',
    'linear-gradient(135deg,#181818,#2b0000)',
    'linear-gradient(135deg,#E00000,#1a1a1a)'
  ];

  const preview = document.createElement('div');
  preview.className = 'cursor-preview';
  const label = document.createElement('div');
  label.className = 'cp-label';
  preview.appendChild(label);
  document.body.appendChild(preview);
  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6 });

  let px = window.innerWidth / 2, py = window.innerHeight / 2;
  const xSet = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const ySet = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });

  document.addEventListener('mousemove', e => { px = e.clientX; py = e.clientY; xSet(px); ySet(py); });

  triggers.forEach((el, i) => {
    el.addEventListener('mouseenter', () => {
      const name = el.querySelector('.client-name, .case-title');
      label.textContent = name ? name.textContent.trim() : 'View';
      preview.style.background = palettes[i % palettes.length];
      document.body.classList.add('has-preview');
      preview.classList.add('show');
      gsap.to(preview, { scale: 1, rotate: gsap.utils.random(-5, 5), duration: 0.5, ease: 'power3.out' });
      if (cursorEl) {
        gsap.to(cursorEl, { opacity: 0, duration: 0.25, overwrite: 'auto' });
      }
    });
    el.addEventListener('mouseleave', () => {
      preview.classList.remove('show');
      document.body.classList.remove('has-preview');
      gsap.to(preview, { scale: 0.6, duration: 0.4, ease: 'power3.in' });
      if (cursorEl) {
        gsap.to(cursorEl, { opacity: 1, duration: 0.25, overwrite: 'auto' });
      }
    });
  });
})();

// ── SCRUBBED BENTO GALLERY (parallax) ────────
const bentoSec = document.getElementById('bento');
if (bentoSec) {
  const tiles = gsap.utils.toArray('.bento-tile');
  if (tiles.length) {
    // entrance scrub
    gsap.from(tiles, {
      scrollTrigger: { trigger: bentoSec, start: 'top 80%', end: 'top 30%', scrub: 1 },
      y: 60, opacity: 0, stagger: 0.06, ease: 'none'
    });

    // inner parallax
    tiles.forEach((tile, i) => {
      const inner = tile.querySelector('.b-inner');
      if (!inner) return;
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.fromTo(inner,
        { yPercent: -8 * dir },
        {
          yPercent: 8 * dir, ease: 'none',
          scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    });
  }
}
