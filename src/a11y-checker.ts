/**
 * A11y Checker - Web Accessibility Testing Library
 * 
 * A comprehensive accessibility checker that helps developers
 * build more inclusive websites by checking for WCAG 2.2 AA compliance.
 * 
 * @author KONEKTIKA
 * @license MIT
 * @version 1.0.0
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface AccessibilityIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  element: string;
  message: string;
  suggestion: string;
  wcagCriteria: string;
}

export interface AccessibilityReport {
  url: string;
  timestamp: string;
  issues: AccessibilityIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    passed: number;
  };
}

export interface ColorContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
  requiredRatio: number;
}

// ============================================================================
// Color Contrast Utilities
// ============================================================================

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.2 formula: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse color string to RGB values
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle hex colors
  const hexMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16)
    };
  }

  // Handle rgb() colors
  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  return null;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.2 formula: (L1 + 0.05) / (L2 + 0.05)
 */
export function calculateContrastRatio(
  color1: string,
  color2: string
): ColorContrastResult {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) {
    return {
      foreground: color1,
      background: color2,
      ratio: 0,
      passes: false,
      requiredRatio: 4.5
    };
  }

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    foreground: color1,
    background: color2,
    ratio: Math.round(ratio * 100) / 100,
    passes: ratio >= 4.5,
    requiredRatio: 4.5
  };
}

// ============================================================================
// Accessibility Checkers
// ============================================================================

/**
 * Check color contrast for text elements
 */
function checkColorContrast(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const elements = document.querySelectorAll('*');

  elements.forEach((element) => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;

    // Skip if background is transparent or inherited
    if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return;
    }

    const result = calculateContrastRatio(color, backgroundColor);
    
    if (!result.passes && element.textContent?.trim()) {
      issues.push({
        id: `contrast-${Math.random().toString(36).substr(2, 9)}`,
        severity: 'error',
        rule: 'color-contrast',
        element: element.tagName.toLowerCase(),
        message: `Color contrast ratio of ${result.ratio}:1 is below the required 4.5:1`,
        suggestion: `Increase contrast between text (${color}) and background (${backgroundColor})`,
        wcagCriteria: 'WCAG 2.2 - 1.4.3 Contrast (Minimum) - Level AA'
      });
    }
  });

  return issues;
}

/**
 * Check for missing alt text on images
 */
function checkImageAltText(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        id: `alt-${Math.random().toString(36).substr(2, 9)}`,
        severity: 'error',
        rule: 'image-alt',
        element: 'img',
        message: 'Image is missing alt attribute',
        suggestion: 'Add descriptive alt text or alt="" for decorative images',
        wcagCriteria: 'WCAG 2.2 - 1.1.1 Non-text Content - Level A'
      });
    }
  });

  return issues;
}

/**
 * Check for missing form labels
 */
function checkFormLabels(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    // Check if input has a label
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    
    if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        id: `label-${Math.random().toString(36).substr(2, 9)}`,
        severity: 'error',
        rule: 'form-label',
        element: input.tagName.toLowerCase(),
        message: 'Form input is missing accessible label',
        suggestion: 'Add a <label> element, aria-label, or aria-labelledby attribute',
        wcagCriteria: 'WCAG 2.2 - 1.3.1 Info and Relationships - Level A'
      });
    }
  });

  return issues;
}

/**
 * Check heading hierarchy
 */
function checkHeadingHierarchy(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  let lastLevel = 0;
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1), 10);
    
    // Check if heading levels are sequential (no skipping levels)
    if (level > lastLevel + 1 && lastLevel !== 0) {
      issues.push({
        id: `heading-${Math.random().toString(36).substr(2, 9)}`,
        severity: 'warning',
        rule: 'heading-order',
        element: heading.tagName.toLowerCase(),
        message: `Heading level skipped from h${lastLevel} to h${level}`,
        suggestion: 'Use heading levels sequentially (h1 → h2 → h3, etc.)',
        wcagCriteria: 'WCAG 2.2 - 1.3.1 Info and Relationships - Level A'
      });
    }
    
    lastLevel = level;
  });

  return issues;
}

/**
 * Check for missing skip links
 */
function checkSkipLinks(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const skipLink = document.querySelector('a[href="#main"], a[href="#content"], a[href="#skip"]');
  
  if (!skipLink) {
    issues.push({
      id: 'skip-link',
      severity: 'warning',
      rule: 'skip-link',
      element: 'body',
      message: 'No skip link found',
      suggestion: 'Add a skip link to allow keyboard users to bypass navigation',
      wcagCriteria: 'WCAG 2.2 - 2.4.1 Bypass Blocks - Level AA'
    });
  }

  return issues;
}

