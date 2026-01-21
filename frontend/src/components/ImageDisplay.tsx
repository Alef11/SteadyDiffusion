import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Loader2, AlertCircle } from 'lucide-react'
import type { JobStatusResponse } from '@/types/api.types'
import { getImageUrl } from '@/lib/api'

interface ImageDisplayProps {
  jobStatus: JobStatusResponse | null
  isGenerating: boolean
  error: string | null
}

export function ImageDisplay({ jobStatus, isGenerating, error }: ImageDisplayProps) {
  const handleDownload = () => {
    if (jobStatus?.job_id) {
      const link = document.createElement('a')
      link.href = getImageUrl(jobStatus.job_id)
      link.download = `${jobStatus.image_name}.png`
      link.click()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
        <CardDescription>
          Your AI-generated image will appear here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
          {!jobStatus && !isGenerating && (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Enter a prompt and click Generate Image to create your artwork
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-medium">Generating your image...</p>
              <p className="text-xs text-muted-foreground">This may take a minute</p>
            </div>
          )}

          {error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Generation Failed</p>
                <p className="text-xs text-muted-foreground mt-2">{error}</p>
              </div>
            </div>
          )}

          {jobStatus?.status === 'completed' && (
            <div className="relative h-full w-full animate-in fade-in duration-500">
              <img
                src={getImageUrl(jobStatus.job_id)}
                alt={jobStatus.prompt}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          {jobStatus?.status === 'failed' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">Generation Failed</p>
                {jobStatus.error_message && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {jobStatus.error_message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {jobStatus?.status === 'completed' && (
          <div className="mt-4 space-y-4">
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-2">Generation Parameters</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Size:</span> {jobStatus.width}x{jobStatus.height}
                </div>
                <div>
                  <span className="font-medium">Steps:</span> {jobStatus.num_inference_steps}
                </div>
              </div>
              <div className="mt-2 text-xs">
                <span className="font-medium">Prompt:</span>{' '}
                <span className="text-muted-foreground">{jobStatus.prompt}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}