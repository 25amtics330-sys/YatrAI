import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, updateUserProfile, googleLoginUser } from '@/store/authSlice';
import { useCallback } from 'react';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    (email, password) => dispatch(loginUser({ email, password })),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const googleLogin = useCallback(
    (credential) => dispatch(googleLoginUser(credential)),
    [dispatch]
  );

  const updateProfile = useCallback(
    (data) => dispatch(updateUserProfile(data)),
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoggedIn: isAuthenticated && !!token,
    loading,
    error,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
  };
}
