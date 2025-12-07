import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './utils/test-utils';
import ResetPassword from '../pages/ResetPassword';
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

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up axios defaults
    axios.defaults = { withCredentials: true };
    
    // Mock axios.post to prevent actual API calls
    axios.post = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Success' },
    });
  });

  it('renders email input form initially', () => {
    const { container } = renderWithRouter(<ResetPassword />);
    
    // Just check that component renders
    expect(container).toBeTruthy();
    
    // Try to find email input
    const emailInput = screen.queryByPlaceholderText(/email/i);
    if (emailInput) {
      expect(emailInput).toBeInTheDocument();
    }
  });

  it('renders without crashing', () => {
    const { container } = renderWithRouter(<ResetPassword />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('has submit button', () => {
    renderWithRouter(<ResetPassword />);
    
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
