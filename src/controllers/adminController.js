const { Op } = require("sequelize");

module.exports = {
  async profession(req, res) { 
    try {
      const {Job, Contract, Profile} = req.app.get('models')
      const {start, end} = req.query
      console.log('start, end: ', start, end)
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const contracts = await Profile.findAll({
        where: {
          type: 'contractor',
        },
        // group: 'profession',
        order: [['profession']],
        include: [{
          model: Contract, as: 'Contractor',
          include: [{
            model: Job,
            required: true,
            where: {
              paid:true,
            },
          }]
         }]
      })
      const items = contracts;
      const groups = items.reduce((groups, item) => {
        const group = (groups[item.profession] || []);
        group.push(item);
        groups[item.profession] = group;
        return groups;
      }, {});
      
      console.log(typeof groups);
      const professions = []
      Object.keys(groups).forEach(propName => {
        console.log('propName => ', propName)
        console.log('propName => ', propName)

        // const sum = jobs.map(c => c.price).reduce((acc, cur) => acc + cur, 0)
        // professions.push({ propName: })
      });

      res.json(groups);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  async clients(req, res) {
    try {
      const {Contract} = req.app.get('models')
      const {start, end, limit} = req.query
      console.log('start, end, limit: ', start, end, limit)
      res.json({})
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

};
