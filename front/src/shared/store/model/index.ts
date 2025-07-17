// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// types/book.ts
export interface Book {
  id: number;
  title: string;
  image_path: string;
  authors: string; // или можно сделать массивом Author, если API возвращает строку
  genres: string; // аналогично
  description: string;
}

// types/author.ts
export interface Author {
  id: number;
  first_name: string;
  last_name: string | null;
  middle_name: string | null;
}

// types/genre.ts
export interface Genre {
  id: number;
  name: string;
}

// types/filter.ts
export interface FilterState {
  title: string;
  authors: number[];
  genres: number[];
}
