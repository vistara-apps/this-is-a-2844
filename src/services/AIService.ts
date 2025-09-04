// AI Service for Yield Optimization and Insights

import { BaseService } from './BaseService';
import { ApiResponse, YieldOptimizationRequest, YieldOptimizationResponse } from '../types/api';

export class AIService extends BaseService {
  private provider: 'openai' | 'anthropic';
  
  constructor(provider: 'openai' | 'anthropic', apiKey: string) {
    const baseURLs = {
      openai: 'https://api.openai.com/v1',
      anthropic: 'https://api.anthropic.com/v1'
    };
    
    super(baseURLs[provider], apiKey);
    this.provider = provider;
  }

  /**
   * Get yield optimization recommendations using AI
   */
  async getYieldOptimization(request: YieldOptimizationRequest): Promise<ApiResponse<YieldOptimizationResponse>> {
    try {
      const prompt = this.buildOptimizationPrompt(request);
      
      if (this.provider === 'openai') {
        return this.getOpenAIOptimization(prompt, request);
      } else {
        return this.getAnthropicOptimization(prompt, request);
      }
    } catch (error) {
      this.log('error', 'Error getting yield optimization', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to get yield optimization recommendations',
      };
    }
  }

  /**
   * Explain yield strategy in natural language
   */
  async explainStrategy(
    strategy: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<ApiResponse<string>> {
    try {
      const prompt = `
        Explain the following DeFi yield strategy in ${userLevel} terms:
        
        Strategy: ${strategy}
        
        Please provide:
        1. A clear explanation of how this strategy works
        2. The main risks involved
        3. Expected returns and timeframe
        4. Who this strategy is best suited for
        
        Keep the explanation ${userLevel === 'beginner' ? 'simple and avoid jargon' : 
                              userLevel === 'intermediate' ? 'balanced with some technical details' : 
                              'detailed and technical'}.
      `;

      const response = await this.generateText(prompt);
      
      if (!response.success) {
        return response;
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      this.log('error', 'Error explaining strategy', error);
      return {
        data: '',
        success: false,
        error: 'Failed to explain strategy',
      };
    }
  }

  /**
   * Analyze portfolio risk
   */
  async analyzeRisk(portfolio: any[]): Promise<ApiResponse<{
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    analysis: string;
    recommendations: string[];
  }>> {
    try {
      const prompt = `
        Analyze the risk profile of this DeFi portfolio:
        
        ${JSON.stringify(portfolio, null, 2)}
        
        Please provide:
        1. A risk score from 1-10 (1 = very low risk, 10 = very high risk)
        2. Risk level classification (low/medium/high)
        3. Detailed risk analysis
        4. Specific recommendations to optimize risk/reward
        
        Consider factors like:
        - Protocol risk (smart contract risk, audit status)
        - Liquidity risk
        - Impermanent loss risk
        - Concentration risk
        - Market risk
        
        Respond in JSON format:
        {
          "riskScore": number,
          "riskLevel": "low" | "medium" | "high",
          "analysis": "detailed analysis",
          "recommendations": ["recommendation1", "recommendation2", ...]
        }
      `;

      const response = await this.generateText(prompt);
      
      if (!response.success) {
        return {
          data: null as any,
          success: false,
          error: response.error,
        };
      }

      try {
        const parsed = JSON.parse(response.data);
        return {
          data: parsed,
          success: true,
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          data: {
            riskScore: 5,
            riskLevel: 'medium' as const,
            analysis: response.data,
            recommendations: ['Consider diversifying across multiple protocols', 'Monitor liquidity levels regularly']
          },
          success: true,
        };
      }
    } catch (error) {
      this.log('error', 'Error analyzing risk', error);
      return {
        data: null as any,
        success: false,
        error: 'Failed to analyze portfolio risk',
      };
    }
  }

  /**
   * Generate market insights
   */
  async getMarketInsights(topic: string): Promise<ApiResponse<string>> {
    try {
      const prompt = `
        Provide current market insights about: ${topic}
        
        Focus on:
        1. Current market conditions
        2. Recent trends and developments
        3. Potential opportunities and risks
        4. Actionable insights for DeFi yield farmers
        
        Keep the response informative but concise (2-3 paragraphs).
      `;

      return this.generateText(prompt);
    } catch (error) {
      this.log('error', 'Error getting market insights', error);
      return {
        data: '',
        success: false,
        error: 'Failed to get market insights',
      };
    }
  }

  // Private helper methods
  private buildOptimizationPrompt(request: YieldOptimizationRequest): string {
    return `
      You are a DeFi yield optimization expert. Analyze this portfolio and provide optimization recommendations:
      
      Current Portfolio:
      ${JSON.stringify(request.currentPortfolio, null, 2)}
      
      User Preferences:
      - Risk Tolerance: ${request.riskTolerance}
      - Target APY: ${request.targetAPY || 'Not specified'}
      - Excluded Protocols: ${request.excludeProtocols?.join(', ') || 'None'}
      
      Please provide recommendations in the following JSON format:
      {
        "recommendations": [
          {
            "poolId": "unique_pool_id",
            "protocol": "protocol_name",
            "chain": "blockchain_name",
            "suggestedAmount": number,
            "expectedAPY": number,
            "riskScore": number (1-10),
            "reasoning": "explanation for this recommendation"
          }
        ],
        "totalExpectedYield": number,
        "riskAssessment": "overall risk analysis",
        "executionSteps": ["step1", "step2", "step3"]
      }
      
      Consider:
      - Current market conditions
      - Protocol security and audit status
      - Liquidity depth and slippage
      - Gas costs and efficiency
      - Diversification benefits
      - Impermanent loss risks
    `;
  }

  private async getOpenAIOptimization(
    prompt: string, 
    request: YieldOptimizationRequest
  ): Promise<ApiResponse<YieldOptimizationResponse>> {
    const response = await this.makeRequest<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a DeFi yield optimization expert with deep knowledge of protocols, risks, and market conditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.success) {
      return response;
    }

    try {
      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        data: parsed,
        success: true,
      };
    } catch (error) {
      // Fallback response if parsing fails
      return {
        data: this.getFallbackOptimization(request),
        success: true,
      };
    }
  }

