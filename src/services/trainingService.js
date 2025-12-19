import {
  createTraining,
  fetchTraining,
  fetchTrainingStats,
  fetchCertificateDetails,
  fetchPartnerCertificates,

  fetchCertificateTrends,
  fetchCertificateDomainTrends,
} from '../api/trainingApi';
import logger from '../utils/logger';

class TrainingService {

  // 1. Create a new training
  static async create(trainingData) {
    logger.info('TrainingService.create called', { trainingData });

    try {
      const newTraining = await createTraining(trainingData);
      logger.success('TrainingService.create succeeded', { newTraining });
      return newTraining;
    } catch (error) {
      logger.error('TrainingService.create failed', { error: error.message, trainingData });
      throw new Error(`Failed to create certificate: ${error.message}`);
    }
  }

  // 2. Fetch the list of certificates
  static async getAll() {
    logger.info('TrainingService.getAll called');

    try {
      const training = await fetchTraining();
      logger.success('TrainingService.getAll succeeded', { training });
      return training;
    } catch (error) {
      logger.error('TrainingService.getAll failed', { error: error.message });
      throw new Error(`Failed to fetch training: ${error.message}`);
    }
  }


    // 3. Fetch training stats for a specific partner/for all partner
  static async getStats() {
    logger.info('TrainingService.getStats called');

    try {
      const stats = await fetchTrainingStats();
      logger.success('TrainingService.getStats succeeded', { stats });
      return stats;
    } catch (error) {
      logger.error('TrainingService.getStats failed', { error: error.message });
      throw new Error(`Failed to fetch training statistics: ${error.message}`);
    }
  }

  // 3. Fetch details of a specific certificate by ID
  static async getById(certId) {
    logger.info('CertificateService.getById called', { certId });

    try {
      const certificate = await fetchCertificateDetails(certId);
      logger.success('CertificateService.getById succeeded', { certificate });
      return certificate;
    } catch (error) {
      logger.error('CertificateService.getById failed', { certId, error: error.message });
      throw new Error(`Failed to fetch certificate details: ${error.message}`);
    }
  }

  // 4. Fetch certificates for a specific partner (PSA ID)
  static async getByPartner(psaId) {
    logger.info('CertificateService.getByPartner called', { psaId });

    try {
      const partnerCertificates = await fetchPartnerCertificates(psaId);
      logger.success('CertificateService.getByPartner succeeded', { partnerCertificates });
      return partnerCertificates;
    } catch (error) {
      logger.error('CertificateService.getByPartner failed', { psaId, error: error.message });
      throw new Error(`Failed to fetch partner certificates: ${error.message}`);
    }
  }



  // Fetch certificate statistics
  static async getTrends() {
    logger.info('CertificateService.getStats called');
    try {
      const stats = await fetchCertificateTrends();
      logger.success('CertificateService.getStats succeeded', { stats });
      return stats;
    } catch (error) {
      logger.error('CertificateService.getStats failed', { error: error.message });
      throw new Error(`Failed to fetch certificate stats: ${error.message}`);
    }
  }

  // Fetch certificate statistics
  static async getDomainTrends() {
    logger.info('CertificateService.getDomainTrends called');
    try {
      const stats = await fetchCertificateDomainTrends();
      logger.success('CertificateService.getDomainTrends succeeded', { stats });
      return stats;
    } catch (error) {
      logger.error('CertificateService.getDomainTrends failed', { error: error.message });
      throw new Error(`Failed to fetch certificate domain stats: ${error.message}`);
    }
  }

}

export default TrainingService;
