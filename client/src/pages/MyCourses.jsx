import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/Appcontext';
import Navbar from '../components/Navbar';

const MyCourses = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState({});

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please login to view your courses');
      navigate('/login');
    } else {
      fetchEnrollments();
    }
  }, [isLoggedIn]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/enrollments/my-courses`);
      if (data.success) {
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (courseId) => {
    try {
      setDropping(prev => ({ ...prev, [courseId]: true }));
      
      const { data } = await axios.delete(`${backendUrl}/api/enrollments/drop/${courseId}`);

      if (data.success) {
        toast.success('Successfully dropped course');
        fetchEnrollments(); // Refresh the list
      }
    } catch (error) {
      console.error('Drop course error:', error);
      toast.error(error.response?.data?.message || 'Failed to drop course');
    } finally {
      setDropping(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            View and manage your enrolled courses
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{enrollments.length}</p>
              <p className="text-gray-600">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{totalCredits}</p>
              <p className="text-gray-600">Total Credits</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{userData?.yearLevel}</p>
              <p className="text-gray-600">Year Level</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {enrollments.map(enrollment => {
              const course = enrollment.course;
              const isDropping = dropping[course.id];
              
              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-blue-600">
                            {course.credits}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {course.courseCode} - {course.courseName}
                          </h3>
                          <p className="text-gray-600">{course.department}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Instructor:</span> {course.instructor || 'TBA'}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Schedule:</span> {course.schedule || 'TBA'}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Room:</span> {course.room || 'TBA'}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Semester:</span> {course.semester} {course.year}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button
                        onClick={() => handleDrop(course.id)}
                        disabled={isDropping}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isDropping ? 'Dropping...' : 'Drop Course'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📚</span>
            </div>
            <p className="text-gray-500 text-lg mb-4">You haven't enrolled in any courses yet</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
