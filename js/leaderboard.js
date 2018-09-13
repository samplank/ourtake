var user = null;

function writeUserData(userId, name, email) {
  var userRef = firebase.database().ref('users/' + userId);

  userRef.once("value").then((snapshot) => {
    if (snapshot.exists()) { 
    } else {
      firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      clout: 0,
      credits: 5,
      votes: 0
    });
    }
  });
}

function updateUser(userUpdate) {
  user = userUpdate;

  if (user) {
    firebase.database().ref('users/' + user.uid + '/clout').once('value').then(function(snapshot) {

      var authDiv = document.getElementById("topright");
      while (authDiv.firstChild) {
        authDiv.removeChild(authDiv.firstChild);
      }


      var cloutButton = document.createElement("button");
      cloutButton.className = "topButton";
      cloutButton.innerHTML = "Leaderboard";
      cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
      authDiv.appendChild(cloutButton);

      var signOutButton = document.createElement("button");
      signOutButton.id = "signOut";
      signOutButton.className = "topButton";
      signOutButton.innerHTML = user.displayName + "<br><span style='color:#fc643f;'>SlicedClout: </span>" + snapshot.val();
      signOutButton.addEventListener('click', function(event) {
        firebase.auth().signOut();
      });
      authDiv.appendChild(signOutButton);

    });
  }
}