import {
  createCertificate,
  fetchCertificates,
  fetchCertificateDetails,
  fetchPartnerCertificates,
  fetchCertificateStats,
  fetchCertificateTrends,
  fetchCertificateDomainTrends,
} from '../api/certificationApi';
import logger from '../utils/logger';

class CertificateService {
  // 1. Create a new certificate
  static async create(certificateData) {
    logger.info('CertificateService.create called', { certificateData });

    try {
      const newCertificate = await createCertificate(certificateData);
      logger.success('CertificateService.create succeeded', { newCertificate });
      return newCertificate;
    } catch (error) {
      logger.error('CertificateService.create failed', { error: error.message, certificateData });
      throw new Error(`Failed to create certificate: ${error.message}`);
    }
  }

  // 2. Fetch the list of certificates
  static async getAll() {
    logger.info('CertificateService.getAll called');

    try {
      const certificates = await fetchCertificates();
      logger.success('CertificateService.getAll succeeded', { certificates });
      return certificates;
    } catch (error) {
      logger.error('CertificateService.getAll failed', { error: error.message });
      throw new Error(`Failed to fetch certificates: ${error.message}`);
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

  static async getStats() {
    logger.info('CertificateStatsService.getStats called');

    try {
      const stats = await fetchCertificateStats();
      logger.success('CertificateStatsService.getStats succeeded', { stats });
      return stats;
    } catch (error) {
      logger.error('CertificateStatsService.getStats failed', { error: error.message });
      throw new Error(`Failed to fetch certificate statistics: ${error.message}`);
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

export default CertificateService;
