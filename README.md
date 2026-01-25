# Stockdex Pro

A modern, Bento-grid financial dashboard designed to make stock analysis **quick, visual, and easy for beginners**.

## Why Stockdex?
Stock markets can be overwhelming. Stockdex Pro simplifies the noise by turning complex financial data into intuitive, game-like visuals. Whether you're a complete beginner or looking for a faster way to screen stocks, this tool helps you understand what matters in seconds.

## Beginner-Friendly Features
- **Stat Radar**: Instantly see a stock's strengths and weaknesses (Liquidity, Growth, Profitability) visualized as a Pokemon-style stat chart. No need to dig through spreadsheets.
- **Built-in Glossary**: Confused by a term like "P/E Ratio" or "Beta"? Just click the glossary to get plain-English definitions while you analyze.
- **Team Builder**: "Draft" a portfolio of up to 6 stocks and see how they work together as a team.
- **Risk Simplified**: Our "Synergy Heatmap" uses simple colors to show if your stocks move together (risky) or balance each other out (safe).
- **Key Metrics Only**: We filter out the noise and show you the most important numbers: Market Cap, P/E, and Yield.
- **Trend Evolution**: A clean 1-year history chart to see the price trend at a glance.

## Mathematical Methodologies (Simplified)

### 1. Risk Analysis (Correlation Heatmap)
To see if your "team" plays well together, we look at how their prices move daily.
- **Green (Low Correlation)**: Great! These stocks don't crash at the same time.
- **Red (High Correlation)**: Careful. If one goes down, the other likely will too.

### 2. Team Metrics
- **Average P/E**: Is your team expensive or cheap compared to earnings?
- **Average Yield**: How much dividend income can you expect on average?

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
