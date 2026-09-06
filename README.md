# Pixash 🐾

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> Pet care, beautifully organised.

Pixash is a full-stack pet care tracker built with Vue 3 and Firebase, designed to help pet owners stay on top of vaccinations, vet visits, medications, treatments, and upcoming health events.

The name comes from my two pets: **Pixie**, a tabby cat who has fully committed to the "unit" body type and treats every surface as a place to be liquid on, and **Sasha**, an energetic and extremely friendly mini pitbull who runs on 100% vibes and 0% self-preservation.

I built this because I actually needed it, not because the world was short on pet-tracker apps. It isn't...

But I didn't learn to code to be sold premium subscription just to remember when Sasha's rabies shot is due, nor to use a spreadsheet.

The real push, though, was Sasha. She's 10 now, and earlier this year she had her first genuinely scary health scare: a tumor. It turned out to be benign, and we got lucky. But it was a real wake-up call: I can't keep being the chill, "eh, she seems fine" pet owner anymore. I also can't afford to haul her to the vet every six months just for peace of mind (vet bills don't care about your feelings).

Therefore, I decided to build the exact tool I want, the way I want it, and completely for free.

---

## Tech stack

- **Vue 3** — Composition API with **TypeScript**
- **Vite** — build tool and dev server
- **Firebase** — Authentication (email/password + Google OAuth) and Firestore database
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Tailwind Variants** — variant-based component styling
- **Vue Router** — client-side routing with navigation guards
- **VueUse** — composable utilities (`useLocalStorage`, `useFocusTrap`, `onClickOutside`...)
- **Lucide Vue** — icon library
- **FullCalendar** — calendar component
- **Vue I18n** - internationalization plugin to make the app multi-languages
- **vue-easy-lightbox** - image zoom and slideshow

---

## Features

- Google OAuth and email/password authentication
- Protected routes
- Pet and vet profiles
- Vaccine, antiparasitics, medical treatment, weight and vet visit tracking
- Calendar
- Light / dark mode with system preference detection and manual toggle
- Fully responsive — mobile first, desktop adapted
- Accessible UI

---

## Project structure

```
src/
  components/         # Shared UI components
  composables/        # Global shared composable (useToast, useTheme)
  config/             # Firebase and db related configs
  features/
    care/             # Vet visits, vaccines, treatments and overall health event management (composables,components)
    languages/        # Texts by language
    pets/             # Pet profiles and management (composables, components)
    theme/            # Theme management (composable, components)
    user/             # Authentication (composable and user-related components)
  router/             # Vue Router config with auth guards
  services/
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

Work in progress — currently in active development as both a portfolio project and a real, actually-used-daily application, built to level up my Vue 3 skills.

Current progress:
- [x] Authentication (Google + email/password)
- [x] Protected routing
- [x] Pet profile creation (species, breed, microchip, sterilization, insurance info...)
- [x] Vaccine and antiparasitic logs and management
- [x] Vet visit creation and management
- [x] Weight monitoring
- [x] Vet view and management
- [x] Medical treatment creation and management
- [x] Custom user and pet profile pictures
- [x] History view per pet and care event
- [x] Other logs (feeding, activity, grooming, etc...)
- [IN PROGRESS] Missed medicine tracking and medication compliance
- [ ] Lump tracking

---

## About

Every feature here was designed and built from scratch, React instincts slowly being rewired into Vue ones along the way. The goal wasn't just "make something that works," but something that's accessible, cleanly architected, and doesn't fall over the moment a real user (or a very determined cat) gets near it.

At the end of the day, this is a tool built for two very real animals by someone who got tired of waiting for the "perfect" free app to exist and decided to just make it instead — bugs, late nights, and all.