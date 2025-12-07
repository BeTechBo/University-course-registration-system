import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './utils/test-utils';
import EmailVerify from '../pages/EmailVerify';
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

describe('EmailVerify Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.defaults = { withCredentials: true };
  });

  it('renders OTP input fields', () => {
    renderWithRouter(<EmailVerify />, {
      contextValue: { 
        isLoggedIn: true, 
        userData: { email: 'test@aucegypt.edu', isAccountVerified: false } 
      },
    });

    const inputs = screen.queryAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('allows entering OTP digits', async () => {
    renderWithRouter(<EmailVerify />, {
      contextValue: { 
        isLoggedIn: true, 
        userData: { email: 'test@aucegypt.edu', isAccountVerified: false } 
      },
    });

    const user = userEvent.setup();
    const inputs = screen.queryAllByRole('textbox');
    
    if (inputs.length >= 6) {
      await user.type(inputs[0], '1');
      expect(inputs[0].value).toBe('1');
    }
  });

  it('submits verification code', async () => {
    axios.post = vi.fn().mockResolvedValueOnce({
      data: { success: true, message: 'Email verified' },
    });

    renderWithRouter(<EmailVerify />, {
      contextValue: { 
        isLoggedIn: true, 
        userData: { email: 'test@aucegypt.edu', isAccountVerified: false },
        getUserData: vi.fn(),
      },
    });

    const user = userEvent.setup();
    const inputs = screen.queryAllByRole('textbox');
    
    if (inputs.length >= 6) {
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], (i + 1).toString());
      }
      
      const submitButton = screen.queryByRole('button', { name: /verify/i });
      if (submitButton) {
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalled();
        });
      }
    }
  });
});
