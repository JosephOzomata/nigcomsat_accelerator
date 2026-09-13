import { useState } from "react";
import logo from "../images/Logo/logo.jpeg";
import livelogo from "../images/livelogo.webm";
import { useNavigate } from "react-router-dom";
import { useSecretTrigger } from "../hooks/useSecretTrigger";
import { RiFacebookCircleFill, RiInstagramLine, RiTwitterXFill, RiWhatsappFill } from "react-icons/ri";

const Footer = () => {
  const triggerAdmin = useSecretTrigger();

  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      if (newCount === 5) {
        navigate("/upload");
        return 0;
      }

      return newCount;
    });
  };

  return (
    <div className='bg-gray-200/30'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-8 py-20 max-w-7xl mx-auto'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-1 gap-4'>
          <div>
            <p onClick={triggerAdmin} className='text-lg text-[#8a8a8a] cursor-pointer'>Abuja Nigeria</p>
            <p className='text-lg text-[#8a8a8a]'>Obasanjo Space Center</p>
            <p className='text-lg'>Umar Musa Yar'Adua Express Way</p>
            <p>Lugbe, Abuja</p>
            <p className='mt-6'>Abuja Office</p>
            <p>+234 1 234 5678</p>
          </div>
          <div className='lg:mt-5'>
            <p className='text-lg text-[#8a8a8a]'>Lagos Regional Business Office</p>
            <p className='text-lg text-[#8a8a8a]'>Awolowo Road, Opposite Lagos</p>
            <p className='text-lg'>Motor Boat Club, South West Ikoyi,</p>
            <p className='mt-6'>Lagos, Nigeria</p>
            <p>+234 1 234 5678</p>
          </div>
        </div>

        <div className='flex justify-center items-center'>
          <img
            src={logo}
            onClick={handleClick}
            alt="Logo"
            className='w-32 h-32 sm:w-44 sm:h-44 object-contain cursor-pointer'
          />
          {/* <video onClick={handleClick} src={livelogo} autoPlay loop muted className="w-60 h-60 object-cover "/> */}
        </div>

        <div className="max-w-md space-y-5">
          <p className="text-gray-600 text-sm leading-6">Subscribe to our newsletter to stay up to date with the latest news, updates, and exclusive offers.</p>
          <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
            <input type="email" placeholder="Enter your email" className="flex-1 min-w-0 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none"/>
            <button className="bg-gray-600 px-4 sm:px-6 py-3 font-medium text-white transition hover:bg-gray-700">
              Sign Up
            </button>
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="newsletter" className="mt-1 h-4 w-4 rounded border-gray-300 accent-black"/>
            <label htmlFor="newsletter" className="text-sm leading-5 text-gray-400">
              I'm okay with receiving emails and having my activity tracked to improve my experience.
            </label>
          </div>

          <div className='flex flex-wrap gap-4'>
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
              <RiFacebookCircleFill size={24} />
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
              <RiInstagramLine size={24} />
            </a>
            <a href="#" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <RiTwitterXFill size={24} />
            </a>
            <a href="#" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-600 transition-colors">
              <RiWhatsappFill size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer