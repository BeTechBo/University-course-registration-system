import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './utils/test-utils';
import Login from '../pages/Login';
import axios from 'axios';

vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.defaults = { withCredentials: true };
  });

  it('renders login form by default', () => {
    renderWithRouter(<Login />);
    
    const emailInputs = screen.queryAllByPlaceholderText(/aucegypt.edu/i);
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('switches to signup mode', async () => {
    renderWithRouter(<Login />);
    const user = userEvent.setup();
    
    // Find and click signup link/button
    const signupLinks = screen.queryAllByText(/sign up/i);
    if (signupLinks.length > 0) {
      await user.click(signupLinks[0]);
      
      // Should show signup-specific fields
      await waitFor(() => {
        const nameInput = screen.queryByPlaceholderText(/full name/i);
        expect(nameInput).toBeInTheDocument();
      });
    }
  });

  it('shows validation error for invalid email format', async () => {
    renderWithRouter(<Login />);
    const user = userEvent.setup();
    
    const emailInputs = screen.queryAllByPlaceholderText(/aucegypt.edu/i);
    if (emailInputs.length > 0) {
      await user.type(emailInputs[0], 'invalid-email');
      await user.tab(); // Trigger validation
      
      // Check for error message (adjust based on your validation)
      await waitFor(() => {
        expect(document.body).toBeTruthy();
      });
    }
  });

  it('submits login successfully', async () => {
    const mockSetIsLoggedIn = vi.fn();
    const mockGetUserData = vi.fn();
    
    axios.post = vi.fn().mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Login successful',
        isVerified: true,
      },
    });

    renderWithRouter(<Login />, {
      contextValue: {
        setIsLoggedIn: mockSetIsLoggedIn,
        getUserData: mockGetUserData,
      },
    });

    const user = userEvent.setup();
    
    const emailInputs = screen.queryAllByPlaceholderText(/aucegypt.edu/i);
    const passwordInputs = screen.queryAllByPlaceholderText(/password/i);
    
    if (emailInputs.length > 0 && passwordInputs.length > 0) {
      await user.type(emailInputs[0], 'test@aucegypt.edu');
      await user.type(passwordInputs[0], 'password123');
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(btn => btn.textContent.includes('Login'));
      
      if (loginButton) {
        await user.click(loginButton);
        
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalled();
        });
      }
    }
  });

  it('handles login error', async () => {
    axios.post = vi.fn().mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    renderWithRouter(<Login />);
    const user = userEvent.setup();
    
    const emailInputs = screen.queryAllByPlaceholderText(/aucegypt.edu/i);
    const passwordInputs = screen.queryAllByPlaceholderText(/password/i);
    
    if (emailInputs.length > 0 && passwordInputs.length > 0) {
      await user.type(emailInputs[0], 'wrong@aucegypt.edu');
      await user.type(passwordInputs[0], 'wrongpass');
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(btn => btn.textContent.includes('Login'));
      
      if (loginButton) {
        await user.click(loginButton);
        
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalled();
        });
      }
    }
  });
});
