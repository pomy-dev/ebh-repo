export interface MaintenanceRequest {
  id?: string;
  user_id: string;
  case_title: string;
  description: string;
  images: string[];
  created_at: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface FileUploadResult {
  url: string;
  path: string;
}