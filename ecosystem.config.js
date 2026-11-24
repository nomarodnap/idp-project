module.exports = {
  apps: [
    {
      name: "idp-project",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      // เซิร์ฟเวอร์มี 8 vCPUs รัน 2 โปรเจกต์ -> กำหนด 4 instances (ครึ่งหนึ่งของ CPU) เพื่อให้รองรับทราฟฟิกได้เต็มที่โดยไม่แย่งทรัพยากรกัน
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,

      // ควบคุม Memory ต่อ Instance ป้องกัน Memory Leak
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=1024",

      // Graceful Shutdown & Zero-downtime Reload
      kill_timeout: 5000,
      listen_timeout: 10000,
      exp_backoff_restart_delay: 100, // ป้องกัน CPU พุ่ง 100% หากเกิด Crash loop

      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
