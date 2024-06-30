module.exports = {
  apps: [
    {
      autorestart: true,
      cwd: './',
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      ignore_watch: ['node_modules', '.logs', 'dist'],
      instances: 1,
      max_memory_restart: '1G',
      name: '@vben/backend-mock',
      script: 'node dist/main.js',
      watch: false,
    },
  ],
};
