import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/Appcontext';
import Navbar from '../components/Navbar';

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    if (!isLoggedIn || userData?.role !== 'admin') {
      toast.error('Access denied');
      navigate('/');
      return;
    }

    fetchStudentData();
  }, [studentId, isLoggedIn, userData]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${backendUrl}/api/admin/students/${studentId}/enrollments`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setStudent(response.data.student);
        setEnrollments(response.data.enrollments);
        setStatistics(response.data.statistics);
      }

    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      enrolled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      dropped: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-600">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/admin"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Dashboard
        </Link>

        {/* Student Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {student.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p><strong>Student ID:</strong> {student.studentId}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year Level:</strong> Year {student.yearLevel}</p>
                <p><strong>Max Credits/Semester:</strong> {student.maxCreditsPerSemester}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
            <p className="text-3xl font-bold text-blue-600">{statistics.totalEnrollments}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Completed Courses</p>
            <p className="text-3xl font-bold text-green-600">{statistics.completedCourses}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Credits Completed</p>
            <p className="text-3xl font-bold text-purple-600">{statistics.totalCreditsCompleted}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Current Credits</p>
            <p className="text-3xl font-bold text-orange-600">{statistics.currentCredits}</p>
          </div>
        </div>

        {/* Enrollment History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrollment History</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Enrolled Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map(enrollment => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {enrollment.course.courseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.course.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {enrollment.course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {enrollment.course.semester} {enrollment.course.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {enrollment.grade || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {enrollments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No enrollment history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
