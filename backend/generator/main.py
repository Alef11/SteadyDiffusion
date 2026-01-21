import sys
import torch
from diffusers import ZImagePipeline

pipe = ZImagePipeline.from_pretrained(
    "Tongyi-MAI/Z-Image-Turbo",
    torch_dtype=torch.bfloat16,
    low_cpu_mem_usage=False,
)

if not torch.cuda.is_available():
    sys.exit("CUDA is not available. This script requires a GPU to run.")


def generate_image(prompt: str, height: int, width: int, num_inference_steps: int, output_path: str):
    try:
        pipe = pipe.to("cuda")

        pipe.enable_model_cpu_offload()

        image = pipe(
            prompt=prompt,
            height=height,
            width=width,
            num_inference_steps=num_inference_steps,
            guidance_scale=0.0,
            generator=torch.Generator("cuda").manual_seed(42),
        ).images[0]

        image.save(f"{output_path}.png")
        return True
    except Exception as e:
        return False