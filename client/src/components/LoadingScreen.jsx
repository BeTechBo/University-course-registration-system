// components/LoadingScreen.jsx
import { FaSpinner } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <FaSpinner className="animate-spin text-5xl text-teal-400 mb-6" />
      <h2 className="text-2xl font-semibold mb-2">Checking who’s knocking... 🔍</h2>
      <p className="text-gray-300">Hold tight. We’re making sure everything’s good to go.</p>
    </div>
  );
};

export default LoadingScreen;
