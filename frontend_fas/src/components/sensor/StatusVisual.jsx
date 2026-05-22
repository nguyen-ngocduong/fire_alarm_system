import './StatusVisual.css';

const StatusVisual = ({ status = 'safe' }) => {
  const statusUpper = status?.toUpperCase();

  if (statusUpper === 'NORMAL' || statusUpper === 'SAFE') {
    return (
      <div className="status-visual-container safe">
        <svg className="status-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing Filter */}
          <defs>
            <filter id="safe-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.6"/>
            </filter>
          </defs>

          {/* Outer rotating radar ring */}
          <circle 
            className="radar-ring radar-slow-rotate" 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#10B981" 
            strokeWidth="1.5" 
            strokeDasharray="4 8" 
            fill="none" 
            opacity="0.4"
          />

          {/* Middle pulse ring */}
          <circle 
            className="radar-ring radar-pulse" 
            cx="50" 
            cy="50" 
            r="30" 
            stroke="#10B981" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.3"
          />

          {/* Inner solid circular ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="20" 
            stroke="#10B981" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.2"
          />

          {/* Green glowing core shield */}
          <path 
            d="M50 32 L65 37 V50 C65 59.25 58.75 66.5 50 69.5 C41.25 66.5 35 59.25 35 50 V37 L50 32 Z" 
            fill="url(#safe-gradient)"
            stroke="#10B981"
            strokeWidth="2"
            filter="url(#safe-glow)"
          />

          {/* Secure checkmark inside shield */}
          <path 
            d="M44 51 L48 55 L56 46" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="safe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (statusUpper === 'WARNING' || statusUpper === 'GAS_LEAK_ALERT' || statusUpper === 'HIGH_TEMP_FIRE') {
    return (
      <div className="status-visual-container warning">
        <svg className="status-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="warning-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F59E0B" floodOpacity="0.8"/>
            </filter>
          </defs>

          {/* Outer Warning waves */}
          <circle 
            className="radar-ring radar-pulse-fast" 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#F59E0B" 
            strokeWidth="1.5" 
            fill="none" 
            opacity="0.4"
          />
          <circle 
            className="radar-ring radar-slow-rotate" 
            cx="50" 
            cy="50" 
            r="32" 
            stroke="#F59E0B" 
            strokeWidth="1.5" 
            strokeDasharray="6 6"
            fill="none" 
            opacity="0.3"
          />

          {/* Yellow glowing core shield */}
          <path 
            d="M50 32 L65 37 V50 C65 59.25 58.75 66.5 50 69.5 C41.25 66.5 35 59.25 35 50 V37 L50 32 Z" 
            fill="url(#warning-gradient)"
            stroke="#F59E0B"
            strokeWidth="2"
            filter="url(#warning-glow)"
          />

          {/* Exclamation point inside shield */}
          <text 
            x="50" 
            y="56" 
            fill="#FFFFFF" 
            fontSize="20" 
            fontWeight="bold" 
            textAnchor="middle"
          >
            !
          </text>

          <defs>
            <linearGradient id="warning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // DANGER or other active alerts
  return (
    <div className="status-visual-container danger">
      <svg className="status-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="danger-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* Shockwave circle */}
        <circle 
          className="radar-ring radar-shockwave" 
          cx="50" 
          cy="50" 
          r="44" 
          stroke="#EF4444" 
          strokeWidth="2" 
          fill="none" 
        />
        <circle 
          className="radar-ring radar-shockwave-delay" 
          cx="50" 
          cy="50" 
          r="44" 
          stroke="#F97316" 
          strokeWidth="1" 
          fill="none" 
        />

        {/* Background glow circle */}
        <circle 
          cx="50" 
          cy="55" 
          r="26" 
          fill="#EF4444" 
          opacity="0.15" 
          filter="url(#danger-glow)"
        />

        {/* Animated Multi-layered SVG Flame */}
        <g className="flame-group" filter="url(#danger-glow)">
          {/* Outer red flame */}
          <path 
            className="flame-layer outer-flame"
            d="M50 20 C62 38 68 48 68 62 C68 73 59 80 50 80 C41 80 32 73 32 62 C32 48 38 38 50 20 Z" 
            fill="#EF4444"
          />

          {/* Middle orange flame */}
          <path 
            className="flame-layer middle-flame"
            d="M50 32 C58 45 62 52 62 62 C62 70 56 75 50 75 C44 75 38 70 38 62 C38 52 42 45 50 32 Z" 
            fill="#F97316"
          />

          {/* Inner yellow flame */}
          <path 
            className="flame-layer inner-flame"
            d="M50 44 C54 53 56 58 56 65 C56 70 53 72 50 72 C47 72 44 70 44 65 C44 58 46 53 50 44 Z" 
            fill="#FBBF24"
          />
        </g>
      </svg>
    </div>
  );
};

export default StatusVisual;
