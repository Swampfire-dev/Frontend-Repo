import React, { useEffect, useState } from "react";
import DynamicTrendsChart from "../../components/TrendChart/TrendChart";
import CertificateService from "../../services/certificateService";
import logger from "../../utils/logger";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatTrends = (data) => {
  return Object.entries(data).map(([key, value]) => {
    const [year, month] = key.split("-");
    const monthIndex = parseInt(month, 10) - 1;

    return {
      month: MONTH_NAMES[monthIndex],
      year: parseInt(year),
      Certifications: value.cert_count || 0,
      Partners: value.partner_count || 0,
      issued_date: `${year}-${month}-01`,
    };
  });
};

export const CertTrendsWrapper = () => {
  const [chartData, setChartData] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        logger.info("Fetching certificate trends...");
        const res = await CertificateService.getTrends(); 
        logger.debug("Trend API Raw Response:", res);

        const formatted = formatTrends(res);
        logger.debug("Formatted Trend Data:", formatted);

        setChartData(formatted);
        setIsManager(Object.values(res).some(v => v.partner_count > 1));
      } catch (error) {
        logger.error("Failed to load certificate trends:", { error: error.message });
      }
    };

    loadTrends();
  }, []);

  const barKeys = ["Certifications"];
  const lineKeys = isManager ? ["Partners"] : [];

  return (
    <DynamicTrendsChart
      data={chartData}
      xKey="month"
      barKeys={barKeys}
      lineKeys={lineKeys}
      title="Monthly Certificate Trends"
      stacked={false}
      yearKey="issued_date"
      colors={{ Certifications: "#8884d8", Partners: "#82ca9d" }}
      tooltipFormatter={(item) => `${item.value} ${item.dataKey}`}
      height={450}
    />
  );
};
