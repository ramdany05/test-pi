// repositories/ideaRepository.js
const ideas = require('../models/ideas.json');

module.exports = {
  getAllIdeas() {
    return ideas;
  },
  getThreeIdeasNamesByCriteria(criteria) {
    const { hobi, pekerjaan, lama_pengalaman, aset } = criteria;
    const filteredIdeas = ideas.filter(idea =>
      idea.hobi === hobi &&
      idea.pekerjaan === pekerjaan &&
      idea.lama_pengalaman === lama_pengalaman &&
      idea.aset === aset
    );
    
    if (filteredIdeas.length === 0) {
      throw new Error('No matching ideas found for the given criteria');
    }
    
    const ideaNames = filteredIdeas.slice(0, 3).map(idea => idea.ide_bisnis); 
    return ideaNames;
  }
};
