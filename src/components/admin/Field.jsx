export const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-900">{label}</label>
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    {children}
  </div>
);

export const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${props.className || ""}`}
  />
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-y ${props.className || ""}`}
  />
);