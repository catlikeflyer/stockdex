import sys
import os

# Add the parent directory to sys.path to allow importing from main
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app
