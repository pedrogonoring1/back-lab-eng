type Settings = {
  port: number;
  mongodb: {
    url: string;
  };
  logger: {
    level: string;
  };
  version: string;
  environment?: string;
  secret: string;
};

export default Settings;
