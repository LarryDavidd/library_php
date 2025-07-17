import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Book } from "../model";

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBooksError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setBooks, fetchBooksStart, fetchBooksError } =
  booksSlice.actions;
export default booksSlice.reducer;
