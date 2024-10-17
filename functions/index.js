/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors')({ origin: true });
const apiKey='75376fc32c70731a3eb507d65789e638'

exports.getUserData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
      const { uid } = req.query;

      console.log("Received UID:", uid);

      if (!uid) {
          console.error("No UID found in the request.");
          return res.status(400).send('User ID (UID) is required.');
      }
      try {
          const userDoc = await admin.firestore().collection('users').doc(uid).get();

          if (!userDoc.exists) {
              console.warn(`User with UID ${uid} not found.`);
              return res.status(404).send(`No user found with UID: ${uid}`);
          }

          console.log("User data:", userDoc.data());
          res.status(200).json({ id: userDoc.id, ...userDoc.data() });
      } catch (error) {
          console.error('Error fetching user data:', error);
          res.status(500).send('Internal Server Error');
      }
  });
});

exports.getPopularMovies = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&certification.lte=PG-13&certification.gte=G&sort_by=popularity.desc&vote_count.gte=1`);
      const data = await response.json();
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: data.status_message });
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
