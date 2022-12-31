const { Op } = require("sequelize");

module.exports = {
  async deposit(req, res) {
    try {
      const {Job, Contract, Profile} = req.app.get('models')
      const {userId} = req.params
      const {depositValue} = req.body
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const balanceClient = (req.profile && req.profile.dataValues) ? req.profile.dataValues.balance : null;
      if(userId != profileId) return res.status(401).end()

      console.log('userId: ', userId)
      const contracts = await Contract.findAll({
        where: {
          status: 'in_progress',
          [Op.and]: [
            { ClientId: profileId }
          ],
        },
        include: [{
          model: Job,
          where: {
            paid: null,
          },
         }]
      })
      const jobs = (contracts[0] && contracts[0].Jobs) ? contracts[0].Jobs : []
      const sum = jobs.map(c => c.price).reduce((acc, cur) => acc + cur, 0)
      const allowedValue = ( sum * 25 ) / 100

      if(depositValue <= allowedValue){
        const newBalance = parseFloat((balanceClient + depositValue).toFixed(2))
        Profile.update({ balance: newBalance }, {
          where: {
            id: profileId
          }
        })
      } else {
        return res.status(400).json({error: "You can only deposit 25% of the total value of your jobs."})
      }

      res.json({message: 'sucess'});
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
