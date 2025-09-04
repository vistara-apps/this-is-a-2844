// Yield Optimization Service - Core Business Logic

import { Pool, UserWallet } from '../data/mockData';
import { AIService } from './AIService';
import { AirstackService } from './AirstackService';
import { YieldOptimizationRequest, YieldOptimizationResponse } from '../types/api';

export interface OptimizationSettings {
  riskTolerance: 'low' | 'medium' | 'high';
  targetAPY?: number;
  maxSlippage: number;
  excludeProtocols?: string[];
  minLiquidity: number;
  diversificationLevel: 'low' | 'medium' | 'high';
}

export interface OptimizationResult {
  recommendations: Array<{
    poolId: string;
    protocol: string;
    chain: string;
    currentAmount: number;
    suggestedAmount: number;
    expectedAPY: number;
    riskScore: number;
    reasoning: string;
    action: 'deposit' | 'withdraw' | 'rebalance';
    priority: number;
  }>;
  totalExpectedYield: number;
  currentYield: number;
  yieldImprovement: number;
  riskAssessment: string;
  executionSteps: string[];
  gasCostEstimate: number;
}

export class YieldOptimizationService {
  private aiService: AIService;
  private airstackService: AirstackService;

  constructor(
    aiProvider: 'openai' | 'anthropic' = 'openai',
    aiApiKey: string,
    airstackApiKey: string
  ) {
    this.aiService = new AIService(aiProvider, aiApiKey);
    this.airstackService = new AirstackService(airstackApiKey);
  }

  /**
   * Main optimization function that analyzes portfolio and provides recommendations
   */
  async optimizeYield(
    currentPortfolio: UserWallet[],
    availablePools: Pool[],
    settings: OptimizationSettings
  ): Promise<OptimizationResult> {
    try {
      // Step 1: Analyze current portfolio
      const currentAnalysis = this.analyzeCurrentPortfolio(currentPortfolio);
      
      // Step 2: Filter and score available pools
      const scoredPools = await this.scoreAndFilterPools(availablePools, settings);
      
      // Step 3: Generate optimization recommendations
      const recommendations = await this.generateRecommendations(
        currentPortfolio,
        scoredPools,
        settings
      );
      
      // Step 4: Use AI for enhanced insights
      const aiEnhancedRecommendations = await this.enhanceWithAI(
        currentPortfolio,
        recommendations,
        settings
      );
      
      // Step 5: Calculate expected outcomes
      const outcomes = this.calculateExpectedOutcomes(
        currentAnalysis,
        aiEnhancedRecommendations
      );
      
      return {
        recommendations: aiEnhancedRecommendations,
        totalExpectedYield: outcomes.totalExpectedYield,
        currentYield: currentAnalysis.totalYield,
        yieldImprovement: outcomes.yieldImprovement,
        riskAssessment: outcomes.riskAssessment,
        executionSteps: outcomes.executionSteps,
        gasCostEstimate: outcomes.gasCostEstimate,
      };
      
    } catch (error) {
      console.error('Error in yield optimization:', error);
      throw new Error('Failed to optimize yield');
    }
  }

  /**
   * Analyze current portfolio to understand existing positions
   */
  private analyzeCurrentPortfolio(portfolio: UserWallet[]) {
    const totalBalance = portfolio.reduce(
      (sum, wallet) => sum + wallet.balanceUsdc + wallet.balanceOtherStablecoins,
      0
    );
    
    const chainDistribution = portfolio.reduce((acc, wallet) => {
      acc[wallet.chain] = (acc[wallet.chain] || 0) + wallet.balanceUsdc + wallet.balanceOtherStablecoins;
      return acc;
    }, {} as Record<string, number>);
    
    // Estimate current yield (simplified calculation)
    const estimatedCurrentYield = totalBalance * 0.05; // Assume 5% average yield
    
    return {
      totalBalance,
      chainDistribution,
      totalYield: estimatedCurrentYield,
      diversificationScore: this.calculateDiversificationScore(chainDistribution),
    };
  }

