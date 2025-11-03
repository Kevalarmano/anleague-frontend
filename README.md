African Nations League – INF4001N Entrance Exam 2026
1. Overview

The African Nations League web application is a football tournament simulation platform developed for the INF4001N Entrance Exam (2026).
It allows representatives to register national teams, and administrators to seed matches, auto-simulate tournaments, and manage data.
All information is stored in Firebase Firestore, with real-time updates and secure authentication.

2. Login Details
Administrator Account

Email: admin@example.com

Password: admin123

Representative Account

Email: rep@example.com

Password: rep123

These accounts are preconfigured for testing and grading.
The admin has full access to all pages, while the representative can only register and view teams.

3. Firebase Configuration

Firebase Project: anleague-backend

To run the app, ensure your src/firebase.js includes your Firebase config:

const firebaseConfig = {
  apiKey: "AIzaSyCJPQDx8COLdzKZjvwUj3vPP7qE2XcqbL8",
  authDomain: "anleague-backend.firebaseapp.com",
  projectId: "anleague-backend",
  storageBucket: "anleague-backend.appspot.com",
  messagingSenderId: "866726235387",
  appId: "1:866726235387:web:da094d0a0c5f8fe59cb45e"
};


Then export the initialized Firestore and Auth instances:

export const db = getFirestore(app);
export const auth = getAuth(app);

4. Installation & Running Locally
Step 1 — Install dependencies
npm install

Step 2 — Run the app in development mode
npm run dev


The app will start on a local server (e.g. http://localhost:5173)

Open that link in your browser.

Step 3 — Log in

Use either admin or representative credentials to test the system.

5. Project Features
Feature	Description
Authentication: Firebase Auth with secure admin and rep accounts
Database: Firestore with collections: teams, quarterFinals, semiFinals, final, hallOfFame, pastWinners
Team Registration: Representatives register new countries with manager info and random player generation
Simulation Engine: Auto tournament simulation with goal scoring, winners, and confetti celebration
Bracket System: Dynamic match display for all seeded and simulated matches
Analytics Dashboard	Admin view for tracking team performance and historical results
Hall of Fame: Displays past champions and runners-up
Sound Effects: Whistle and goal audio for immersion
Visual Effects: Confetti celebration animation
Theme Toggle: Light/dark mode switch
Responsive UI: Mobile-friendly Tailwind CSS design
6. Deployment

To deploy using Firebase Hosting:

Step 1 — Build production bundle
npm run build

Step 2 — Initialize Firebase Hosting
firebase login
firebase init hosting
# Select your project: anleague-backend
# Set public directory to "dist"
# Configure as single-page app: Yes

Step 3 — Deploy to the web
firebase deploy --only hosting


After deploying, Firebase will display a live URL (e.g., https://anleague-backend.web.app)
Include this link in your submission.

7. Submission Checklist (as per INF4001N brief)

 1. Zip file name:
INF4001N_StudentNo_ANLeague_2026.zip

 2. Contents inside the zip:

All source code files (/src, /public, etc.)

README.md (this file)

.env.example or firebase.js (no secrets)

Built files (/dist) – optional

A short text file or note containing:

Admin credentials (admin@example.com
 / admin123)

Representative credentials (rep@example.com
 / rep123)

Firebase project access given to:

ammarcanani@gmail.com

elsje.scott@uct.ac.za

Deployed site URL

 3. Database Access:
Add both required emails (ammarcanani@gmail.com, elsje.scott@uct.ac.za) as project collaborators in Firebase Console.

 4. Deployment URL:
Include your live Firebase Hosting URL in the submission.

 5. Readme:
This file explains how to install, run, and test the project.

8. Notes for Grading Team

The app includes all required and bonus features:

Audio effects

Confetti celebrations

Auto-simulation logic

Hall of Fame

Analytics and admin dashboard

Thematic UI

The database and authentication are hosted live on Firebase.

Code follows clean, modular React structure using functional components and modern hooks.

Developed by:
Keval Armano Ramchander (RMCKEV001)
INF4001N Entrance Exam 2026 Submission
© 2025 African Nations League | University of Cape Town
