const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class FeedRepository {
    async findAllFeeds() {
        try {
            return await prisma.fundingFeed.findMany();
        } catch (error) {
            console.log("Error finding all feeds: ", error);
            throw error;
        }
    }
}

module.exports = new FeedRepository();