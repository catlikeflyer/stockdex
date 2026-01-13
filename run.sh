#!/bin/bash

# Activate backend virtual env
source .venv/bin/activate

# Start Backend in background
echo "Starting Backend..."
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Trap SIGINT to kill both on Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Wait
wait
