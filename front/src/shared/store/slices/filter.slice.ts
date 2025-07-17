import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  title: string;
  authors: number[];
  genres: number[];
}

const initialState: FilterState = {
  title: "",
  authors: [],
  genres: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    toggleAuthor: (state, action: PayloadAction<number>) => {
      const index = state.authors.indexOf(action.payload);
      if (index === -1) {
        state.authors.push(action.payload);
      } else {
        state.authors.splice(index, 1);
      }
    },
    toggleGenre: (state, action: PayloadAction<number>) => {
      const index = state.genres.indexOf(action.payload);
      if (index === -1) {
        state.genres.push(action.payload);
      } else {
        state.genres.splice(index, 1);
      }
    },
    resetFilters: () => initialState,
  },
});

export const { setTitle, toggleAuthor, toggleGenre, resetFilters } =
  filterSlice.actions;
export default filterSlice.reducer;
