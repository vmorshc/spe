# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (preferred)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality checks

## Project Overview

This is a Next.js application for "Sure Pick Engine" (SPE), a service for conducting fair Instagram giveaways. The application is primarily in Ukrainian and focuses on transparent, automated winner selection from Instagram comments.

## Tech Stack & Configuration

### Core Framework
- **Next.js 15** with App Router architecture
- **TypeScript** with strict mode enabled
- **React 19** with modern hooks and patterns
- **Turbopack** for fast development builds

### Styling & UI
- **Tailwind CSS v4** with new `@theme inline` syntax
- **PostCSS** with Tailwind plugin
- **Framer Motion** for animations and interactions
- **Lucide React** + **React Icons** for iconography
- Custom CSS variables for theming (background/foreground)
- Custom scrollbar styling and accessibility focus rings

### Development Tools
- **ESLint** with Next.js core-web-vitals and TypeScript rules
- **pnpm** as package manager (v10.12.4)
- **TypeScript** with bundler module resolution
- Path aliases configured (`@/*` → `./src/*`)

### Font System
- **Geist Sans** and **Geist Mono** from Google Fonts
- CSS custom properties for font family inheritance
- Optimized font loading with `next/font`

## Architecture

### Project Structure
```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Landing page composition
│   └── globals.css     # Global styles and theme
├── components/
│   ├── ui/
│   │   ├── Button.tsx  # Reusable button component
│   │   └── Section.tsx # Layout section wrapper
│   ├── landing/        # Landing-specific components
│   └── [Components]    # Main page sections
```

### Component Architecture
- **Landing Page Sections**: Header, Hero, HowItWorks, Benefits, FuturePlans, FAQ, Footer
- **UI Components**: Reusable with TypeScript interfaces and variant patterns
- **Animation Pattern**: Framer Motion with consistent staggered delays
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Key Patterns
- `'use client'` directive for interactive components
- TypeScript interfaces for component props
- Variant-based styling system (primary, secondary, outline, ghost)
- Motion components with hover/tap interactions
- Semantic HTML with accessibility considerations

### Metadata & SEO
- Comprehensive OpenGraph and Twitter card setup
- Ukrainian content with proper locale settings
- Structured metadata for search engines
- Robot indexing permissions configured

## Development Notes

### Styling Approach
- Uses Tailwind v4 with new CSS-first configuration
- Custom CSS variables for consistent theming
- Light theme enforced (dark mode variables set to light values)
- Smooth scrolling and font smoothing enabled

### Component Conventions
- TypeScript interfaces for all props
- Default parameter values in function signatures
- Consistent className patterns with template literals
- Motion wrapper components for animations

### Build Configuration
- ES2017 target for broad compatibility
- Strict TypeScript settings
- Incremental compilation enabled
- Next.js plugin integration