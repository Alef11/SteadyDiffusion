from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from generator import main as image_generator
import threading
from utils import output_folder_handler
from database.dbconnector import DatabaseConnector
import os

app = FastAPI()

# Initialize database connector
db = DatabaseConnector()


class GenerateImageRequest(BaseModel):
    prompt: str
    height: int = 1024
    width: int = 1024
    num_inference_steps: int = 9


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/generate-image")
def generate_image_endpoint(request: GenerateImageRequest):
    """
    Start image generation in a background thread and return job ID immediately.
    
    Returns:
        dict: Contains job_id and image_name for tracking the generation
    """
    # Generate image name/path
    image_path = output_folder_handler.get_save_location()
    image_name = os.path.basename(image_path)
    
    # Create job in database with "generating" status
    job_id = db.create_job(
        prompt=request.prompt,
        height=request.height,
        width=request.width,
        num_inference_steps=request.num_inference_steps,
        image_name=image_name
    )
    
    # Start image generation in a separate thread
    generation_thread = threading.Thread(
        target=image_generator.generate_image,
        args=(job_id, request.prompt, request.height, request.width, 
              request.num_inference_steps, image_path, db)
    )
    generation_thread.start()
    
    return {
        "job_id": job_id,
        "image_name": image_name,
        "status": "generating"
    }


@app.get("/status/{job_id}")
def get_job_status(job_id: str):
    """
    Get the status of an image generation job.
    
    Args:
        job_id: The unique job identifier
        
    Returns:
        dict: Job information including status, timestamps, and parameters
    """
    job = db.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": job["job_id"],
        "image_name": job["image_name"],
        "status": job["status"],
        "prompt": job["prompt"],
        "height": job["height"],
        "width": job["width"],
        "num_inference_steps": job["num_inference_steps"],
        "created_at": job["created_at"],
        "completed_at": job["completed_at"],
        "error_message": job["error_message"]
    }


@app.get("/image/{job_id}")
def get_image_by_job_id(job_id: str):
    """
    Retrieve the generated image file by job ID.
    
    Args:
        job_id: The unique job identifier
        
    Returns:
        FileResponse: The generated PNG image file
    """
    job = db.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["status"] != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Image is not ready yet. Current status: {job['status']}"
        )
    
    # Reconstruct the image path
    image_name = job["image_name"]
    created_at = job["created_at"]
    date_part = created_at.split("T")[0].replace("-", "")  # Convert to YYYYMMDD format
    
    image_path = os.path.join("outputs", date_part, f"{image_name}.png")
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_path, media_type="image/png", filename=f"{image_name}.png")


@app.get("/image/by-name/{image_name}")
def get_image_by_name(image_name: str):
    """
    Retrieve the generated image file by image name.
    
    Args:
        image_name: The image name (without extension)
        
    Returns:
        FileResponse: The generated PNG image file
    """
    job = db.get_job_by_image_name(image_name)
    
    if not job:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if job["status"] != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Image is not ready yet. Current status: {job['status']}"
        )
    
    # Reconstruct the image path
    created_at = job["created_at"]
    date_part = created_at.split("T")[0].replace("-", "")  # Convert to YYYYMMDD format
    
    image_path = os.path.join("outputs", date_part, f"{image_name}.png")
    
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_path, media_type="image/png", filename=f"{image_name}.png")