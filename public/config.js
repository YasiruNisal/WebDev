//	<!--Configure firebase-->
var config = {
  apiKey: "AIzaSyBmd-sLLqJITFnCU8sbbu1e1TVfo13d0HE",
  authDomain: "testauth-fd2f0.firebaseapp.com",
  databaseURL: "https://testauth-fd2f0.firebaseio.com",
  projectId: "testauth-fd2f0",
  storageBucket: "testauth-fd2f0.appspot.com",
  messagingSenderId: "559340214095",
  appId: "1:559340214095:web:8a2fa6b1040df39a"
};

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}