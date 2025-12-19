import React, { useState, useEffect } from 'react';
import DynamicTable from '../../components/Table/DynamicTable';
import TrainingService from '../../services/trainingService';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

export const TrainingTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: userLoading } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        logger.info('Fetching training from TrainingService...');

        const response = await TrainingService.getAll();
        logger.success('Training fetched successfully', response);

        const flattenedData = flattenData(response);
        logger.debug('Flattened training data:', flattenedData);

        setData(flattenedData);
      } catch (err) {
        logger.error('Failed to fetch training', { error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
        logger.info('Finished loading training');
      }
    };

    getData();
  }, []);

  const flattenData = (data) => {
    return data.map(item => ({
      partner_psa_id: item.partner_psa_id,
      training_title: item.training_title,
      training_type: item.training_type,
      status: item.status,
      learning_hours: item.learning_hours,
      start_date: item.start_date,
      end_date: item.end_date,
      last_accessed: item.last_accessed,
      domain: item.domain,
    }));
  };

  if (loading || userLoading) return <div>Loading Trainings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <DynamicTable
        data={data}
        columns={columns}
        filterableKeys={['status', 'year', 'domain']}
        recordsPerPage={10}
        title="Training Table"
        showSearch={user?.role === "MANAGER"}
        searchColumn="partner_psa_id"
        dateKey="start_date"
      />
    </div>
  );
};

// Table columns
const columns = [
  { key: 'partner_psa_id', label: 'PSA ID' },
  { key: 'training_title', label: 'TRAINING' },
  { key: 'training_type', label: 'TRAINING TYPE' },
  { key: 'status', label: 'STATUS' },
  { key: 'start_date', label: 'START DATE' },
  { key: 'end_date', label: 'END DATE' },
  { key: 'last_accessed', label: 'LAST ACCESSED' },
  { key: 'domain', label: 'DOMAIN' },
];
