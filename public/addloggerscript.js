const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var access, company, logger, username;
const storageService = firebase.storage().ref();




//==========================================================//
firebase.auth().onAuthStateChanged(user=>
{   
    
    // If this is just an ID token refresh we exit.
    if (user && this.currentUid === user.uid) {
        return;
    }
    // Remove all Firebase realtime database listeners.
    if (this.listeners) {
        this.listeners.forEach(function(ref) {
        ref.off();
        });
    }
    this.listeners = [];

    if(user)
    {
        $('#email').append("Email :  " + firebase.auth().currentUser.email);
        firebase.auth().currentUser.getIdTokenResult(true).then((idTokenResult) =>{
            if(idTokenResult.claims.manager)
            {
                $('#accesslevel').append("Manager");
                showManagerUI();
            }
            else if(idTokenResult.claims.distributor)
            {
                $('#accesslevel').append("Distributor");
                showDistributorUI();
            }
            else
            {
                $('#accesslevel').append("Employee");
                showEmployeeUI();
            }
        })
        .catch((error) => {
            console.log(error);
        });

        var uid = firebase.auth().currentUser.uid;
        var db = firebase.database().ref("userprofile/" + uid  + "/profile");
        db.once('value', function(snapshot) {

            if (snapshot.exists()) {
                access = snapshot.val()["accesslevel"]//.accesslevel
                username = snapshot.val()["username"]
                company = snapshot.val()["companyid"]

            $('#username').append("User : " + username);
            $('#companyid').append("Company : " + company);
            openLoggerFile();
            }
        });  
        
        saveToken();
        this.currentUid = user.uid;
        sendNotification();
    } 
    else
    {
        this.currentUid = null;
        //user is null -- Show error
    }
})
//==========================================================//

//==========================================================//
document.getElementById("btnSignOut").addEventListener('click', e=>{
    firebase.auth().signOut();
    window.location = 'index.html';
    console.log('logged out')
})
//==========================================================//

//==========================================================//
document.getElementById("btnChangeAccess").addEventListener('click', e=>{
    modifyAccessLevel();
})
//==========================================================//


//==========================================================//
document.getElementById("btnAddLogger").addEventListener('click', e=>{
    var uid = firebase.auth().currentUser.uid;
	
    logger = document.getElementById("txtSerialNo").value;
    var db = firebase.database().ref("company/" + company);
    db.push({
        logger: logger
    });

    var f = new File(["This is logger test file for" + logger], logger + ".txt", {type: "text/plain"});
    const uploadTask = storageService.child("company/" + company + "/"+logger+ "/" + logger).put(f);
    confirm(logger + " Added");
})
//==========================================================//

//==========================================================//
document.getElementById("btnViewLogger").addEventListener('click', e=>{
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.database().ref("company/" + company  );
        
    db.on('value', function(snapshot) {
        if (snapshot.exists()) {
          
            var content = '';
            $('#ex-table').empty();
            content += '<tr id="tr"><th>My Loggers</th></tr>';
            snapshot.forEach(function(data) {
                var val = '';
                val = data.val();
            
                content += '<tr>';
                content += '<td id="click_link" align="center"><a href="?Logger='+ val.logger+'">' + val.logger + '</a></td>';
                content += '</tr>';
                
            });
          $('#ex-table').append(content);
        }
    });
})
//==========================================================//

//==========================================================//
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
//==========================================================//

//==========================================================//
function openLoggerFile()
{
    var logger = getUrlVars()["Logger"];
    if(logger === undefined)
    {
        console.log("UNDEFINED");
    }
    else if(company === undefined)
    {
        console.log("company var UNDEFINED");
    }
    else
    {
        storageService.child("company/" + company + "/" + logger + "/" + logger)
        .getDownloadURL().then(function(url) {
            // `url` is the download URL for 'images/stars.jpg'
            console.log("URLLLL " + url);

            document.getElementById("downlink").href = url
            $('#downlink').append("View " +logger+ " Data File");

            // This can be downloaded directly:
            // var xhr = new XMLHttpRequest();
            // xhr.responseType = 'blob';
            // xhr.onload = function(event) {
            //   var blob = xhr.response;
            // };
            // xhr.open('GET', url);
            // xhr.send();
            //console.log("URLLLL " + xhr.url);
        
        }).catch(function(error) {
            // Handle any errors
        });
    }
}
//https://firebasestorage.googleapis.com/v0/b/testauth-fd2f0.appspot.com/o/company%2F123%2FTEST00147.txt?alt=media&token=1897d1a5-59c8-4abd-85a9-dd6a16ceb1d0

