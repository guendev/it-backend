module.exports = {
  apps: [
    {
      name: 'it-geto',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run start'
    }
  ]
}
