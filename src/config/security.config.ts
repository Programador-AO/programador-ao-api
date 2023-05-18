export default () => {
  const { NODE_ENV, THROTTLING_TTL, THROTTLING_LIMIT } = process.env;
  const env = NODE_ENV ?? 'development';

  const config = {
    production: {
      ttl: THROTTLING_TTL ?? '',
      limit: THROTTLING_LIMIT ?? '',
    },
    development: {
      ttl: 60,
      limit: 10000,
    },
  }[env];

  return config ?? {};
};
