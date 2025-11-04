# African Nations League – INF4001N Entrance Exam 2026

## 1. Overview

The **African Nations League** web app is a football tournament simulation platform developed for the **INF4001N Entrance Exam (2026)**.
It’s built using **React + Firebase (Auth, Firestore, Hosting)** and lets national representatives register teams while administrators can simulate matches, manage data, and view results.

All tournament data is stored in **Firebase Firestore**, with real-time updates and secure authentication.

---

## 2. Login Details

### Administrator Account

* **Email:** `admin@example.com`
* **Password:** `admin123`

### Representative Account

* **Email:** `rep@example.com`
* **Password:** `rep123`

> These test accounts are pre-configured for grading.
> The admin can access all areas, while the representative can only register a team and view results.

---

## 3. Firebase Configuration

**Firebase Project:** `anleague-backend`

Make sure your `src/firebase.js` includes your Firebase config:

```js
const firebaseConfig = {
  apiKey: "AIzaSyCJPQDx8COLdzKZjvwUj3vPP7qE2XcqbL8",
  authDomain: "anleague-backend.firebaseapp.com",
  projectId: "anleague-backend",
  storageBucket: "anleague-backend.appspot.com",
  messagingSenderId: "866726235387",
  appId: "1:866726235387:web:da094d0a0c5f8fe59cb45e"
};
```

Then export Firestore and Auth:

```js
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## 4. Installation & Running Locally

**Step 1 — Install dependencies**

```bash
npm install
```

**Step 2 — Run the app in development mode**

```bash
npm run dev
```

Open the local link (e.g. [http://localhost:5173](http://localhost:5173)) in your browser.

**Step 3 — Log in**
Use either the **admin** or **representative** credentials to test the system.

---

## 5. Project Features

| Feature                 | Description                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Authentication**      | Firebase Auth with secure role-based access (Admin & Rep)                                           |
| **Database**            | Firestore collections: `teams`, `quarterFinals`, `semiFinals`, `final`, `hallOfFame`, `pastWinners` |
| **Team Registration**   | Representatives register a new country, manager info, and get random player generation              |
| **Simulation Engine**   | Auto-simulates the full tournament with goal scoring, match results, and confetti celebration       |
| **Bracket System**      | Dynamically displays seeded and simulated matches                                                   |
| **Analytics Dashboard** | Admin dashboard with team performance and historical stats                                          |
| **Hall of Fame**        | Displays past champions and runners-up                                                              |
| **Audio & Visuals**     | Goal/whistle sounds + confetti animations                                                           |
| **Theme Toggle**        | Switch between light and dark modes                                                                 |
| **Responsive UI**       | Tailwind CSS – works on all screen sizes                                                            |

---

## 6. System Architecture

Below is the architecture diagram of the system that shows how each component connects (frontend, backend, Firebase, and external services).

### Diagram Preview

![System Architecture](./docs/system_architecture.png)


---

## 7. Deployment

**Step 1 — Build the production bundle**

```bash
npm run build
```

**Step 2 — Initialize Firebase Hosting**

```bash
firebase login
firebase init hosting
# Select project: anleague-backend
# Public directory: dist
# Configure as SPA: Yes
```

**Step 3 — Deploy**

```bash
firebase deploy --only hosting
```

Once done, Firebase will give a live URL like:

```
https://anleague-backend.web.app
```

Include that URL in your submission.

---

## 8. Submission Checklist (INF4001N)

1. **Zip file name:**
   `INF4001N_StudentNo_ANLeague_2026.zip`

2. **Include in ZIP:**

   * All source code (`/src`, `/public`, etc.)
   * `README.md` (this file)
   * `firebase.js` or `.env.example` (no secrets)
   * `/dist` (optional)
   * A small text note with:

     * Admin login
     * Rep login
     * Firebase collaborators
     * Deployment link

3. **Firebase collaborators:**

   * `ammarcanani@gmail.com`
   * `elsje.scott@uct.ac.za`

4. **Deployment URL:**
   Add your live Firebase Hosting URL here.

5. **README:**
   This document explains how to run and test the app.

---

## 9. Notes for Grading Team

This submission includes all core and bonus features listed in the INF4001N brief:

* Audio and confetti effects
* Full tournament auto-simulation
* Hall of Fame and analytics dashboard
* Live Firebase backend (Auth + Firestore)
* Clean React structure using functional components and hooks
* Responsive Tailwind UI with theme toggle

Developed by **Keval Armano Ramchander (RMCKEV001)**
INF4001N Entrance Exam 2026 – University of Cape Town
© 2025 African Nations League Project
