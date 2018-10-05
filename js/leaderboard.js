var user = null;
var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;

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

        var userInfo;
        var userUid;

        waitForRef();

        function waitForRef() {

          firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
            userInfo = snapshot.val();
            userUid = snapshot.key;
          });

          if (userInfo) {

            var authDivFixed = document.getElementById("topRightFixed");
            var authDivMove = document.getElementById("topright");

            while (authDivFixed.firstChild) {
              authDivFixed.removeChild(authDivFixed.firstChild);
            }

            while (authDivMove.firstChild) {
              authDivMove.removeChild(authDivMove.firstChild);
            }

            var leftDivFixed = document.getElementById("topLeftFixed");
            var leftDivMove = document.getElementById("topleft")

            while (leftDivFixed.firstChild) {
              leftDivFixed.removeChild(leftDivFixed.firstChild);
            }

            while (leftDivMove.firstChild) {
              leftDivMove.removeChild(leftDivMove.firstChild);
            }

            var signOutButton = document.createElement("button");
            signOutButton.id = "signOut";
            signOutButton.className = "topButtonRight";
            signOutButton.innerHTML = "Log Out";
            signOutButton.addEventListener('click', function(event) {
              firebase.auth().signOut();
            });
            authDivMove.appendChild(signOutButton);

            var myProfile = document.createElement("button");
            myProfile.className = "topButtonRight";
            myProfile.innerHTML = '<span style="vertical-align:middle;">My Profile</span><img src="pizzaslice.jpg" id="buttonPizza">';
            var href = '"https://sliced.us/author.html?author=' + userUid + '"'; 
            myProfile.setAttribute('onclick', 'location.href=' + href);
            authDivMove.appendChild(myProfile);

            var cloutButton = document.createElement("button");
            cloutButton.className = "topButton";
            cloutButton.innerHTML = "Leaderboard";
            cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
            leftDivFixed.appendChild(cloutButton);

            var howToButton = document.createElement("button");
            howToButton.className = "topButton";
            howToButton.innerHTML = "How To Slice"
            howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
            leftDivFixed.appendChild(howToButton);

          }
          else {
              setTimeout(waitForRef, 250);
          }
        }
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
      uid = child.key;
      clout = user.clout;

      var tableRow = document.createElement("tr");

      var userRow = document.createElement("td");
      userRow.innerHTML = '<a href="author.html?author=' + uid + '">' + username + "</a>"
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

function checkMobile() {
    ourtakeSheet = document.styleSheets[0];
    if (!is_mobile) {
        console.log("desktop");
        ourtakeSheet.insertRule("#readcontainer { padding: 0% 15%; }", 0);
        ourtakeSheet.insertRule("#logo { display: block; margin-left: auto; margin-right: auto; width: 12%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 40%; position:absolute; top: 4%; right: 2%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule("#topright { flex-grow: 1; }", 0);
        ourtakeSheet.insertRule("#topleft { width: 30%; position:absolute; top: 4%; right: 66%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 4% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Trebuchet MS", sans-serif; font-size: 18px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Trebuchet MS", sans-serif; font-size: 18px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right }', 0);

    }
    else if (is_mobile) {
        console.log("mobile");
        ourtakeSheet.insertRule("#readcontainer { padding: 0% 0%; }", 0)
        ourtakeSheet.insertRule("#logo { display: block; margin-left: auto; margin-right: auto; width: 25%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 100%; padding: 0px 0px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topleft { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topright { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 3% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Trebuchet MS", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 31%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Trebuchet MS", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 26.75%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);

    }
}
