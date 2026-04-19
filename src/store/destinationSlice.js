import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as destApi from '@/api/destination.api';
import { MOCK_DESTINATIONS } from '@/utils/constants';

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await destApi.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(MOCK_DESTINATIONS);
    }
  }
);

export const searchDestinations = createAsyncThunk(
  'destinations/search',
  async (query, { rejectWithValue }) => {
    try {
      const data = await destApi.search(query);
      return data;
    } catch (err) {
      const filtered = MOCK_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.state.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    }
  }
);

export const fetchTrending = createAsyncThunk(
  'destinations/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const data = await destApi.getTrending();
      return data;
    } catch (err) {
      return MOCK_DESTINATIONS.slice(0, 6);
    }
  }
);

export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await destApi.getById(id);
      return data;
    } catch (err) {
      const found = MOCK_DESTINATIONS.find((d) => d.id === id);
      if (found) return found;
      return rejectWithValue('Destination not found');
    }
  }
);

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    list: MOCK_DESTINATIONS,
    trending: MOCK_DESTINATIONS.slice(0, 6),
    selected: null,
    filters: {
      category: [],
      budgetRange: null,
      season: null,
      crowdLevel: null,
    },
    searchQuery: '',
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { category: [], budgetRange: null, season: null, crowdLevel: null };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    updateCrowdLevel: (state, action) => {
      const { id, crowdLevel } = action.payload;
      const dest = state.list.find((d) => d.id === id);
      if (dest) dest.crowdLevel = crowdLevel;
      if (state.selected && state.selected.id === id) {
        state.selected.crowdLevel = crowdLevel;
      }
    },
    loadMore: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.list = action.payload || MOCK_DESTINATIONS;
      })
      .addCase(searchDestinations.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSearchQuery,
  setSelected,
  updateCrowdLevel,
  loadMore,
} = destinationSlice.actions;
export default destinationSlice.reducer;
