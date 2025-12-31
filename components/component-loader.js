// Component Loader with Bootstrap Dropdown Support
// This script dynamically loads header and footer components into pages

(function() {
  // Function to load a component
  function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${componentPath}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        element.innerHTML = html;
        
        // Fix relative paths based on current page location
        fixRelativePaths(element);
        
        // If it's the header, reinitialize mobile menu and Bootstrap dropdowns
        if (elementId === 'header-component') {
          initializeMobileMenu();
          initializeBootstrapDropdowns();
        }
      })
      .catch(error => {
        console.error('Error loading component:', error);
      });
  }

  // Function to initialize Bootstrap dropdowns after component loads
  function initializeBootstrapDropdowns() {
    let attempts = 0;
    const maxAttempts = 20;
    
    function tryInitialize() {
      attempts++;
      
      // Check if Bootstrap is loaded
      if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
        // Initialize all dropdowns
        const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
        console.log('Found dropdown toggles:', dropdownElementList.length);
        
        dropdownElementList.forEach(dropdownToggleEl => {
          // Destroy existing instance if any
          const existingInstance = bootstrap.Dropdown.getInstance(dropdownToggleEl);
          if (existingInstance) {
            existingInstance.dispose();
          }
          
          // Create new instance
          new bootstrap.Dropdown(dropdownToggleEl, {
            autoClose: true
          });
        });
        
        console.log('Bootstrap dropdowns initialized successfully!');
        return true;
      } else {
        if (attempts < maxAttempts) {
          console.log(`Bootstrap not ready yet, attempt ${attempts}/${maxAttempts}`);
          setTimeout(tryInitialize, 100);
        } else {
          console.error('Bootstrap failed to load after', maxAttempts, 'attempts. Using fallback.');
          useFallbackDropdown();
        }
        return false;
      }
    }
    
    // Start trying to initialize
    setTimeout(tryInitialize, 50);
  }
  
  // Fallback dropdown functionality if Bootstrap doesn't load
  function useFallbackDropdown() {
    console.log('Using fallback dropdown implementation');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      const dropdown = toggle.nextElementSibling;
      
      if (dropdown && dropdown.classList.contains('dropdown-menu')) {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other dropdowns
          document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== dropdown) {
              menu.classList.remove('show');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('show');
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
          if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
          }
        });
      }
    });
  }

  // Function to initialize mobile menu toggle
  function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle, .csi-component-menu-toggle');
    const navLinks = document.querySelector('.nav-links, .csi-component-nav');
    const navLinksList = document.querySelectorAll('.nav-links a, .csi-component-nav a, .dropdown-item');
    const body = document.body;
    
    console.log('Initializing mobile menu...', {
      toggleFound: !!mobileMenuToggle,
      navFound: !!navLinks,
      linkCount: navLinksList.length
    });
    
    if (mobileMenuToggle && navLinks) {
      // Remove any existing listeners by cloning
      const newToggle = mobileMenuToggle.cloneNode(true);
      mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
      
      newToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Toggle clicked!');
        navLinks.classList.toggle('open');
        navLinks.classList.toggle('mobile-nav-active');
        body.classList.toggle('menu-open');
        console.log('Nav classes:', navLinks.classList.toString());
      });
      
      // Close menu when a link is clicked
      navLinksList.forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navLinks.classList.remove('mobile-nav-active');
          body.classList.remove('menu-open');
        });
      });
      
      // Close menu when clicking outside
      setTimeout(() => {
        document.addEventListener('click', function(e) {
          const currentToggle = document.querySelector('.mobile-menu-toggle, .csi-component-menu-toggle');
          if (currentToggle && !currentToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            navLinks.classList.remove('mobile-nav-active');
            body.classList.remove('menu-open');
          }
        });
      }, 100);
    }
  }

  // Determine the base path based on current page location
  function getBasePath() {
    const path = window.location.pathname;
    
    // If we're in a subdirectory (like /pages/About/)
    if (path.includes('/pages/')) {
      return '../..';
    }
    
    // If we're in the root
    return '.';
  }

  // Function to fix relative paths in loaded components
  function fixRelativePaths(container) {
    const basePath = getBasePath();
    
    // Fix all images with data-src attribute
    const images = container.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const relativePath = img.getAttribute('data-src');
      img.src = `${basePath}/${relativePath}`;
    });
    
    // Fix all links with data-href attribute
    const links = container.querySelectorAll('a[data-href]');
    links.forEach(link => {
      const relativePath = link.getAttribute('data-href');
      link.href = `${basePath}/${relativePath}`;
    });
  }

  // Load components when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const basePath = getBasePath();
    
    // Load header if placeholder exists
    if (document.getElementById('header-component')) {
      loadComponent('header-component', `${basePath}/components/header.html`);
    }
    
    // Load footer if placeholder exists
    if (document.getElementById('footer-component')) {
      loadComponent('footer-component', `${basePath}/components/footer.html`);
    }
  });
})();