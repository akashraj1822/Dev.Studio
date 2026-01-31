# Admin Dashboard

A private, mobile-first PWA for managing leads and projects.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Supabase Setup**:
    Ensure the following tables exist in your Supabase project:
    - `leads` (from the public site)
    - `projects` (id, client_name, price, advance_received, status, progress, created_at)
    - `payments` (id, amount, type, date, method, created_at)

3.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features
- **Leads**: Real-time sync from the public website.
- **Projects**: Track active work and progress.
- **Billing**: View revenue and transaction history.
- **Mobile PWA**: Installable on Android (Add to Home Screen).
