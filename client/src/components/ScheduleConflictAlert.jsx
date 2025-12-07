import React from 'react';

const ScheduleConflictAlert = ({ conflictingCourse, conflictingDays, onClose }) => {
  if (!conflictingCourse) return null;

  return (
    <div 
      data-testid="schedule-conflict-alert" 
      className="alert alert-error bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md mb-4"
    >
      <div className="flex items-start">
        <div className="alert-icon text-3xl mr-3">⚠️</div>
        
        <div className="alert-content flex-1">
          <h4 className="text-lg font-bold text-red-800 mb-2">
            Schedule Conflict Detected
          </h4>
          
          <p className="text-red-700 mb-2">
            This course conflicts with{' '}
            <strong className="font-semibold">{conflictingCourse.courseCode}</strong>{' '}
            ({conflictingCourse.courseName})
          </p>
          
          {conflictingDays && conflictingDays.length > 0 && (
            <p className="conflicting-days text-red-600 text-sm mb-1">
              <span className="font-semibold">Conflicting days:</span>{' '}
              {conflictingDays.join(', ')}
            </p>
          )}
          
          <p className="conflict-schedule text-red-600 text-sm">
            <span className="font-semibold">{conflictingCourse.courseCode}:</span>{' '}
            {conflictingCourse.schedule}
          </p>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose} 
            className="alert-close text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none ml-3"
            data-testid="close-alert"
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleConflictAlert;
