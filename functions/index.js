const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

// Trigger when a new user (donor) is created or updated
// For this example, let's assume we listen to a new 'inventory' collection
// or when a user updates their profile to be a donor.
// Here is a function that triggers when a new item is added to 'inventory'
exports.onInventoryAdded = onDocumentCreated("inventory/{inventoryId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    return;
  }
  const inventoryItem = snapshot.data();
  const bloodType = inventoryItem.bloodType;
  const location = inventoryItem.location;

  console.log(`New inventory added: ${bloodType} in ${location}`);

  // Query the watchlists collection for matching requests
  // We want to find users who are watching for this blood type
  // and are in the same location (or no location specified)
  try {
    const watchlistsRef = db.collection('watchlists');
    
    // Complex queries might require composite indexes
    // For simplicity, let's query by bloodType and filter in code for location if needed
    // or assume exact match on location
    const q = watchlistsRef
      .where('bloodType', '==', bloodType)
      .where('status', '==', 'active');

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log('No matching watchlists found.');
      return;
    }

    const notifications = [];
    querySnapshot.forEach((doc) => {
      const watchlist = doc.data();
      
      // Check location match (if watchlist has location, it must match)
      if (watchlist.location && 
          (!location || !location.toLowerCase().includes(watchlist.location.toLowerCase()))) {
        return; 
      }

      // Prepare notification
      // Note: You need to store the user's FCM token in their user profile to send notifications
      // Let's assume we can look up the user's FCM token
      const promise = db.collection('users').doc(watchlist.userId).get()
        .then(userDoc => {
          if (userDoc.exists && userDoc.data().fcmToken) {
            const token = userDoc.data().fcmToken;
            
            const message = {
              notification: {
                title: 'Blood Type Match Found!',
                body: `${bloodType} blood is now available in ${location}. Contact the hospital immediately.`
              },
              token: token
            };

            return getMessaging().send(message)
              .then((response) => {
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
              });
          }
        });
      
      notifications.push(promise);
    });

    await Promise.all(notifications);
    
  } catch (error) {
    console.error("Error processing inventory trigger:", error);
  }
});
