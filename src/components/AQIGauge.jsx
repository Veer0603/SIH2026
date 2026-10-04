import React from 'react';

/**
 * AQIGauge - Precision 180° Speedometer Arch Gauge
 * 
 * Re-engineered to guarantee 100% zero overlap between the measurement text
 * and the meter track or needle.
 * - The gauge arc exists solely in the upper hemisphere (y <= cy).
 * - The needle rotates strictly between -90° (left) and +90° (right) within the upper hemisphere.
 * - All telemetry text (AQI number, category, WHO multiplier) is placed in the lower hemisphere
 *   with generous vertical and horizontal clearance.
 */
export default function AQIGauge({ aqi = 250, maxAqi = 500, size = 220 }) {
  // Normalize AQI between 0 and maxAqi (CPCB scale standard 0-500)
  const clampedAqi = Math.max(0, Math.min(maxAqi, Number(aqi) || 0));
  const percentage = clampedAqi / maxAqi;

  // WHO annual PM2.5 threshold is 5 µg/m³, which corresponds to ~AQI 15
  const whoMultiplier = (clampedAqi / 15).toFixed(1);

  // Category & Color mapping according to CPCB guidelines
  let color = '#059669'; // Good (0-50)
  let categoryLabel = 'Good';
  if (clampedAqi > 400) {
    color = '#7e22ce'; // Severe
    categoryLabel = 'Severe';
  } else if (clampedAqi > 300) {
    color = '#be185d'; // Very Poor
    categoryLabel = 'Very Poor';
  } else if (clampedAqi > 200) {
    color = '#dc2626'; // Poor
    categoryLabel = 'Poor';
  } else if (clampedAqi > 100) {
    color = '#ea580c'; // Moderate
    categoryLabel = 'Moderate';
  } else if (clampedAqi > 50) {
    color = '#d97706'; // Satisfactory
    categoryLabel = 'Satisfactory';
  }

  // Exact geometric coordinates in virtual 220 x 186 viewBox
  const vbWidth = 220;
  const vbHeight = 186;
  const cx = 110;
  const cy = 94;
  const radius = 74;
  const strokeWidth = 13;

  // SVG Arch Path: Starts at (cx - radius, cy) [left], arches UP to (cx, cy - radius) [top],
  // and finishes at (cx + radius, cy) [right]. 100% of this arc is in y <= cy.
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  // Needle angle: -90° (left, 0 AQI) -> 0° (top, 250 AQI) -> +90° (right, 500 AQI)
  const needleRotation = -90 + percentage * 180;

  // Discrete tick marks for precision scale (0, 100, 200, 300, 400, 500)
  const ticks = [
    { val: 0, pct: 0 },
    { val: 100, pct: 0.2 },
    { val: 200, pct: 0.4 },
    { val: 300, pct: 0.6 },
    { val: 400, pct: 0.8 },
    { val: 500, pct: 1.0 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: `${size}px`,
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: `${Math.round(size * 0.86)}px`,
          display: 'block',
          overflow: 'visible'
        }}
        role="img"
        aria-label={`AQI Gauge reading ${clampedAqi}, Category: ${categoryLabel}`}
      >
        <defs>
          {/* Horizontal gradient matching the 0 (green) -> 500 (purple) CPCB spectrum */}
          <linearGradient id="aqiArcSpectrum" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="16%" stopColor="#84cc16" />
            <stop offset="35%" stopColor="#eab308" />
            <stop offset="55%" stopColor="#ea580c" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="88%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          {/* Subtle 3D shadow for needle and hub */}
          <filter id="gaugeSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Background Arch Track: Upper 180° semi-circle */}
        <path
          d={arcPath}
          fill="none"
          stroke="var(--border-color, #cbd5e1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.32"
        />

        {/* 2. Scale Tick Notches */}
        {ticks.map((t) => {
          const angleRad = (-180 + t.pct * 180) * (Math.PI / 180);
          const rInner = radius - strokeWidth / 2 - 3;
          const rOuter = radius - strokeWidth / 2 - 8;
          const x1 = cx + rInner * Math.cos(angleRad);
          const y1 = cy + rInner * Math.sin(angleRad);
          const x2 = cx + rOuter * Math.cos(angleRad);
          const y2 = cy + rOuter * Math.sin(angleRad);
          return (
            <line
              key={t.val}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--text-muted, #94a3b8)"
              strokeWidth={t.val % 250 === 0 ? "1.5" : "1"}
              opacity={0.65}
            />
          );
        })}

        {/* 3. Active Colored Progress Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#aqiArcSpectrum)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={Math.max(0, 100 - percentage * 100)}
          style={{
            transition: 'stroke-dashoffset 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />

        {/* 4. Min / Max / Mid Scale Text */}
        <text
          x={cx - radius - 2}
          y={cy + 16}
          textAnchor="middle"
          fill="var(--text-muted, #64748b)"
          style={{ fontSize: '9.5px', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}
        >
          0
        </text>

        <text
          x={cx}
          y={cy - radius - 7}
          textAnchor="middle"
          fill="var(--text-muted, #64748b)"
          style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', opacity: 0.65 }}
        >
          250
        </text>

        <text
          x={cx + radius + 2}
          y={cy + 16}
          textAnchor="middle"
          fill="var(--text-muted, #64748b)"
          style={{ fontSize: '9.5px', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}
        >
          500
        </text>

        {/* 5. Analog Needle Indicator (Strictly swings within y <= cy) */}
        <g
          filter="url(#gaugeSoftShadow)"
          style={{
            transform: `rotate(${needleRotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Needle stem */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius + 7}
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Needle center core stripe for contrast */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius + 11}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Needle glowing tip bead */}
          <circle
            cx={cx}
            cy={cy - radius + 7}
            r="3.5"
            fill={color}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>

        {/* 6. Center Hub Pivot (y = cy = 94, hub bottom = 101.5) */}
        <g filter="url(#gaugeSoftShadow)">
          <circle
            cx={cx}
            cy={cy}
            r="7.5"
            fill="var(--bg-panel, #ffffff)"
            stroke="var(--border-color, #cbd5e1)"
            strokeWidth="1.5"
          />
          <circle cx={cx} cy={cy} r="4.5" fill={color} />
          <circle cx={cx} cy={cy} r="1.5" fill="#ffffff" />
        </g>

        {/* 7. Central Telemetry Readings — 100% in the open lower hemisphere (y > cy) */}
        {/* Main AQI Number: centered at y = 132 (top: 114, bottom: 150), > 12px below pivot hub */}
        <text
          x={cx}
          y={cy + 38}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          style={{
            fontSize: '37px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            letterSpacing: '-0.03em'
          }}
        >
          {clampedAqi}
        </text>

        {/* Subtitle Label: centered at y = 158 */}
        <text
          x={cx}
          y={cy + 61}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--text-muted, #64748b)"
          style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.07em'
          }}
        >
          AIR QUALITY INDEX
        </text>

        {/* WHO Toxicity Multiplier: centered at y = 176 */}
        <text
          x={cx}
          y={cy + 78}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          style={{
            fontSize: '11.5px',
            fontWeight: 700
          }}
        >
          {whoMultiplier}x WHO Safe Limit
        </text>
      </svg>
    </div>
  );
}
