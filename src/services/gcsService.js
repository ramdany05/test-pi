const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = 'feed_service';

async function uploadfileToGCS(file) {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            resolve(`https://storage.googleapis.com/${bucketName}/${file.originalname}`);
        });

        blobStream.end(file.buffer);
    });
}

module.exports = uploadfileToGCS;
