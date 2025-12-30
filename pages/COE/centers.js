// Centers of Excellence Page JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('menu-open');
      }
    });
  }

  // Add scrolled class to header on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Read More functionality for Objectives
  const objectivesCard = document.querySelector('.info-card:first-child');
  if (objectivesCard) {
    const objectivesList = objectivesCard.querySelector('.info-list');
    const listItems = objectivesList.querySelectorAll('li');
    
    // Only add read more if there are more than 3 items
    if (listItems.length > 3) {
      // Add collapsed class initially
      objectivesList.classList.add('collapsed');
      
      // Create read more button
      const readMoreBtn = document.createElement('button');
      readMoreBtn.className = 'read-more-btn';
      readMoreBtn.innerHTML = '<span>Read More</span><i class="fas fa-chevron-down"></i>';
      
      // Insert button after the list
      objectivesList.parentNode.insertBefore(readMoreBtn, objectivesList.nextSibling);
      
      // Toggle functionality
      readMoreBtn.addEventListener('click', function() {
        objectivesList.classList.toggle('collapsed');
        this.classList.toggle('expanded');
        
        if (objectivesList.classList.contains('collapsed')) {
          this.innerHTML = '<span>Read More</span><i class="fas fa-chevron-down"></i>';
        } else {
          this.innerHTML = '<span>Read Less</span><i class="fas fa-chevron-down"></i>';
        }
      });
    }
  }

  // Intersection Observer for card animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe info cards and institute cards
  const allCards = document.querySelectorAll('.info-card, .institute-card');
  allCards.forEach(card => {
    cardObserver.observe(card);
  });
});