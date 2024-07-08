// services/ideaService.js
const IdeaRepository = require('../repositories/ideaRepository');

module.exports = {
  async getThreeIdeaNamesByCriteria(criteria) {
    try {
      const ideaNames = await IdeaRepository.getThreeIdeasNamesByCriteria(criteria);
      return ideaNames; 
    } catch (error) {
      throw new Error('Failed to fetch idea names by criteria');
    }
  }
};