  /**
   * Score and filter pools based on optimization settings
   */
  private async scoreAndFilterPools(
    pools: Pool[],
    settings: OptimizationSettings
  ): Promise<Array<Pool & { score: number; riskScore: number }>> {
    const filteredPools = pools.filter(pool => {
      // Filter by minimum liquidity
      if (pool.liquiditySize < settings.minLiquidity) return false;
      
      // Filter by excluded protocols
      if (settings.excludeProtocols?.includes(pool.protocol)) return false;
      
      // Filter by target APY if specified
      if (settings.targetAPY && pool.currentAPY < settings.targetAPY) return false;
      
      return true;
    });

    return filteredPools.map(pool => {
      const riskScore = this.calculatePoolRiskScore(pool);
      const score = this.calculatePoolScore(pool, settings, riskScore);
      
      return {
        ...pool,
        score,
        riskScore,
      };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate risk score for a pool (1-10, where 10 is highest risk)
   */
  private calculatePoolRiskScore(pool: Pool): number {
    let riskScore = 5; // Base risk score
    
    // Protocol risk assessment
    const protocolRiskScores: Record<string, number> = {
      'Aave': 2,
      'Compound': 2,
      'Curve': 3,
      'Uniswap V3': 4,
      'Balancer': 4,
      'SushiSwap': 5,
    };
    
    riskScore = protocolRiskScores[pool.protocol] || 5;
    
    // Liquidity risk - lower liquidity = higher risk
    if (pool.liquiditySize < 10000000) riskScore += 2;
    else if (pool.liquiditySize < 50000000) riskScore += 1;
    
    // APY risk - unusually high APY might indicate higher risk
    if (pool.currentAPY > 20) riskScore += 2;
    else if (pool.currentAPY > 15) riskScore += 1;
    
    // Chain risk
    const chainRiskScores: Record<string, number> = {
      'Ethereum': 0,
      'Base': 1,
      'Arbitrum': 1,
      'Polygon': 2,
      'Optimism': 1,
    };
    
    riskScore += chainRiskScores[pool.chain] || 2;
    
    return Math.min(Math.max(riskScore, 1), 10);
  }

  /**
   * Calculate overall score for a pool based on settings
   */
  private calculatePoolScore(
    pool: Pool,
    settings: OptimizationSettings,
    riskScore: number
  ): number {
    let score = 0;
    
    // APY weight (40% of score)
    score += (pool.currentAPY / 20) * 40; // Normalize to 20% max APY
    
    // Risk adjustment (30% of score)
    const riskTolerance = { low: 3, medium: 6, high: 9 }[settings.riskTolerance];
    const riskPenalty = Math.max(0, riskScore - riskTolerance) * 5;
    score -= riskPenalty;
    
    // Liquidity bonus (20% of score)
    score += Math.min((pool.liquiditySize / 100000000) * 20, 20);
    
    // Volume bonus (10% of score)
    score += Math.min((pool.volume24h / 50000000) * 10, 10);
    
    return Math.max(score, 0);
  }

  /**
   * Generate optimization recommendations
   */
  private async generateRecommendations(
    currentPortfolio: UserWallet[],
    scoredPools: Array<Pool & { score: number; riskScore: number }>,
    settings: OptimizationSettings
  ) {
    const recommendations = [];
    const totalBalance = currentPortfolio.reduce(
      (sum, wallet) => sum + wallet.balanceUsdc + wallet.balanceOtherStablecoins,
      0
    );
    
    // Determine diversification strategy
    const targetPools = this.selectTargetPools(scoredPools, settings.diversificationLevel);
    
    // Calculate optimal allocation
    const allocations = this.calculateOptimalAllocation(totalBalance, targetPools, settings);
    
    for (const allocation of allocations) {
      const pool = allocation.pool;
      const currentAmount = this.getCurrentAmountInPool(currentPortfolio, pool);
      
      if (allocation.targetAmount > currentAmount + 100) { // $100 minimum threshold
        recommendations.push({
          poolId: pool.poolId,
          protocol: pool.protocol,
          chain: pool.chain,
          currentAmount,
          suggestedAmount: allocation.targetAmount,
          expectedAPY: pool.currentAPY,
          riskScore: pool.riskScore,
          reasoning: `High yield opportunity (${pool.currentAPY.toFixed(1)}% APY) with acceptable risk level`,
          action: 'deposit' as const,
          priority: allocation.priority,
        });
      } else if (currentAmount > allocation.targetAmount + 100) {
        recommendations.push({
          poolId: pool.poolId,
          protocol: pool.protocol,
          chain: pool.chain,
          currentAmount,
          suggestedAmount: allocation.targetAmount,
          expectedAPY: pool.currentAPY,
          riskScore: pool.riskScore,
          reasoning: `Rebalance to optimize risk/reward ratio`,
          action: 'withdraw' as const,
          priority: allocation.priority,
        });
      }
    }
    
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Enhance recommendations with AI insights
   */
  private async enhanceWithAI(
    currentPortfolio: UserWallet[],
    recommendations: any[],
    settings: OptimizationSettings
  ) {
    try {
      const aiRequest: YieldOptimizationRequest = {
        currentPortfolio: currentPortfolio.map(wallet => ({
          chain: wallet.chain,
          token: 'USDC',
          amount: wallet.balanceUsdc + wallet.balanceOtherStablecoins,
        })),
        riskTolerance: settings.riskTolerance,
        targetAPY: settings.targetAPY,
        excludeProtocols: settings.excludeProtocols,
      };
      
      const aiResponse = await this.aiService.getYieldOptimization(aiRequest);
      
      if (aiResponse.success) {
        // Merge AI recommendations with our algorithmic recommendations
        return this.mergeRecommendations(recommendations, aiResponse.data.recommendations);
      }
      
      return recommendations;
    } catch (error) {
      console.warn('AI enhancement failed, using algorithmic recommendations:', error);
      return recommendations;
    }
  }

  /**
   * Helper methods
   */
  private calculateDiversificationScore(chainDistribution: Record<string, number>): number {
    const values = Object.values(chainDistribution);
    const total = values.reduce((sum, val) => sum + val, 0);
    const normalized = values.map(val => val / total);
    
    // Calculate Herfindahl-Hirschman Index (lower = more diversified)
    const hhi = normalized.reduce((sum, share) => sum + share * share, 0);
    
    // Convert to 0-100 score (higher = more diversified)
    return Math.round((1 - hhi) * 100);
  }

  private selectTargetPools(
    scoredPools: Array<Pool & { score: number; riskScore: number }>,
    diversificationLevel: 'low' | 'medium' | 'high'
  ) {
    const poolCounts = { low: 2, medium: 4, high: 6 };
    const targetCount = poolCounts[diversificationLevel];
    
    return scoredPools.slice(0, targetCount);
  }

  private calculateOptimalAllocation(
    totalBalance: number,
    targetPools: Array<Pool & { score: number; riskScore: number }>,
    settings: OptimizationSettings
  ) {
    const totalScore = targetPools.reduce((sum, pool) => sum + pool.score, 0);
    
    return targetPools.map((pool, index) => ({
      pool,
      targetAmount: (pool.score / totalScore) * totalBalance,
      priority: index + 1,
    }));
  }

  private getCurrentAmountInPool(portfolio: UserWallet[], pool: Pool): number {
    // Simplified - in reality, you'd track specific pool positions
    const chainWallet = portfolio.find(w => w.chain === pool.chain);
    return chainWallet ? (chainWallet.balanceUsdc + chainWallet.balanceOtherStablecoins) * 0.1 : 0;
  }

  private calculateExpectedOutcomes(currentAnalysis: any, recommendations: any[]) {
    const totalExpectedYield = recommendations.reduce(
      (sum, rec) => sum + (rec.suggestedAmount * rec.expectedAPY / 100),
      0
    );
    
    const yieldImprovement = totalExpectedYield - currentAnalysis.totalYield;
    
    return {
      totalExpectedYield,
      yieldImprovement,
      riskAssessment: 'Balanced risk profile with optimized yield potential',
      executionSteps: [
        'Review recommendations',
        'Approve token spending',
        'Execute rebalancing transactions',
        'Monitor performance',
      ],
      gasCostEstimate: recommendations.length * 50, // $50 per transaction estimate
    };
  }

  private mergeRecommendations(algorithmic: any[], ai: any[]) {
    // Simple merge strategy - prefer AI recommendations but keep algorithmic as fallback
    const merged = [...ai];
    
    // Add algorithmic recommendations that aren't covered by AI
    for (const algoRec of algorithmic) {
      const exists = ai.some(aiRec => aiRec.poolId === algoRec.poolId);
      if (!exists) {
        merged.push(algoRec);
      }
    }
    
    return merged;
  }
}
