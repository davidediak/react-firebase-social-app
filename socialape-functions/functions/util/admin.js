const admin = require('firebase-admin');
const serviceAccount = require('../../socialape-a1ae6-firebase-adminsdk-oiea7-fd2da9ba35.json');

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://socialape.firebaseio.com'
  });
} else admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
