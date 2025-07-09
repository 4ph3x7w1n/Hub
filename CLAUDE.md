# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application called "byte-incident-management" that showcases an incident management team's capabilities through a modern, animated landing page. The application is configured for deployment on Cloudflare Workers.

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
- **Deployment**: Cloudflare Workers via Wrangler

### Project Structure
- `src/routes/+page.svelte` - Main landing page with all sections
- `src/lib/components/` - Reusable UI components (KPICard, Chart, FeatureBadge, etc.)
- `src/lib/data/mockData.ts` - All application data and mock metrics
- `src/app.css` - Global styles and Tailwind component classes

### Key Components
- **KPICard**: Metric display cards with trend indicators and gradient backgrounds
- **Chart**: Chart.js wrapper for line charts, doughnut charts, etc.
- **FeatureBadge**: Feature showcase cards with variants and active states
- **PostmortemCard**: Incident postmortem display with expandable details
- **Navigation**: Smooth scrolling navigation component

### Design System
- **Color Scheme**: Dark theme with vibrant gradient accents (magenta, crimson, orange, gold, purple)
- **Gradients**: Custom hero gradient, card gradient, and feature gradient defined in Tailwind config
- **Animations**: Fade-in, slide-up, and scale-in animations with hover effects
- **Typography**: System fonts with gradient text effects for headings

### Data Management
All data is centralized in `src/lib/data/mockData.ts` including:
- KPI metrics with trend data
- Chart datasets for incident trends and response times
- Feature configurations with variants
- Postmortem incident data with detailed RCA information
- Team statistics and capabilities

### Styling Approach
- Tailwind CSS with custom utility classes defined in `app.css`
- Component-specific styling using Tailwind classes
- Responsive design with mobile-first approach
- Smooth animations and hover effects throughout

## Deployment

The application is configured for Cloudflare Workers deployment with staging and production environments defined in `wrangler.toml`. The adapter automatically handles the build process for the Workers runtime.