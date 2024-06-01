// src/controllers/feedController.js
const feedRepository = require('../repositories/feedRepository');

exports.getFeed = async (req, res) => {
    try {
        const feeds = await feedRepository.findAllFeeds();
        res.status(200).json(feeds);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching feeds", error: error.message });
    }
};
