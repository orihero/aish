# PM2 Ecosystem Configuration

This project includes PM2 ecosystem files for managing all applications in the job board system.

**Note**: Backend and Admin applications use `.cjs` extension for ecosystem files due to ES module compatibility requirements.

## Applications

- **Backend**: Node.js API server (Port 5000)
- **Frontend**: React application (Port 3000)  
- **Admin**: Vite-based React admin panel (Port 5173)

## Prerequisites

Install PM2 globally:
```bash
npm install -g pm2
```

## Usage

### Start All Applications
```bash
# Development mode
npm run pm2:start

# Production mode
npm run pm2:start:prod
```

### Individual Application Management

#### Backend Only
```bash
cd backend
pm2 start ecosystem.config.cjs
```

#### Frontend Only
```bash
cd frontend
pm2 start ecosystem.config.js
```

#### Admin Only
```bash
cd admin
pm2 start ecosystem.config.cjs
```

### PM2 Commands

```bash
# View status of all processes
npm run pm2:status

# View logs
npm run pm2:logs

# Restart all applications
npm run pm2:restart

# Reload all applications (zero-downtime)
npm run pm2:reload

# Stop all applications
npm run pm2:stop

# Delete all applications from PM2
npm run pm2:delete

# Monitor applications
npm run pm2:monit
```

### Log Files

Logs are stored in the following locations:
- Root logs: `./logs/`
- Backend logs: `./backend/logs/`
- Frontend logs: `./frontend/logs/`
- Admin logs: `./admin/logs/`

Each application has:
- `error.log` - Error logs
- `out.log` - Standard output logs
- `combined.log` - Combined logs

### Environment Variables

Each ecosystem file supports different environments:
- `development` - Default development settings
- `production` - Production settings

### Monitoring

Use `pm2 monit` to monitor:
- CPU usage
- Memory usage
- Process status
- Logs in real-time

### Auto-restart Configuration

All applications are configured with:
- Automatic restart on file changes (watch mode)
- Memory limit restart (1GB)
- Maximum restart attempts (10)
- Minimum uptime before restart (10 seconds)

### Deployment

The ecosystem files include deployment configurations for production environments. Update the deployment section with your server details:

```javascript
deploy: {
  production: {
    user: 'your-username',
    host: 'your-server.com',
    ref: 'origin/main',
    repo: 'your-repo-url',
    path: '/var/www/production',
    'post-deploy': 'npm install && pm2 reload ecosystem.config.cjs --env production'
  }
}
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 3000, 5000, and 5173 are available
2. **Memory issues**: Adjust `max_memory_restart` values in ecosystem files
3. **Watch issues**: Check file permissions and paths in watch configurations
4. **Environment variables**: Ensure `.env` files are properly configured

## Development vs Production

- **Development**: File watching enabled, detailed logging
- **Production**: Optimized for performance, minimal logging, auto-restart disabled
