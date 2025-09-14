module.exports = {
  apps: [
    {
      name: 'frontend-react',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        BROWSER: 'none'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: ['src', 'public'],
      ignore_watch: ['node_modules', 'build', 'logs'],
      watch_options: {
        followSymlinks: false
      },
      max_memory_restart: '1G',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'your-repo-url',
      path: '/var/www/production/frontend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
