from fastapi import FastAPI
from generator import main as image_generator
import threading
from utils import output_folder_handler

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate-image")
def generate_image_endpoint(prompt: str, height: int = 1024, width: int = 1024, num_inference_steps: int = 9):
    # Run image generation in different thread and return jobID

    genertion_thread = threading.Thread(target=image_generator.generate_image, args=(prompt, height, width, num_inference_steps, output_folder_handler.get_save_location()))
    genertion_thread.start()