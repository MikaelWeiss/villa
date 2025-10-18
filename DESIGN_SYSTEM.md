# Villa Design System

This document outlines the unified design system implemented across the Villa application.

## Overview

The Villa design system is built on **Tailwind CSS** with a custom component library located in `/src/components/ui/`. All pages and components follow consistent design tokens for colors, typography, spacing, and interactions.

---

## Design Tokens

### Colors

#### Primary Palette
```
primary: #1976d2 (Blue)
- 50:  #e3f2fd
- 500: #1976d2 (default)
- 600: #1565c0 (hover)
```

#### Semantic Colors
```
success: #10b981 (Green)
warning: #f59e0b (Orange)
error:   #ef4444 (Red)
```

#### Neutral Palette
```
secondary: #6b7280 (Gray)
- 50:  #f9fafb
- 100: #f3f4f6
- 200: #e5e7eb (borders)
- 500: #6b7280
- 600: #4b5563
- 700: #374151
- 800: #1f2937 (text primary)
```

#### Backgrounds
```
background: #f5f7fa (page background)
surface:    #ffffff (cards, modals)
```

### Typography

**Font Family:** Inter, -apple-system, system-ui

**Font Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)

**Headings:**
- H1: text-4xl font-bold (36px, 700 weight)
- H2: text-2xl font-semibold (24px, 600 weight)
- H3: text-xl font-semibold (20px, 600 weight)
- H4: text-lg font-semibold (18px, 600 weight)

### Spacing

Base unit: 4px

Common spacing:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Border Radius

- sm: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- full: 9999px (pills)

### Shadows

- sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

---

## Component Library

All components are located in `/src/components/ui/` and can be imported individually or via the index:

```javascript
import { Button, Card, Modal } from '../components/ui';
// or
import Button from '../components/ui/Button';
```

### Button

Versatile button component with multiple variants and sizes.

**Variants:**
- `primary` (default) - Blue background
- `secondary` - Gray background
- `danger` - Red background
- `outline` - Transparent with border
- `ghost` - Transparent, no border

**Sizes:**
- `sm` - Compact
- `md` (default) - Standard
- `lg` - Large

**Props:**
```javascript
<Button
  variant="primary"
  size="md"
  loading={false}
  disabled={false}
  onClick={() => {}}
>
  Click me
</Button>
```

### Card

Container component for grouped content.

**Subcomponents:**
- `Card.Header` - Top section
- `Card.Title` - Heading
- `Card.Content` - Main content
- `Card.Footer` - Bottom section (with border-top)

**Props:**
```javascript
<Card padding="md"> {/* none, sm, md, lg */}
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
</Card>
```

### Modal

Accessible modal dialog with backdrop and keyboard support.

**Features:**
- Escape key to close
- Click backdrop to close
- Body scroll lock when open
- Keyboard focus management

**Subcomponents:**
- `Modal.Header` - With close button
- `Modal.Title` - Heading
- `Modal.Content` - Body content
- `Modal.Footer` - Action buttons

**Props:**
```javascript
<Modal isOpen={isOpen} onClose={handleClose} size="md">
  <Modal.Header onClose={handleClose}>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Content>
    Content here
  </Modal.Content>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSubmit}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

### Form Components

**Input:**
```javascript
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error="Error message"
  helperText="Helper text"
/>
```

**TextArea:**
```javascript
<TextArea
  label="Description"
  rows={4}
  placeholder="Enter description"
/>
```

**Select:**
```javascript
<Select label="Status">
  <option value="open">Open</option>
  <option value="closed">Closed</option>
</Select>
```

### Badge

Label component for status and categories.

**Variants:**
- Status: `open`, `in-progress`, `resolved`
- Severity: `low`, `medium`, `high`, `urgent`
- General: `default`, `primary`, `success`, `warning`, `error`

**Sizes:** `sm`, `md`, `lg`

```javascript
<Badge variant="success" size="md">Active</Badge>
<Badge variant="urgent">Urgent</Badge>
```

### StatCard

Dashboard statistic display.

**Props:**
```javascript
<StatCard
  title="Total Reports"
  value={150}
  icon={<Activity size={24} />}
  color="primary" // primary, success, warning, error, secondary
/>
```

### PageHeader

Consistent page title with optional actions.

```javascript
<PageHeader
  title="Dashboard"
  actions={<Button>New Report</Button>}
