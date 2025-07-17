export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface Book {
  id: number;
  title: string;
  image_path: string;
  authors: string;
  genres: string;
  description: string;
}

export interface Author {
  id: number;
  first_name: string;
  last_name: string | null;
  middle_name: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface FilterState {
  title: string;
  authors: number[];
  genres: number[];
}
