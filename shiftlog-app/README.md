# ShiftLog

ShiftLog is a mobile-first incident reporting and shift handover tool for security personnel. It replaces scattered paper logs, messages, and verbal briefings with one focused workflow for recording incidents, reviewing site activity, and passing critical context to the next shift.

## Portfolio Goal

This project exists to close three high-value junior frontend skill gaps:

- TypeScript in a real React application.
- Jest tests for validation and filtering logic.
- GitHub Actions CI that runs tests and builds the app.

## Current Demo

- Demo authentication screen with site and guard context.
- Start/end shift workflow and live shift metrics.
- Fast incident form with typed fields, validation, automatic timestamp, guard, and site data.
- Seven-day history with severity and incident-type filters.
- Expandable incident details and color-coded severity status.
- Priority-sorted handover report with generated summary.
- Local persistence and BroadcastChannel cross-tab updates for a working real-time demo.
- TypeScript interfaces for incident records and form state.
- Jest test suite for validation, creation, date windows, filtering, sorting, and handover summaries.
- GitHub Actions workflow for test/build checks.

## Planned Production Features

- Firebase Auth for production guard accounts.
- Firestore storage with real-time `onSnapshot` updates replacing the demo persistence adapter.
- Supervisor dashboard for reviewing high-severity incidents.
- Photo attachments from camera or gallery.
- PDF export for shift handover reports.

## Stack

- React
- TypeScript
- Vite
- Firebase-ready architecture
- Jest
- GitHub Actions

## Run Locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```
