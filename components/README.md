# Reusable Components

This folder contains reusable header and footer components for the Cyber Secured India website.

## Files

- **header.html** - Site header with navigation and social links
- **footer.html** - Site footer with contact info, links, and social media
- **component-loader.js** - JavaScript loader that dynamically injects components into pages

## Usage

To use these components in any page:

1. Add placeholder divs in your HTML:
```html
<body>
  <!-- Header Component -->
  <div id="header-component"></div>
  
  <!-- Your page content here -->
  
  <!-- Footer Component -->
  <div id="footer-component"></div>
  
  <!-- Load the component loader script -->
  <script src="../../components/component-loader.js"></script>
  <script src="../../script.js"></script>
</body>
```

2. Make sure the path to `component-loader.js` is correct based on your page location:
   - For root pages (like index.html): `components/component-loader.js`
   - For pages in subdirectories (like pages/About/): `../../components/component-loader.js`

## Features

### Header Component
- Responsive navigation menu
- Mobile hamburger menu with toggle functionality
- Social media icons (Instagram, Telegram, LinkedIn)
- Logo linking to homepage
- Navigation links to all major sections

### Footer Component
- Contact information
- Social media links
- Quick links to site sections
- Association information
- Address and contact details
- Developer credits

### Component Loader
- Automatically detects page location and adjusts paths
- Dynamically loads header and footer HTML
- Initializes mobile menu functionality
- Compatible with existing script.js

## Mobile Responsiveness

The hamburger menu functionality is handled by:
1. `component-loader.js` - Initializes the menu after component loads
2. `script.js` - Contains the main menu toggle logic

The menu uses these CSS classes:
- `.open` - Added to nav-links when menu is open
- `.menu-open` - Added to body when menu is active

## Maintenance

To update the header or footer across all pages:
1. Edit `header.html` or `footer.html`
2. Changes will automatically appear on all pages
3. No need to update individual page files

## Pages Using Components

✅ index.html
✅ pages/About/about.html
✅ pages/Services/services.html
✅ pages/Associations/associations.html
✅ pages/Carriers/carrier.html
✅ pages/COE/coe.html
✅ pages/Internship/internship.html
✅ pages/Publications/publicaations.html
