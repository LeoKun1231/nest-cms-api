declare namespace NodeJS {
  interface ProcessEnv extends ENV {}
}

interface ENV {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_PORT: number;
  APP_ENV: string;
  DB_HOST: string;
  DB_PORT: number;

  DB_USERNAME: string;
  DB_DATABASE: string;
  DB_PASSWORD: string;

  DB_SYNC: boolean;

  LOG_LEVEL: string;
  TIMESTAMP: boolean;

  LOG_ON: boolean;

  JWT_PUBLIC_KEY: string;

  JWT_PRIVATE_KEY: string;

  JWT_ACCESS_TOKEN_EXPIRES_IN: string;
  JWT_REFRESH_TOKEN_EXPIRES_IN: string;
}
