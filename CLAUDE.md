# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application called "byte-incident-management" that showcases an incident management team's capabilities through a modern, interactive landing page. The application is configured for deployment on Cloudflare Workers and includes a content management system for regular updates.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run TypeScript and Svelte checks
- `npm run check:watch` - Run checks in watch mode
- `npm run lint` - Run linting (Prettier + ESLint)
- `npm run format` - Format code with Prettier
- `npm run deploy` - Deploy to Cloudflare Workers

## Architecture

### Tech Stack
- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS with custom gradient themes
- **Charts**: Chart.js with date-fns adapter
- **State Management**: Svelte stores with localStorage persistence
- **Deployment**: Cloudflare Workers via Wrangler

### Project Structure
- `src/routes/+page.svelte` - Main landing page with all sections
- `src/lib/components/` - Reusable UI components
- `src/lib/stores/` - Svelte stores for state management
- `src/lib/data/mockData.ts` - Default application data and mock metrics
- `src/app.css` - Global styles and Tailwind component classes
- `src/app.html` - HTML template with SEO meta tags

### Key Components
- **Navigation**: Responsive navigation with mobile menu overlay
- **KPICard**: Metric display cards with trend indicators and gradient backgrounds
- **Chart**: Interactive Chart.js wrapper with filtering, export, and fullscreen features
- **FeatureBadge**: Feature showcase cards with variants and active states
- **PostmortemCard**: Incident postmortem display with expandable details and search highlighting
- **PostmortemFilter**: Advanced filtering and sorting for incident analysis
- **ContactForm**: Functional contact forms with validation and submission
- **ContentManager**: Admin interface for content updates

### Interactive Features
- **Mobile Navigation**: Hamburger menu with overlay and keyboard navigation
- **Contact Forms**: Three types (Slack, Email, Escalation) with validation and priority selection
- **Chart Interactions**: Time range filtering, dataset toggles, export functionality, fullscreen mode
- **Content Management**: Real-time editing of KPIs, team stats, and content via admin panel
- **Postmortem Search**: Full-text search with highlighting, severity filtering, and sorting
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### State Management
- **contentStore**: Manages KPI data and team statistics with localStorage persistence
- **Dynamic Content**: Real-time updates to displayed metrics and information
- **Import/Export**: JSON-based data backup and restoration system

### Design System
- **Color Scheme**: Dark theme with vibrant gradient accents (magenta → crimson → orange → gold → purple)
- **Gradients**: Custom hero gradient, card gradient, and feature gradient defined in Tailwind config
- **Animations**: Fade-in, slide-up, and scale-in animations with hover effects
- **Typography**: System fonts with gradient text effects for headings
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

### Data Management
- **Mock Data**: Default data in `src/lib/data/mockData.ts`
- **Dynamic Content**: Editable KPI metrics, team statistics, and content
- **Persistence**: Browser localStorage for content updates
- **Filtering**: Advanced search and filtering for postmortem analysis

### SEO & Accessibility
- **Meta Tags**: Comprehensive SEO optimization with Open Graph and Twitter cards
- **Structured Data**: JSON-LD schema for rich snippets
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **Performance**: Optimized charts, lazy loading, and efficient state management

## Deployment

The application is configured for Cloudflare Workers deployment with staging and production environments defined in `wrangler.toml`. The adapter automatically handles the build process for the Workers runtime.

## Content Management

The site includes a floating admin button (bottom right) that opens a content management interface allowing:
- Real-time editing of KPI metrics (values, trends, subtitles)
- Team statistics management (size, coverage, regions, specialties)
- Data import/export for backup and sharing
- Reset to defaults functionality

Content changes are automatically saved to localStorage and persist across sessions.