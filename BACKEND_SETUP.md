# Express.js Backend Setup - Summary

## What Was Created

I've successfully set up an **Express.js API backend** for your Quran app. Here's what was added:

### 📁 Files Created

```
server/
├── index.js          # Main Express server with all API routes
├── package.json      # Server dependencies (Express, CORS, dotenv)
├── .env              # Server configuration
└── README.md         # Detailed API documentation
```

### 📝 Configuration Files Updated

```
Root directory:
├── package.json      # Added dev scripts and concurrently
├── .env.local        # Added NEXT_PUBLIC_API_URL for frontend
├── .gitignore        # Added server/node_modules
└── README.md         # Updated with backend info
```

### 📚 Code Files Updated

```
lib/
├── api.js            # NEW - API client functions
└── quran.js          # Kept for backward compatibility

app/surah/[id]/
└── page.js           # Updated to use API client

components/
└── HomeClient.js     # Updated to use API client
```

---

## How It Works

### Architecture
```
User Browser
     ↓
Next.js Components ← (Call functions from lib/api.js)
     ↓
Express API Server (localhost:5000)
     ↓
Quran JSON Data (data/quran.json)
     ↓
JSON Response
     ↓
Display in Components
```

### Data Flow
1. **Frontend** (Next.js) makes HTTP requests to **Backend API**
2. **Backend** (Express) receives the request
3. **Backend** reads data from `data/quran.json` and `data/surahs.json`
4. **Backend** returns JSON response
5. **Frontend** displays the data

---

## 🚀 Quick Start

### Step 1: Install All Dependencies
```bash
npm run install:all
```

This installs both frontend and backend packages.

### Step 2: Run Everything
```bash
npm run dev:all
```

This starts both the backend and frontend simultaneously.

**Output should show:**
```
Frontend running on http://localhost:3000
Backend API running on http://localhost:5000
```

### Step 3: Test the API (Optional)
Open a new terminal and test:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all surahs
curl http://localhost:5000/api/surahs

# Get Surah 1
curl http://localhost:5000/api/surah/1

# Search verses
curl "http://localhost:5000/api/search?q=mercy"

# Get Juz 3
curl http://localhost:5000/api/juz/3
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Check API status |
| `GET` | `/api/surahs` | Get all 114 Surahs |
| `GET` | `/api/surah/:id` | Get specific Surah with verses |
| `GET` | `/api/search?q=query` | Search verses (min 2 chars) |
| `GET` | `/api/surah/:id/ayah/:number` | Get specific verse |
| `GET` | `/api/juz/:number` | Get verses in a Juz (1-30) |

**Example Responses:**

**GET /api/surahs** - Returns array of 114 Surahs
```json
[
  {
    "number": 1,
    "nameEnglish": "Al-Faatiha",
    "nameArabic": "سُورَةُ ٱلْفَاتِحَةِ",
    "translation": "The Opening",
    "revelation": "Meccan",
    "ayahCount": 7
  },
  ...
]
```

**GET /api/surah/1** - Returns Surah 1 with all 7 verses
```json
{
  "number": 1,
  "nameEnglish": "Al-Faatiha",
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

---

## 🛠️ Available Commands

```bash
# Install all dependencies
npm run install:all

# Run backend and frontend together
npm run dev:all

# Run frontend only
npm run client
npm run dev

# Run backend only
npm run server

# Build for production
npm run build
npm start
```

---

## ⚙️ Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Change to your production API URL when deploying.

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
```
Change PORT if 5000 is already in use.

---

## 📂 Project Structure

```
quran-app/
├── app/                    # Next.js pages
│   ├── layout.js
│   ├── page.js            # Home page
│   └── surah/[id]/page.js # Surah pages
├── components/             # React components
│   ├── Sidebar.js
│   ├── AyahCard.js
│   ├── SurahView.js
│   └── ... other components
├── context/
│   └── SettingsContext.js  # Settings state
├── data/
│   ├── quran.json         # Complete Quran data
│   └── surahs.json        # Surahs index
├── lib/
│   ├── api.js             # API client (NEW)
│   └── quran.js           # Local utilities
├── public/
│   └── favicon, images
├── server/                # Express API (NEW)
│   ├── index.js           # Main server
│   ├── package.json       # Server dependencies
│   ├── .env               # Server config
│   └── README.md          # API docs
├── .env.local             # Frontend config (NEW)
├── .gitignore             # Updated
├── package.json           # Updated
└── README.md              # Updated
```

---

## 🔍 Key Components

### 1. API Client (lib/api.js)
Functions that handle all API calls:
- `getAllSurahs()` - Fetch all Surahs
- `getSurah(id)` - Fetch specific Surah
- `searchAyahs(query)` - Search verses
- `getJuz(number)` - Get Juz verses
- `checkAPIHealth()` - Check if API is running

### 2. Express Server (server/index.js)
- 6 API endpoints
- CORS enabled for frontend
- Error handling
- Data validation
- Health check endpoint

### 3. Frontend Components
- Updated to use API client functions
- Fallback to local data if API fails
- Automatic retry logic

---

## ✅ What's Working

✅ Frontend loads data from Express backend  
✅ All 114 Surahs available via API  
✅ Search functionality via `/api/search`  
✅ Juz filtering via `/api/juz/:number`  
✅ Copy verses to clipboard  
✅ Font switching (3 options)  
✅ Dark mode  
✅ Responsive design  
✅ Settings persistence  

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Use a different port in server/.env
PORT=3001
```

### Frontend can't connect to backend
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart frontend after changing `.env.local`

### Port already in use
Edit `server/.env`:
```
PORT=5001
```

Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 📖 Next Steps

1. **Run the app**: `npm run dev:all`
2. **Test the API**: Use the curl commands above
3. **Review API docs**: Check `server/README.md`
4. **Deploy**: Add production API URL to `.env.local`

---

## 📚 File References

- **Frontend README**: [README.md](../README.md)
- **Backend README**: [server/README.md](../server/README.md)
- **API Client**: [lib/api.js](../lib/api.js)
- **Express Server**: [server/index.js](../server/index.js)

---

**Everything is ready to run! Execute `npm run dev:all` to start both server and client.** 🎉
