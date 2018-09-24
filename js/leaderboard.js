var user = null;

function writeUserData(userId, name, email) {
  var userRef = firebase.database().ref('users/' + userId);

  userRef.once("value").then((snapshot) => {
    if (snapshot.exists()) { 
      
      console.log("exists");
    } else {
      console.log("new user");
      firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
        clout: 0,
        credits: 5,
        votes: 0,
        editor: false
    });
    }
  });
  console.log("update received");
}

function updateUser(userUpdate) {
  user = userUpdate;

  if (user) {
    firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
      userInfo = snapshot.val();

      var authDiv = document.getElementById("topright");
      while (authDiv.firstChild) {
        authDiv.removeChild(authDiv.firstChild);
      }

      var signOutButton = document.createElement("button");
      signOutButton.id = "signOut";
      signOutButton.className = "topButton";
      signOutButton.innerHTML = user.displayName + "<br><span style='color:#fc643f;'>SlicedClout: </span>" + userInfo.clout;
      signOutButton.addEventListener('click', function(event) {
        firebase.auth().signOut();
      });
      authDiv.appendChild(signOutButton);

      var cloutButton = document.createElement("button");
      cloutButton.className = "topButton";
      cloutButton.innerHTML = "Leaderboard";
      cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
      authDiv.appendChild(cloutButton);

      var howToButton = document.createElement("button");
      howToButton.className = "topButton";
      howToButton.innerHTML = "How To Slice"
      howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
      authDiv.appendChild(howToButton);

      var flowDiv = document.getElementById("topleft");
      while (flowDiv.firstChild) {
          flowDiv.removeChild(flowDiv.firstChild);
      }

      var earnButton = document.createElement("button");
      earnButton.className = "topButton";
      earnButton.innerHTML = "Earn Votes" + "<br><span>Vote Credits: </span>" + userInfo.credits;
      earnButton.setAttribute('onclick', "location.href='https://sliced.us/earn'");
      flowDiv.appendChild(earnButton);

      var arrow1 = document.createElement("img");
      // arrow1.src = "https://sliced.us/arrow.jpg";
      arrow1.className = "arrow";
      flowDiv.appendChild(arrow1);

      var neededVotes = 5 - userInfo.votes;
      neededVotes = neededVotes < 0 ? 0 : neededVotes;

      var voteButton = document.createElement("button");
      voteButton.className = "topButton";
      // voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
      voteButton.setAttribute('onclick', "voteButtonActions()");
      flowDiv.appendChild(voteButton);

      var arrow2 = document.createElement("img");
      // arrow2.src = "https://sliced.us/arrow.jpg";
      arrow2.className = "arrow";
      flowDiv.appendChild(arrow2);

      var contribButton = document.createElement("button");
      contribButton.className = "topButton";
      // contribButton.innerHTML = "Contribute";
      contribButton.setAttribute('onclick', "contributeButtonActions()");
      flowDiv.appendChild(contribButton);

      if (userInfo.credits == 0 && userInfo.votes < 5) {
        arrow1.src = "https://sliced.us/arrow.jpg"
        arrow2.src = "https://sliced.us/arrow.jpg"
        voteButton.disabled = true;
        contribButton.disabled = true;
        voteButton.innerHTML = "<span style='color:#D3D3D3'>Vote<br>Votes Needed: " + neededVotes + "</span>";
        contribButton.innerHTML = "<span style='color:#D3D3D3'>Contribute</span>";
      }
      else if (userInfo.credits > 0 && userInfo.votes < 5) {
        arrow1.src = "https://sliced.us/arrow2.jpg"
        arrow2.src = "https://sliced.us/arrow.jpg"
        voteButton.disabled = false;
        contribButton.disabled = true;
        voteButton.innerHTML = "Vote <br> Votes Needed: " + neededVotes;
        contribButton.innerHTML = "<span style='color:#D3D3D3'>Contribute</span>";
      }
      else if (userInfo.votes >= 5) {
        arrow1.src = "https://sliced.us/arrow2.jpg"
        arrow2.src = "https://sliced.us/arrow2.jpg"
        voteButton.disabled = false;
        contribButton.disabled = false;
        voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
        contribButton.innerHTML = "Contribute";
      }

    });
  }
}

function getLeaders() {
  var tableArray = [];
  var n = 0;
  firebase.database().ref('users').orderByChild('clout').limitToLast(10).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      n++;
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

  waitforRows();

  function waitforRows() {
      if (tableArray.length == n && n !== 0) {
        var table = document.getElementById("leaderTable");

        var arrayLength = tableArray.length;
        for (var i = 0; i < arrayLength; i++) {

            var row = tableArray.pop();

            table.appendChild(row);
        }
      }
      else {
          setTimeout(waitforRows, 250);
      }
  }

}

function voteButtonActions() {

  firebase.database().ref('posts').orderByChild('activect').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      key = child.key;
      location.href = 'https://sliced.us/article.html?article=' + String(key) + '#contribution';

    });
  });
    // location.href='https://sliced.us';
}

function contributeButtonActions() {
    location.href='https://sliced.us';
    alert("Go to the contribute section of any article to write your own contributions!");
}
