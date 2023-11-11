import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroesAdapter = createEntityAdapter();

// const initialState = {
//   heroes: [],
//   //idle loading error
//   heroesLoadingStatus: "idle",
//   heroesCreatingStatus: "idle",
//   heroesDeletingStatus: "idle",
// };

const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: "idle",
  heroesCreatingStatus: "idle",
  heroesDeletingStatus: "idle",
});

export const fetchHeroes = createAsyncThunk("heroes/fetchHeroes", () => {
  const { request } = useHttp();
  return request("http://localhost:3001/heroes");
});

export const deleteHero = createAsyncThunk("heroes/deleteHero", (id) => {
  const { request } = useHttp();
  return request(`http://localhost:3001/heroes/${id}`, "DELETE");
});

export const createHero = createAsyncThunk("heroes/createHero", (hero) => {
  const { request } = useHttp();
  return request("http://localhost:3001/heroes", "POST", JSON.stringify(hero));
});

const heroesSlice = createSlice({
  name: "heroes",
  initialState,
  //   reducers: {
  // heroesFetching: (state) => {
  //   state.heroesLoadingStatus = "loading";
  // },
  // heroesFetched: (state, action) => {
  //   state.heroesLoadingStatus = "idle";
  //   state.heroes = action.payload;
  // },
  // heroesFetchingError: (state) => {
  //   state.heroesLoadingStatus = "error";
  // },
  // heroesCreated: (state, action) => {
  //   state.heroesCreatingStatus = "idle";
  //   state.heroes.push(action.payload);
  // },
  // heroesCreating: (state) => {
  //   state.heroesCreatingStatus = "loading";
  // },
  // heroesCreatingError: (state) => {
  //   state.heroesCreatingStatus = "error";
  // },
  // heroesDeleting: (state) => {
  //   state.heroesDeletingStatus = "loading";
  // },
  // heroesDeleted: (state, action) => {
  //   state.heroes = state.heroes.filter((hero) => hero.id !== action.payload);
  //   state.heroesDeletingStatus = "idle";
  // },
  // heroesDeletingError: (state) => {
  //   state.heroesDeletingStatus = "error";
  // },
  //   },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = "loading";
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.heroesLoadingStatus = "idle";
        heroesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = "error";
      })
      .addCase(deleteHero.pending, (state) => {
        state.heroesDeletingStatus = "loading";
      })
      .addCase(deleteHero.fulfilled, (state, action) => {
        heroesAdapter.removeOne(state, action.meta.arg);
        state.heroesDeletingStatus = "idle";
      })
      .addCase(deleteHero.rejected, (state) => {
        state.heroesDeletingStatus = "error";
      })
      .addCase(createHero.pending, (state) => {
        state.heroesCreatingStatus = "loading";
      })
      .addCase(createHero.fulfilled, (state, action) => {
        state.heroesCreatingStatus = "idle";
        heroesAdapter.addOne(state, action.payload);
      })
      .addCase(createHero.rejected, (state) => {
        state.heroesCreatingStatus = "error";
      });
  },
});

const {
  // actions,
  reducer,
} = heroesSlice;

export default reducer;

export const { selectAll } = heroesAdapter.getSelectors(
  (state) => state.heroes
);

export const filteredHeroesSelector = createSelector(
  selectAll,
  (state) => state.filters.currentFilter,
  (heroes, filter) => {
    if (filter === "all") {
      return heroes;
    } else {
      return heroes.filter((hero) => hero.element === filter);
    }
  }
);

// export const {
//   heroesCreated,
//   heroesCreatingError,
//   heroesCreating,
//   heroesDeleted,
//   heroesDeleting,
//   //   heroesFetched,
//   //   heroesFetching,
//   //   heroesFetchingError,
//   heroesDeletingError,
// } = actions;
