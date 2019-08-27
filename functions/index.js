/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const path = require('path');
const os = require('os');
const fs = require('fs');
var db, message = "";

//////////////////////////////////////////////////////////////////////////////////////////////////
//==========================================================//
exports.addExtraText = functions.storage.object().onFinalize(async (object) => {                                                              //This gets triggered when a new file added

  // [START eventAttributes]
  const fileBucket = object.bucket;                                                                                                           // The Storage bucket that contains the file.
  const filePath = object.name;                                                                                                               // File path in the bucket.
  const contentType = object.contentType;                                                                                                     // File content type.
  const metageneration = object.metageneration;                                                                                               // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  console.log("Filebucket " + fileBucket + " Filepath " + filePath + " content type " + contentType + " metageneration " + metageneration);
  db = admin.database().ref(removeChars(filePath)); 
  message = false;

  // db.once('value', function(snapshot) {
  //   if (snapshot.exists()) {
      
  //     message = snapshot.val();
  //     print(snapshot.val());
  //     console.log(message["edit"] + " +++++++++++++++++++++ " + snapshot.val()["edit"]);
  //   }
     
  // });

    //------------------------------------------//
    if (message && message["edit"] === false)
    {
      
      const fileName = path.basename(filePath);                                                                                                   // Get the file name.
      // addEdited();
        // [START thumbnailGeneration]
      
      const bucket = admin.storage().bucket(fileBucket);                                                                                          // Download file from bucket.
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const metadata = {
        contentType: contentType,
      };
      await bucket.file(filePath).download({destination: tempFilePath});
      console.log('Image downloaded locally to', tempFilePath);
      var fileContent; 

      fs.appendFile(tempFilePath, " adding this from the firebase function\n", 'utf-8', (err) => { 
      if (err) throw err; 

                                                                                                                                                  // Converting Raw Buffer to text 
                                                                                                                                                  // data using tostring function. 
        console.log("coming into append file"); 
      }) 

      // await bucket.upload(tempFilePath, {
      //   destination: filePath,
      //   metadata: metadata,
      // });

                                                                                                                                                    // Once the thumbnail has been uploaded delete the local file to free up disk space.
      return fs.unlinkSync(tempFilePath);
    }
    //------------------------------------------//
  return null;

});
//==========================================================//

//==========================================================//
function addEdited()
{
  db.update({
      //logger: getLoggerName(filePath),
      edit:true
  });
}
//==========================================================//

//==========================================================//
function checkEdited()
{
  var val;
  db.once('value', function(snapshot) {
    if (snapshot.exists()) {
      
      val = snapshot.val();
      print(snapshot.val());
      return val["edit"];
    }
   
  });
  
  //return null;
}
//==========================================================//

//==========================================================//
function removeChars(val)
{
  return val.substring(0, val.length - 9);
}
//==========================================================//

//==========================================================//
function getLoggerName(val)
{
  return val.substring(val.length - 9, val.length);
}
//==========================================================//

//==========================================================//
function print(obj) 
{
  for (var i in obj)
  {
      //console.log(i + " -******* " + obj[i]);
  }
}
//==========================================================//
//////////////////////////////////////////////////////////////////////////////////////////////////

//Granting access level to users when they login//

// function grantManagerRole(email, user)
// {
//   //const user = admin.auth().getUser();
//   if(user.customClaims && user.customClaims.manager === true)
//   {
//     return;
//   }
//   return admin.auth().setCustomUserClaims(user.uid, {
//       manager: true
//   });
// }


// //exports.addmanager = functions.https.onCall((data, context))
// exports.addmanager = functions.auth.user().onCreate((user) => {
//   const email = user.email;
//   return grantManagerRole(email, user);
// })

//==========================================================//
exports.addManager = functions.https.onCall((data, context) => {
  if (context.auth.token.manager !== true) {
    return {
        error: "Request not authorized. User must be a manager to fulfill request."
    };
  }; 
  var email = data.email; 
  if(data.access === 1){
    return grantManagerRole(email).then(() => {
        return {
            result: "Request fulfilled! " + email + " is now a manager."
        };
    });
  }
  else if(data.access === 2)
  {
    return grantDistributorRole(email).then(() => {
      return {
          result: "Request fulfilled! " + email + " is now a distributor."
      };
    });
  }
  else
  {
    return {
      result: "No access level was selected"
  };
  }
});
//==========================================================//

//==========================================================//
async function grantManagerRole(email) {
  const user = await admin.auth().getUserByEmail(email); // 1
  if (user.customClaims && user.customClaims.manager === true) {
      return;
  } // 2
  return admin.auth().setCustomUserClaims(user.uid, {
    manager: true
  }); // 3
}
//==========================================================//

//==========================================================//
async function grantDistributorRole(email) {
  const user = await admin.auth().getUserByEmail(email); // 1
  if (user.customClaims && user.customClaims.distributor === true) {
      return;
  } // 2
  return admin.auth().setCustomUserClaims(user.uid, {
    distributor: true
  }); // 3
}
//==========================================================//
