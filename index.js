const express = require('express');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const userAuth = require('./lib/userAuth');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const router = require('./config/router');

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

app.use(express.static(`${__dirname}/public`));

mongoose.connect('mongodb://localhost/blogposts-database');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride(req => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: 'PgsJe^814d69uovK3G)', // a random key used to encrypt the session cookie
  resave: false,
  saveUninitialized: false
}));

app.use(userAuth);

app.use(router);

app.use((err, req, res, next) => { // eslint-disable-line
  console.log(err);
  if(err.name === 'ValidationError') return res.render('pages/422');
  res.render('pages/500', { err });
});

app.listen(PORT, () => console.log(`Up and running on PORT ${PORT}`));
