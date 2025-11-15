import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/Appcontext';
import Navbar from '../components/Navbar';

const Courses = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    department: '',
    level: '',
    semester: '',
    year: '',
    credits: '',
    instructor: '',
    availableOnly: false
  });
  
  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    levels: [],
    semesters: [],
    instructors: [],
    credits: []
  });

  // Enrollment state
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [processingCourse, setProcessingCourse] = useState({});

  axios.defaults.withCredentials = true;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to view courses');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Debounce search query (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/courses/filters`);
        if (data.success) {
          setFilterOptions(data.filters);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, [backendUrl]);

  // Fetch all courses initially
  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // Combined search + filters - trigger whenever debounced query OR filters change
  useEffect(() => {
    performCombinedSearch();
  }, [debouncedQuery, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/courses`);
      if (data.success) {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/enrollments/my-courses`);
      if (data.success) {
        const enrolledIds = new Set(data.enrollments.map(e => e.courseId));
        setEnrolledCourses(enrolledIds);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  // Combined search with filters
  const performCombinedSearch = async () => {
    try {
      setLoading(true);
      
      // Check if any filters or search query is active
      const hasQuery = debouncedQuery.trim() !== '';
      const hasFilters = Object.values(filters).some(value => 
        value !== '' && value !== false
      );

      // If no search and no filters, show all courses
      if (!hasQuery && !hasFilters) {
        setFilteredCourses(courses);
        setLoading(false);
        return;
      }

      // Build query params - always include search query and all active filters
      const params = {
        query: debouncedQuery,
        ...filters
      };
      
      // Remove empty filters but keep the query even if empty
      Object.keys(params).forEach(key => {
        if (key !== 'query' && (params[key] === '' || params[key] === false)) {
          delete params[key];
        }
      });

      // Use advanced search endpoint which handles both search and filters
      const { data } = await axios.get(`${backendUrl}/api/courses/advanced-search`, {
        params
      });
      
      if (data.success) {
        setFilteredCourses(data.courses);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle enrollment (Add course)
  const handleEnroll = async (courseId) => {
    try {
      setProcessingCourse(prev => ({ ...prev, [courseId]: true }));
      
      const { data } = await axios.post(`${backendUrl}/api/enrollments/enroll`, {
        courseId
      });

      if (data.success) {
        toast.success('Successfully enrolled in course!');
        setEnrolledCourses(prev => new Set([...prev, courseId]));
        // Refresh courses to update enrollment count
        await fetchCourses();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setProcessingCourse(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Handle drop (Remove course)
  const handleDrop = async (courseId) => {
    // Confirmation dialog
    if (!window.confirm('Are you sure you want to drop this course?')) {
      return;
    }

    try {
      setProcessingCourse(prev => ({ ...prev, [courseId]: true }));
      
      const { data } = await axios.delete(`${backendUrl}/api/enrollments/drop/${courseId}`);

      if (data.success) {
        toast.success('Successfully dropped course');
        setEnrolledCourses(prev => {
          const newSet = new Set(prev);
          newSet.delete(courseId);
          return newSet;
        });
        // Refresh courses to update enrollment count
        await fetchCourses();
      }
    } catch (error) {
      console.error('Drop course error:', error);
      toast.error(error.response?.data?.message || 'Failed to drop course');
    } finally {
      setProcessingCourse(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search only
  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  // Clear all filters and search
  const clearAll = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters({
      department: '',
      level: '',
      semester: '',
      year: '',
      credits: '',
      instructor: '',
      availableOnly: false
    });
    toast.info('All filters and search cleared');
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '' && value !== false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Course Catalog</h1>
          <p className="text-gray-600">
            Search and browse available courses for registration
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by course name or code (e.g., CS101, Calculus)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                  showFilters || hasActiveFilters()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                {hasActiveFilters() && !showFilters && (
                  <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    Active
                  </span>
                )}
              </button>
            </div>
            
            {/* Active filters indicator */}
            {(searchQuery || hasActiveFilters()) && (
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Search: "{searchQuery}"
                  </span>
                )}
                {filters.department && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Dept: {filters.department}
                  </span>
                )}
                {filters.level && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Level: {filters.level}
                  </span>
                )}
                {filters.semester && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Semester: {filters.semester}
                  </span>
                )}
                {filters.credits && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Credits: {filters.credits}
                  </span>
                )}
                {filters.instructor && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Instructor: {filters.instructor}
                  </span>
                )}
                {filters.availableOnly && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Available Only
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Departments</option>
                    {filterOptions.departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Levels</option>
                    {filterOptions.levels.map(level => (
                      <option key={level} value={level}>{level}-Level</option>
                    ))}
                  </select>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Semesters</option>
                    {filterOptions.semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* Credits Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits
                  </label>
                  <select
                    value={filters.credits}
                    onChange={(e) => handleFilterChange('credits', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Credits</option>
                    {filterOptions.credits.map(credit => (
                      <option key={credit} value={credit}>{credit} Credits</option>
                    ))}
                  </select>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <select
                    value={filters.instructor}
                    onChange={(e) => handleFilterChange('instructor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">All Instructors</option>
                    {filterOptions.instructors.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                {/* Available Only */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="availableOnly"
                    checked={filters.availableOnly}
                    onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="availableOnly" className="ml-2 text-sm text-gray-700">
                    Show only courses with available seats
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={clearAll}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> course(s)
            {(searchQuery || hasActiveFilters()) && (
              <span className="text-sm text-gray-500 ml-2">
                (filtered from {courses.length} total)
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : (
          /* Course List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => {
                const isEnrolled = enrolledCourses.has(course.id);
                const isProcessing = processingCourse[course.id];
                const isFull = course.currentEnrollment >= course.maxCapacity;
                
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{course.courseCode}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isFull
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isFull ? 'Full' : 'Available'}
                      </span>
                    </div>
                    
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      {course.courseName}
                    </h4>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Department:</span> {course.department}</p>
                      <p><span className="font-medium">Credits:</span> {course.credits}</p>
                      <p><span className="font-medium">Instructor:</span> {course.instructor || 'TBA'}</p>
                      <p><span className="font-medium">Schedule:</span> {course.schedule || 'TBA'}</p>
                      <p><span className="font-medium">Enrollment:</span> {course.currentEnrollment}/{course.maxCapacity}</p>
                      <p><span className="font-medium">Semester:</span> {course.semester} {course.year}</p>
                    </div>

                    {course.prerequisites && (
                      <div className="mb-4 pb-3 ">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Prerequisites:</span> {course.prerequisites}
                        </p>
                      </div>
                    )}

                    {/* CRUD Enrollment Buttons */}
                    <div className="pt-3 border-t border-gray-200 mt-auto">
                      {isEnrolled ? (
                        // Drop button (Delete operation)
                        <button
                          onClick={() => handleDrop(course.id)}
                          disabled={isProcessing}
                          className="w-full px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                              Dropping...
                            </>
                          ) : (
                            <>
                              <span className="text-lg">🗑️</span>
                              Drop Course
                            </>
                          )}
                        </button>
                      ) : (
                        // Add button (Create operation)
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={isProcessing || isFull}
                          className={`w-full px-4 py-2.5 rounded-lg transition-colors font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                            isFull 
                              ? 'bg-gray-300 text-gray-500' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                              Enrolling...
                            </>
                          ) : isFull ? (
                            <>
                              <span className="text-lg">🚫</span>
                              Course Full
                            </>
                          ) : (
                            <>
                              <span className="text-lg">➕</span>
                              Add Course
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No courses found matching your criteria</p>
                <button
                  onClick={clearAll}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters and Show All Courses
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
