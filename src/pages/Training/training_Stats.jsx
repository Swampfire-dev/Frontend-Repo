import React, { useState, useEffect } from 'react';
import DynamicStatsCard from '../../components/StatsCard/StatsCard';
import TrainingService from '../../services/trainingService';
import {
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaLayerGroup,
  FaCalendarCheck,
  FaCheckCircle,
  FaHourglassHalf,
  FaStar,
} from "react-icons/fa";
import logger from '../../utils/logger';
import './training_stats.css';

export const TrainingStatsCard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        logger.info('Fetching training statistics from TrainingService...');
        const response = await TrainingService.getStats();
        logger.success('Training statistics fetched successfully', response);

        let statsArray = [];

        if ('total_employees_trained' in response) {
          // ------------------------
          // MANAGER STATS
          // ------------------------
          statsArray = [
            { label: "Total Employees Trained", value: response.total_employees_trained, icon: FaUsers, color: "FaUsers" },
            { label: "Total Trainings Assigned", value: response.total_trainings_assigned, icon: FaLayerGroup, color: "FaLayerGroup" },
            { label: "Total Trainings Completed", value: response.total_trainings_completed, icon: FaCheckCircle, color: "FaCheckCircle" },
            { label: "Ongoing Trainings", value: response.ongoing_trainings, icon: FaHourglassHalf, color: "FaHourglassHalf" },
            { label: "Completed This Month", value: response.completed_this_month, icon: FaCalendarCheck, color: "FaCalendarCheck" },

            {
              label: "Top Performer",
              value: response.top_performing_employee
                ? `${response.top_performing_employee.name} - ${response.top_performing_employee.psa_id} (${response.top_performing_employee.completed_trainings})`
                : null,
              icon: FaArrowUp,
              color: "FaArrowUp"
            },

            {
              label: "Least Performer",
              value: response.least_trained_employee
                ? `${response.least_trained_employee.name} - ${response.least_trained_employee.psa_id} (${response.least_trained_employee.completed_trainings})`
                : null,
              icon: FaArrowDown,
              color: "FaArrowDown"
            },

            { label: "Overall Completion Rate", value: response.overall_completion_rate, icon: FaChartLine, color: "FaChartLine" },

            {
              label: "Most Popular Training",
              value: response.most_popular_training
                ? `${response.most_popular_training.title} (${response.most_popular_training.completions})`
                : null,
              icon: FaStar,
              color: "FaStar"
            },

          ];
        }


        // Filter out null or undefined values
        statsArray = statsArray.filter(item => item.value !== null && item.value !== undefined);

        setStats(statsArray);
      } catch (err) {
        logger.error('Failed to fetch training statistics', { error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading training statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: 400, height: 'auto' }}>
      <DynamicStatsCard
        data={stats}
        title="Training Overview"
        width={400}
        height={300}
        getLabel={item => item.label}
        getValue={item => item.value}
        getIcon={item => item.icon}
      />
    </div>
  );
};
