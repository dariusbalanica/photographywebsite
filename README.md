# Darius Bălănică Photography Website

A bilingual (Romanian & English) portfolio website for showcasing amateur photography and visual storytelling.

---

## 📁 Project Structure

```
photography-website/
├── index.html                  # Homepage (Romanian)
├── index-en.html               # Homepage (English)
├── css/
│   ├── style.css               # Main styles
│   └── responsive.css          # Responsive/mobile styles
├── js/
│   ├── main.js                 # General JS (navigation, scroll, etc.)
│   └── gallery.js              # Gallery navigation logic
├── images/
│   └── gallery/
│       ├── whysovertical/
│       ├── strada/
│       ├── aripi/
│       ├── montan/
│       ├── tricolor/
│       └── natura/
├── pages/
│   ├── gallery-whysovertical.html
│   ├── gallery-whysovertical-en.html
│   ├── gallery-strada.html
│   ├── gallery-strada-en.html
│   ├── gallery-aripi.html
│   ├── gallery-aripi-en.html
│   ├── gallery-montan.html
│   ├── gallery-montan-en.html
│   ├── gallery-tricolor.html
│   ├── gallery-tricolor-en.html
│   ├── gallery-natura.html
│   ├── gallery-natura-en.html
│   ├── shop.html
│   └── shop-en.html
└── README.md                   # This file
```

---

## 🌍 Features

- **Bilingual:** Romanian and English versions for all main pages and galleries
- **Responsive Design:** Mobile and tablet friendly (see `responsive.css`)
- **Gallery Navigation:** Clickable gallery items open dedicated gallery pages
- **Modern UI:** Clean navigation bar, language switcher with flag icons, and overlay effects
- **About & Contact:** Dedicated sections for equipment, editing tools, and social links

---

## 🚀 Getting Started

1. **Clone or Download the Repository**

   ```sh
   git clone https://github.com/YOUR_USERNAME/photography-website.git
   cd photography-website
   ```

2. **Add Your Images**

   - Place your photos in the appropriate `images/gallery/[category]/` folders.
   - Use thumbnails or optimized images for faster loading.

3. **Customize Content**

   - Edit `index.html` and `index-en.html` for your bio, about, and contact info.
   - Update gallery titles, descriptions, and image paths as needed.
   - Update Instagram links in the contact section.

4. **Language Switcher**

   - The language switcher is styled as navbar buttons with flag icons.
   - On each page, the active language is highlighted.

5. **Gallery Navigation**
   - Each gallery item uses a `data-category` attribute.
   - Clicking an item opens the corresponding gallery page (e.g., `gallery-whysovertical.html` or `gallery-whysovertical-en.html`).

---

## 🖥️ Development & Customization

- **CSS:**
  - Edit `css/style.css` for main styles.
  - Edit `css/responsive.css` for mobile/tablet adjustments.
- **JavaScript:**
  - `js/main.js` handles navigation highlighting and general UI.
  - `js/gallery.js` handles gallery item click navigation.
- **HTML:**
  - Each language has its own set of pages for easy editing and translation.

---

## 🌐 Deployment

You can deploy this site using:

- **GitHub Pages:**
  - Push your code to a GitHub repository.
  - Enable GitHub Pages in the repository settings (set source to `main` branch and `/ (root)`).
- **Netlify / Vercel:**
  - Drag and drop the folder or connect your repo for instant deployment.
- **Traditional Hosting:**
  - Upload all files to your web server’s `public_html` or root directory.

---

## 📱 Mobile Friendly

- The site is fully responsive.
- The navbar and language switcher adapt for mobile screens.
- Touch targets are large and easy to use.

---

## 📝 Customization Tips

- **Colors & Fonts:** Adjust in `style.css` to match your brand.
- **Flags:** For rectangular flag icons, use SVG or PNG images and style with `.flag-icon`.
- **SEO:** Add meta tags in the `<head>` of each HTML file for better search engine visibility.
- **Accessibility:** All navigation and buttons are keyboard accessible.

---

## 📄 License

This project is for personal/portfolio use.  
Feel free to adapt and use for your own photography website!

---

## 🙏 Credits

- [Flag icons](https://flagcdn.com/) (if used)
- [Google Fonts - Raleway](https://fonts.google.com/specimen/Raleway)
- [SVG Instagram icon](https://simpleicons.org/)

---

**Created by Darius Bălănică**
