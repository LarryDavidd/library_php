import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Author } from "../model";

interface AuthorsState {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorsState = {
  authors: [],
  loading: false,
  error: null,
};

export const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    setAuthors: (state, action: PayloadAction<Author[]>) => {
      state.authors = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAuthorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAuthorsError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setAuthors, fetchAuthorsStart, fetchAuthorsError } =
  authorsSlice.actions;
export default authorsSlice.reducer;
