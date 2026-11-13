export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text?: string;
  imageUrl?: string; // Base64 or URL
  timestamp: number;
  isError?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'folder' | 'link' | 'file';
  path?: string; // For display purposes in "System Folders"
  url?: string;
  icon?: string;
}

export interface PermissionSettings {
  allowSystemAnalysis: boolean;
  allowOnlineTools: boolean;
  allowAutoSave: boolean;
}