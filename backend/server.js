require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/auth.routes.js');
const petRoutes = require('./routes/pet.routes.js');
const applicationRoutes = require('./routes/application.routes.js');
const favouriteRoutes = require('./routes/favourite.routes.js');
const reportRoutes = require('./routes/report.routes.js');
const userRoutes = require('./routes/user.routes.js');
const { notFound, errorHandler } = require('./middleware/error.middleware.js');

const app = express();
const PORT = process.env.PORT || 4000;

// allow the React app to call this API
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PawHome API' });
});

app.use('/', authRoutes);
app.use('/', petRoutes);
app.use('/', applicationRoutes);
app.use('/', favouriteRoutes);
app.use('/', reportRoutes);
app.use('/', userRoutes);

// these two must be after all the routes
app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
    console.log('PawHome server started on port ' + PORT);
});
