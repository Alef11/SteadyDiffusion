# DaddyDiffusion

A fun quick project for using Z-Image-Turbo and making it more accessible! DaddyDiffusion provides a modern web interface for the powerful Z-Image-Turbo AI model, allowing you to generate stunning images with an easy-to-use interface.

## About

DaddyDiffusion wraps the Tongyi-MAI Z-Image-Turbo model in a clean, responsive web application. Generate AI images in seconds with real-time status updates, dark/light mode, and a beautiful UI powered by React and shadcn/ui.

## Features

-  **Modern Web Interface** - Clean, responsive design that works on any device
-  **Fast Generation** - Powered by Z-Image-Turbo for quick results
-  **Dark/Light Mode** - Toggle themes with persistent preference
-  **Real-time Updates** - Live status monitoring during generation
-  **Easy Downloads** - One-click image downloads
-  **Parameter Control** - Adjust width, height, and inference steps
-  **Health Monitoring** - Always know if your API is responsive

## Prerequisites

- **CUDA-compatible GPU** (NVIDIA graphics card with CUDA support)
- **Python 3.9+** installed
- **Node.js 18+** installed
- **Git** (optional, for cloning)

## Installation Guide

### Step 1: Clone or Download the Project

```bash
git clone <your-repo-url>
cd DaddyDiffusion
```

### Step 2: Set Up Python Environment

**Important:** Depending on your GPU and CUDA version, you may need to install PyTorch with specific CUDA compatibility.

#### Option A: Quick Install (if compatible)

```bash
pip install -r requirements.txt
```

#### Option B: Custom PyTorch Installation (Recommended for GPU compatibility)

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Linux/Mac:
   source venv/bin/activate
   ```

2. **Check your CUDA version:**
   ```bash
   nvidia-smi
   ```
   Look for "CUDA Version" in the output (e.g., CUDA 11.8, 12.1, etc.)

3. **Install PyTorch, torchvision, and torchaudio:**
   
   Visit [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/) and select:
   - Your OS (Windows/Linux/Mac)
   - Package Manager: pip
   - Language: Python
   - Compute Platform: Your CUDA version
   
   Copy the generated command and run it. For example:
   
   ```bash
   # CUDA 11.8 example:
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   
   # CUDA 12.1 example:
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
   ```

4. **Install remaining dependencies:**
   
   **Important:** Z-Image-Turbo requires diffusers to be installed from source (not PyPI).
   
   ```bash
   pip install git+https://github.com/huggingface/diffusers transformers accelerate fastapi uvicorn pydantic pillow
   ```
   
   Or simply use the requirements file:
   ```bash
   pip install -r requirements.txt
   ```

### Step 3: Set Up Frontend

```bash
cd frontend
npm install
cd ..
```

### Step 4: Initialize Database

The database will be created automatically on first run, or you can initialize it manually:

```bash
cd backend/database
python dbconnector.py
cd ../..
```

### Step 5: Run the Application

**Easy Way - Use the batch file (Windows):**
```bash
start.bat
```

**Manual Way:**

Terminal 1 - Backend:
```bash
python backend/main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Then open your browser to [http://localhost:5173](http://localhost:5173)

## Usage

1. **Enter a Prompt** - Describe the image you want to generate
2. **Set Parameters:**
   - Width: 512-2048px
   - Height: 512-2048px
   - Inference Steps: 1-50 (9 is default and works great)
3. **Click Generate** - Watch the loading animation
4. **Download** - Save your masterpiece!

## Troubleshooting

### AutoTokenizer Import Error

If you see `RuntimeError: Failed to import diffusers.pipelines.z_image.pipeline_z_image` with `Could not import module 'AutoTokenizer'`:

**Solution:**
1. Make sure `transformers` is installed: `pip install transformers`
2. Ensure you installed diffusers from source (not PyPI): `pip install git+https://github.com/huggingface/diffusers`
3. If issues persist, reinstall all dependencies: `pip install -r requirements.txt --force-reinstall`

### CUDA/GPU Issues

If you get errors about CUDA not being available:
- Make sure you have an NVIDIA GPU with CUDA support
- Install the correct PyTorch version for your CUDA version (see Step 2B above)
- Update your NVIDIA drivers: [https://www.nvidia.com/Download/index.aspx](https://www.nvidia.com/Download/index.aspx)

### Out of Memory Errors

If your GPU runs out of memory:
- Reduce the image dimensions (try 512x512 or 768x768)
- Close other GPU-intensive applications
- Consider using a smaller batch size or fewer inference steps

### Frontend Won'\''t Start

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Backend API Errors

Make sure all Python dependencies are installed:
```bash
pip install -r requirements.txt
```

## API Endpoints

- `POST /generate-image` - Start image generation
- `GET /status/{job_id}` - Check generation status
- `GET /image/{job_id}` - Retrieve generated image
- `GET /health` - API health check

## Technology Stack

**Backend:**
- FastAPI
- Z-Image-Turbo (Tongyi-MAI)
- PyTorch
- SQLite

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Project Structure

```
DaddyDiffusion/
 backend/
    main.py              # FastAPI server
    api/                 # API endpoints
    database/            # SQLite database
    generator/           # Image generation logic
    utils/               # Helper functions
 frontend/
    src/
       components/      # React components
       hooks/           # Custom hooks
       lib/             # API client
       types/           # TypeScript types
    package.json
 outputs/                 # Generated images
 requirements.txt         # Python dependencies
 start.bat               # Quick start script
```

## License

This is a fun quick project - feel free to use and modify as you like!

## Credits

Built with  using:
- [Z-Image-Turbo](https://github.com/Tongyi-MAI/Z-Image-Turbo) by Tongyi-MAI
- [shadcn/ui](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
