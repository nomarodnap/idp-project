module.exports = {
  apps: [
    {
      name: "idp-project",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 3, // สามารถเปลี่ยนเป็น "max" เพื่อเปิดใช้งาน Cluster Mode (ใช้ CPU ทุก Core)
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      }
    }
  ]
};
