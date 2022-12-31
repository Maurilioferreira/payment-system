const { Op } = require("sequelize");

module.exports = {
  async all(req, res) { 
    try {
      const {Contract} = req.app.get('models')
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const contracts = await Contract.findAll({
        where: {
          status: {
            [Op.ne]: 'terminated'
          },
          [Op.or]: [
            { ContractorId: profileId },
            { ClientId: profileId }
          ],
        }
      })
      res.json(contracts);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  async one(req, res) {
    /**
     * FIX ME!
     * @returns contract by id
     */
    try {
      const {Contract} = req.app.get('models')
      const {id} = req.params
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const contract = await Contract.findOne({where: {id}})
      // console.log('profile => ', req.profile); // to see all data user
      if(id != profileId) return res.status(401).end()
      if(!contract) return res.status(404).end()
      res.json(contract)
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
