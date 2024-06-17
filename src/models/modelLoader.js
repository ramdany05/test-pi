const tf = require('@tensorflow/tfjs-node');

exports.loadModel = async () => {
    try {
        const model = await tf.loadLayersModel('file:///home/radit/coooodeeee/bangkit/pandoe-web-service/src/models/save/saved_model.pb');
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Failed to load model', error);
        throw error;
    }
};