#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Set environment variable untuk Google Cloud credentials
export GOOGLE_APPLICATION_CREDENTIALS=./config/service-account.json

# Jika environment variable yang diperlukan ada, jalankan migrasi Prisma
if [[ -n "${DATABASE_URL}" ]]; then
  npx prisma generate
    npx prisma migrate deploy --preview-feature
else
    echo "ENV_VARIABLE belum diset, prisma migrate tidak dijalankan."
fi

# Jalankan aplikasi Node.js
exec npm run start
