import React from 'react';
import PrerequisitesDisplay from './PrerequisitesDisplay';

const EnhancedCourseCard = ({ course, onEnroll, onDrop, isEnrolled, isProcessing }) => {
  const prerequisites = course.prerequisites 
    ? course.prerequisites.split(',').map(p => p.trim()).filter(p => p.length > 0)
    : [];
  
  const hasPrerequisites = prerequisites.length > 0;
  const isFull = course.currentEnrollment >= course.maxCapacity;
  const availableSeats = course.maxCapacity - course.currentEnrollment;
  
  // Calculate seat availability percentage
  const seatPercentage = (course.currentEnrollment / course.maxCapacity) * 100;
  const getSeatColor = () => {
    if (seatPercentage >= 90) return 'text-red-600';
    if (seatPercentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div 
      data-testid="course-card" 
      className="course-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-200"
    >
      {/* Header */}
      <div className="course-header flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-blue-600">{course.courseCode}</h3>
          <span className="course-credits inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mt-1">
            {course.credits} credits
          </span>
        </div>
        
        {isFull && (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
            FULL
          </span>
        )}
      </div>
      
      {/* Course Name */}
      <h4 className="text-xl font-semibold text-gray-800 mb-4">{course.courseName}</h4>
      
      {/* Course Details */}
      <div className="course-details space-y-2 mb-4">
        <p className="course-schedule flex items-center text-gray-700">
          <span className="mr-2">📅</span>
          <span className="font-medium">{course.schedule || 'TBA'}</span>
        </p>
        
        {course.room && (
          <p className="course-room flex items-center text-gray-700">
            <span className="mr-2">🚪</span>
            <span>{course.room}</span>
          </p>
        )}
        
        <p className="course-instructor flex items-center text-gray-700">
          <span className="mr-2">👤</span>
          <span>{course.instructor || 'TBA'}</span>
        </p>
        
        <p className={`course-enrollment flex items-center font-semibold ${getSeatColor()}`}>
          <span className="mr-2">👥</span>
          <span>{course.currentEnrollment}/{course.maxCapacity} students</span>
          {!isFull && (
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({availableSeats} seats left)
            </span>
          )}
        </p>

        {course.department && (
          <p className="course-department flex items-center text-gray-600 text-sm">
            <span className="mr-2">🏛️</span>
            <span>{course.department}</span>
          </p>
        )}
      </div>
      
      {/* Prerequisites Section */}
      {hasPrerequisites && (
        <div className="prerequisites-section border-t border-gray-200 pt-3 mb-4" data-testid="prerequisites-section">
          <PrerequisitesDisplay 
            courseCode={course.courseCode} 
            prerequisites={prerequisites} 
          />
        </div>
      )}
      
      {/* Description (if available) */}
      {course.description && (
        <p className="course-description text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
      )}
      
      {/* Action Button */}
      <div className="mt-4">
        {isEnrolled ? (
          <button
            onClick={() => onDrop(course.id)}
            disabled={isProcessing}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            data-testid="drop-button"
          >
            {isProcessing ? 'Processing...' : 'Drop Course'}
          </button>
        ) : (
          <button
            onClick={() => onEnroll(course.id)}
            disabled={isProcessing || isFull}
            className={`w-full font-semibold py-2 px-4 rounded transition-colors duration-200 ${
              isFull 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400'
            }`}
            data-testid="enroll-button"
          >
            {isProcessing ? 'Processing...' : isFull ? 'Full' : 'Enroll'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourseCard;
