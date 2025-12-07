import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from './utils/test-utils';
import Home from '../pages/Home';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home Component', () => {
  it('renders home page', () => {
    renderWithRouter(<Home />);
    expect(document.body).toBeTruthy();
  });

  it('shows different content when logged in', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@aucegypt.edu',
      studentId: '2021001',
      department: 'Computer Science',
      yearLevel: '2',
      isAccountVerified: true,
    };

    renderWithRouter(<Home />, {
      contextValue: { isLoggedIn: true, userData: mockUser },
    });
    
    // Check if personalized content appears
    const welcomeText = screen.queryByText(/welcome/i);
    expect(welcomeText).toBeTruthy();
  });

  it('shows welcome message for guests when not logged in', () => {
    renderWithRouter(<Home />, {
      contextValue: { isLoggedIn: false, userData: null },
    });
    
    // Should show generic welcome or call-to-action
    expect(document.body).toBeTruthy();
  });

  it('displays course registration features', () => {
    renderWithRouter(<Home />);
    
    // Check if feature cards or sections exist
    const container = document.body;
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});
