module.exports = {
  apps: [
    {
      name: 'it-backend',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run start:prod'
    }
  ]
}
