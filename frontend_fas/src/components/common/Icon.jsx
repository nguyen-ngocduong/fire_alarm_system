import { alertIcons, navigationIcons, sensorIcons, statusIcons, systemIcons, userIcons } from '../../assets/icons';

/**
 * Icon component wrapper for SVG icons
 * @param {string} category - Icon category (alert, navigation, sensor, status, system, user)
 * @param {string} name - Icon name
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size preset (xs, sm, md, lg, xl) or custom
 * @param {string} alt - Alt text for accessibility
 */
const Icon = ({ category, name, className = '', size = 'md', alt = 'icon', ...props }) => {
  const iconCategories = {
    alert: alertIcons,
    navigation: navigationIcons,
    sensor: sensorIcons,
    status: statusIcons,
    system: systemIcons,
    user: userIcons,
  };

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12',
  };

  const iconSrc = iconCategories[category]?.[name];

  if (!iconSrc) {
    console.warn(`Icon not found: ${category}/${name}`);
    return null;
  }

  const sizeClass = sizeClasses[size] || size;

  return (
    <img
      src={iconSrc}
      alt={alt}
      className={`inline-block ${sizeClass} ${className}`}
      {...props}
    />
  );
};

export default Icon;
