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

function getLeaders() {
  var tableArray = [];
  firebase.database().ref('users').orderByChild('clout').limitToLast(10).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      user = child.val();
      username = user.username;
      clout = user.clout;

      var tableRow = document.createElement("tr");

      var userRow = document.createElement("td");
      userRow.innerHTML = username;
      var userClout = document.createElement("td");
      userClout.innerHTML = clout;

      tableRow.appendChild(userRow);
      tableRow.appendChild(userClout);
      tableArray.push(tableRow);

    });
  });

  var table = document.getElementById("leaderTable");

  var arrayLength = tableArray.length;
  for (var i = 0; i < arrayLength; i++) {

      var row = tableArray.pop();

      table.appendChild(row);
  }

}
