module.exports = {
  apps: [{
    name: 'quote-bot',
    script: './src/bot.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    wait_ready: true,
    listen_timeout: 10000,
    max_restarts: 10,
    max_memory_restart: '50M',
    log_file: 'quote-bot.log',
    merge_logs: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
