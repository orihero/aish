import React from 'react';

interface CompanyAvatarProps {
  name: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const getRandomColor = (name: string) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export const CompanyAvatar: React.FC<CompanyAvatarProps> = ({ name, logo, size = 'sm' }) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getRandomColor(
        name
      )} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {getInitial(name)}
    </div>
  );
};

export default CompanyAvatar; 