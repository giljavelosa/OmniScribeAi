module.exports = {
  apps: [{
    name: 'omniscribe-staging',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/home/omniscribe/omniscribeai/app',
    max_restarts: 3,
    kill_timeout: 5000,
    treekill: true,
    env: {
      NODE_ENV: 'production',
      PORT: '3000'
    }
  }]
};
