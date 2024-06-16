# Gunakan node image yang cocok dengan versi Anda
FROM node:21

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json (jika ada) ke dalam direktori kerja
COPY package*.json ./

# Install dependensi npm
RUN npm install --production

# Salin kode aplikasi Anda ke dalam direktori kerja
COPY . .

# Expose port yang digunakan oleh aplikasi Express
EXPOSE ${PORT}
EXPOSE 8080

# Salin skrip entry point ke dalam container
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Definisikan entry point
ENTRYPOINT ["docker-entrypoint.sh"]
