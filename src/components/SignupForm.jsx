// src/components/SignupForm.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  FileVideo,
  X,
  Loader2,
  User,
  Users,
  ClipboardCheck,
  ArrowLeft,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { uploadImage } from '../services/cloudinary';
import Checklist from './Checklist';

const TOTAL_STEPS = 3;

const STEPS = [
  { id: 1, label: 'Your Information', icon: User },
  { id: 2, label: 'Team & Video', icon: Users },
  { id: 3, label: 'Review', icon: ClipboardCheck },
];

const SignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  otherNames: '',
  phone: '',
  email: '',
  teamName: '',
  cacRegistered: 'Yes',
  digitalPresence: 'Yes',
  hasMvp: 'Yes',
  teamSize: 'Yes',
  videoName: '',
  videoUrl: '',
  videoFile: null,
  videoPreview: '',
});

  const [errors, setErrors] = useState({});

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Accept immediately — show the preview and filename right away
  const previewUrl = URL.createObjectURL(file);

  setFormData((prev) => {
    // Revoke any previous preview to avoid memory leaks
    if (prev.videoPreview) URL.revokeObjectURL(prev.videoPreview);
    return {
      ...prev,
      videoName: file.name,
      videoFile: file,
      videoPreview: previewUrl,
    };
  });
  setErrors((prev) => ({ ...prev, video: '' }));

  // Check duration asynchronously (non-blocking)
  const videoEl = document.createElement('video');
  videoEl.preload = 'metadata';

  const handleLoaded = () => {
    const duration = videoEl.duration;
    videoEl.src = '';
    if (duration && duration > 60) {
      setErrors((prev) => ({
        ...prev,
        video: `Video must be 60 seconds or shorter (yours is ${Math.round(duration)}s)`,
      }));
    }
  };

  const handleError = () => {
    // Some browsers/codecs can't read metadata — just accept the file
    videoEl.src = '';
  };

  videoEl.addEventListener('loadedmetadata', handleLoaded);
  videoEl.addEventListener('error', handleError);
  videoEl.src = previewUrl;

  // Safety timeout: if metadata hasn't loaded in 5s, accept the file anyway
  setTimeout(() => {
    if (videoEl.readyState < 1) handleError();
  }, 5000);
};

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim())
        newErrors.lastName = 'Last name is required';
      if (!formData.phone.trim())
        newErrors.phone = 'Phone number is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    }

    if (currentStep === 2) {
      if (!formData.teamName.trim())
        newErrors.teamName = 'Team name is required';
      if (!formData.videoName)
        newErrors.video = 'A 1-minute pitch video is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep()) return;

  setIsSubmitting(true);
  try {
    let videoUrl = '';
    let videoResourceType = '';

    if (formData.videoFile) {
      // Auto-detect: MIME type is video/* so this goes to /video/upload/
      const result = await uploadImage(formData.videoFile);

      console.log('✅ Cloudinary upload result:', {
        resource_type: result.resource_type,
        format: result.format,
        duration: result.duration,
        secure_url: result.secure_url,
      });

      if (result.resource_type !== 'video') {
        throw new Error(
          `Video was uploaded as "${result.resource_type}" instead of "video". ` +
            `Update your Cloudinary preset to allow video uploads.`
        );
      }

      // Force MP4 + auto quality so every browser can stream it
      videoUrl = result.secure_url.replace(
        '/video/upload/',
        '/video/upload/f_mp4,q_auto/'
      );
      videoResourceType = result.resource_type;
    }

    const { videoFile, videoPreview, ...rest } = formData;

    await addDoc(collection(db, 'applications'), {
      ...rest,
      videoUrl,
      videoResourceType,
      submittedAt: serverTimestamp(),
      status: 'new',
    });

    setIsSubmitted(true);
  } catch (err) {
    console.error('Submission error:', err);
    toast.error(err.message || 'Submission failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  /* ---------- UI Primitives ---------- */
  const Label = ({ children, required }) => (
    <label className="mb-1.5 block text-sm font-medium text-gray-900">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  const inputBase =
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:border-transparent';
  const inputOk = 'border-gray-200 bg-white';
  const inputErr = 'border-rose-400 bg-rose-50/50';

  /* ---------- Success View ---------- */
  if (isSubmitted) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
              <Check className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Application submitted
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Thanks, {formData.firstName || 'there'}. We've received your
              application. We'll reach out at{' '}
              <span className="font-semibold text-gray-900">
                {formData.email}
              </span>{' '}
              with next steps.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  /* ---------- Main Form ---------- */
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gray-50 mt-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Apply for Cohort 3.0
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Complete the three-step application below. Review the
                eligibility checklist before you begin.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Body */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Checklist */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1 lg:sticky lg:top-24"
            >
              <Checklist />
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Stepper */}
              <div className="border-b border-gray-200 px-6 sm:px-8 py-5">
                <div className="flex items-center gap-2 sm:gap-4">
                  {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isComplete = currentStep > step.id;

                    return (
                      <div
                        key={step.id}
                        className="flex items-center flex-1 last:flex-initial"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition ${
                              isComplete
                                ? 'bg-black text-white'
                                : isActive
                                  ? 'bg-black text-white'
                                  : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isComplete ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <span
                            className={`hidden sm:block text-sm font-medium truncate ${
                              isActive
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className="flex-1 h-px bg-gray-200 mx-2 sm:mx-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={
                  currentStep === TOTAL_STEPS ? handleSubmit : nextStep
                }
                className="p-6 sm:p-8"
              >
                <AnimatePresence mode="wait">
                  {/* STEP 1 */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Your Information
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Tell us about yourself.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <Label required>First name</Label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Ada"
                            className={`${inputBase} ${errors.firstName ? inputErr : inputOk}`}
                          />
                          {errors.firstName && (
                            <p className="mt-1.5 text-xs font-medium text-rose-500">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label required>Last name</Label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Lovelace"
                            className={`${inputBase} ${errors.lastName ? inputErr : inputOk}`}
                          />
                          {errors.lastName && (
                            <p className="mt-1.5 text-xs font-medium text-rose-500">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Other names</Label>
                        <input
                          type="text"
                          name="otherNames"
                          value={formData.otherNames}
                          onChange={handleChange}
                          placeholder="Optional"
                          className={`${inputBase} ${inputOk}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <Label required>Phone number</Label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+234 800 000 0000"
                            className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-xs font-medium text-rose-500">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label required>Email</Label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-rose-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Team & Video
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Tell us about your team and upload a short pitch.
                        </p>
                      </div>

                      <div>
                        <Label required>Team name</Label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder="The Innovators"
                          className={`${inputBase} ${errors.teamName ? inputErr : inputOk}`}
                        />
                        {errors.teamName && (
                          <p className="mt-1.5 text-xs font-medium text-rose-500">
                            {errors.teamName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <Label required>CAC registered?</Label>
                          <select
                            name="cacRegistered"
                            value={formData.cacRegistered}
                            onChange={handleChange}
                            className={`${inputBase} ${inputOk}`}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <Label required>Digital presence?</Label>
                          <select
                            name="digitalPresence"
                            value={formData.digitalPresence}
                            onChange={handleChange}
                            className={`${inputBase} ${inputOk}`}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <Label required>Has an MVP?</Label>
                          <select
                            name="hasMvp"
                            value={formData.hasMvp}
                            onChange={handleChange}
                            className={`${inputBase} ${inputOk}`}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <Label required>Team of 2 or more?</Label>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className={`${inputBase} ${inputOk}`}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>

                      {/* Video Upload */}
                      {/* Video Upload */}
<div>
  <Label required>Pitch video (max 1 minute)</Label>

  {formData.videoPreview ? (
    <div className="space-y-3">
      {/* Video Preview */}
      <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
        <video
          src={formData.videoPreview}
          controls
          className="w-full max-h-72 object-contain"
        />
      </div>

      {/* File info + remove */}
      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
          <FileVideo className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {formData.videoName}
          </div>
          <div className="text-xs text-gray-500">
            {formData.videoFile
              ? `${(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB`
              : 'Ready to upload'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (formData.videoPreview) {
              URL.revokeObjectURL(formData.videoPreview);
            }
            setFormData((prev) => ({
              ...prev,
              videoName: '',
              videoFile: null,
              videoPreview: '',
            }));
          }}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  ) : (
    <label
      htmlFor="video-upload"
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
        errors.video
          ? 'border-rose-400 bg-rose-50/50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      }`}
    >
      <UploadCloud className="h-6 w-6 text-gray-400" />
      <span className="text-sm font-medium text-gray-700">
        Click to upload your pitch video
      </span>
      <span className="text-xs text-gray-500">
        Maximum 60 seconds · MP4, MOV, WEBM
      </span>
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  )}

  {errors.video && (
    <p className="mt-1.5 text-xs font-medium text-rose-500">
      {errors.video}
    </p>
  )}
</div>
                    </motion.div>
                  )}

                  {/* STEP 3 — Review */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Final Review
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Please confirm your details before submitting.
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gray-50 divide-y divide-gray-200">
                        {/* Profile */}
                        <div className="p-5">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                            Profile
                          </h3>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                              <dt className="text-gray-500">Name</dt>
                              <dd className="font-medium text-gray-900">
                                {formData.firstName} {formData.lastName}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Other names</dt>
                              <dd className="font-medium text-gray-900">
                                {formData.otherNames || '—'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Phone</dt>
                              <dd className="font-medium text-gray-900">
                                {formData.phone}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Email</dt>
                              <dd className="font-medium text-gray-900 break-all">
                                {formData.email}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Team & Video */}
                        <div className="p-5">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                            Team & Video
                          </h3>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                              <dt className="text-gray-500">Team name</dt>
                              <dd className="font-medium text-gray-900">
                                {formData.teamName}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">
                                CAC registered
                              </dt>
                              <dd className="font-medium text-gray-900">
                                {formData.cacRegistered}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">
                                Digital presence
                              </dt>
                              <dd className="font-medium text-gray-900">
                                {formData.digitalPresence}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">
                                Has MVP / Prototype
                              </dt>
                              <dd className="font-medium text-gray-900">
                                {formData.hasMvp}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">
                                Team of 2 or more
                              </dt>
                              <dd className="font-medium text-gray-900">
                                {formData.teamSize}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Video</dt>
                              <dd className="font-medium text-gray-900 truncate">
                                {formData.videoName || '—'}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload progress */}
                {isSubmitting && formData.videoFile && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading video...
                      </span>
                      <span className="text-gray-500">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignupForm;