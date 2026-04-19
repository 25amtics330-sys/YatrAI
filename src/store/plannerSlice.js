import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as plannerApi from '@/api/planner.api';
import { MOCK_ITINERARY } from '@/utils/constants';

export const createTrip = createAsyncThunk(
  'planner/createTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const data = await plannerApi.createTrip(tripData);
      return data;
    } catch (err) {
      return { ...MOCK_ITINERARY, ...tripData, id: 'trip_' + Date.now() };
    }
  }
);

export const updateTripDay = createAsyncThunk(
  'planner/updateDay',
  async ({ tripId, dayIndex, dayData }, { rejectWithValue }) => {
    try {
      const data = await plannerApi.updateDay(tripId, dayIndex, dayData);
      return data;
    } catch (err) {
      return { dayIndex, dayData };
    }
  }
);

export const replanTrip = createAsyncThunk(
  'planner/replan',
  async ({ tripId, alertData }, { rejectWithValue }) => {
    try {
      const data = await plannerApi.replanTrip(tripId, alertData);
      return data;
    } catch (err) {
      return { replanned: true, message: 'AI has adjusted your itinerary for the weather change.' };
    }
  }
);

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    currentTrip: MOCK_ITINERARY,
    days: MOCK_ITINERARY.days,
    budget: MOCK_ITINERARY.budget,
    alerts: [],
    replanStatus: 'idle',
    exportStatus: 'idle',
    showReplanModal: false,
  },
  reducers: {
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
      state.days = action.payload.days;
      state.budget = action.payload.budget;
    },
    reorderDays: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const reordered = Array.from(state.days);
      const [removed] = reordered.splice(sourceIndex, 1);
      reordered.splice(destinationIndex, 0, removed);
      state.days = reordered;
    },
    addAlert: (state, action) => {
      state.alerts.unshift({
        id: 'alert_' + Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    dismissAlert: (state, action) => {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    toggleReplanModal: (state) => {
      state.showReplanModal = !state.showReplanModal;
    },
    updateBudget: (state, action) => {
      state.budget = { ...state.budget, ...action.payload };
    },
    setExportStatus: (state, action) => {
      state.exportStatus = action.payload;
    },
    updateSlot: (state, action) => {
      const { dayIndex, slotIndex, slotData } = action.payload;
      if (state.days[dayIndex] && state.days[dayIndex].slots[slotIndex]) {
        state.days[dayIndex].slots[slotIndex] = {
          ...state.days[dayIndex].slots[slotIndex],
          ...slotData,
        };
      }
    },
    updateDayWeather: (state, action) => {
      const { dayIndex, weather } = action.payload;
      if (state.days[dayIndex]) {
        state.days[dayIndex].weather = weather;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.fulfilled, (state, action) => {
        state.currentTrip = action.payload;
        state.days = action.payload.days || [];
        state.budget = action.payload.budget || {};
      })
      .addCase(updateTripDay.fulfilled, (state, action) => {
        const { dayIndex, dayData } = action.payload;
        if (state.days[dayIndex]) {
          state.days[dayIndex] = { ...state.days[dayIndex], ...dayData };
        }
      })
      .addCase(replanTrip.pending, (state) => {
        state.replanStatus = 'loading';
      })
      .addCase(replanTrip.fulfilled, (state) => {
        state.replanStatus = 'success';
        state.showReplanModal = false;
      })
      .addCase(replanTrip.rejected, (state) => {
        state.replanStatus = 'error';
      });
  },
});

export const {
  setCurrentTrip,
  reorderDays,
  addAlert,
  dismissAlert,
  toggleReplanModal,
  updateBudget,
  setExportStatus,
  updateSlot,
  updateDayWeather,
} = plannerSlice.actions;
export default plannerSlice.reducer;
