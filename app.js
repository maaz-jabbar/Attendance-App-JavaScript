
var auth = firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();
  var mainDiv= document.getElementById("students")

function signIn(){
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((user)=>{
        console.log(user)
        localStorage.setItem('uid', user.user.uid);
        window.location = "./home.html"
    })
    .catch(function(error) {
        // Handle Errors here.
       alert(error)
     });
}

function signUp(){
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const userName = document.getElementById('userName').value;
    const teacherId = document.getElementById('teacherId').value;
 

    firebase.auth().createUserWithEmailAndPassword(email, pass)
            .then((user)=>{
                alert("User Created")

                console.log(user)
                saveUserDetailsToDB(userName, email,teacherId, user.user.uid);
                localStorage.setItem('uid', user.user.uid);
    
})
.catch(function(error) {
    // Handle Errors here.
    alert(error)
  });
}


const forgetPass = ()=>{
    var email = prompt("Enter Email Address:");
   
  firebase.auth().sendPasswordResetEmail(email)
  .then(function() {
   alert("Email sent")
  }).catch(function(error) {
    alert(error)
  });
}



/*Function to save user details to DB*/
function saveUserDetailsToDB(userName, userEmail,teacherId, uid) {
    db.collection("users").add({
        userName,
        userEmail,
        teacherId,
        uid
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            location = './home.html';
        })
}





function signOut(){
    firebase.auth().signOut().then(function() {
        location = "./index.html"
      }).catch(function(error) {
        // An error happened.
      });
}
var modal = document.getElementById('id01');
window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

function addStudent(){
  const selectedFile = document.getElementById('file').files[0];
  var storageRef = firebase.storage().ref();
var mountainImagesRef = storageRef.child('adPics/'+ selectedFile.name);

mountainImagesRef.put(selectedFile)
.then(function(snapshot) {
alert('Ad Posted!');
addStudents();
});

}

function addStudents(){
  document.getElementById('id01').style.display='none';

  var e = document.getElementById("section")
  db.collection("students").add({
    studentName :  document.getElementById('studentName').value,
    fatherName :  document.getElementById('fatherName').value ,
    rollNo : document.getElementById('rollNo').value,
    section : e.options[e.selectedIndex].value,
    picName: document.getElementById('file').files[0].name,
    
  })
  .then(function (docRef) {   
    document.getElementById('studentName').value = ""
    document.getElementById('fatherName').value = ""
    document.getElementById('rollNo').value = ""
    
    });

}

function getAllStudents() {
  db.collection("students")
      .onSnapshot(function (Snapshot) {
          Snapshot.docChanges().forEach(function (change) {
              if (change.type === "added") {
                  listStudents(change.doc.id, change.doc.data());
              }
              if (change.type === "modified") {
                  console.log("Modified todo: ", change.doc.data());
                  updateStudentFromDOM(change.doc.data(), change.doc.id);
              }
              if (change.type === "removed") {
                  console.log("Removed city: ", change.doc.data(), change.doc.id);
                  deleteStudentFromDOM(change.doc.id);
              }
          });
      });

}


function listStudents(docId, docData) {

 var div = document.createElement('div');
 div.setAttribute('class', 'student');
 div.setAttribute('id', docId + 'student');

 firebase.storage().ref().child("adPics/"+docData.picName).getDownloadURL()
 .then(function(url) {
     console.log(url)
     var img = document.getElementById(docId);
     img.src = url;
   }).catch(function(error) {
     // Handle any errors
   });

 div.innerHTML = `<div  class="studImgdiv" ><span class="helper"></span><img id="${docId}" class="studImg" src=""/></div>
 <span class = "name">${docData.studentName.toUpperCase()}</span><br>
 <span class="fatherName">${docData.fatherName} </span><br>   
 <span class="section">${docData.section}</span><br>
 <span class="rollNo">${docData.rollNo}</span><br><div class="qw">
 <button class = "btn qww" onclick="deleteStudent('${docId}')">Delete</button>
 <button class = "btn qww" onclick="updateStudent('${docId}')">Edit</button><br><br><div>`
 localStorage.setItem('docId',docId) 
  
 mainDiv.appendChild(div)
}

function deleteStudent(docId){
  console.log(docId)
    db.collection("students").doc(docId).delete()
    .then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

function deleteStudentFromDOM(docId){
  var childToDelete = document.getElementById(docId+"student");
  students.removeChild(childToDelete);
}

function updateStudent (docId, todo){

   alert('not now')

}
var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

  function setDate(){
document.getElementById('dateOfAttendance').value = date;

  }


function markAttendance(){

   var rollNumber = document.getElementById('rollAttendance').value
  var datee = document.getElementById('dateOfAttendance').value;
var a = datee.indexOf('-')
a++;
var b= datee.substring(a);

   db.collection("attendance").add({
      date : datee ,
      rollNumber,
      month : b,
  })
  .then(function (docRef) {   
    document.getElementById('rollAttendance').value = ""
    
    });
   console.log(date);
}


function viewOneMonth(){
  var oneMonth = document.getElementById('oneMonth');
  
  oneMonth.innerHTML=`<span>Student was present on : </span><br>`
  
  var rollNumber = document.getElementById('rollOneMonth').value;
  var checkMonth = (today.getMonth()+1)+'-'+today.getFullYear();
  console.log(checkMonth)
  db.collection("attendance").where("rollNumber","==",rollNumber).where("month","==",checkMonth).get()
  .then(function (userSnapshot) {
    userSnapshot.forEach(function (doc) {
      
      var div = document.createElement('div');
      div.innerHTML = `<span>${doc.data().date} </span><br>`

      oneMonth.appendChild(div)

        console.log(doc.data().date);
    })
  })

}


function viewToday(){
  var div = document.getElementById('today')
  div.innerHTML = `Students present today:<br>`
  
    var e = document.getElementById("todayAtt")
  var section = e.options[e.selectedIndex].value;

  console.log(section)

  db.collection("students").where("section","==",section).get()
        .then(function (userSnapshot) {
          userSnapshot.forEach(function (doc) {
            
            var rollNum = doc.data().rollNo;
            
            db.collection("attendance").where("date","==",date).get()
                  .then(function (userSnapshot) {
                    userSnapshot.forEach(function (doc) {
                      var rollNumber = doc.data().rollNumber
                      if (rollNum ===  rollNumber)
                      {
                        div.innerHTML += `${rollNumber}<br>`
                      }

                    })
                  })

                
            
        })
})}