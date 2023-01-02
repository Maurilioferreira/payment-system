const { Op, col, between } = require("sequelize");
const sequelize = require("sequelize");

module.exports = {
  async profession(req, res) { 
    try {
      const {Job, Contract, Profile} = req.app.get('models')
      const {start, end} = req.query
      const sum = await Profile.findAll({
        limit: 1,
        subQuery:false,
        attributes: [
          'profession',
          [sequelize.fn('SUM', sequelize.col('Contractor->Jobs.price')), 'sum_jobs_paid'],
          'Contractor->Jobs.price'
        ],
        where: {
          type: 'contractor',
        },
        group: 'profession',
        order: [['sum_jobs_paid', 'DESC']],
        include: [{
          model: Contract, as: 'Contractor',
          attributes: ['id'],
          required: true,
          include: [{
            model: Job,
            attributes: ['id'],
            required: true,
            where: {
              paid:true,
              [Op.or]: [{
                paymentDate: {
                    [Op.between]: [start, end]
                }
              }]
            },
          }]
         }],
        //  
      })
      
      res.json(sum);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  async clients(req, res) {
    try {
      const {Job, Contract, Profile} = req.app.get('models')
      const {start, end, limit} = req.query
      const sum = await Profile.findAll({
        limit,
        // offset: 0,
        subQuery:false,
        attributes: [
          'firstName',
          [sequelize.fn('SUM', sequelize.col('Client->Jobs.price')), 'sum_jobs_paid'],
        ],
        where: {
          type: 'client',
        },
        group: 'profession',
        order: [['sum_jobs_paid', 'DESC']],
        include: [{
          model: Contract, as: 'Client',
          attributes: ['id'],
          required: true,
          include: [{
            model: Job,
            attributes: ['id'],
            required: true,
            where: {
              paid:true,
              [Op.or]: [{
                paymentDate: {
                    [Op.between]: [start, end]
                }
              }]
            },
          }]
         }],
        //  
      })
      
      res.json(sum);
      
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

};
