import React, { useState, useEffect } from 'react';
import DynamicStatsCard from '../../components/StatsCard/StatsCard';
import CertificateService from '../../services/certificateService';
import {
  FaCertificate,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaClock,
  FaLayerGroup,
  FaCalendarCheck
} from "react-icons/fa";
import logger from '../../utils/logger';
import './cert_stats.css';

export const CertStatsCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        logger.info('Fetching certificate statistics from CertificateService...');
        const response = await CertificateService.getStats();
        logger.success('Certificate statistics fetched successfully', response);

        // Convert backend response to array format suitable for DynamicStatsCard
        const statsArray = [
          { label: "Total Certificates Issued", value: response.total_certificates, icon: FaCertificate, color: "FaCertificate" },
          { label: "Total Partners Certified", value: response.total_partners, icon: FaUsers, color: "FaUsers" },
          { label: "Top Certified Partner", value: response.top_partner, icon: FaArrowUp, color: "FaArrowUp" },
          { label: "Least Certified Partner", value: response.least_partner, icon: FaArrowDown, color: "FaArrowDown" },
          { label: "Certificates by Status", value: response.certificates_status, icon: FaChartLine, color: "FaChartLine" },
          { label: "Certificates Expiring Soon (90 days)", value: response.expiring_soon, icon: FaClock, color: "FaClock" },
          { label: "Certificates Completed This Month", value: response.completed_this_month, icon: FaCalendarCheck, color: "FaCalendarCheck" },
        ].filter(item => item.value !== null);
        
        setStats(statsArray);
      } catch (err) {
        logger.error('Failed to fetch certificate statistics', { error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading certificate statistics...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ width: 400, height: 300 }}>
      <DynamicStatsCard
        data={stats}
        title="Certificates Overview"
        width={400}
        height={300}
        getLabel={item => item.label}
        getValue={item => item.value}
        getIcon={item => item.icon}
        getColor={item => item.color}
      />
    </div>
  );
};
