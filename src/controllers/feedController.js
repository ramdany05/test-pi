const feedRepository = require('../repositories/feedRepository');

exports.createFeed = async (req, res) => {
    const { executiveSummary, thumbnail, pitchDeck, amountRaised, endDate } = req.body;
    if (!executiveSummary || !thumbnail || !pitchDeck || !amountRaised || !endDate) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            data: null,
            error: {
                code: 'MISSING_FIELDS',
                details: 'Some required fields are missing.'
            }
        });
    }

    const feedData = {
        userId: req.user.id,
        executiveSummary,
        thumbnail,
        pitchDeck,
        amountRaised,
        endDate
    };

    try {
        const newFeed = await feedRepository.createFeed(feedData);
        res.status(201).json({
            status: 'success',
            message: 'Feed created successfully',
            data: newFeed,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating feed',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const feeds = await feedRepository.findAllFeeds();
        res.status(200).json({
            status: 'success',
            message: 'Feeds fetched successfully',
            data: feeds,
            error: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching feeds',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};

exports.getFeedById = async (req, res) => {
    const feedId = req.params.id;
    try {
        const feed = await feedRepository.findFeedById(feedId);
        if (feed) {
            res.status(200).json({
                status: 'success',
                message: 'Feed fetched successfully',
                data: feed,
                error: null
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Feed not found',
                data: null,
                error: {
                    code: 'NOT_FOUND',
                    details: 'The feed with the specified ID was not found.'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the feed',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};

exports.updateFeed = async (req, res) => {
    const feedId = req.params.id;
    const { executiveSummary, thumbnail, pitchDeck, amountRaised, endDate } = req.body;

    if (!executiveSummary || !thumbnail || !pitchDeck || !amountRaised || !endDate) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            data: null,
            error: {
                code: 'MISSING_FIELDS',
                details: 'Some required fields are missing.'
            }
        });
    }

    const feedData = {
        userId: req.user.id,
        executiveSummary,
        thumbnail,
        pitchDeck,
        amountRaised,
        endDate
    };

    try {
        const feed = await feedRepository.findFeedById(feedId);
        if (feed) {
            if (feed.userId !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You are not authorized to update this feed',
                    data: null,
                    error: {
                        code: 'UNAUTHORIZED',
                        details: 'You can only update your own feeds.'
                    }
                });
            }
            const updatedFeed = await feedRepository.updateFeed(feedId, feedData);
            res.status(200).json({
                status: 'success',
                message: 'Feed updated successfully',
                data: updatedFeed,
                error: null
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Feed not found',
                data: null,
                error: {
                    code: 'NOT_FOUND',
                    details: 'The feed with the specified ID was not found.'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating the feed',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};

exports.deleteFeed = async (req, res) => {
    const feedId = req.params.id;

    try {
        const feed = await feedRepository.findFeedById(feedId);
        if (feed) {
            if (feed.userId !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You are not authorized to delete this feed',
                    data: null,
                    error: {
                        code: 'UNAUTHORIZED',
                        details: 'You can only delete your own feeds.'
                    }
                });
            }
            await feedRepository.deleteFeedById(feedId);
            res.status(200).json({
                status: 'success',
                message: 'Feed deleted successfully',
                data: null,
                error: null
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Feed not found',
                data: null,
                error: {
                    code: 'NOT_FOUND',
                    details: 'The feed with the specified ID was not found.'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the feed',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};
