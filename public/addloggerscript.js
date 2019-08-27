var access, company, logger, username;
const storageService = firebase.storage().ref();

//==========================================================//
firebase.auth().onAuthStateChanged(user=>
{   
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
        var db = firebase.database().ref("userprofile/" + uid);

        db.on('value', function(snapshot) {
            if (snapshot.exists()) {
            snapshot.forEach(function(data) {
                access = data.val().accesslevel
                username = data.val().username
                company = data.val().companyid
            });
            
            $('#username').append("User : " + username);
            $('#companyid').append("Company : " + company);
            openLoggerFile();
            }
        });  
    } 
    else
    {
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
