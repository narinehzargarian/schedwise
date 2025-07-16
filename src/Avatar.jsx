import { title } from "framer-motion/client";

function stringToInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  console.log('Parts:', parts);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
}

export function Avatar({name, size = 'md', className = ''}) {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full bg-gray-500 text-white font-bold ${sizeMap[size] || sizeMap.md} ${className}`}
      title={name}
    >
      {stringToInitials(name)}
    </div>
  );
}