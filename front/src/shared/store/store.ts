import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/books.slice";
import authorsReducer from "./slices/authors.slice";
import genresReducer from "./slices/genres.slice";
import filterReducer from "./slices/filter.slice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    authors: authorsReducer,
    genres: genresReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
