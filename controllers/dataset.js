//Import Internal Dependencies
const Loader = require('../models/loader.js');

module.exports = {
    dataset: async (req, res) => {
       user = req.query.username
       dataset = await Loader.find({ $or:[ {'user':user}, {'shared':true} ]})
       res.status(200).json({dataset});
    },
}