/**
 * Check for outline: none abuse
 */
function checkFocusIndicators(document: Document, stylesheets: CSSStyleSheet[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Check inline styles and stylesheets for outline: none
  try {
    stylesheets.forEach((sheet) => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        Array.from(rules).forEach((rule: any) => {
          if (rule.selectorText?.includes(':focus') && rule.style?.outline === 'none') {
            issues.push({
              id: `focus-${Math.random().toString(36).substr(2, 9)}`,
              severity: 'error',
              rule: 'focus-visible',
              element: rule.selectorText,
              message: 'Focus indicator removed with outline: none',
              suggestion: 'Provide alternative focus indicator (border, background, etc.)',
              wcagCriteria: 'WCAG 2.2 - 2.4.7 Focus Visible - Level AA'
            });
          }
        });
      } catch (e) {
        // Ignore CORS errors for external stylesheets
      }
    });
  } catch (e) {
    // Ignore errors
  }

  return issues;
}

/**
 * Check for positive tabindex values (anti-pattern)
 */
function checkTabindex(document: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const elements = document.querySelectorAll('[tabindex]');

  elements.forEach((element) => {
    const tabindex = parseInt(element.getAttribute('tabindex') || '0', 10);
    
    if (tabindex > 0) {
      issues.push({
        id: `tabindex-${Math.random().toString(36).substr(2, 9)}`,
        severity: 'warning',
        rule: 'tabindex-order',
        element: element.tagName.toLowerCase(),
        message: `Positive tabindex value (${tabindex}) disrupts natural focus order`,
        suggestion: 'Use tabindex="0" to add to natural order, or reorder DOM instead',
        wcagCriteria: 'WCAG 2.2 - 2.4.3 Focus Order - Level A'
      });
    }
  });

  return issues;
}

// ============================================================================
// Main Accessibility Checker
// ============================================================================

/**
 * Run all accessibility checks on a document
 */
export function checkAccessibility(
  document: Document,
  url: string = window.location.href
): AccessibilityReport {
  const issues: AccessibilityIssue[] = [
    ...checkColorContrast(document),
    ...checkImageAltText(document),
    ...checkFormLabels(document),
    ...checkHeadingHierarchy(document),
    ...checkSkipLinks(document),
    ...checkFocusIndicators(document, Array.from(document.styleSheets)),
    ...checkTabindex(document)
  ];

  const summary = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    passed: 7 - issues.filter(i => i.severity === 'error').length // 7 checks total
  };

  return {
    url,
    timestamp: new Date().toISOString(),
    issues,
    summary
  };
}

/**
 * Generate human-readable report
 */
export function generateReport(report: AccessibilityReport): string {
  let output = `
╔═══════════════════════════════════════════════════════════╗
║           A11Y ACCESSIBILITY REPORT                       ║
╚═══════════════════════════════════════════════════════════╝

URL: ${report.url}
Date: ${report.timestamp}

📊 SUMMARY
────────────────────────────────────────────────────────────
❌ Errors:   ${report.summary.errors}
⚠️  Warnings: ${report.summary.warnings}
ℹ️  Info:     ${report.summary.info}
✅ Passed:   ${report.summary.passed}/7

`;

  if (report.issues.length === 0) {
    output += `
🎉 No accessibility issues found! Great job!
`;
  } else {
    output += `
🔍 ISSUES FOUND
────────────────────────────────────────────────────────────
`;

    report.issues.forEach((issue, index) => {
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      output += `
${icon} Issue #${index + 1}: ${issue.rule}
   Element: <${issue.element}>
   Problem: ${issue.message}
   Fix: ${issue.suggestion}
   Standard: ${issue.wcagCriteria}

`;
    });
  }

  output += `
────────────────────────────────────────────────────────────
Built with ❤️ by KONEKTIKA - Making the web accessible for everyone
`;

  return output;
}

// ============================================================================
// Browser Extension Entry Point
// ============================================================================

/**
 * Run accessibility check and display results
 */
export async function runAccessibilityCheck(): Promise<void> {
  console.log('🔍 Running accessibility check...');
  
  const report = checkAccessibility(document);
  const formattedReport = generateReport(report);
  
  console.log(formattedReport);
  
  // Could also display in a popup or overlay
  return report;
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  (window as any).a11yChecker = {
    check: checkAccessibility,
    report: generateReport,
    run: runAccessibilityCheck,
    utils: {
      calculateContrastRatio
    }
  };
  
  console.log('♿ A11y Checker loaded! Run window.a11yChecker.run() to check accessibility');
}
