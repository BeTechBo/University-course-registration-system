import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppContent } from '../../context/Appcontext';
import { vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Default mock context values
const defaultContextValue = {
  backendUrl: 'http://localhost:4000',
  isLoggedIn: true, // ✅ Changed to true for authenticated tests
  userData: { 
    id: 1, 
    name: 'Test User',
    email: 'test@aucegypt.edu' 
  }, // ✅ Added default user data
  setIsLoggedIn: vi.fn(),
  setUserData: vi.fn(),
  getUserData: vi.fn(),
};

// Custom render function with error boundary
export function renderWithRouter(ui, { route = '/', contextValue = {}, ...options } = {}) {
  window.history.pushState({}, 'Test page', route);

  const mergedContextValue = { ...defaultContextValue, ...contextValue };

  return render(
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent.Provider value={mergedContextValue}>
          {ui}
        </AppContent.Provider>
      </BrowserRouter>
    </ErrorBoundary>,
    options
  );
}

// Mock navigation
export const mockNavigate = vi.fn();

export * from '@testing-library/react';
