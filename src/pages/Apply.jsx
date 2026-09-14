// src/pages/Apply.jsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import SignupForm from '../components/SignupForm';
import ApplicationsClosed from '../components/ApplicationsClosed';
import { useFirestoreDoc } from '../hooks/useFirestore';
import logo from  '../images/Logo/superlogo.png';

const Apply = () => {
  const { data: settings, loading } = useFirestoreDoc('applicationSettings');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  // If settings doc doesn't exist yet, treat as open (safe default)
  if (!settings || settings.isOpen !== false) {
    return <SignupForm />;
  }

  return <ApplicationsClosed settings={settings} />;
};

export default Apply;