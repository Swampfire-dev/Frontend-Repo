import React, { useMemo, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ---------- Styles ----------
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start', 
  marginBottom: '0.6rem',
  borderBottom: '1px solid #eee',
  paddingBottom: '2px',
};

const titleStyle = { margin: 0, lineHeight: 1.2 };
const selectStyle = { padding: '2px 10px', fontSize: 14 };

// ---------- Random color generator ----------
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// ---------- Custom Tooltip ----------
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
      {payload[0]?.payload?.xLabel && (
        <p><strong>{payload[0].payload.xLabel}</strong></p>
      )}
      {payload.map(entry => (
        <p key={entry.name} style={{ margin: 0 }}>
          <span style={{ color: entry.fill }}>{entry.name}: </span>
          {entry.value}
        </p>
      ))}
    </div>
  );
};

// ---------- Dynamic Trends Chart ----------
const DynamicTrendsChart = ({
  data = [],
  xKey = 'xLabel',
  barKeys = [],
  lineKeys = [],
  height = 400,
  title = '',
  colors = {},
  stacked = false,
  yearKey = '', // field in data representing date or year
}) => {
  const [selectedYear, setSelectedYear] = useState('');

  // Extract unique years
  const years = useMemo(() => {
    if (!yearKey) return [];
    const uniqueYears = new Set();
    data.forEach(d => {
      if (d[yearKey]) {
        const date = new Date(d[yearKey]);
        const year = isNaN(date.getFullYear()) ? d[yearKey] : date.getFullYear();
        uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => a - b);
  }, [data, yearKey]);

  // Filter data by selected year
  const filteredData = useMemo(() => {
    if (!yearKey || !selectedYear) return data;
    return data.filter(d => {
      const date = new Date(d[yearKey]);
      const year = isNaN(date.getFullYear()) ? d[yearKey] : date.getFullYear();
      return year.toString() === selectedYear;
    });
  }, [data, selectedYear, yearKey]);

  // Auto-detect keys for bars/lines
  const allKeys = useMemo(() => {
    const keys = new Set();
    filteredData.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== xKey && k !== yearKey) keys.add(k);
      });
    });
    return Array.from(keys);
  }, [filteredData, xKey, yearKey]);

  const barsToRender = barKeys.length ? barKeys : allKeys;
  const linesToRender = lineKeys;

  // Generate color map
  const colorMap = useMemo(() => {
    const map = {};
    [...barsToRender, ...linesToRender].forEach(key => {
      map[key] = colors[key] || getRandomColor();
    });
    return map;
  }, [barsToRender, linesToRender, colors]);

  return (
    <div style={{ height }}>
      <div style={headerStyle}>
        {title && <h4 style={titleStyle}>{title}</h4>}

        {years.length > 0 && (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}
      </div>

      {/* ---------- Chart Container ---------- */}
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={filteredData}
          margin={{ top: 20, right: 30, bottom: -10, left: -10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />

          {barsToRender.map(key => (
            <Bar
              key={key}
              dataKey={key}
              fill={colorMap[key]}
              name={key}
              stackId={stacked ? 'stack' : undefined}
              barSize={20}
            />
          ))}

          {linesToRender.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorMap[key]}
              name={key}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicTrendsChart;
