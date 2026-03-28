// main.js — Dental Clinic Website

/* =============================================
   Navbar — hide on scroll down / show on scroll up
            + light mode past hero
   ============================================= */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var lastScrollY = window.scrollY;
  var mobileMenu = document.getElementById('mobile-menu');

  function isMobileMenuOpen() {
    return mobileMenu && mobileMenu.classList.contains('open');
  }

  window.addEventListener('scroll', function () {
    var currentScrollY = window.scrollY;

    // Light mode: past hero (100vh)
    if (currentScrollY > window.innerHeight) {
      navbar.classList.add('navbar-light');
    } else {
      navbar.classList.remove('navbar-light');
    }

    // Hide/show: only when menu is closed and scrolled more than 10px
    if (!isMobileMenuOpen()) {
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
})();

/* =============================================
   Navbar — hamburger / mobile menu
   ============================================= */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  hamburger.addEventListener('click', function () {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a mobile nav link is clicked
  mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (isOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
})();

/* =============================================
   Team — cards fade-in + scale on scroll
   ============================================= */
(function () {
  var cards = document.querySelectorAll('.team-card');
  if (!cards.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var index = parseInt(el.getAttribute('data-team-index'), 10);
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 80);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function (el, i) {
    el.setAttribute('data-team-index', i);
    observer.observe(el);
  });
})();

/* =============================================
   Why Us — stat counter animation
   ============================================= */
(function () {
  var section = document.getElementById('dlaczego-my');
  if (!section) return;

  var counters = section.querySelectorAll('.stat-number');
  var triggered = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = target >= 100 ? 1500 : target >= 10 ? 1500 : 800;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(animateCounter);
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
})();

/* =============================================
   Why Us — feature rows fade-in from right
   ============================================= */
(function () {
  var features = document.querySelectorAll('.trust-feature');
  if (!features.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var index = parseInt(el.getAttribute('data-index'), 10);
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 100);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  features.forEach(function (el, i) {
    el.setAttribute('data-index', i);
    observer.observe(el);
  });
})();

/* =============================================
   Transformations — scroll animations
   ============================================= */
(function () {
  var section = document.getElementById('metamorfozy');
  if (!section) return;

  // Featured card: fade in from left
  var featured = document.getElementById('transformation-featured');
  if (featured) {
    var featuredObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          featuredObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    featuredObserver.observe(featured);
  }

  // Small cards: stagger fade in from bottom
  var smallCards = section.querySelectorAll('.transformation-small-card');
  if (smallCards.length) {
    var smallObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var index = parseInt(el.getAttribute('data-small-index'), 10);
          setTimeout(function () {
            el.classList.add('visible');
          }, index * 120);
          smallObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    smallCards.forEach(function (el, i) {
      el.setAttribute('data-small-index', i);
      smallObserver.observe(el);
    });
  }
})();

/* =============================================
   CTA — location toggle + scroll animations
   ============================================= */
(function () {
  // Location toggle
  var locationBtns = document.querySelectorAll('.location-btn');
  var zlBtn        = document.getElementById('cta-zl-btn');
  var phoneBtn     = document.getElementById('cta-phone-btn');
  var phoneText    = document.getElementById('cta-phone-text');
  var addressEl    = document.getElementById('cta-location-address');

  locationBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      locationBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Swap content from data attributes
      if (zlBtn)     zlBtn.href        = btn.dataset.zlHref;
      if (phoneBtn)  phoneBtn.href     = btn.dataset.tel;
      if (phoneText) phoneText.textContent = 'Zadzwoń: ' + btn.dataset.phone;
      if (addressEl) addressEl.textContent = btn.dataset.address;
    });
  });

  // Scroll animations
  var section = document.getElementById('umow-wizyte');
  if (!section) return;

  var left = document.getElementById('cta-left');
  var card = document.getElementById('cta-card');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Left col fires immediately, card 100ms later
        if (entry.target === left) {
          left.classList.add('visible');
          setTimeout(function () {
            if (card) card.classList.add('visible');
          }, 100);
          observer.unobserve(left);
          if (card) observer.unobserve(card);
        }
      }
    });
  }, { threshold: 0.15 });

  if (left) observer.observe(left);
})();

/* =============================================
   FAQ — accordion logic
   ============================================= */
(function () {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      // Close all items
      items.forEach(function (el) {
        el.classList.remove('active');
        var q = el.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it was closed
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* =============================================
   FAQ — scroll animations
   ============================================= */
(function () {
  var section = document.getElementById('faq');
  if (!section) return;

  // Left column: fade in from left
  var left = section.querySelector('.faq-left');
  if (left) {
    var leftObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          leftObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    leftObserver.observe(left);
  }

  // FAQ items: stagger fade in from right
  var items = section.querySelectorAll('.faq-item');
  if (items.length) {
    var itemsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var index = parseInt(el.getAttribute('data-faq-index'), 10);
          setTimeout(function () {
            el.classList.add('visible');
          }, index * 60);
          itemsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.08 });

    items.forEach(function (el, i) {
      el.setAttribute('data-faq-index', i);
      itemsObserver.observe(el);
    });
  }
})();

/* =============================================
   Reviews — scroll animations
   ============================================= */
(function () {
  var section = document.getElementById('opinie');
  if (!section) return;

  // Featured review: fade in from bottom
  var featured = document.getElementById('reviews-featured');
  if (featured) {
    var featuredObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          featuredObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    featuredObserver.observe(featured);
  }

  // Small review cards: stagger fade in from bottom
  var cards = section.querySelectorAll('.review-card');
  if (cards.length) {
    var cardsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var index = parseInt(el.getAttribute('data-review-index'), 10);
          setTimeout(function () {
            el.classList.add('visible');
          }, index * 80);
          cardsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (el, i) {
      el.setAttribute('data-review-index', i);
      cardsObserver.observe(el);
    });
  }
})();

/* =============================================
   Footer — smooth scroll for nav links
   ============================================= */
(function () {
  var scrollLinks = document.querySelectorAll('.footer-link[href^="#"], .nav-link[href^="#"], .mobile-nav-link[href^="#"], .navbar-cta[href^="#"], .mobile-cta[href^="#"]');
  if (!scrollLinks.length) return;

  scrollLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (!target) return;
      var offset = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      // Close mobile menu if open
      var menu = document.getElementById('mobile-menu');
      if (menu && menu.getAttribute('aria-hidden') === 'false') {
        document.getElementById('hamburger').click();
      }
    });
  });
})();

/* =============================================
   Navbar — active link via IntersectionObserver
   ============================================= */
(function () {
  const sectionIds = ['dlaczego-my', 'uslugi', 'zespol', 'metamorfozy', 'opinie', 'umow-wizyte'];
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function setActive(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sectionIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})()