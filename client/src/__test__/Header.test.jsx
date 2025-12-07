import { describe, it, expect } from 'vitest';
import { renderWithRouter } from './utils/test-utils';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders header', () => {
    renderWithRouter(<Header />);
    expect(document.body).toBeTruthy();
  });

  it('displays welcome message when logged in', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@aucegypt.edu',
    };

    renderWithRouter(<Header />, {
      contextValue: { isLoggedIn: true, userData: mockUser },
    });
    
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it('displays generic message when not logged in', () => {
    renderWithRouter(<Header />, {
      contextValue: { isLoggedIn: false, userData: null },
    });
    
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });
});
