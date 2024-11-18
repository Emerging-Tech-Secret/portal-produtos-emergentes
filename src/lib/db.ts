import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { z } from 'zod';

let rdsClient: RDSDataClient | null = null;
let isUsingMockData = true;

// Initialize RDS client only if all required environment variables are present
const requiredEnvVars = [
  'VITE_AWS_REGION',
  'VITE_AURORA_ARN',
  'VITE_AURORA_SECRET_ARN',
  'VITE_AURORA_DATABASE'
];

const hasAllEnvVars = requiredEnvVars.every(varName => !!import.meta.env[varName]);

if (hasAllEnvVars) {
  try {
    rdsClient = new RDSDataClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: fromEnv()
    });
    isUsingMockData = false;
  } catch (error) {
    console.warn('Failed to initialize RDS client, falling back to mock data:', error);
    isUsingMockData = true;
  }
} else {
  console.warn('Missing required environment variables for RDS connection, using mock data');
}

const dbConfig = {
  resourceArn: import.meta.env.VITE_AURORA_ARN,
  secretArn: import.meta.env.VITE_AURORA_SECRET_ARN,
  database: import.meta.env.VITE_AURORA_DATABASE,
};

export async function executeQuery<T>(
  sql: string,
  parameters: any[] = [],
  schema?: z.ZodType<T>
): Promise<T[]> {
  // If mock data is being used, return empty array to allow services to fall back to mock data
  if (isUsingMockData) {
    return [];
  }

  try {
    if (!rdsClient) {
      throw new Error('RDS client not initialized');
    }

    const command = new ExecuteStatementCommand({
      ...dbConfig,
      sql,
      parameters: parameters.map(param => ({ value: { stringValue: String(param) } })),
    });

    const response = await rdsClient.send(command);
    
    if (!response.records) {
      return [];
    }

    const results = response.records.map(record => {
      const obj: any = {};
      record.forEach((field, index) => {
        const columnName = response.columnMetadata?.[index].name || `column${index}`;
        obj[columnName] = field.stringValue || field.longValue || field.booleanValue;
      });
      return obj;
    });

    if (schema) {
      return results.map(result => schema.parse(result));
    }

    return results as T[];
  } catch (error) {
    console.warn('Database query error:', error);
    return [];
  }
}

export function isUsingMockDatabase(): boolean {
  return isUsingMockData;
}