# ShiftLog

[![ShiftLog CI](https://github.com/Admiral-Kizaru/FES-Virtual-Internship/actions/workflows/shiftlog-ci.yml/badge.svg)](https://github.com/Admiral-Kizaru/FES-Virtual-Internship/actions/workflows/shiftlog-ci.yml)

ShiftLog is a mobile-first incident reporting and shift handover tool for security personnel. It replaces paper logs, scattered messages, and verbal briefings with one focused workflow for recording incidents and passing critical context to the next shift.

- [Live demo](https://admiral-kizaru.github.io/shiftlog/)
- [Source code](https://github.com/Admiral-Kizaru/FES-Virtual-Internship/tree/main/shiftlog-app)

## Features

- Email/password authentication and site assignment when Firebase is configured.
- Portfolio demo mode when Firebase credentials are absent.
- Start/end shift workflow and live shift metrics.
- Incident form with type, location, severity, description, timestamp, guard, and site data.
- Dashboard showing the five newest incidents.
- Seven-day history with severity and incident-type filters.
- Expandable incident details and severity status.
- Priority-sorted handover report.
- Firestore `onSnapshot` updates in production and cross-tab demo updates with `BroadcastChannel`.
- React Router navigation, TypeScript, Jest, React Testing Library, and GitHub Actions CI.

## Stack

React, TypeScript, Vite, React Router v6, Firebase Auth, Cloud Firestore, Jest, React Testing Library, and GitHub Actions.

## Run Locally

```bash
npm install
npm run dev
```

Without an `.env` file, the app starts in demo mode using the prefilled login.

## Firebase Setup

1. Copy `.env.example` to `.env` and add the Firebase web-app values.
2. Enable Email/Password authentication in Firebase Authentication.
3. Create a Cloud Firestore database.
4. Deploy the included security rules with `firebase deploy --only firestore:rules`.
5. Run `npm run dev` and create the first guard account.

User profiles are stored in `users/{uid}` with their assigned `siteId`. Incident reads and writes are restricted to authenticated users assigned to the same site.

## Test And Build

```bash
npm test
npm run build
```

The test suite covers incident validation, creation, filtering, seven-day history, handover ordering and summaries, plus interactive incident-form and severity-filter controls.
