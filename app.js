const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const userRoutes = require('./routes/user'); 
const saucesRoutes = require('./routes/sauce') ;

mongoose.connect('mongodb+srv://mel:CeDMeL0803@cluster0.nlv2b.mongodb.net/p6piquante?retryWrites=true&w=majority',
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

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);  


 

module.exports=app;