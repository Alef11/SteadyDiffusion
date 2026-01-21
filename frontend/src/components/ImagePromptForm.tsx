import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { GenerateImageRequest } from '@/types/api.types'

interface ImagePromptFormProps {
  onSubmit: (request: GenerateImageRequest) => void
  isGenerating: boolean
}

export function ImagePromptForm({ onSubmit, isGenerating }: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState('')
  const [height, setHeight] = useState(1024)
  const [width, setWidth] = useState(1024)
  const [numInferenceSteps, setNumInferenceSteps] = useState(9)
  const [errors, setErrors] = useState<Record<string, string>>({}) 

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!prompt || prompt.length < 3) {
      newErrors.prompt = 'Prompt must be at least 3 characters'
    }

    if (height < 512 || height > 2048) {
      newErrors.height = 'Height must be between 512 and 2048'
    }

    if (width < 512 || width > 2048) {
      newErrors.width = 'Width must be between 512 and 2048'
    }

    if (numInferenceSteps < 1 || numInferenceSteps > 50) {
      newErrors.numInferenceSteps = 'Inference steps must be between 1 and 50'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      prompt,
      height,
      width,
      num_inference_steps: numInferenceSteps,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Image</CardTitle>
        <CardDescription>
          Enter your prompt and parameters to generate an AI image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="A beautiful sunset over mountains..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min={512}
                max={2048}
                step={64}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                disabled={isGenerating}
              />
              {errors.width && (
                <p className="text-sm text-destructive">{errors.width}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min={512}
                max={2048}
                step={64}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                disabled={isGenerating}
              />
              {errors.height && (
                <p className="text-sm text-destructive">{errors.height}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Inference Steps</Label>
              <Input
                id="steps"
                type="number"
                min={1}
                max={50}
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                disabled={isGenerating}
              />
              {errors.numInferenceSteps && (
                <p className="text-sm text-destructive">{errors.numInferenceSteps}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}