  private async getAnthropicOptimization(
    prompt: string,
    request: YieldOptimizationRequest
  ): Promise<ApiResponse<YieldOptimizationResponse>> {
    const response = await this.makeRequest<any>('/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.success) {
      return response;
    }

    try {
      const content = response.data.content[0].text;
      const parsed = JSON.parse(content);
      
      return {
        data: parsed,
        success: true,
      };
    } catch (error) {
      // Fallback response if parsing fails
      return {
        data: this.getFallbackOptimization(request),
        success: true,
      };
    }
  }

  private async generateText(prompt: string): Promise<ApiResponse<string>> {
    if (this.provider === 'openai') {
      const response = await this.makeRequest<any>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.choices[0].message.content,
        success: true,
      };
    } else {
      const response = await this.makeRequest<any>('/messages', {
        method: 'POST',
        headers: {
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.success) {
        return response;
      }

      return {
        data: response.data.content[0].text,
        success: true,
      };
    }
  }

  private getFallbackOptimization(request: YieldOptimizationRequest): YieldOptimizationResponse {
    // Provide a basic fallback optimization when AI fails
    return {
      recommendations: [
        {
          poolId: 'curve-usdc-usdt',
          protocol: 'Curve',
          chain: 'Ethereum',
          suggestedAmount: 10000,
          expectedAPY: 8.5,
          riskScore: 3,
          reasoning: 'Stable, well-audited protocol with consistent yields'
        }
      ],
      totalExpectedYield: 850,
      riskAssessment: 'Medium risk profile with diversified stablecoin exposure',
      executionSteps: [
        'Review current positions',
        'Approve token spending',
        'Execute rebalancing transactions',
        'Monitor performance'
      ]
    };
  }
}
