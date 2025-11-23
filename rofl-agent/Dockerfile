# Use a lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for compilation or basic networking
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the agent logic and the model manager
COPY rofl_agent.py .
COPY model_manager.py .

# Create the directory for persistent model storage
# This matches the path used in rofl_agent.py and compose.yaml
RUN mkdir -p /data/model

# Set the entrypoint to run the agent
ENTRYPOINT ["python", "rofl_agent.py"]