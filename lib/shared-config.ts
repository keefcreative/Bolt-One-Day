/**
 * Shared Configuration System
 * 
 * Manages configuration sharing between the main website and content-improver system.
 * Handles environment variables, paths, and common settings.
 */

import path from 'path';
import { promises as fs } from 'fs';

// Note: In Next.js, environment variables are loaded automatically
// No need to use dotenv in Next.js apps

export interface SharedConfig {
  // API Keys
  openai: {
    apiKey?: string;
    model: string;
    maxTokens: number;
  };
  
  freepik: {
    apiKey?: string;
    enabled: boolean;
  };
  
  replicate: {
    token?: string;
    enabled: boolean;
  };

  // Content System Settings
  content: {
    systemEnabled: boolean;
    autoBackup: boolean;
    qualityThreshold: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    maxImprovementsPerRun: number;
    reviewRequired: boolean;
    analyticsEnabled: boolean;
  };

  // Paths
  paths: {
    root: string;
    contentImprover: string;
    data: string;
    improvements: string;
    backups: string;
    logs: string;
  };

  // Integration
  integration: {
    webhookUrl?: string;
    webhookSecret?: string;
    enabled: boolean;
  };
}

/**
 * Create the shared configuration object
 */
function createSharedConfig(): SharedConfig {
  const rootPath = process.cwd();
  
  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000', 10)
    },

    freepik: {
      apiKey: process.env.FREEPIK_API_KEY,
      enabled: process.env.FREEPIK_API_KEY ? true : false
    },

    replicate: {
      token: process.env.REPLICATE_API_TOKEN,
      enabled: process.env.REPLICATE_API_TOKEN ? true : false
    },

    content: {
      systemEnabled: process.env.CONTENT_SYSTEM_ENABLED === 'true',
      autoBackup: process.env.CONTENT_AUTO_BACKUP !== 'false',
      qualityThreshold: parseInt(process.env.CONTENT_QUALITY_THRESHOLD || '75', 10),
      logLevel: (process.env.CONTENT_LOG_LEVEL as any) || 'info',
      maxImprovementsPerRun: parseInt(process.env.CONTENT_MAX_IMPROVEMENTS_PER_RUN || '50', 10),
      reviewRequired: process.env.CONTENT_REVIEW_REQUIRED !== 'false',
      analyticsEnabled: process.env.CONTENT_ANALYTICS_ENABLED !== 'false'
    },

    paths: {
      root: rootPath,
      contentImprover: path.join(rootPath, 'content-improver'),
      data: path.join(rootPath, 'data'),
      improvements: path.join(rootPath, 'content-improver', 'improvements'),
      backups: path.join(rootPath, 'content-improver', 'backups'),
      logs: path.join(rootPath, 'content-improver', 'logs')
    },

    integration: {
      webhookUrl: process.env.INTEGRATION_WEBHOOK_URL,
      webhookSecret: process.env.INTEGRATION_SECRET,
      enabled: process.env.INTEGRATION_WEBHOOK_URL ? true : false
    }
  };
}

/**
 * Shared configuration instance
 */
export const sharedConfig = createSharedConfig();

/**
 * Configuration utilities
 */
export const configUtils = {
  /**
   * Validate that required configuration is present
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!sharedConfig.openai.apiKey) {
      errors.push('OPENAI_API_KEY is required for content improvements');
    }

    if (!sharedConfig.content.systemEnabled) {
      errors.push('Content system is disabled (CONTENT_SYSTEM_ENABLED=false)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Get environment-specific configuration for content-improver
   */
  getContentImproverEnv(): Record<string, string> {
    return {
      OPENAI_API_KEY: sharedConfig.openai.apiKey || '',
      OPENAI_MODEL: sharedConfig.openai.model,
      OPENAI_MAX_TOKENS: sharedConfig.openai.maxTokens.toString(),
      FREEPIK_API_KEY: sharedConfig.freepik.apiKey || '',
      REPLICATE_API_TOKEN: sharedConfig.replicate.token || '',
      CONTENT_QUALITY_THRESHOLD: sharedConfig.content.qualityThreshold.toString(),
      CONTENT_LOG_LEVEL: sharedConfig.content.logLevel,
      CONTENT_MAX_IMPROVEMENTS_PER_RUN: sharedConfig.content.maxImprovementsPerRun.toString(),
      CONTENT_REVIEW_REQUIRED: sharedConfig.content.reviewRequired.toString(),
      CONTENT_ANALYTICS_ENABLED: sharedConfig.content.analyticsEnabled.toString(),
      NODE_ENV: process.env.NODE_ENV || 'development'
    };
  },

  /**
   * Write environment variables to content-improver .env file
   */
  async syncEnvironmentToContentImprover(): Promise<void> {
    const envVars = this.getContentImproverEnv();
    const envPath = path.join(sharedConfig.paths.contentImprover, '.env');
    
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile(envPath, envContent + '\n', 'utf-8');
  },

  /**
   * Ensure all required directories exist
   */
  async ensureDirectories(): Promise<void> {
    const dirs = [
      sharedConfig.paths.improvements,
      sharedConfig.paths.backups,
      sharedConfig.paths.logs
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  },

  /**
   * Get configuration summary for debugging
   */
  getSummary(): Record<string, any> {
    return {
      system: {
        enabled: sharedConfig.content.systemEnabled,
        qualityThreshold: sharedConfig.content.qualityThreshold,
        reviewRequired: sharedConfig.content.reviewRequired
      },
      apis: {
        openai: !!sharedConfig.openai.apiKey,
        freepik: sharedConfig.freepik.enabled,
        replicate: sharedConfig.replicate.enabled
      },
      paths: {
        root: sharedConfig.paths.root,
        contentImprover: sharedConfig.paths.contentImprover,
        data: sharedConfig.paths.data
      },
      integration: {
        webhookEnabled: sharedConfig.integration.enabled
      }
    };
  }
};

/**
 * Initialize shared configuration
 * Call this before using content integration features
 */
export async function initializeSharedConfig(): Promise<void> {
  // Validate configuration
  const validation = configUtils.validate();
  if (!validation.valid) {
    console.warn('Configuration validation failed:', validation.errors);
  }

  // Ensure directories exist
  await configUtils.ensureDirectories();

  // Sync environment to content-improver
  try {
    await configUtils.syncEnvironmentToContentImprover();
    console.log('✅ Environment synchronized to content-improver system');
  } catch (error) {
    console.warn('⚠️ Failed to sync environment to content-improver:', error);
  }
}

export default sharedConfig;