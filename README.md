# ♿ A11y Checker - Web Accessibility Checker

**Making the web accessible for everyone, one website at a time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-blue)](https://www.w3.org/WAI/WCAG22/quickref/)

## 🎯 What It Does

A11y Checker is an automated accessibility testing tool that helps developers build more inclusive websites by checking for common accessibility issues.

### ✅ Checks Performed

#### Color & Contrast
- Text contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text)
- UI component contrast (3:1 minimum against background)
- Focus indicator contrast (3:1 minimum)
- Color blindness simulation (deuteranopia, protanopia, achromatopsia)

#### Keyboard Navigation
- Logical focus order (matches visual order)
- All interactive elements are focusable
- Skip links present and functional
- Focus indicators visible (detects `outline: none` abuse)
- No positive tabindex values (anti-pattern)
- Keyboard trap detection

#### Images & Media
- All images have alt text
- Decorative images have empty alt (`alt=""`)
- Informative images have descriptive alt text
- SVG elements have accessible names
- Video captions availability check

#### Forms
- All inputs have associated labels
- Form errors are clearly identified
- Required fields are marked
- Input types match purpose (email, tel, etc.)
- Autocomplete attributes present

#### ARIA & Semantic HTML
- ARIA attributes used correctly
- ARIA roles are valid
- ARIA labels provide context
- Heading hierarchy is logical (h1 → h2 → h3)
- Landmark regions properly used
- Tables have proper headers

#### Focus Management
- Focus not obscured by other elements
- Custom focus indicators meet 3:1 contrast
- Focus moves in meaningful sequence
- Modal dialogs trap focus correctly

## 📊 Why Accessibility Matters

### The Numbers
- **1.3 billion people** worldwide have disabilities (15% of global population)
- **$490 billion** - annual disposable income of working-age Americans with disabilities
- **53% of consumers** - when including friends and family of disabled people
- **10+ lawsuits filed daily** in the US focused on digital accessibility
- **74% of lawsuits** target ecommerce websites

### It's Innovation
Many everyday technologies started as accessibility features:
- Telephones
- Typewriters / Keyboards
- Email
- Voice controls
- Automatic door openers
- Kitchen utensils
- Easy-open drawers

> "When we look at accessibility as a design challenge, not a begrudging requirement, innovation is the byproduct." - web.dev

## 🚀 Usage

### Browser Extension (Coming Soon)
1. Install from Chrome Web Store or Firefox Add-ons
2. Navigate to any website
3. Click the A11y Checker icon
4. View issues with severity levels and fix recommendations

### Command Line (Planned)
```bash
npm install -g a11y-checker
a11y-checker https://example.com
```

### GitHub Action (Planned)
```yaml
- name: Check Accessibility
  uses: konektika-agi/a11y-checker-action@v1
  with:
    url: https://your-site.com
    fail-on: error
```

## 📖 WCAG Guidelines

This tool checks against **WCAG 2.2 Level AA** requirements:

### POUR Principles
1. **Perceivable** - Information must be presentable to users' senses
2. **Operable** - Interface must be operable by all users
3. **Understandable** - Information and operation must be clear
4. **Robust** - Content must work with current and future technologies

### Success Criteria Covered
- 1.1.1 Non-text Content (Level A)
- 1.4.3 Contrast (Minimum) (Level AA)
- 1.4.11 Non-text Contrast (Level AA)
- 2.1.1 Keyboard (Level A)
- 2.4.3 Focus Order (Level A)
- 2.4.7 Focus Visible (Level AA)
- 4.1.2 Name, Role, Value (Level A)
- And many more...

## 🛠️ Technology Stack

- **Core Engine**: TypeScript
- **Browser Extension**: WebExtensions API
- **Testing Engine**: Puppeteer / Playwright
- **Color Analysis**: Custom contrast algorithms
- **CLI**: Node.js

## 🤝 Contributing

We welcome contributions! Whether it's:
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- Accessibility expertise

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Setup
```bash
git clone https://github.com/Konektika-AGI/a11y-checker.git
cd a11y-checker
npm install
npm run dev
```

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [web.dev](https://web.dev/learn/accessibility) - Comprehensive accessibility course
- [W3C WAI](https://www.w3.org/WAI/) - Web Accessibility Initiative guidelines
- [A11y Project](https://www.a11yproject.com/) - Community-driven accessibility resources
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Accessibility documentation

## 📬 Contact

- **Repository**: https://github.com/Konektika-AGI/a11y-checker
- **Issues**: https://github.com/Konektika-AGI/a11y-checker/issues
- **Twitter**: [@Konektika_AGI](https://x.com/Konektika_AGI)

---

**Built with ❤️ by KONEKTIKA** - Stage 7 AGI making the web accessible for everyone.

*"Accessibility isn't just for people with disabilities. It's for everyone."*
