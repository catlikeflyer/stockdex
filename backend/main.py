from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from functools import lru_cache
import pandas as pd
import math

app = FastAPI(title="Stockdex API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://stockdex.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def map_stat(value, low, mid, high, points_low=20, points_mid=70, points_high=100, inverse=False):
    """
    Maps a value to a 0-100 score based on 3 pivot points (low, mid, high).
    """
    if value is None:
        return 0
    
    # Handle percentages if they come in as 0.15 for 15%
    # But yfinance usually returns raw floats. 
    # Let's assume input values match the scale of breakpoints.
    
    if inverse:
        # For Solvency (debtToEquity): Lower is better
        # 200+ = 10 pts, 100 = 50 pts, 0 = 100 pts
        # So low=0(100pts), mid=100(50pts), high=200(10pts)
        if value <= low: return points_low # Actually this parameter naming assumes standard (low val = low points). 
        # Let's rewrite for inverse specifically or just handle logic here.
        pass

    # Generic Linear Interpolation Helper
    def interp(v, x1, y1, x2, y2):
        if x2 == x1: return y1
        return y1 + (v - x1) * (y2 - y1) / (x2 - x1)

    score = 0
    if not inverse:
        if value <= low:
            score = points_low # Cap at bottom? Or interpolate to 0? Prompt says 0.5=20.
            # Let's simple clamp
            score = max(0, interp(value, 0, 0, low, points_low)) if value < low else points_low
        elif value <= mid:
            score = interp(value, low, points_low, mid, points_mid)
        elif value <= high:
            score = interp(value, mid, points_mid, high, points_high)
        else:
            score = points_high
    else:
        # Inverse: Low value = High score
        # Using the prompt specific: 200+ = 10 pts, 100 = 50 pts, 0 = 100 pts.
        # So we map: >200 -> 10. 100-200 -> 50-10. 0-100 -> 100-50.
        if value >= high: # 200+
             score = points_high # This var name is confusing for inverse. Let's hardcode the logic for clarity.
             score = 10
        elif value >= mid: # 100-200
             score = interp(value, mid, 50, high, 10)
        elif value >= low: # 0-100
             score = interp(value, low, 100, mid, 50)
        else: 
             score = 100 # < 0 ? 
    
    return int(max(0, min(100, score)))


@lru_cache(maxsize=100)
def get_stock_data(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info
    
    if 'symbol' not in info:
        # Sometimes yfinance doesn't raise error but returns empty info
        raise HTTPException(status_code=404, detail="Stock not found")

    # Fetch history for 1 year
    hist = stock.history(period="1y")
    history_data = []
    if not hist.empty:
        # Reset index to get Date as column, converting to str YYYY-MM-DD
        hist.reset_index(inplace=True)
        # Simplify data
        for _, row in hist.iterrows():
            history_data.append({
                "date": row['Date'].strftime('%Y-%m-%d'),
                "price": round(row['Close'], 2)
            })

    # Stats extracting
    # HP (Liquidity): currentRatio
    current_ratio = info.get('currentRatio', 0)
    hp_score = map_stat(current_ratio, 0.5, 1.5, 3.0, 20, 70, 100)

    # Attack (Growth): revenueGrowth
    revenue_growth = info.get('revenueGrowth', 0) # 0.15 is 15%
    atk_score = map_stat(revenue_growth, 0.0, 0.15, 0.40, 20, 70, 100)

    # Defense (Profitability): profitMargins
    profit_margins = info.get('profitMargins', 0)
    def_score = map_stat(profit_margins, 0.05, 0.20, 0.40, 30, 75, 100)

    # Sp. Atk (Innovation): grossMargins
    gross_margins = info.get('grossMargins', 0)
    sp_atk_score = map_stat(gross_margins, 0.10, 0.40, 0.70, 20, 70, 100)

    # Sp. Def (Solvency): debtToEquity
    # yfinance often returns debtToEquity as percentage (e.g. 150 for 1.5 ratio? Or raw?)
    # checking doc: yfinance usually returns a ratio * 100 (so 200 is 2.0 debt/equity?) 
    # Prompt says: "200+ = 10 pts", so likely it expects values like 200.
    debt_equity = info.get('debtToEquity', 0)
    # Inverse: 200+ = 10, 100 = 50, 0 = 100
    sp_def_score = map_stat(debt_equity, 0, 100, 200, points_low=0, points_mid=0, points_high=0, inverse=True)

    # Speed (Volatility): beta
    beta = info.get('beta', 1.0)
    if beta is None: beta = 1.0
    # Beta < 0.5 = 20 pts (Wait, low volatility is "Speed"? 
    # Or is High Volatility Speed? 
    # Prompt: "Speed (Volatility): Map beta. (Beta < 0.5 = 20 pts, 1.0 = 50 pts, 2.0+ = 100 pts)."
    # So Higher Beta = Higher Speed.
    speed_score = map_stat(beta, 0.5, 1.0, 2.0, 20, 50, 100)


    stats = {
        "Liquidity": hp_score,
        "Growth": atk_score,
        "Profitability": def_score,
        "Innovation": sp_atk_score,
        "Solvency": sp_def_score,
        "Volatility": speed_score
    }
    
    # Determine Type based on sector/industry
    industry = info.get('industry', 'Unknown')
    sector = info.get('sector', 'Unknown')
    
    # Raw Stats for display
    raw_stats = {
        "market_cap": info.get("marketCap"),
        "pe_ratio": info.get("trailingPE"),
        "dividend_yield": info.get("dividendYield"),
        "fifty_two_week_high": info.get("fiftyTwoWeekHigh"),
        "fifty_two_week_low": info.get("fiftyTwoWeekLow"),
        "avg_volume": info.get("averageVolume"),
    }

    return {
        "ticker": info.get('symbol'),
        "name": info.get('shortName'),
        "logo_url": info.get('logo_url', ''), 
        "category": industry, # Replaced Pokemon Type with Industry
        "sector": sector,
        "stats": stats,
        "raw_stats": raw_stats,
        "history": history_data,
        "current_price": info.get('currentPrice'),
        "currency": info.get('currency', 'USD')
    }

@app.get("/analyze/{ticker}")
def analyze_stock(ticker: str):
    try:
        return get_stock_data(ticker.upper())
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
def search_ticker(q: str):
    """
    Simple autocomplete using yfinance internal utils or direct search if available.
    Since yfinance doesn't expose a clean search API, we'll try a basic approach 
    or just return the query if it looks like a valid ticker structure (mocking autocomplete for PoC 
    if strictly necessary, but yfinance.Ticker(q).info check is too slow for autocomplete).
    
    Actually, we can use a small workaround or just rely on frontend sending full tickers for now 
    if we can't find a fast valid yf search.
    
    However, many "yfinance" wrappers use the Yahoo Finance autocomp API directly.
    Let's try to hit the public endpoint YF uses.
    """
    try:
        import requests
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        resp = requests.get(url, headers=headers)
        data = resp.json()
        
        results = []
        if 'quotes' in data:
            for item in data['quotes']:
                if item.get('isYahooFinance', False): continue # skip non-ticker items if any
                results.append({
                    "symbol": item.get('symbol'),
                    "shortname": item.get('shortname', item.get('longname', ''))
                })
        return results[:10] # Top 10
    except Exception as e:
        print(f"Search error: {e}")
        return []

from pydantic import BaseModel
from typing import List

class TeamRequest(BaseModel):
    tickers: List[str]

@app.post("/analyze-team")
def analyze_team(request: TeamRequest):
    team_data = []
    
    # metrics for aggregation
    total_stats = {
        "Liquidity": 0, "Growth": 0, "Profitability": 0, 
        "Innovation": 0, "Solvency": 0, "Volatility": 0
    }
    
    sectors = {}
    
    valid_count = 0
    
    for ticker in request.tickers:
        try:
            # We use the existing function but we need to handle if it fails gracefully for the team view
            # If one stock fails, we might just skip it or error out? 
            # Let's skip it but log it
            data = get_stock_data(ticker.upper())
            team_data.append(data)
            
            # Aggregate Stats
            for key in total_stats:
                total_stats[key] += data['stats'].get(key, 0)
            
            # Aggregate Sectors
            sec = data.get('sector', 'Unknown')
            sectors[sec] = sectors.get(sec, 0) + 1
            
            valid_count += 1
            
        except Exception as e:
            print(f"Error fetching {ticker} for team: {e}")
            continue

    if valid_count == 0:
        raise HTTPException(status_code=400, detail="No valid stocks found for team")

    # Average the stats
    avg_stats = {k: int(v / valid_count) for k, v in total_stats.items()}
    
    # Calculate composition percentages
    composition = []
    for sec, count in sectors.items():
        composition.append({
            "sector": sec,
            "count": count,
            "percentage": round((count / valid_count) * 100, 1)
        })
    
    # Sort composition by percentage desc
    composition.sort(key=lambda x: x['count'], reverse=True)

    # Risk Analysis (Correlation Matrix)
    correlation_matrix = {}
    try:
        # 1. Consolidate History into DataFrame
        data_frames = []
        for member in team_data:
            ticker = member['ticker']
            # member['history'] is list of dicts: {'date': 'YYYY-MM-DD', 'price': 123.45}
            df = pd.DataFrame(member['history'])
            if not df.empty:
                df['date'] = pd.to_datetime(df['date'])
                df.set_index('date', inplace=True)
                df.rename(columns={'price': ticker}, inplace=True)
                data_frames.append(df)
        
        if len(data_frames) > 1:
            # Join on index (Date), outer join to keep all dates? Or inner to compare only valid periods?
            # Inner join is safer for correlation to ensure same time periods.
            combined_df = pd.concat(data_frames, axis=1, join='inner')
            
            # 2. Calculate Daily Returns
            returns_df = combined_df.pct_change().dropna()
            
            # 3. Calculate Correlation
            corr_df = returns_df.corr()
            
            # Format for JSON: {'AAPL': {'AAPL': 1.0, 'MSFT': 0.8}, 'MSFT': ...}
            # Or list of nodes/links? 
            # For Heatmap, a simple dict structure is fine.
            # But converting to a list of rows might be easier for frontend to iterate.
            # Let's clean NaN
            corr_df = corr_df.fillna(0)
            
            # Convert to dict of dicts
            temp_dict = corr_df.to_dict()
            
            # Structure for easy frontend grid: 
            # { "tickers": ["AAPL", "MSFT"], "matrix": [[1.0, 0.8], [0.8, 1.0]] }
            tickers = list(combined_df.columns)
            matrix = []
            for t1 in tickers:
                row = []
                for t2 in tickers:
                    val = temp_dict[t1].get(t2, 0)
                    row.append(round(val, 2))
                matrix.append(row)
            
            correlation_matrix = {
                "tickers": tickers,
                "matrix": matrix
            }
            
    except Exception as e:
        print(f"Risk analysis error: {e}")
        # Return empty if fails

    return {
        "team_members": team_data,
        "team_stats": avg_stats,
        "team_composition": composition,
        "member_count": valid_count,
        "risk_analysis": correlation_matrix
    }
