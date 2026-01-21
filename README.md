# SteadyDiffusion

A FastAPI-based image generation service using Z-Image-Turbo diffusion model with asynchronous job processing.

## Features

- Asynchronous image generation using threading
- Job tracking with SQLite database
- RESTful API with status monitoring
- Automatic image organization by date

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python backend/main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

### Generate Image
```
POST /generate-image
```
Start an image generation job. Returns immediately with a job ID.

**Request Body:**
```json
{
  "prompt": "a beautiful sunset over mountains",
  "height": 1024,
  "width": 1024,
  "num_inference_steps": 9
}
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "image_name": "ImgGen_143022",
  "status": "generating"
}
```

### Check Job Status
```
GET /status/{job_id}
```
Get the current status and details of a generation job.

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "image_name": "ImgGen_143022",
  "status": "completed",
  "prompt": "a beautiful sunset over mountains",
  "height": 1024,
  "width": 1024,
  "num_inference_steps": 9,
  "created_at": "2026-01-21T14:30:22.123456",
  "completed_at": "2026-01-21T14:30:45.789012",
  "error_message": null
}
```

**Status values:**
- `generating`: Image is being generated
- `completed`: Image generation successful
- `failed`: Image generation failed (check error_message)

### Get Image by Job ID
```
GET /image/{job_id}
```
Download the generated image using the job ID. Returns 404 if job not found, or 400 if image is not ready yet.

### Get Image by Name
```
GET /image/by-name/{image_name}
```
Download the generated image using the image name (e.g., "ImgGen_143022").

## Architecture

- **FastAPI**: REST API framework
- **Threading**: Asynchronous image generation
- **SQLite**: Job tracking and status management
- **Z-Image-Turbo**: Diffusion model for image generation

## Output Structure

Generated images are organized by date:
```
outputs/
  20260121/
    ImgGen_143022.png
    ImgGen_143045.png
  20260122/
    ImgGen_091530.png
```

## Requirements

- Python 3.8+
- CUDA-capable GPU
- FastAPI, uvicorn, torch, diffusers, pydantic, pillow