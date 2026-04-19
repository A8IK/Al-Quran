# Quran App - Backend Setup Guide

## Architecture

This project uses a **two-tier architecture**:

```
Frontend (Next.js) ← → Backend (Express.js)
         ↓
    http://localhost:3000          http://localhost:5000
```

## Backend Setup

The Express API server is located in the `server/` directory.

### Installation

**Option 1: Install everything at once**
```bash
npm run install:all
```

**Option 2: Manual installation**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

**Option 1: Run both server and client together** (Recommended)
```bash
npm run dev:all
```

**Option 2: Run separately in different terminals**

Terminal 1 - Backend:
```bash
npm run server
# or
cd server && npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
# or
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

**Response:**
```json
{
  "status": "OK",
  "message": "Quran API is running",
  "surahs": 114,
  "totalVerses": 6236
}
```

### Get All Surahs
- `GET /api/surahs` - Get list of all 114 Surahs

**Response:**
```json
[
  {
    "number": 1,
    "nameArabic": "سُورَةُ ٱلْفَاتِحَةِ",
    "nameEnglish": "Al-Faatiha",
    "translation": "The Opening",
    "revelation": "Meccan",
    "ayahCount": 7
  },
  ...
]
```

### Get Specific Surah
- `GET /api/surah/:id` - Get a specific Surah with all its verses

**Example:** `GET /api/surah/1`

**Response:**
```json
{
  "number": 1,
  "nameArabic": "سُورَةُ ٱلْفَاتِحَةِ",
  "nameEnglish": "Al-Faatiha",
  "translation": "The Opening",
  "revelation": "Meccan",
  "ayahs": [
    {
      "number": 1,
      "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "english": "All praise is due to Allah, Lord of the worlds"
    },
    ...
  ]
}
```

### Search Verses
- `GET /api/search?q=query&limit=50` - Search for verses

**Example:** `GET /api/search?q=mercy&limit=10`

**Response:**
```json
[
  {
    "surahNumber": 1,
    "surahNameEnglish": "Al-Faatiha",
    "surahNameArabic": "سُورَةُ ٱلْفَاتِحَةِ",
    "ayahNumber": 3,
    "arabic": "مَالِكِ يَوْمِ الدِّينِ",
    "english": "Master of the Day of Judgment"
  },
  ...
]
```

**Query Parameters:**
- `q` (required) - Search query (min 2 characters)
- `limit` (optional) - Max results to return (default: 50)

### Get Specific Verse
- `GET /api/surah/:surahId/ayah/:ayahNumber` - Get a specific verse

**Example:** `GET /api/surah/1/ayah/1`

**Response:**
```json
{
  "surahNumber": 1,
  "surahNameEnglish": "Al-Faatiha",
  "ayahNumber": 1,
  "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "english": "All praise is due to Allah, Lord of the worlds"
}
```

### Get Verses in a Juz
- `GET /api/juz/:juzNumber` - Get all verses in a specific Juz (1-30)

**Example:** `GET /api/juz/3`

**Response:**
```json
{
  "juz": 3,
  "verses": [
    {
      "surahNumber": 2,
      "surahNameEnglish": "Al-Baqara",
      "ayahNumber": 253,
      "arabic": "...",
      "english": "..."
    },
    ...
  ]
}
```

## Configuration

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** (`server/.env`):
```
PORT=5000
NODE_ENV=development
```

### Production Deployment

For production, update the frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Project Structure

```
quran-app/
├── app/                    # Next.js app directory
│   ├── layout.js
│   ├── page.js
│   └── surah/[id]/page.js
├── components/             # React components
├── context/                # React context (SettingsContext)
├── data/                   # Quran data files
│   ├── quran.json         # Complete Quran data (114 Surahs)
│   └── surahs.json        # Surahs index
├── lib/
│   ├── quran.js           # Utility functions (local fallback)
│   └── api.js             # API client functions
├── public/                 # Static files
├── server/                 # Express API server
│   ├── index.js           # Main server file
│   ├── package.json       # Server dependencies
│   └── .env               # Server environment variables
└── package.json           # Frontend dependencies

```

## Data Flow

1. **Frontend** (`Next.js`) makes HTTP requests to the **Backend**
2. **Backend** (`Express`) reads data from `../data/quran.json`
3. **Backend** returns JSON response
4. **Frontend** displays data in components

```
User Browser
     ↓
Next.js Components
     ↓
API Client (lib/api.js)
     ↓
Express Server (localhost:5000)
     ↓
Quran Data (data/quran.json)
     ↓
Response
     ↓
Component Display
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Kill the process and restart
npm run server
```

### API not responding
```bash
# Check health endpoint
curl http://localhost:5000/api/health
```

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on port 5000
- Check if CORS is enabled (it should be in `server/index.js`)

### Port conflicts
Edit `server/.env` to use a different port:
```
PORT=3001
```

Then update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Tips

### Testing API Endpoints

Use curl or Postman:
```bash
# Get all surahs
curl http://localhost:5000/api/surahs

# Get Surah 1
curl http://localhost:5000/api/surah/1

# Search for "mercy"
curl "http://localhost:5000/api/search?q=mercy"

# Get Juz 3
curl http://localhost:5000/api/juz/3

# Health check
curl http://localhost:5000/api/health
```

### Monitoring Requests

The Express server logs all requests. Watch the terminal for activity.

### Code Changes
- **Frontend changes**: Refresh the browser (auto-reload enabled)
- **Backend changes**: Server automatically restarts (using `--watch` flag)

## Production Build

Frontend:
```bash
npm run build
npm start
```

Backend:
```bash
cd server
npm start
```

Then access at `http://your-domain.com`
