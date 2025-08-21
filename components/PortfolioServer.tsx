import { loadPortfolioProjects } from '@/lib/portfolioLoader';
import PortfolioClient from './PortfolioClient';

export default function PortfolioServer() {
  // Load portfolio data server-side
  const portfolioData = loadPortfolioProjects();
  
  return <PortfolioClient portfolioData={portfolioData} />;
}