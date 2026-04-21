This is a [Next.js](https://nextjs.org) Quran Reader application with an Express.js backend API.
Live Link: https://harmonious-concha-3ea353.netlify.app/
## Tech Stack

- **Frontend**: Next.js 16.2.4 with React 19
- **Backend**: Express.js (Node.js)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Data**: Static JSON files served via API

## Getting Started

### Quick Start (Recommended)

1. **Install all dependencies**:
```bash
npm run install:all
```

2. **Run frontend and backend together**:
```bash
npm run dev:all
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Start (Separate Terminals)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Features

- 📖 Read all 114 Surahs with complete translations
- 🔍 Search verses by Arabic text or English translation
- 📑 Browse by Juz divisions (30 sections)
- 🎨 3 Arabic font options (King Fahad v1/v2, Qpc Utmani)
- 🌙 Dark mode support
- 📱 Responsive design (mobile, tablet, desktop)
- 🚀 Copy verses to clipboard
- ⚙️ Customizable text sizes

## API Endpoints

The Express backend provides the following endpoints:

- `GET /api/health` - API health check
- `GET /api/surahs` - Get all Surahs
- `GET /api/surah/:id` - Get specific Surah with verses
- `GET /api/search?q=query` - Search verses
- `GET /api/surah/:surahId/ayah/:ayahNumber` - Get specific verse
- `GET /api/juz/:juzNumber` - Get verses in a Juz

See [server/README.md](server/README.md) for detailed API documentation.

## Project Structure

```
quran-app/
├── app/              # Next.js app directory
├── components/       # React components
├── context/          # React Context (settings)
├── data/             # Quran data (JSON)
├── lib/              # Utility functions & API client
├── public/           # Static assets
├── server/           # Express API server
│   ├── index.js     # Main server
│   └── package.json # Server dependencies
└── package.json     # Frontend dependencies
```

## Available Scripts

```bash
# Development
npm run dev         # Run frontend only
npm run server      # Run backend only
npm run dev:all     # Run both together

# Production
npm run build       # Build frontend
npm start           # Start frontend
npm run install:all # Install all dependencies
```

## Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** (`server/.env`):
```
PORT=5000
NODE_ENV=development
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Server API Documentation](./server/README.md)


