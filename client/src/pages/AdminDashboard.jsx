import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/Appcontext';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'enrollments'
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('completed');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!isLoggedIn) {
      toast.error('Please login to access admin dashboard');
      navigate('/login');
      return;
    }

    if (userData?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    fetchData();
  }, [isLoggedIn, userData, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, enrollmentsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/students`, { withCredentials: true }),
        axios.get(`${backendUrl}/api/admin/enrollments`, { withCredentials: true })
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.students);
      }

      if (enrollmentsRes.data.success) {
        setEnrollments(enrollmentsRes.data.enrollments);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.message || 'Failed to load data');
      
      if (error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setSelectedGrade('');
    setSelectedStatus('completed');
    setShowGradeModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnrollment) return;

    if (selectedStatus === 'completed' && !selectedGrade) {
      toast.error('Please select a grade');
      return;
    }

    try {
      setProcessing(true);

      const response = await axios.put(
        `${backendUrl}/api/admin/enrollments/${selectedEnrollment.id}/status`,
        {
          status: selectedStatus,
          grade: selectedGrade || undefined
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Enrollment marked as ${selectedStatus}`);
        setShowGradeModal(false);
        setSelectedEnrollment(null);
        fetchData(); // Refresh data
      }

    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error(error.response?.data?.message || 'Failed to update enrollment');
    } finally {
      setProcessing(false);
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
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage students and enrollments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Enrollments</p>
                <p className="text-3xl font-bold text-green-600">{enrollments.length}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Enrollments</p>
                <p className="text-3xl font-bold text-orange-600">{activeEnrollments.length}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-purple-600">{completedEnrollments.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'students'
                    ? 'border-b-2 border-blue-600 text-blue-600 active'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'enrollments'
                    ? 'border-b-2 border-blue-600 text-blue-600 active'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Enrollments ({enrollments.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            Year {student.yearLevel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => navigate(`/admin/students/${student.id}`)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {students.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            )}

            {/* Enrollments Tab */}
            {activeTab === 'enrollments' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollments.map(enrollment => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.student?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {enrollment.student?.studentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.course?.courseCode}
                            </div>
                            <div className="text-xs text-gray-500">
                              {enrollment.course?.courseName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {enrollment.course?.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {enrollment.grade || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {enrollment.status === 'enrolled' && (
                              <button
                                onClick={() => handleMarkComplete(enrollment)}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                Mark Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {enrollments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No enrollments found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Enrollment Status
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Student:</strong> {selectedEnrollment?.student?.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Course:</strong> {selectedEnrollment?.course?.courseCode} - {selectedEnrollment?.course?.courseName}
              </p>
            </div>

            {/* Status Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {/* Grade Selection */}
            {(selectedStatus === 'completed' || selectedStatus === 'failed') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select grade...</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                  <option value="P">P (Pass)</option>
                  <option value="NP">NP (No Pass)</option>
                  <option value="W">W (Withdraw)</option>
                  <option value="I">I (Incomplete)</option>
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {processing ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={() => {
                  setShowGradeModal(false);
                  setSelectedEnrollment(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
