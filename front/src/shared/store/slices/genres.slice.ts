import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Genre } from "../model";

interface GenresState {
  genres: Genre[];
  loading: boolean;
  error: string | null;
}

const initialState: GenresState = {
  genres: [],
  loading: false,
  error: null,
};

export const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchGenresStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGenresError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setGenres, fetchGenresStart, fetchGenresError } =
  genresSlice.actions;
export default genresSlice.reducer;
