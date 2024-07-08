# Gunakan node image yang cocok dengan versi Anda
FROM node:21.4.0

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json (jika ada) ke dalam direktori kerja
COPY package*.json ./

# Install dependensi npm
RUN npm install --production

# Salin kode aplikasi Anda ke dalam direktori kerja
COPY . .

# Salin file kredensial Google Cloud ke dalam container
COPY src/config/service-account.json src/config/service-account.json


COPY src/models/ideas.json src/models/ideas.json

# Expose port yang digunakan oleh aplikasi Express
EXPOSE ${PORT}
EXPOSE 8080

# Jalankan perintah saat container dimulai menggunakan bash
CMD /bin/bash -c 'if [ -n "${DATABASE_URL}" ]; then npx prisma generate && npx prisma migrate deploy --preview-feature; else echo "ENV_VARIABLE belum diset, prisma migrate tidak dijalankan."; fi && exec npm run start'
