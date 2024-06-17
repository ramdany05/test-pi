const modelLoader = require('../models/modelLoader');

exports.loadModel = async()=>{
    try {
        const model = await modelLoader.loadModel();
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}


exports.predict = async (model, input) => {
    const { hobi, pekerjaan, lama_pengalaman, aset, ide_bisnis } = input;

    const inputTensor = tf.tensor2d([
        [hobi, pekerjaan, lama_pengalaman, aset, ide_bisnis]
    ]);

    const prediction = model.predict(inputTensor);
    return prediction.arraySync();
};