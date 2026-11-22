/**
 * SHIVANI M. - DEVELOPER PORTFOLIO SCRIPT
 * Vanilla JavaScript (ES6+)
 * Capabilities:
 * - Mobile navigation menu toggle & accessibility
 * - Navbar glassmorphism on scroll
 * - Active section tracking via IntersectionObserver
 * - Typewriter text cycling animation in Hero
 * - Scroll reveal animations
 * - Contact form client-side validation & feedback
 * - Back to top floating button
 * - Dynamic copyright year
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. CONSTANTS & DOM REFERENCES
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');
  const currentYearSpan = document.getElementById('currentYear');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  /* ==========================================================================
     2. DYNAMIC CURRENT YEAR
     ========================================================================== */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     3. NAVBAR SCROLL EFFECT
     ========================================================================== */
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on initial load

  /* ==========================================================================
     4. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const toggleMobileNav = (open) => {
    const isExpanded = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', isExpanded.toString());
    menuToggle.classList.toggle('active', isExpanded);
    mobileMenu.classList.toggle('open', isExpanded);
    mobileMenu.setAttribute('aria-hidden', (!isExpanded).toString());
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });

    // Close when mobile nav links are clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileNav(false);
      });
    });

    // Close when clicking outside mobile menu
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        toggleMobileNav(false);
      }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileNav(false);
        menuToggle.focus();
      }
    });

    // Close mobile menu on resize to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && mobileMenu.classList.contains('open')) {
        toggleMobileNav(false);
      }
    });
  }

  /* ==========================================================================
     5. SMOOTH SCROLLING WITH NAVBAR OFFSET
     ========================================================================== */
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  allAnchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility without jumping
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  /* ==========================================================================
     6. ACTIVE SECTION HIGHLIGHT ON SCROLL
     ========================================================================== */
  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ==========================================================================
     7. BACK TO TOP BUTTON
     ========================================================================== */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     8. ANIMATED SUBTITLE TYPING EFFECT
     ========================================================================== */
  const typingTarget = document.getElementById('typingTarget');
  const roles = [
    'Software Developer',
    'Web Development Enthusiast',
    'Data Science & AI Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  const typeRoles = () => {
    if (!typingTarget) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45; // Faster deletion
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95; // Natural typing speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, proceed to next word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Small delay before next word starts
    }

    setTimeout(typeRoles, typingSpeed);
  };

  typeRoles();

  /* ==========================================================================
     9. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach((el) => el.classList.add('active'));
  }

  /* ==========================================================================
     10. CONTACT FORM VALIDATION & USER NOTIFICATION
     ========================================================================== */
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper: Clear specific field error
    const clearError = (input, errorSpan) => {
      input.classList.remove('invalid');
      errorSpan.textContent = '';
    };

    // Helper: Display field error
    const setError = (input, errorSpan, message) => {
      input.classList.add('invalid');
      errorSpan.textContent = message;
    };

    // Real-time input listeners to clear errors on typing
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    subjectInput.addEventListener('input', () => clearError(subjectInput, subjectError));
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setError(nameInput, nameError, 'Please enter your name.');
        isValid = false;
      } else if (nameVal.length < 2) {
        setError(nameInput, nameError, 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setError(emailInput, emailError, 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Subject
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        setError(subjectInput, subjectError, 'Please enter a subject.');
        isValid = false;
      } else if (subjectVal.length < 3) {
        setError(subjectInput, subjectError, 'Subject must be at least 3 characters.');
        isValid = false;
      } else {
        clearError(subjectInput, subjectError);
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setError(messageInput, messageError, 'Please enter your message.');
        isValid = false;
      } else if (messageVal.length < 10) {
        setError(messageInput, messageError, 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (isValid) {
        // Feedback explaining frontend demo status and offering direct email
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong><i class="fas fa-check-circle"></i> Inputs Validated Successfully!</strong><br>
          Thank you, <em>${encodeHTML(nameVal)}</em>. Your message draft is complete.<br>
          <small style="display:inline-block; margin-top:6px; opacity:0.9;">
            <strong>Note:</strong> As this is a client-side frontend portfolio, an email endpoint (e.g. Formspree / EmailJS) or backend handler is required to forward messages automatically. You can also reach Shivani directly at 
            <a href="mailto:shivakanmani02@gmail.com" style="text-decoration:underline; font-weight:600; color:inherit;">shivakanmani02@gmail.com</a>.
          </small>
        `;

        // Reset inputs
        contactForm.reset();

        // Smooth scroll to feedback message
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = `
          <strong><i class="fas fa-circle-exclamation"></i> Form Incomplete</strong><br>
          Please correct the highlighted fields above before submitting.
        `;
      }
    });
  }

  // Security Helper: Encode HTML to prevent XSS in feedback rendering
  function encodeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /* ==========================================================================
     11. CONSOLE GREETING FOR FELLOW DEVELOPERS
     ========================================================================== */
  console.log(
    '%c Shivani M. | Developer Portfolio %c Designed & Engineered with Vanilla Web Standards %c',
    'background: #7C3AED; color: #FFF; padding: 6px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #1E293B; color: #38BDF8; padding: 6px 12px; border-radius: 0 4px 4px 0;',
    'background: transparent;'
  );
});
