# Darius Bălănică | Photography Portfolio

A modern, bilingual photography portfolio website built with vanilla JavaScript, no dependencies required.

## ✨ Features

- **🌍 Bilingual** - Romanian & English with instant language switching
- **📱 Fully Responsive** - Mobile-first design for all devices
- **⚡ Zero Dependencies** - Vanilla JavaScript, pure CSS (no frameworks)
- **🎴 Dynamic Galleries** - Smooth transitions and lightbox viewing
- **🚀 GitHub Pages Ready** - Deploy directly, no build process required
- **♿ Accessible** - WCAG compliant navigation and semantic HTML

## 📁 Project Structure

```
.
├── index.html                 # Single entry point (SPA)
├── css/
│   ├── style.css             # Main styles + components
│   └── responsive.css        # Mobile-responsive design
├── js/
│   ├── i18n.js              # Translation & language system
│   ├── router.js            # Dynamic page routing
│   ├── main.js              # Core app initialization
│   └── gallery.js           # Gallery & lightbox
├── data/
│   ├── portfolio.json       # Gallery projects config
│   └── config.json          # Site settings & social links
├── translations/
│   ├── en.json             # English translations
│   └── ro.json             # Romanian translations
└── images/
    └── gallery/            # Photo galleries
```

## 🚀 Quick Start - Local Development

1. **Install VS Code extension:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. **Open** `index.html` with Live Server
3. **Edit** and browser auto-refreshes

## 🎨 Customization

### Update Social Links
Edit `data/config.json`:
```json
"socialLinks": {
  "instagram": ["handle1", "handle2"]
}
```

### Add Gallery Projects
Edit `data/portfolio.json` and add images to `images/gallery/[category]/`

### Translate Content
Edit `translations/en.json` or `translations/ro.json`

## 🌐 Deploy to GitHub Pages

1. Create repository: `yourusername.github.io`
2. Push code:
   ```bash
   git add .
   git commit -m "Deploy portfolio site"
   git push origin main
   ```
3. Visit: `https://yourusername.github.io`

## 💻 Technologies

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- JSON data management
- No external dependencies

## 🌍 Browser Support

- Chrome, Firefox, Safari, Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

© 2026 Darius Bălănică. All rights reserved.
