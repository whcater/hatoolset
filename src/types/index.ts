export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  tools: Tool[];
} 