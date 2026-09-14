// src/components/Launchpad.jsx
import { Link } from 'react-router-dom';
import { useFirestoreDoc } from '../hooks/useFirestore';

function Launchpad() {
  const { data, loading } = useFirestoreDoc('launchpad');

  if (loading) {
    return (
      <section className="bg-white py-24 mx-3">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="w-full h-[700px] bg-gray-100 rounded-[30px]" />
          <div className="space-y-6">
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-20 w-3/4 bg-gray-100 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null; // nothing to show until an admin seeds it
  }

  return (
    <section className="bg-white py-24 mx-3">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 sm:grid-cols-1 gap-10">
        <div className="w-full">
          {data.image && (
            <img
              src={data.image}
              alt="Launchpad"
              className="w-full h-[700px] object-cover rounded-[30px]"
            />
          )}
        </div>

        <div className="w-full">
          {data.eyebrow && (
            <p className="uppercase text-black tracking-widest font-semibold mb-3">
              {data.eyebrow}
            </p>
          )}

          <h2 className="text-[60px] font-bold leading-tight text-black mb-6 whitespace-pre-line">
            {data.heading}
          </h2>

          <p className="text-xl text-gray-700 leading-9 mb-10">
            {data.description}
          </p>

          {data.ctaLabel && (
            <Link
              to={data.ctaLink || '/apply'}
              className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-900 hover:shadow font-semibold transition duration-500"
            >
              {data.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default Launchpad;