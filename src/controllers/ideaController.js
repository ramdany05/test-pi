const IdeaService = require('../services/ideaService');

module.exports = {
  async getThreeIdeaNamesByCriteria(req, res) {
    const { hobi, pekerjaan, lama_pengalaman, aset } = req.body;
    try {
      const ideaNames = await IdeaService.getThreeIdeaNamesByCriteria({ hobi, pekerjaan, lama_pengalaman, aset });
      res.json({
        status: "success",
        message: "Get ideas successfully",
        data: ideaNames,
        error: null
      });
    } catch (error) {
      res.json({ 
        status: "error",
        message: "Failed to get ideas",
        error: {
          code: "Error getting idea names by criteria",
          details: error.message
        }
      });
    }
  },
};
