
//==========================================================//
document.getElementById("btnRegister").addEventListener('click', e=>{
    const email = document.getElementById("txtEmail").value;
    const pass = document.getElementById("txtPassword").value;

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(() => {
        
    }).catch(function(error) {
        console.log(error.message);
    });

    
})
//==========================================================//

//==========================================================//
document.getElementById("btnSignIn").addEventListener('click', e=>{
    window.location = 'index.html';
})
//==========================================================//

//==========================================================//
firebase.auth().onAuthStateChanged(user=>
{ 
    if(user)
    {
        var uid = firebase.auth().currentUser.uid;
        var db = firebase.database().ref("userprofile/" + uid);
        //Add extra data to the reatime database
        db.push(
        {
            username: document.getElementById("txtUserName").value,
            email: document.getElementById("txtEmail").value,
            companyid: document.getElementById("txtCompany").value,
            accesslevel: 3
        })
       // window.location = 'addlogger.html';

       //---- Comment this out to remove email verification ---//
    //    if(!user.emailVerified)
    //    {
    //     user.sendEmailVerification().then(function() {
    //         confirm("Verify E-mail address to login");
    //       }).catch(function(error) {
    //         // An error happened.
    //       });
    //    }
    } 
})
//==========================================================//
//TODO
//Need to add a function that check if the two passwords are the same

