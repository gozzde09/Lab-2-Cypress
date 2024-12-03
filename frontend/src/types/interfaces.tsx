export interface Language {
  id: number;
  name: string;
}

export interface Book {
  id?: number;
  title: string;
  author: string;
  language_id: number;
  language_name?: string;
}
