import pm2 from "pm2";

pm2.start({
  name: 'wbp-api',
      script: `./src/api/index.js`,
      interpreter: 'babel-node',
      max_memory_restart: `${process.env.WEB_MEMORY || 512}M`,
      exec_mode: 'fork',
      instances: process.env.WEB_CONCURRENCY || -1
});