import { useState } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import { HealthStatus } from './components/HealthStatus'
import { ImagePromptForm } from './components/ImagePromptForm'
import { ImageDisplay } from './components/ImageDisplay'
import { useJobPolling } from './hooks/useJobPolling'
import { generateImage } from './lib/api'
import type { GenerateImageRequest } from './types/api.types'
import { Sparkles } from 'lucide-react'

function App() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { jobStatus, isPolling, error } = useJobPolling(currentJobId)

  const handleGenerateImage = async (request: GenerateImageRequest) => {
    try {
      setIsSubmitting(true)
      const response = await generateImage(request)
      setCurrentJobId(response.job_id)
    } catch (err) {
      console.error('Failed to start image generation:', err)
      alert('Failed to start image generation. Please check if the API is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isGenerating = isSubmitting || isPolling

  return (
    <ThemeProvider defaultTheme="system" storageKey="DaddyDiffusion-theme">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">DaddyDiffusion</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="container flex-1 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <ImagePromptForm 
                onSubmit={handleGenerateImage} 
                isGenerating={isGenerating}
              />
            </div>

            <div className="space-y-8">
              <ImageDisplay 
                jobStatus={jobStatus} 
                isGenerating={isGenerating}
                error={error}
              />
            </div>
          </div>
        </main>

        <footer className="mt-auto">
          <HealthStatus />
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
