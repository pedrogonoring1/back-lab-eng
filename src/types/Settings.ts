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
};

export default Settings;
