// Main JavaScript file for the multi-template project

(function() {
  'use strict';

  // Initialize the application
  function init() {
    console.log('🚀 Multi-Template Project initialized');
    
    // Initialize components
    initNavbar();
    initSidebar();
    initCards();
    initButtons();
  }

  // Initialize navbar functionality
  function initNavbar() {
    const navbar = document.querySelector('#header');
    if (!navbar) return;

    // Add scroll effect
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });

    // Mobile menu toggle
    const mobileToggle = navbar.querySelector('.navbar-toggler');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function() {
        navbar.classList.toggle('navbar-mobile-open');
      });
    }
  }

  // Initialize sidebar functionality
  function initSidebar() {
    const sidebar = document.querySelector('.navbar-vertical-aside');
    if (!sidebar) return;

    // Sidebar toggle
    const toggle = sidebar.querySelector('.navbar-vertical-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        sidebar.classList.toggle('navbar-vertical-aside-collapsed');
      });
    }

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = sidebar.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  // Initialize card interactions
  function initCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      // Add hover effects
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // Initialize button interactions
  function initButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add click ripple effect
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Expose public API
  window.MultiTemplate = {
    init: init,
    debounce: debounce,
    throttle: throttle
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); 