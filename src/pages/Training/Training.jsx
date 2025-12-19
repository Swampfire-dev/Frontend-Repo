import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './training_dashboard.module.css';
import { TrainingTable } from './training_table';
import { MandatoryTraining } from './mandatoryTraining';
import { TrainingStatsCard } from './training_Stats';

const Training = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Authenticating user...</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Top row */}
      <div className={`${styles.card} ${styles.cardTop1}`}>
        <TrainingStatsCard />
      </div>

      <div className={`${styles.card} ${styles.cardTop2}`}><h1>Second</h1></div>
      <div className={`${styles.card} ${styles.cardTop3}`}><h1>Third</h1></div>

      {/* Middle row: stacked left (1fr) + large right (3fr) */}
      <div className={styles.cardMidLeft}>
        <div className={styles.card}><h1>Fourth</h1></div>
        <div className={styles.card}><h1>Fifth</h1></div>
      </div>
      <div className={`${styles.card} ${styles.cardMidRight}`}><h1>Sixth</h1></div>

      {/* Bottom row */}
      <div className={`${styles.card} ${styles.cardBottom}`}>
        <TrainingTable />
      </div>

    </div>
  );
};

export default Training;
