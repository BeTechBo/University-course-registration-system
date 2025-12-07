import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScheduleConflictAlert from '../components/ScheduleConflictAlert';

describe('Schedule Conflict Alert Component', () => {
  const mockConflict = {
    courseCode: 'CS101',
    courseName: 'Intro to CS',
    schedule: 'MWF 10:00-11:00'
  };

  it('should not render when no conflict', () => {
    render(<ScheduleConflictAlert conflictingCourse={null} />);
    
    expect(screen.queryByTestId('schedule-conflict-alert')).not.toBeInTheDocument();
  });

  it('should render conflict message with course details', () => {
    render(<ScheduleConflictAlert conflictingCourse={mockConflict} />);
    
    expect(screen.getByText('Schedule Conflict Detected')).toBeInTheDocument();
    
    // Use getAllByText since CS101 appears twice
    const cs101Elements = screen.getAllByText(/CS101/);
    expect(cs101Elements.length).toBeGreaterThan(0);
    
    // Check for course name
    expect(screen.getByText(/Intro to CS/)).toBeInTheDocument();
    
    // Check for the complete conflict message
    expect(screen.getByText(/This course conflicts with/)).toBeInTheDocument();
  });

  it('should display conflicting days', () => {
    render(
      <ScheduleConflictAlert 
        conflictingCourse={mockConflict}
        conflictingDays={['Monday', 'Wednesday', 'Friday']}
      />
    );
    
    expect(screen.getByText(/Monday, Wednesday, Friday/)).toBeInTheDocument();
  });

  it('should display conflicting schedule', () => {
    render(<ScheduleConflictAlert conflictingCourse={mockConflict} />);
    
    expect(screen.getByText(/MWF 10:00-11:00/)).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const mockOnClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ScheduleConflictAlert 
        conflictingCourse={mockConflict}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByTestId('close-alert');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not show close button when onClose not provided', () => {
    render(
      <ScheduleConflictAlert conflictingCourse={mockConflict} />
    );
    
    expect(screen.queryByTestId('close-alert')).not.toBeInTheDocument();
  });
});
