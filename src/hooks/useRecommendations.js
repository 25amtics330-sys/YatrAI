import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendations, setPreferences } from '@/store/recommendSlice';
import { useCallback } from 'react';

export default function useRecommendations() {
  const dispatch = useDispatch();
  const { preferences, recommendations, loading, error, festivalMatches } = useSelector(
    (state) => state.recommendations
  );

  const updatePreferences = useCallback(
    (prefs) => dispatch(setPreferences(prefs)),
    [dispatch]
  );

  const submitPreferences = useCallback(
    (prefs) => dispatch(fetchRecommendations(prefs || preferences)),
    [dispatch, preferences]
  );

  return {
    preferences,
    recommendations,
    festivalMatches,
    loading,
    error,
    updatePreferences,
    submitPreferences,
  };
}
