import React, { useEffect, useState } from 'react';
import DynamicDonut from '../../components/Donut/DynamicDonut';
import CertificateService from '../../services/certificateService';
import logger from '../../utils/logger';

export const CertDonut = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadDomainTrends = async () => {
      try {
        logger.info('Fetching certificate domain trends...');
        const res = await CertificateService.getDomainTrends();
        logger.debug('Raw domain trends:', res);

        setData(res); 
      } catch (error) {
        logger.error('Failed to fetch domain trends:', { error: error.message });
      }
    };

    loadDomainTrends();
  }, []);

  return (
    <DynamicDonut
      data={data}
      getName={item => item.domain}
      getValue={item => item.count}
      getYear={item => item.year}
      innerRadius={50}
      outerRadius={80}
      colors={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00ced1']}
      legendLayout="horizontal"
      legendAlign="center"
      legendVerticalAlign="bottom"
      title="Domain Breakdown"
    />
  );
};
