# Pixash 🐾

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> Pet care, beautifully organised.

Pixash is a full-stack pet care tracker built with Vue 3 and Firebase. It helps pet owners keep track of vaccines, vet visits and upcoming health events — all in one place.

The name comes from my two pets: **Pixie** (a chubby affectionate tabby cat) and **Sasha** (an energetic and extremely friendly mini pitbull). I built it because I actually needed it — no more digging through passport documents to keep track og the vaccines dates.

---

## Tech stack

- **Vue 3** — Composition API with **TypeScript**
- **Vite** — build tool and dev server
- **Firebase** — Authentication (email/password + Google OAuth) and Firestore database
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Tailwind Variants** — variant-based component styling
- **Vue Router** — client-side routing with navigation guards
- **VueUse** — composable utilities (`useLocalStorage`, `onClickOutside`, `useSwipe`)
- **Lucide Vue** — icon library
- **FullCalendar** — calendar component
- **Vue I18n** - internationalization plugin to make the app multi-languages

---

## Features

- Google OAuth and email/password authentication
- Protected routes
- Pet profiles
- Vaccine and vet visit tracking
- Calendar
- Light / dark mode with system preference detection and manual toggle
- Fully responsive — mobile first, desktop adapted
- Accessible UI

---

## Design

The design system uses a custom palette built around deep forest green and warm gold in light mode, charcoal and purple in dark mode.

---

## Project structure

```
src/
  components/         # Shared UI components
  composables/        # Global shared composable (useToast, useTheme)
  config/             
    locales/          # Texts by language
  features/
    health/           # Vet visits, vaccines and health event management (composables, components)
    pets/             # Pet profiles and management (composables, components)
    theme/            # Theme management (composable, components)
    user/             # Authentication (composable and user-related components)
  router/             # Vue Router config with auth guards
  styles/             # Global CSS and design tokens
  views/              # Page-level components (DashboardView, AuthView...)
```

---

## Getting started

```bash
# Install dependencies
npm install

# Create .env.local with your Firebase config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Run dev server
npm run dev
```

---

## Status

Work in progress — actively developed as a portfolio project to deepen Vue 3 knowledge after a React specialisation.

Current progress:
- [x] Authentication (Google + email/password)
- [x] Protected routing
- [x] Pet profile creation
- [x] Vaccine and antiparasitic logs and management
- [x] Vet visit creation and management
- [x] Vet view and management
- [ IN PROGRESS ] Medical treatment creation and management
- [ ] History view and management

---

## About

Built by a junior frontend developer coming from a React specialization, using Pixash as a real-world project to learn Vue 3 deeply — reactivity system, composables, directives, lifecycle hooks and the Vue ecosystem.

No tutorial was followed. Every feature was built from scratch with a focus on accessibility, clean architecture and production-quality code.