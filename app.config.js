module.exports = {
  name: 'Fitness Tracker',
  slug: 'fitness-tracker',
  web: { bundler: 'metro', output: 'single' },
  experiments: { baseUrl: process.env.PAGES_BASE_PATH || '' },
};
