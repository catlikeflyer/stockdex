import numpy as np
from scipy import stats

def calculate_var_cvar(returns, confidence_level=0.95):
    """
    Calculates Parametric Value at Risk (VaR) and Conditional Value at Risk (CVaR)
    for a series of returns.

    Args:
        returns (list or np.array): A series of historical daily returns.
        confidence_level (float): The confidence level for the metrics (default 0.95).

    Returns:
        dict: A dictionary containing:
            - var: Value at Risk at the specified confidence level.
            - cvar: Conditional Value at Risk (Expected Shortfall).
            - mean_return: Average daily return.
            - volatility: Standard deviation of returns.
            - confidence_level: The confidence level used.
    """
    if not isinstance(returns, (list, np.ndarray)):
        # Try to convert if it's pandas series or similar
        returns = np.array(returns)
    
    if len(returns) == 0:
        return {
            "var": 0,
            "cvar": 0,
            "mean_return": 0,
            "volatility": 0,
            "confidence_level": confidence_level
        }

    # Remove NaNs
    returns = returns[~np.isnan(returns)]

    if len(returns) == 0:
         return {
            "var": 0,
            "cvar": 0,
             "mean_return": 0,
            "volatility": 0,
            "confidence_level": confidence_level
        }

    # Calculate statistics
    mean = np.mean(returns)
    std_dev = np.std(returns)

    # Parametric VaR
    # VaR = mean - (Z * std_dev)
    # We want the loss value, so we usually express it as a positive number or negative return.
    # The user prompt asks for "returns worse than VaR". 
    # Usually VaR is expressed as a negative return threshold (e.g. -2%).
    
    alpha = 1 - confidence_level
    z_score = stats.norm.ppf(alpha)
    var = mean + z_score * std_dev

    # Parametric CVaR (Expected Shortfall)
    # CVaR = mean - (std_dev * (pdf(z) / alpha))
    # This formula gives the expected return given it is below VaR.
    pdf_z = stats.norm.pdf(z_score)
    cvar = mean - (std_dev * (pdf_z / alpha))
    
    # NOTE: The formula above `mean - ...` effectively subtracts a positive term (since mean is small, z is neg, but we use alpha).
    # actually: E[X | X <= VaR] = mu - sigma * (phi(z) / Phi(z))
    # where z = Phi^-1(alpha). Phi(z)=alpha. So it is mu - sigma * (phi(z)/alpha).
    # Since we want the threshold value, this will return a negative number (e.g. -0.03).
    
    return {
        "var": var,
        "cvar": cvar,
        "mean_return": mean,
        "volatility": std_dev,
        "confidence_level": confidence_level
    }
