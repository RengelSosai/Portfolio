# Mary Rengel Sosai — Personal Portfolio

A responsive, single-page personal portfolio website for **Mary Rengel Sosai**, a BICT (Hons) undergraduate at the University of Vavuniya and aspiring UI/UX designer. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

🔗 **Live site:** [rengelsosai.github.io/Portfolio](https://rengelsosai.github.io/Portfolio/)

## ✨ Features

- **Dark / light theme toggle** with preference saved to `localStorage`
- **Responsive navigation** with active-section highlighting on scroll and a mobile hamburger menu
- **Scroll-reveal animations** for sections as they enter the viewport
- **Certificate lightbox/modal** for viewing certification images at full size
- **In-page CV viewer** with a modal PDF preview and direct download button
- **Contact section** with quick-connect social links (LinkedIn, GitHub, Behance, Email)

## 📄 Sections

| Section | Description |
|---|---|
| Home | Intro, tagline, and quick links to projects/CV |
| About | Short bio and professional focus |
| Education | Degree, institution, and relevant coursework |
| Skills | Languages, frameworks/tools, design skills, and soft skills |
| Projects | Featured project previews (e.g. waste management, pet adoption, flower shop, mental wellness, anime streaming) |
| Experience | Volunteering and event coordination highlights |
| Certifications | Course and competition certificates with image previews |
| CV | Embedded/downloadable CV |
| Contact | Contact form and social links |

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom properties for theming, no CSS framework)
- Vanilla JavaScript (DOM APIs, `localStorage`, no external JS libraries)

## 📁 Project Structure

```
Portfolio-main/
├── index.html              # Main site (all sections)
├── css/
│   └── style.css           # All styling, incl. dark/light theme variables
├── js/
│   └── script.js           # Navigation, theme toggle, scroll-reveal, modals, form logic
├── assets/
│   ├── hero-profile.jpg    # Hero section photo
│   └── about-profile.jpg   # About section photo
├── logo.png                # Site logo
├── *.jpg / *.jpeg / *.png / *.webp   # Project previews and certificate images
├── Mary_Rengel_Sosai_CV.pdf # Downloadable CV
└── .github/workflows/      # CI/CD or deployment workflow(s)
```

## 🚀 Getting Started

### Run locally

No build tools required — just open the site in a browser:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
open index.html   # or double-click index.html
```

For live-reload while editing, you can optionally serve it with any static server, e.g.:

```bash
npx serve .
```

## 📬 Contact

- **LinkedIn:** [Mary Rengel Sosai](https://www.linkedin.com/in/mary-rengel-sosai-80558833a/)
- **GitHub:** [@RengelSosai](https://github.com/RengelSosai)
- **Behance:** [maryrengelsosai](https://www.behance.net/maryrengelsosai)
- **Email:** maryrengelsosai@gmail.com

## 📝 License

This project is personal portfolio content. Feel free to reference the code structure, but please don't reuse the personal content, images, or CV as your own.
