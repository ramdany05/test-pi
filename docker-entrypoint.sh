#!/bin/bash

# Jika environment variable yang diperlukan ada, jalankan migrasi Prisma
if [[ -n "${DATABASE_URL}" ]]; then
  npx prisma generate
    npx prisma migrate deploy --preview-feature
else
    echo "ENV_VARIABLE belum diset, prisma migrate tidak dijalankan."
fi

# Jalankan aplikasi Node.js
exec npm run start
