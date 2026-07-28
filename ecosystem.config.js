module.exports = {
  apps: [
    {
      name: "idp-project",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1, // สามารถเปลี่ยนเป็น "max" เพื่อเปิดใช้งาน Cluster Mode (ใช้ CPU ทุก Core)
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        // ถ้าต้องการแก้ Port หรือตั้งค่า ENV อื่นๆ เฉพาะตอนรันสามารถใส่เพิ่มตรงนี้ได้
        // PORT: 3000,
      }
    }
  ]
};
