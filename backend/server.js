require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(async () => {
    // Explicitly require all models to ensure they are registered before sync
    require('./models/User');
    require('./models/Income');
    require('./models/Expense');
    require('./models/Budget');
    require('./models/Goal');
    require('./models/Bill');
    require('./models/Subscription');
    require('./models/Loan');

    // Sync models
    await sequelize.sync({ alter: true }); // Safely alters tables to match updated models without dropping data
    console.log('Sequelize Models Synced');

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
});
