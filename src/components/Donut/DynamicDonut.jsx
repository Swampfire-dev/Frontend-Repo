import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// ---------- Styles ----------
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start', 
  marginBottom: '1.3rem',    
  borderBottom: '1px solid #eee',
  paddingBottom: '2px',       
};
const titleStyle = { margin: 0, lineHeight: 1.2 }; 
const selectStyle = { padding: '2px 10px', fontSize: 14 };

const DynamicDonut = ({
  data = [],
  getName = item => item.name,
  getValue = item => item.value,
  getYear = item => item.year,

  height = 300,

  innerRadius = 50,
  outerRadius = 80,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],

  legendLayout = 'horizontal',
  legendAlign = 'center',
  legendVerticalAlign = 'bottom',
  legendIconSize = 14,

  title = '',
  className = ''
}) => {

  // Extract years + add "All"
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(data.map(getYear))).sort();
    return ["All Years", ...uniqueYears];
  }, [data, getYear]);

  const [selectedYear, setSelectedYear] = useState("All Years");

  // Filtering + Aggregation
  const filteredData = useMemo(() => {
    const filtered = selectedYear === "All Years"
      ? data
      : data.filter(item => getYear(item) === Number(selectedYear));

    const aggregated = {};

    filtered.forEach(item => {
      const name = getName(item);
      const val = getValue(item);

      if (!aggregated[name]) aggregated[name] = 0;
      aggregated[name] += val;
    });

    return Object.entries(aggregated).map(([name, value]) => ({
      name,
      value
    }));
  }, [data, selectedYear, getName, getValue, getYear]);

  if (!filteredData.length) {
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
    <div style={{ height }}>
      {/* ---------- Header: Title + Year Dropdown ---------- */}
      <div style={headerStyle}>
        {title && <h4 style={titleStyle}>{title}</h4>}

        {years.length > 1 && (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={selectStyle}
          >
            {years.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        )}
      </div>

      {/* ---------- Chart ---------- */}
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cx="50%"
            cy="50%"
            label={entry => `${entry.name}: ${entry.value}`}
          >
            {filteredData.map((entry, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>

          <Tooltip formatter={value => [value, '']} />
          <Legend
            layout={legendLayout}
            align={legendAlign}
            verticalAlign={legendVerticalAlign}
            iconSize={legendIconSize}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicDonut;