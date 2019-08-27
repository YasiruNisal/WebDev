//==========================================================//
document.getElementById("btnRegister").addEventListener('click', e=>{
    window.location = 'register.html';
})
//==========================================================//

//==========================================================//
document.getElementById("btnSignIn").addEventListener('click', e=>{

   // if(document.getElementById("txtEmailAdd") !== null && document.getElementById("txtPassword") !== null)
    //{
        const email = document.getElementById("txtEmail").value;
        const pass = document.getElementById("txtPassword").value;

        firebase.auth().signInWithEmailAndPassword(email, pass)
        .catch(e=>
        {
            console.log(e.massage)
        })
   // }

 })
//==========================================================//

//==========================================================//
document.getElementById("btnResetPass").addEventListener('click', e=>{
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(document.getElementById("txtEmailAdd").value).then(function() {
    // Email sent.
    confirm("Password Reset Email Sent");
    }).catch(function(error) {
    // An error happened.
    });
})
//==========================================================//

//==========================================================//
firebase.auth().onAuthStateChanged(user=>{ 
    if(user)
    {
        window.location = 'addlogger.html';
        //---- Comment this out to remove email verification ---//
    //     //if(document.getElementById("txtEmailAdd") !== null)
    //     //{
    //         if(user.emailVerified){

    //             window.location = 'addlogger.html';
    //         }
    //         else
    //         {
    //             alert("Email address not verified");           
    //         }
    //    // }
        
    } 
})
//==========================================================//
