const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
let http = require('http');
let fs = require('fs');
require('dotenv').config();
const path = require('path');
// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');
const {autosubmiturl}= require('./controllers/autosubmiturl')


const {getstatus} = require('./controllers/getstatus')

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
// app
const app = express();

// db
mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log(err);
    });




// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
// if (process.env.NODE_ENV === 'development') {
//     app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }

app.use(cors());
// routes middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);


  app.get('/',(req,res)=>{
      res.send("Server is running")
  })

  app.get('/addindex',(req,res)=>{
      const data= req.body.data

      const url= data.url
      const type= data.type

      console.log(url,type)

      autosubmiturl(url,type)
  })

  app.get('/deleteindex',(req,res)=>{
    const data= req.body.data

    const url= data.url
    const type= data.type

    autosubmiturl(url,type)

    console.log(url,type)
})

app.get('/viewindex',(req,res)=>{
    const data= req.body.data

    const url= data.url
    const type= data.type

    console.log(url,type)

})

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

admin.initializeApp();
