import { type AppDispatch } from "./store";
import {
  setBooks,
  fetchBooksStart,
  fetchBooksError,
} from "./slices/books.slice";
import {
  setAuthors,
  fetchAuthorsStart,
  fetchAuthorsError,
} from "./slices/authors.slice";
import {
  setGenres,
  fetchGenresStart,
  fetchGenresError,
} from "./slices/genres.slice";
import { type RootState } from "./store";
import {
  type Book,
  type Author,
  type Genre,
  type FilterState,
  type ApiResponse,
} from "./model";

export const fetchBooks =
  (filterState: FilterState) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(fetchBooksStart());
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/books/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: filterState.title,
            authors: filterState.authors,
            genres: filterState.genres,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Book[]> = await response.json();

      if (!data.data) {
        throw new Error("Invalid response format: data is missing");
      }

      dispatch(setBooks(data.data));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      dispatch(fetchBooksError(message));
    }
  };

export const fetchAuthors =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(fetchAuthorsStart());
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/authors"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Author[]> = await response.json();

      if (!data.data) {
        throw new Error("Invalid response format: data is missing");
      }

      dispatch(setAuthors(data.data));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      dispatch(fetchAuthorsError(message));
    }
  };

export const fetchGenres =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(fetchGenresStart());
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/genres"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Genre[]> = await response.json();

      if (!data.data) {
        throw new Error("Invalid response format: data is missing");
      }

      dispatch(setGenres(data.data));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      dispatch(fetchGenresError(message));
    }
  };

export const fetchInitialData =
  () =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    try {
      await Promise.all([
        dispatch(fetchBooks(getState().filter)),
        dispatch(fetchAuthors()),
        dispatch(fetchGenres()),
      ]);
    } catch (error) {
      console.error("Error in fetchInitialData:", error);
    }
  };
