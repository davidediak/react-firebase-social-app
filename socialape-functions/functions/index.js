const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../socialape-a1ae6-firebase-adminsdk-oiea7-fd2da9ba35.json');
const express = require('express');

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://socialape.firebaseio.com'
  });
} else admin.initializeApp();

const app = express();

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);