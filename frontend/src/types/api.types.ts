export interface GenerateImageRequest {
  prompt: string;
  height: number;
  width: number;
  num_inference_steps: number;
}

export interface GenerateImageResponse {
  job_id: string;
  image_name: string;
  status: string;
}

export interface JobStatusResponse {
  job_id: string;
  image_name: string;
  status: 'generating' | 'completed' | 'failed';
  prompt: string;
  height: number;
  width: number;
  num_inference_steps: number;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface HealthCheckResponse {
  status: string;
}
