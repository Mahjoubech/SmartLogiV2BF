import { describe, it, expect } from 'vitest';
import authReducer, { logout } from './features/auth/authSlice';

describe('authSlice', () => {
  it('should handle logout', () => {
    const initialState = {
      user: { id: '1', nom: 'Test', email: 'test@example.com', role: { id: 1, name: 'CLIENT' } },
      token: 'some-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const nextState = authReducer(initialState, logout());

    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.error).toBeNull();
  });
});
