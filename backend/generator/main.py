import torch
import os
from diffusers import ZImagePipeline

# Global variable to store the pipeline (lazy-loaded)
_pipeline = None


def _get_pipeline():
    """
    Lazy-load the pipeline on first use to avoid loading at import time.
    """
    global _pipeline
    if _pipeline is None:
        if not torch.cuda.is_available():
            raise RuntimeError("CUDA is not available. This script requires a GPU to run.")
        
        _pipeline = ZImagePipeline.from_pretrained(
            "Tongyi-MAI/Z-Image-Turbo",
            torch_dtype=torch.bfloat16,
            low_cpu_mem_usage=False,
        )
        _pipeline = _pipeline.to("cuda")
        _pipeline.enable_model_cpu_offload()
    
    return _pipeline


def generate_image(job_id: str, prompt: str, height: int, width: int, num_inference_steps: int, output_path: str, db_connector):
    """
    Generate an image and update the database with the result.
    
    Args:
        job_id: The unique job identifier
        prompt: The text prompt for image generation
        height: Image height in pixels
        width: Image width in pixels
        num_inference_steps: Number of denoising steps
        output_path: Full path where to save the image (without extension)
        db_connector: Database connector instance to update job status
    """
    try:
        print(f"Starting image generation for job {job_id}")
        print(f"Output path: {output_path}")
        
        # Ensure the output directory exists
        output_dir = os.path.dirname(output_path)
        if not os.path.exists(output_dir):
            print(f"Creating output directory: {output_dir}")
            os.makedirs(output_dir, exist_ok=True)
        
        # Get or initialize the pipeline
        print("Loading pipeline...")
        pipe = _get_pipeline()

        print("Generating image...")
        image = pipe(
            prompt=prompt,
            height=height,
            width=width,
            num_inference_steps=num_inference_steps,
            guidance_scale=0.0,
            generator=torch.Generator("cuda").manual_seed(42),
        ).images[0]

        output_file = f"{output_path}.png"
        print(f"Saving image to: {output_file}")
        image.save(output_file)
        
        # Update database status to completed
        print(f"Image generation completed for job {job_id}")
        db_connector.update_job_status(job_id, "completed")
        return True
    except Exception as e:
        # Update database status to failed with error message
        error_msg = str(e)
        print(f"Error generating image for job {job_id}: {error_msg}")
        import traceback
        traceback.print_exc()
        db_connector.update_job_status(job_id, "failed", error_msg)
        return False