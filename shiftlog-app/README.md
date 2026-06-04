# ShiftLog

ShiftLog is a mobile-first incident reporting and shift handover tool for security personnel. It is designed around a real security-operations workflow: log an incident quickly, review what happened during the last shift, and hand off important context to a supervisor or incoming guard.

## Portfolio Goal

This project exists to close three high-value junior frontend skill gaps:

- TypeScript in a real React application.
- Jest tests for validation and filtering logic.
- GitHub Actions CI that runs tests and builds the app.

## MVP Features

- Current shift dashboard with active/open incident counts.
- Log Incident form with typed fields for incident type, location, severity, and description.
- Validation for required fields and useful descriptions.
- Shift History list with severity filtering.
- Handover summary for open incidents.
- TypeScript interfaces for incident records and form state.
- Jest test suite for validation, filtering, sorting, and handover summaries.
- GitHub Actions workflow for test/build checks.

## Planned Production Features

- Firebase Auth for guard accounts.
- Firestore incident storage with real-time `onSnapshot` updates.
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
