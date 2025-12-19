import React, { useMemo } from 'react';

const DynamicStatsCard = ({
  data = [],                           
  getLabel = item => item.label,      
  getValue = item => item.value,       
  getIcon = item => item.icon,         
  getColor = item => item.color,      
  title = '',                           
  className = '',                      
}) => {
  const statsData = useMemo(() => 
    data.map(item => ({
      label: getLabel(item),
      value: getValue(item),
      IconComponent: getIcon(item),
      color: getColor(item),
    }))
  , [data, getLabel, getValue, getIcon, getColor]);

  if (!statsData.length) {
    return (
      <div
        className={className}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        No data to display
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: 5 }}>
          {title}
        </h4>
      )}

      <ul className="stats-list">
        {statsData.map(({ label, value, IconComponent, color }, idx) => (
          <li key={idx}>
            {IconComponent && <IconComponent className={`icon ${color || ''}`} />}{" "}
            <strong>{label}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicStatsCard;
