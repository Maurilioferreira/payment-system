const { Op } = require("sequelize");

module.exports = {
  async unpaid(req, res) { 
    try {
      const {Job, Contract} = req.app.get('models')
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const jobs = await Job.findAll({
        where: {
          paid: null,
        },
        include: [{
          model: Contract,
          where: {
            status: 'in_progress',
            [Op.or]: [
              { ContractorId: profileId },
              { ClientId: profileId }
            ],
          }
         }]
      })
      res.json(jobs);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  async pay(req, res) {
    try {
      const {Job, Contract, Profile} = req.app.get('models')
      const {job_id} = req.params
      // const {amount} = req.body
      const profileId = (req.profile && req.profile.dataValues) ? req.profile.dataValues.id : null;
      const balanceClient = (req.profile && req.profile.dataValues) ? req.profile.dataValues.balance : null;
      const type = (req.profile && req.profile.dataValues) ? req.profile.dataValues.type : null;
      if(type != 'client') return res.status(400).json({error: "only client can pay"})
      
      const job = await Job.findOne({
        where: {id: job_id},
        include: [{
          model: Contract
        }]
      })
      
      if(job.Contract.ClientId != profileId) return res.status(401).end()
      if(job.Contract.status != 'in_progress') return res.status(400).json({error: "contract is not in progress"})

      if(balanceClient >= job.price){
        const {price} = job;
        const {ContractorId} = job.Contract;
        const newBalance = parseFloat((balanceClient - price).toFixed(2))
        const contractor = await Profile.findOne({where: {id:ContractorId}})
        if(!contractor) return res.status(400).json({error: "We need one contractor"})
        Profile.update({ balance: newBalance }, {
          where: {
            id: profileId
          }
        }).then(function (result) {
          const balanceContractor = contractor.balance;
          const newBalanceContractor = parseFloat((balanceContractor + price).toFixed(2))
          Profile.update({ balance: newBalanceContractor }, {
            where: {
              id: ContractorId
            }
          }).then(function (result) {
            console.log('Done');
          }).catch(function () {
            // if have a problem return the old value
            Profile.update({ balance: balanceClient }, {
              where: {
                id: profileId
              }
            })
          })
        });
        
        res.json({message: 'sucess'});
      } else {
        return res.status(400).json({error: "you don't have enough balance"})
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

};


// const formatterUSD = new Intl.NumberFormat('en-US', {
//   maximumSignificantDigits: 2,
//   // style: 'currency',
//   // currency: 'USD'
// });
//const newBalance = formatterUSD.format(balance - job.price)