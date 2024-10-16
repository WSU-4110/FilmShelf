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


exports.getCommentById = functions.https.onRequest(async (req, res) => {
    const id = req.params[0];

    console.log("Received ID:", id);

    if (!id) {
        console.error("No ID found in request.");
        return res.status(400).send('Comment ID is required.');
    }

    try {
        const commentDoc = await admin.firestore().collection('comments').doc(id).get();

        if (!commentDoc.exists) {
            console.warn(`Comment with ID ${id} not found.`);
            return res.status(404).send(`No comment found with ID: ${id}`);
        }

        console.log("Comment data:", commentDoc.data());
        res.status(200).json({ id: commentDoc.id, ...commentDoc.data() });
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
