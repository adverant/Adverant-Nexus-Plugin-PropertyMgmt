export const config = {
  // Server
  port: parseInt(process.env.PORT || '9020', 10),
  host: process.env.HOST || '0.0.0.0',
  isDevelopment: process.env.NODE_ENV !== 'production',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://nexus:nexus@localhost:5432/nexus_property_mgmt',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://nexus:nexus@localhost:5672',

  // Nexus GraphRAG
  nexusApiUrl: process.env.NEXUS_API_URL || 'http://localhost:9001',

  // File Storage
  s3Bucket: process.env.S3_BUCKET || 'nexus-property-mgmt',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
};