//==========================================================//
function showEmployeeUI() 
{
    document.getElementById("btnAddLogger").style.display='none';
    document.getElementById("txtSerialNo").style.display='none';
    document.getElementById("btnChangeAccess").style.display='none';
    document.getElementById("txtEmailAdd").style.display='none';
    document.getElementById("radioSelectLevel").style.display='none';
}
//==========================================================//

//==========================================================//
function showManagerUI()
{
    document.getElementById("btnAddLogger").style.display='block';
    document.getElementById("txtSerialNo").style.display='block';
    document.getElementById("btnChangeAccess").style.display='block';
    document.getElementById("txtEmailAdd").style.display='block';
    document.getElementById("radioSelectLevel").style.display='block';
}
//==========================================================//


//==========================================================//
function showDistributorUI()
{
    document.getElementById("btnAddLogger").style.display='block';
    document.getElementById("txtSerialNo").style.display='block';
    document.getElementById("btnChangeAccess").style.display='none';
    document.getElementById("txtEmailAdd").style.display='none';
    document.getElementById("radioSelectLevel").style.display='none';
}
//==========================================================//

//==========================================================//
function modifyAccessLevel()
{
    var addManager = firebase.functions().httpsCallable('addManager');
    var level = 0;

    if(document.getElementById("manager").checked)
    {
        level = 1;
    }
    else if(document.getElementById("distributor").checked)
    {
        level = 2;
    }
    else
    {
        level = 0;
    }
    
    addManager({email: document.getElementById("txtEmailAdd").value, access : level}).then(function(result){
        confirm(result.data['result']);
    })
}
//==========================================================//


const messaging = firebase.messaging();
messaging.usePublicVapidKey("BNgI9IkVyR-VSfhCSouAlNXerzztiuLI3wCNiwWl-_8tJAicrHKG_pe-uN4-eJTBDO6zuVRe6INerivdf25kpv4");


 messaging.onMessage(payload=>{
    console.log('Message received. ', payload);
    // Normally our Function sends a notification payload, we check just in case.
    if (payload.notification) {
        // If notifications are supported on this browser we display one.
        // Note: This is for demo purposes only. For a good user experience it is not recommended to display browser
        // notifications while the app is in focus. In a production app you probably want to only display some form of
        // in-app notifications like the snackbar (see below).
        if (window.Notification instanceof Function) {
        // This displays a notification if notifications have been granted.
        new Notification(payload.notification.title, payload.notification);
        }
        // Display the notification content in the Snackbar too.
        //this.snackbar.MaterialSnackbar.showSnackbar({message: payload.notification.body});
    }
})

    

//THIS MONITORS TOKEN REFRESH
// Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(() => {
//     messaging.getToken().then((refreshedToken) => {
//       console.log('Token refreshed.');
//       saveToken();
//       // ...
//     }).catch((err) => {
//       console.log('Unable to retrieve refreshed token ', err);
//       showToken('Unable to retrieve refreshed token ', err);
//     });
//   });


function requestPermission()
{
    console.log('Requesting permission...');
    firebase.messaging().requestPermission().then(function() 
    {
        console.log('Notification permission granted.');
        this.saveToken();
    }
    .bind(this)).catch(function(err) 
    {
        console.error('Unable to get permission to notify.', err);
    });
}

function saveToken()
{
    firebase.messaging().getToken().then(function(currentToken) {
        if (currentToken) {
            console.log('cOMING INTO DATABASE TO STORE tOKEN');
          firebase.database().ref('userprofile/' + this.currentUid + '/notificationTokens/' + currentToken).set(true);
        } else {
          this.requestPermission();
        }
      }.bind(this)).catch(function(err) {
        console.error('Unable to get messaging token.', err);
        if (err.code === 'messaging/permission-default') {
          alert('You have not enabled notifications on this browser. To enable notifications reload the page and allow notifications using the permission dialog.');
        } else if (err.code === 'messaging/notifications-blocked') {
          alert('You have blocked notifications on this browser. To enable notifications follow these instructions: <a href="https://support.google.com/chrome/answer/114662?visit_id=1-636150657126357237-2267048771&rd=1&co=GENIE.Platform%3DAndroid&oco=1">Android Chrome Instructions</a><a href="https://support.google.com/chrome/answer/6148059">Desktop Chrome Instructions</a>');
        }
    });
}

function sendNotification()
{
    
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

    admin.messaging().sendToDevice(registrationToken, message)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}
