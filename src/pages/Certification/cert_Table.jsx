import React, { useState, useEffect } from 'react';
import DynamicTable from '../../components/Table/DynamicTable';
import CertificateService from '../../services/certificateService';
import { useAuth } from '../../context/AuthContext';
import logger from '../../utils/logger';

export const CertificateTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: userLoading } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        logger.info('Fetching certificates from CertificateService...');

        const response = await CertificateService.getAll();
        logger.success('Certificates fetched successfully', response);

        const flattenedData = flattenData(response);
        logger.debug('Flattened certificate data:', flattenedData);

        setData(flattenedData);
      } catch (err) {
        logger.error('Failed to fetch certificates', { error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
        logger.info('Finished loading certificates');
      }
    };

    getData();
  }, []);

  const flattenData = (data) => {
    return data.map(item => ({
      partner_name: item.partner.name,
      partner_psa_id: item.partner.psa_id,
      certificate_id: item.certificate.certificate_id,
      certificate_name: item.certificate.certificate_name,
      issued_by: item.certificate.issued_by,
      certificate_level: item.certificate.certificate_level,
      description: item.certificate.description,
      issued_date: item.metadata.issued_date,
      expiry_date: item.metadata.expiry_date,
      status: item.metadata.status,
      credential_url: item.metadata.credential_url,
      certificate_file: item.metadata.certificate_file,
      domain: item.certificate.domain,
    }));
  };

  if (loading || userLoading) return <div>Loading certificates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <DynamicTable
        data={data}
        columns={columns}
        filterableKeys={['status', 'year', 'domain']}
        recordsPerPage={10}
        title="Certificate Table"
        showSearch={user?.role === "MANAGER"}
        searchColumn="partner_psa_id"
        dateKey="issued_date"
      />
    </div>
  );
};

// Table columns
const columns = [
  { key: 'partner_name', label: 'PARTNER' },
  { key: 'partner_psa_id', label: 'PSA ID' },
  { key: 'certificate_id', label: 'CERTIFICATE ID' },
  { key: 'certificate_name', label: 'CERTIFICATE NAME' },
  { key: 'domain', label: 'DOMAIN' },
  { key: 'issued_date', label: 'ISSUED DATE' },
  { key: 'status', label: 'STATUS' },
];
