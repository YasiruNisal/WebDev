//==========================================================//
document.getElementById("btnRegister").addEventListener('click', e=>{
    window.location = 'register.html';
})
//==========================================================//

//==========================================================//
document.getElementById("btnSignIn").addEventListener('click', e=>{
    const email = document.getElementById("txtEmail").value;
    const pass = document.getElementById("txtPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .catch(e=>
        {
         console.log(e.massage)
        })
 })
//==========================================================//

//==========================================================//
firebase.auth().onAuthStateChanged(user=>{ 
    if(user)
    {
        window.location = 'addlogger.html';
    } 
})
//==========================================================//
