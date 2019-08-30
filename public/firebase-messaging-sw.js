// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/3.9.0/firebase-app.js');
importScripts('/__/firebase/3.9.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');
importScripts('config.js');

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  

// This registration token comes from the client FCM SDKs.
var registrationToken = firebase.messaging().getToken();

var message = {
data: {
    score: '850',
    time: '2:45'
},
token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.

firebase.messaging().sendToDevice(registrationToken, message)
.then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
})
.catch((error) => {
    console.log('Error sending message:', error);
});