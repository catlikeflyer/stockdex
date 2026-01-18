# Stockdex Pro

A modern, Bento-grid financial dashboard that gamifies stock analysis.

## Features
- **Stat Radar**: Visualizes stock health (Liquidity, Growth, Margins, etc.) as Pokemon-style stats.
- **Team Builder**: Build a portfolio of up to 6 stocks to analyze their combined stats and synergy.
- **Risk Analysis**: Correlation heatmap to visualize team members' return correlations (Synergy/Hedging).
- **Portfolio Metrics**: Analyzes weighted average P/E and Dividend Yield for the team.
- **Trend Evolution**: 1-year historical price chart.
- **Raw Metrics**: Key financial data (Market Cap, P/E, etc.).
- **Smart Search**: Context-aware ticker search.
- **Bento UI**: Responsive grid layout with glassmorphism and fintech aesthetics.

## Mathematical Methodologies

### 1. Risk Analysis (Correlation Heatmap)
To visualize the relationship between assets in a team, we compute the **Pearson Correlation Coefficient** of their daily returns.

**Step 1: Daily Returns**
We calculate the daily percentage change in price for each stock $i$:
$$ R_{i,t} = \frac{P_{i,t} - P_{i,t-1}}{P_{i,t-1}} $$

**Step 2: Correlation Matrix**
For any pair of stocks $X$ and $Y$, the correlation coefficient $\rho_{X,Y}$ is calculated as:
$$ \rho_{X,Y} = \frac{\text{cov}(X,Y)}{\sigma_X \sigma_Y} $$
Where:
- $\text{cov}(X,Y)$ is the covariance of the daily returns.
- $\sigma_X$ and $\sigma_Y$ are the standard deviations (volatility) of the returns.

**Interpretation:**
- $\rho = 1.0$: Perfect positive correlation (Prices move identically).
- $\rho = -1.0$: Perfect negative correlation (Prices move inversely).
- $\rho \approx 0$: No correlation.

### 2. Team Metrics
- **Average P/E**: Arithmetic mean of the P/E ratios of team members.
- **Average Yield**: Arithmetic mean of the Dividend Yields.
*(Note: In a real portfolio, these would be weighted by position size, but for the "Dream Team" builder, we assume equal weights).*

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
