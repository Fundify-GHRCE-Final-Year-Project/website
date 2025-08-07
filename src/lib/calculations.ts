import { Project, Investment } from '@/types/global';

/**
 * Calculate funding percentage for a project
 */
export const calculateFundingPercentage = (project: Project): number => {
  if (project.goal === 0) return 0;
  return Math.min((project.funded / project.goal) * 100, 100);
};

/**
 * Calculate remaining funding needed
 */
export const calculateRemainingFunding = (project: Project): number => {
  return Math.max(project.goal - project.funded, 0);
};

/**
 * Calculate milestone percentages
 */
export const calculateMilestonePercentages = (milestones: number): number[] => {
  if (milestones <= 1) return [100];
  
  const percentages: number[] = [];
  const step = 100 / milestones;
  
  for (let i = 1; i <= milestones; i++) {
    percentages.push(Math.round(step * i));
  }
  
  return percentages;
};

/**
 * Calculate total invested amount for a user
 */
export const calculateTotalInvested = (investments: Investment[]): number => {
  return investments.reduce((total, investment) => total + investment.amount, 0);
};

/**
 * Calculate total defunded amount for a user
 */
export const calculateTotalDefunded = (investments: Investment[]): number => {
  return investments.reduce((total, investment) => total + investment.defunded, 0);
};

/**
 * Calculate net investment (invested - defunded)
 */
export const calculateNetInvestment = (investments: Investment[]): number => {
  return calculateTotalInvested(investments) - calculateTotalDefunded(investments);
};

/**
 * Format ETH amount with proper decimals
 */
export const formatEthAmount = (amount: number): string => {
  return `${amount.toFixed(4)} ETH`;
};

/**
 * Format percentage with proper decimals
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Calculate days remaining for a project (dummy function)
 */
export const calculateDaysRemaining = (project: Project): number => {
  // This would typically use project.endDate
  // For now, return a random number between 1-30
  return Math.floor(Math.random() * 30) + 1;
};

/**
 * Calculate project status
 */
export const getProjectStatus = (project: Project): 'active' | 'funded' | 'ended' => {
  if (project.ended) return 'ended';
  if (project.funded >= project.goal) return 'funded';
  return 'active';
}; 