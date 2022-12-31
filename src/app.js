const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./models/model')
const {getProfile} = require('./middleware/getProfile')
const contractRoutes = require('./routes/contract.routes')
const jobRoutes = require('./routes/job.routes')
const balanceRoutes = require('./routes/balance.routes')
const adminController = require('./routes/admin.routes')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use("/contracts", getProfile, contractRoutes)
app.use("/jobs", getProfile, jobRoutes)
app.use("/balances", getProfile, balanceRoutes)
app.use("/admin", getProfile, adminController)

module.exports = app;