/>
```

### EmptyState

Empty state placeholder with icon and action.

```javascript
<EmptyState
  icon={<Inbox size={64} />}
  title="No reports yet"
  description="Create your first maintenance report"
  action={<Button>Create Report</Button>}
/>
```

### LoadingSpinner

Animated loading indicator.

**Sizes:** `sm`, `md`, `lg`, `xl`

```javascript
<LoadingSpinner size="md" />
```

### Skeleton

Loading placeholder for content.

```javascript
<Skeleton width="100%" height="20px" variant="rectangle" />
<Skeleton.Text lines={3} />
```

---

## Layout Patterns

### Authenticated Pages

All authenticated pages (tenant/manager dashboards) follow this structure:

```javascript
<div className="flex">
  <Nav /> {/* Fixed left sidebar, w-315 */}
  <div className="ml-315 p-10 bg-background min-h-screen flex-1">
    <PageHeader
      title="Page Title"
      actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
    />
    {/* Page content */}
  </div>
</div>
```

### Public Pages

```javascript
<div className="min-h-screen bg-background">
  <header className="...">...</header>
  <main className="px-6 py-14">...</main>
  <footer className="...">...</footer>
</div>
```

### Responsive Grid

```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards or items */}
</div>
```

---

## Utility Classes

### Custom Utilities

```css
/* Focus ring for accessibility */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

/* Smooth transitions */
.transition-smooth {
  @apply transition-all duration-200 ease-in-out;
}

/* Custom scrollbar */
.scrollbar-thin {
  /* Thin scrollbar with secondary colors */
}
```

### Animations

```javascript
className="animate-fade-in"   // Fade in
className="animate-slide-in"  // Slide in from top
className="animate-spin"      // Loading spinner
className="animate-pulse"     // Skeleton loading
```

---

## Best Practices

### 1. Consistency
- Always use design tokens (Tailwind classes) instead of arbitrary values
- Use the component library instead of creating custom styled components
- Follow the established spacing scale

### 2. Accessibility
- All interactive elements have focus states (`.focus-ring`)
- Color contrast meets WCAG AA standards
- Semantic HTML elements used throughout
- Keyboard navigation supported in modals and forms

### 3. Responsive Design
- Mobile-first approach using Tailwind breakpoints (`md:`, `lg:`)
- Flexible layouts using grid and flexbox
- Responsive typography and spacing

### 4. Performance
- Minimal CSS bundle (Tailwind purges unused styles)
- Component lazy loading where appropriate
- Optimized animations using CSS transforms

### 5. Maintainability
- Single source of truth in `tailwind.config.js`
- Reusable components in `/src/components/ui/`
- Clear component props and documentation

---

## Migration Notes

All CSS modules have been removed and replaced with:
1. Tailwind utility classes for layout and styling
2. UI components for common patterns
3. CSS variables in `index.css` for theme values

**Deleted files:**
- All `*.module.css` files (11 files removed)
- `App.css`

**No breaking changes** - All functionality preserved, only styling approach changed.

---

## Examples

### Creating a New Page

```javascript
import React from 'react';
import Nav from '../../components/nav/Nav';
import { PageHeader, Card, Button } from '../../components/ui';

function NewPage() {
  return (
    <div className="flex">
      <Nav />
      <div className="ml-315 p-10 bg-background min-h-screen flex-1">
        <PageHeader
          title="New Page"
          actions={<Button>Action</Button>}
        />

        <Card>
          <Card.Header>
            <Card.Title>Section Title</Card.Title>
          </Card.Header>
          <Card.Content>
            Content goes here
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
```

### Status Badge Pattern

```javascript
import { Badge } from '../components/ui';

<Badge variant={report.status}>{report.status}</Badge>
<Badge variant={report.severity}>{report.severity}</Badge>
```

### Loading State

```javascript
import { LoadingSpinner, Skeleton } from '../components/ui';

{loading ? (
  <div className="flex justify-center py-12">
    <LoadingSpinner size="lg" />
  </div>
) : (
  <div>{content}</div>
)}
```

---

## Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Color Palette Tool:** https://tailwindcss.com/docs/customizing-colors
- **Lucide Icons:** https://lucide.dev (for consistent iconography)

---

**Last Updated:** 2025
**Maintained By:** Villa Development Team
