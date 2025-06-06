#!/bin/bash

# Activate the Python venv for Whisper
echo "Starting Whisper API..."
source whisper/venv/bin/activate
uvicorn whisper.server:app --reload --port 8000
