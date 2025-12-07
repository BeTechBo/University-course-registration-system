import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from './utils/test-utils';
import Navbar from '../components/Navbar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Component', () => {
  it('renders navbar', () => {
    renderWithRouter(<Navbar />);
    expect(document.querySelector('nav')).toBeTruthy();
  });

  it('renders differently when logged in vs logged out', () => {
    // Not logged in
    const { container: loggedOut } = renderWithRouter(<Navbar />, {
      contextValue: { isLoggedIn: false, userData: null },
    });
    const loggedOutHTML = loggedOut.innerHTML;

    // Logged in
    const { container: loggedIn } = renderWithRouter(<Navbar />, {
      contextValue: { 
        isLoggedIn: true, 
        userData: {
          name: 'John Doe',
          email: 'john@aucegypt.edu',
          studentId: '2021001',
          department: 'Computer Science',
          yearLevel: '2',
          isAccountVerified: true,
        }
      },
    });
    const loggedInHTML = loggedIn.innerHTML;

    // They should be different
    expect(loggedOutHTML).not.toBe(loggedInHTML);
  });

  it('has navigation links', () => {
    renderWithRouter(<Navbar />);
    
    // Check if nav element exists
    const nav = document.querySelector('nav');
    expect(nav).toBeTruthy();
    
    // Check if there are links (a tags or buttons)
    const links = document.querySelectorAll('a, button');
    expect(links.length).toBeGreaterThan(0);
  });
});
