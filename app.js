const express = require('express');
const Helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();

const userRoutes = require('./routes/user'); 
const saucesRoutes = require('./routes/sauce') ;

const bddMongoose = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlv2b.mongodb.net/p6piquante?retryWrites=true&w=majority`

mongoose.connect(bddMongoose,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch(() => console.log('Connexion à MongoDB Atlas échouée !'));





app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json()); 
app.use(Helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);  


 

module.exports=app;