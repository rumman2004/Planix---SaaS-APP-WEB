# Planix Setup Guide

Follow these steps to set up the Planix development environment on your local machine.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **PostgreSQL**: v14 or higher (or a Supabase account)
- **Google Cloud Platform Account**: For OAuth2 credentials

## 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd Planix

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

## 2. Database Configuration

Planix uses PostgreSQL. You can use a local instance or a managed service like Supabase.

1.  Create a new database named `planix`.
2.  Run the initialization scripts located in the `Database/` directory:
    - First, run `scema.sql` to create basic tables.
    - Then, run `migration.sql` for any updates.

## 3. Google Cloud Setup

To enable Google Calendar and Tasks synchronization:

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project named "Planix".
3.  Enable the following APIs:
    - Google Calendar API
    - Google Tasks API
    - Google People API (for profile info)
4.  Configure the **OAuth Consent Screen**:
    - User Type: External.
    - Add Scopes: `.../auth/calendar`, `.../auth/tasks`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
5.  Create **OAuth 2.0 Client IDs**:
    - Application Type: Web Application.
    - Authorized Redirect URIs: `http://localhost:5000/api/auth/google/callback`.
6.  Copy your **Client ID** and **Client Secret**.

## 4. Environment Variables

### Server (`server/.env`)
Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
JWT_SECRET=your_random_secret_string
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_API_URI=http://localhost:5000/api
```

## 5. Running the Application

### Start the Backend
```bash
cd server
npm run dev
```

### Start the Frontend
```bash
cd client
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 6. Deployment (Brief)

- **Backend**: Use a service like Render, Heroku, or a VPS. Ensure all environment variables are set in the platform's dashboard.
- **Frontend**: Vite apps are easily deployed to Vercel or Netlify.
- **Database**: Supabase is recommended for easy managed PostgreSQL with SSL support.
