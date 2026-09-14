// src/components/Footer.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Check, Loader2, Mail, X, Sparkles } from 'lucide-react';
import {
  RiFacebookCircleFill,
  RiInstagramLine,
  RiTwitterXFill,
  RiWhatsappFill,
} from 'react-icons/ri';
import { FaLinkedin } from "react-icons/fa";

import logo from '../images/Logo/superlogo.png';
import { db } from '../services/firebase';
import { useSecretTrigger } from '../hooks/useSecretTrigger';

const Footer = () => {
  const triggerAdmin = useSecretTrigger();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* Success modal */
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  /* Alternate 5-click trigger on the logo — kept from your original */
  const [clickCount, setClickCount] = useState(0);
  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        navigate('/upload');
        return 0;
      }
      return newCount;
    });
  };

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');

    const clean = email.trim().toLowerCase();

    if (!clean) {
      setError('Please enter your email address');
      return;
    }
    if (!isValidEmail(clean)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!consent) {
      setError('Please tick the consent checkbox to subscribe');
      return;
    }

    setSubmitting(true);
    try {
      // Check for duplicate
      const q = query(
        collection(db, 'subscribers'),
        where('email', '==', clean)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        setError('This email is already subscribed');
        setSubmitting(false);
        return;
      }

      // Save to Firestore
      await addDoc(collection(db, 'subscribers'), {
        email: clean,
        consent: true,
        source: 'footer',
        status: 'active',
        subscribedAt: serverTimestamp(),
      });

      // Show success modal
      setSubscribedEmail(clean);
      setShowSuccess(true);
      setEmail('');
      setConsent(false);
    } catch (err) {
      console.error('Subscribe error:', err);
      setError('Something went wrong. Please try again.');
      toast.error('Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-200/30">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-8 py-20 max-w-7xl mx-auto">
        {/* Addresses */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div>
            <p
              onClick={triggerAdmin}
              className="text-lg text-[#8a8a8a] "
            >
              Abuja Nigeria
            </p>
            <p className="text-lg text-[#8a8a8a]">Obasanjo Space Center</p>
            <p className="text-lg">Umar Musa Yar'Adua Express Way</p>
            <p>Lugbe, Abuja</p>
            <p className="mt-6">Abuja Office</p>
            <p>+234 1 234 5678</p>
          </div>
          <div className="lg:mt-5">
            <p className="text-lg text-[#8a8a8a]">
              Lagos Regional Business Office
            </p>
            <p className="text-lg text-[#8a8a8a]">
              Awolowo Road, Opposite Lagos
            </p>
            <p className="text-lg">Motor Boat Club, South West Ikoyi,</p>
            <p className="mt-6">Lagos, Nigeria</p>
            <p>+234 1 234 5678</p>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center">
          <img
            src={logo}
            onClick={handleClick}
            alt="Logo"
            className="w-45 h-45 sm:w-44 sm:h-44 object-contain cursor-pointer"
          />
        </div>

        {/* Newsletter + socials */}
        <div className="max-w-md space-y-5">
          <p className="text-gray-600 text-lg leading-6">
            Subscribe to our newsletter to stay up to date with the latest
            news, updates, and exclusive offers.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-gray-500 transition"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email"
              disabled={submitting}
              className="flex-1 min-w-0 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-gray-600 px-4 sm:px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Mail className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Sign Up</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="text-xs font-medium text-rose-500 -mt-2">{error}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="newsletter"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (error) setError('');
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 accent-black"
            />
            <label
              htmlFor="newsletter"
              className="text-sm leading-5 text-gray-400"
            >
              I'm okay with receiving emails and having my activity tracked
              to improve my experience.
            </label>
          </div>

          <div className="flex gap-6 mt-10">
            <a href="https://www.facebook.com/nigcomsat/" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition-colors">
              <RiFacebookCircleFill size={35} />
            </a>
            <a href="https://x.com/NigComSat1R" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
              <RiInstagramLine size={35} />
            </a>
            <a href="https://x.com/NigComSat1R" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <RiTwitterXFill size={35} />
            </a>
            <a href="https://ng.linkedin.com/company/nigcomsat" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
              <FaLinkedin size={35} />
            </a>
          </div>
        </div>
      </div>

      {/* ============ SUBSCRIPTION SUCCESS MODAL ============ */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowSuccess(false)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
            >
              {/* Close */}
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <div className="p-8 text-center">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: 'spring',
                    damping: 15,
                    stiffness: 300,
                  }}
                  className="relative mx-auto mb-5 w-16 h-16"
                >
                  <div className="absolute inset-0 rounded-full bg-black opacity-5 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                </motion.div>

                {/* Sparkles accents */}
                

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  You're on the list
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-1">
                  We've added you to our newsletter.
                </p>
                <p className="text-sm font-medium text-gray-900 break-all px-4">
                  {subscribedEmail}
                </p>

                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  Watch your inbox for updates from the NIGCOMSAT Accelerator
                  team.
                </p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-6 w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Footer;