import React from 'react';

const PrerequisitesDisplay = ({ courseCode, prerequisites }) => {
  if (!prerequisites || prerequisites.length === 0) {
    return <div className="text-gray-500 text-sm">No prerequisites</div>;
  }

  return (
    <div data-testid="prerequisites-display" className="mt-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Prerequisites Required
      </h3>
      <div className="prerequisites-list flex flex-wrap gap-2">
        {prerequisites.map((prereq) => (
          <span 
            key={prereq} 
            className="prerequisite-badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
          >
            {prereq}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PrerequisitesDisplay;
