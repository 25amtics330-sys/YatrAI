import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as recApi from '@/api/recommendation.api';
import { INDIAN_STATES, MOCK_DESTINATIONS, FESTIVALS_2025 } from '@/utils/constants';

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async (preferences, { rejectWithValue }) => {
    try {
      const data = await recApi.getByPreference(preferences);
      return data;
    } catch (err) {
      // Mock AI recommendation logic
      const { interests = [], budget, groupType, duration } = preferences;
      const scored = INDIAN_STATES.map((state) => {
        let score = 0;
        interests.forEach((interest) => {
          if (state.tags.includes(interest)) score += 25;
        });
        if (budget && state.avgBudgetPerDay <= budget) score += 15;
        if (state.crowdLevel === 'Low') score += 10;
        if (state.crowdLevel === 'Medium') score += 5;
        const matchingFestivals = FESTIVALS_2025.filter((f) => f.state === state.name);
        if (matchingFestivals.length > 0) score += 10;
        score = Math.min(98, Math.max(45, score + Math.floor(Math.random() * 10)));
        return {
          ...state,
          matchPercent: score,
          festivals: matchingFestivals,
          destinations: MOCK_DESTINATIONS.filter((d) => d.state === state.name),
          whyRecommended: `Based on your interest in ${interests.join(', ')}, ${state.name} is a perfect match with ${state.highlights.slice(0, 2).join(' and ')}.`,
        };
      });
      scored.sort((a, b) => b.matchPercent - a.matchPercent);
      return scored.slice(0, 5);
    }
  }
);

export const fetchFestivalCalendar = createAsyncThunk(
  'recommendations/festivals',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const data = await recApi.getFestivalCalendar(month, year);
      return data;
    } catch (err) {
      return FESTIVALS_2025;
    }
  }
);

const recommendSlice = createSlice({
  name: 'recommendations',
  initialState: {
    preferences: {
      interests: [],
      budget: 5000,
      groupType: 'couple',
      duration: 5,
      startDate: null,
    },
    recommendations: [],
    festivalMatches: FESTIVALS_2025,
    selectedState: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearPreferences: (state) => {
      state.preferences = { interests: [], budget: 5000, groupType: 'couple', duration: 5, startDate: null };
      state.recommendations = [];
    },
    setSelectedState: (state, action) => {
      state.selectedState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFestivalCalendar.fulfilled, (state, action) => {
        state.festivalMatches = action.payload;
      });
  },
});

export const { setPreferences, clearPreferences, setSelectedState } = recommendSlice.actions;
export default recommendSlice.reducer;
