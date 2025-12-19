import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CertStatsCard } from './cert_Stats';
import { CertDonut } from './cert_Donut';
import { CertTrendsWrapper } from './cert_TrendChart';
import { CertificateTable } from './cert_Table';
import styles from './cert_dashboard.module.css';   // ✅ import as styles

const Certification = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Authenticating user...</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* First row */}
      <div className={styles.firstRow}>
        <div className={`${styles.card} ${styles.cardStats}`}>
          <CertStatsCard />
        </div>

        <div className={`${styles.card} ${styles.cardDonuts}`}>
          <CertDonut />
        </div>

        <div className={`${styles.card} ${styles.cardTrends}`}>
          <CertTrendsWrapper />
        </div>
      </div>

      {/* Second row */}
      <div className={styles.secondRow}>
        <div className={styles.tableCard}>
          <CertificateTable />
        </div>
      </div>

    </div>
  );
};

export default Certification;
