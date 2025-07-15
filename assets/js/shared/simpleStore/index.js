function createStore(initialState = {}) {
  let state = initialState;

  const listeners = new Set();

  const getState = () => state;

  const setState = (updater) => {
    const newState =
      typeof updater === "function" ? updater(state) : { ...state, ...updater };

    state = newState;
    notifyListeners();
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(state));
  };

  return { getState, setState, subscribe };
}

const filterStore = createStore({ title: "", authors: [], genres: [] });
const booksStore = createStore({ books: [] });
const authorsStore = createStore({ authors: [] });
const genresStore = createStore({ genres: [] });

export { filterStore, booksStore, authorsStore, genresStore };
