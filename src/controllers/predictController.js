const modelService = require('../services/modelService');
const tf = require('@tensorflow/tfjs-node');


exports.predict = async (req, res) => {
    try {
        const model = await modelService.loadModel();   
        const { hobi, pekerjaan, lama_pengalaman, aset, ide_bisnis } = req.body;
        const input = { hobi, pekerjaan, lama_pengalaman, aset, ide_bisnis };
        const prediction = await modelService.predict(model, input);
        res.json({ prediction });
    } catch (error) {
        console.error('Error in prediction:', error);
        res.status(500).send('Internal Server Error');
    }
};