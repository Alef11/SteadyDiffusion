# DaddyDiffusion Frontend

Modern web interface for the DaddyDiffusion AI image generator, built with Vite, React, TypeScript, and shadcn/ui.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS and shadcn/ui components
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Real-time Generation**: Live status updates while images are being generated
- **Health Monitoring**: Footer displays API connection status
- **Custom Theme**: Primary color #72195a throughout the design
- **Image Download**: Download generated images directly
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup

### Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
\\\ash
npm install
\\\

2. Start the development server:
\\\ash
npm run dev
\\\

The frontend will be available at http://localhost:5173

### Build for Production

\\\ash
npm run build
\\\

The built files will be in the \dist\ directory.

## Project Structure

\\\
frontend/
 src/
    components/
       ui/              # shadcn/ui components
       ThemeToggle.tsx  # Dark/light mode toggle
       ThemeProvider.tsx # Theme context provider
       HealthStatus.tsx  # API health footer
       ImagePromptForm.tsx # Form for image generation
       ImageDisplay.tsx   # Display generated images
    hooks/
       useHealthCheck.ts  # Health monitoring hook
       useJobPolling.ts   # Job status polling hook
    lib/
       api.ts            # API service layer
       utils.ts          # Utility functions
    types/
       api.types.ts      # TypeScript type definitions
    App.tsx               # Main application component
    main.tsx              # Entry point
    index.css             # Global styles with theme
 tailwind.config.js        # Tailwind configuration
 tsconfig.json             # TypeScript configuration
 vite.config.ts            # Vite configuration
 package.json              # Dependencies
\\\

## Usage

1. **Enter a Prompt**: Type your image description in the prompt field
2. **Set Parameters**: 
   - Width (512-2048px)
   - Height (512-2048px)
   - Inference Steps (1-50)
3. **Generate**: Click the Generate Image button
4. **Wait**: A loading spinner will appear while the image is being generated
5. **View & Download**: Once complete, the image appears with a download button

## API Integration

The frontend connects to the backend API at http://localhost:8000 through a proxy configured in vite.config.ts.

### API Endpoints Used

- \POST /generate-image\ - Start image generation
- \GET /status/{job_id}\ - Check generation status
- \GET /image/{job_id}\ - Retrieve generated image
- \GET /health\ - Health check

## Theme Customization

The primary color (#72195a) is configured in:
- \src/index.css\ - CSS variables for light/dark mode
- \	ailwind.config.js\ - Tailwind theme configuration

## Troubleshooting

### API Connection Issues

- Ensure the backend is running on http://localhost:8000
- Check the health status in the footer
- Open browser console for detailed error messages

### Build Errors

- Clear node_modules and reinstall: \
m -rf node_modules && npm install\
- Clear Vite cache: \
m -rf node_modules/.vite\

## Technologies

- **Vite** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Axios** - HTTP client
