import { ExternalLink, Globe } from 'lucide-react';
import {
  RiTwitterXFill, RiInstagramLine, RiLinkedinFill,
} from 'react-icons/ri';

const PersonCard = ({ item }) => {
  const socials = item.socials || {};
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
          {item.logo ? (
            <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
              {item.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          {item.role && <p className="text-xs text-gray-500 truncate">{item.role}</p>}
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>
      )}

      <div className="flex items-center gap-2">
        {item.website && (
          <a
            href={item.website}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            title="Website"
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
        {socials.twitter && (
          <a href={socials.twitter} target="_blank" rel="noreferrer"
             className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
             title="Twitter">
            <RiTwitterXFill className="w-4 h-4" />
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noreferrer"
             className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
             title="LinkedIn">
            <RiLinkedinFill className="w-4 h-4" />
          </a>
        )}
        {socials.instagram && (
          <a href={socials.instagram} target="_blank" rel="noreferrer"
             className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
             title="Instagram">
            <RiInstagramLine className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default PersonCard;