# Aurora Stream

A full-stack personal cloud music streaming platform with a custom colorful glass UI, JWT auth, Cloudinary uploads, playlists, favorites, search, recently played tracking, and a sticky audio player.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router DOM, Axios
- Backend: Node.js, Express, MongoDB Atlas, JWT, Cloudinary, Multer

## Local Setup

1. Install dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Fill in `backend/.env` with MongoDB Atlas and Cloudinary credentials.

4. Run the apps in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API runs on `http://localhost:5000/api`.

## Deployment

- Deploy `frontend` to Vercel.
- Deploy `backend` to Render.
- Use MongoDB Atlas for `MONGO_URI`.
- Use Cloudinary for audio, cover, and profile image storage.
- Set `CLIENT_URL` on Render to your Vercel URL.
- Set `VITE_API_URL` on Vercel to your Render API URL, ending in `/api`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/songs`
- `GET /api/songs/trending`
- `GET /api/songs/search?q=term`
- `POST /api/songs/upload`
- `POST /api/songs/:id/play`
- `POST /api/songs/:id/favorite`
- `GET /api/songs/favorites`
- `GET /api/playlists`
- `POST /api/playlists`
- `GET /api/playlists/:id`
- `POST /api/playlists/:id/songs`
- `DELETE /api/playlists/:id/songs/:songId`
- `GET /api/users/profile`
- `PATCH /api/users/profile`
