export interface Tool {
  id: string;
  name: string;
  description: string;
  icon?: string;
  path?: string;
  features?: string[];
  requirements?: string[];
  category?: string;
  tags?: string[];
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  tools: Tool[];
} 