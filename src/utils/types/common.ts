type db = {
  type: 'mysql' | 'mariadb';
  port: number;
  database: string;
  host: string;
  username: string;
  password: string;
  timezone: string;
  synchronize: boolean;
};

type server = {
  port: number;
};

enum ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

type ApiResponse<T> = {
  success: boolean;
  status?: number;
  message?: string;
  data: T;
};

export { db, server, ENV, ApiResponse };
