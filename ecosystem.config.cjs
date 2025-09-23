module.exports = {
  apps: [
    {
      name: "aish-backend",
      cwd: "./backend",
      script: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 8100,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8100,
      },
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_file: "./logs/backend-combined.log",
      time: true,
    },
    {
      name: "aish-frontend",
      cwd: "./frontend",
      script: "yarn",
      args: "dev",
      instances: 1,
      env: {
        NODE_ENV: "development",
        PORT: 8200,
        BROWSER: "none",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8200,
      },
      watch: true,
    },
    {
      name: "aish-business",
      cwd: "./admin",
      script: "npx",
      args: "vite --host 0.0.0.0",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 8300,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8300,
      },
      watch: false,
      max_memory_restart: "1G",
      error_file: "./logs/admin-error.log",
      out_file: "./logs/admin-out.log",
      log_file: "./logs/admin-combined.log",
      time: true,
    },
  ],

  deploy: {
    production: {
      user: "node",
      host: "your-server.com",
      ref: "origin/main",
      repo: "your-repo-url",
      path: "/var/www/production",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
