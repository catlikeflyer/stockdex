# Stockdex Pro

A modern, Bento-grid financial dashboard that gamifies stock analysis.

## Features
- **Stat Radar**: Visualizes stock health (Liquidity, Growth, Margins, etc.) as Pokemon-style stats.
- **Trend Evolution**: 1-year historical price chart.
- **Raw Metrics**: Key financial data (Market Cap, P/E, etc.).
- **Smart Search**: Context-aware ticker search.
- **Bento UI**: Responsive grid layout with glassmorphism and fintech aesthetics.

## Tech Stack
- **Backend**: FastAPI, yfinance
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Framer Motion

## Setup

1. **Install Dependencies**
   ```bash
   # Backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt

   # Frontend
   cd frontend
   npm install
   cd ..
   ```

2. **Run Application**
   You can run both servers with the included script:
   ```bash
   ./run.sh
   ```

   Or manually:
   - Backend: `source .venv/bin/activate && uvicorn backend.main:app --reload`
   - Frontend: `npm run dev --prefix frontend`

## License
MIT
