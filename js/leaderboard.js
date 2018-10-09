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
            myProfile.innerHTML = '<span style="vertical-align:middle;">My Profile </span><img src="' + userInfo.plane + '.jpg" id="buttonPizza">';
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
      userRow.innerHTML = '<a href="author.html?author=' + uid + '" style="color:black;">' + username + "</a>"
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
        ourtakeSheet.insertRule("#readcontainer { position: absolute; top: 20%; padding: 0% 10%; }", 0);
        ourtakeSheet.insertRule("#logo { position: absolute; top: 5%; left: 42.5%; display: block; margin-left: auto; margin-right: auto; width: 15%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 35%; position: absolute; top: 4%; right: 2%; padding: 6px 12px; display: flex; text-align:center;}", 0);
        ourtakeSheet.insertRule("#topright { flex-grow: 1; }", 0);
        ourtakeSheet.insertRule("#topLeftOut { position: absolute; top: 4%; width: 35%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule("#topLeftIn { position: absolute; top: 4%; width: 35%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 4% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Lato", sans-serif; font-size: 22px; display: inline-block; background: white; color: black; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; width: 40%; height: 50px; vertical-align: middle; float: right; cursor: pointer;}', 0);
        ourtakeSheet.insertRule('.topButtonOut {font-family: "Lato", sans-serif; font-size: 22px; display: inline-block; background: white; color: black; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right; cursor: pointer; width: 40%}', 0);
        ourtakeSheet.insertRule('.topButtonIn {font-family: "Lato", sans-serif; font-size: 22px; display: inline-block; background: white; color: black; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right; cursor: pointer; width: 40%}', 0);
        ourtakeSheet.insertRule('.addToArticle { font-family: "Lato", sans-serif; font-size: 22px; display: inline-block; background: #fff4db; color: black; border-radius: 3px; white-space: nowrap; margin: 5px; height: 50px; width: 45%; vertical-align: top; white-space: normal; cursor: pointer;}', 0);
        ourtakeSheet.insertRule('.frontHolder { padding: 24px; margin: 10% 0% 0% 0%; }', 0);
        ourtakeSheet.insertRule('p { font-family: "Lora", serif; font-size: 22px; line-height: 34px; }', 0);
        ourtakeSheet.insertRule('.front { font-family: "Lora", serif; font-size: 22px; line-height: 34px; color: black; text-decoration: none; }', 0);
        ourtakeSheet.insertRule('.title { font-weight: bold; font-size: 28px; line-height: 40px; margin: 0%;}', 0);
        ourtakeSheet.insertRule('#buttonPizza { border-radius: 50%; width: 16%; height: 75%; display: inline-block; vertical-align: middle; border: 1px solid #484848; }', 0);


    }
    else if (is_mobile) {
        console.log("mobile");
        ourtakeSheet.insertRule("#readcontainer { position: absolute; top: 18%; padding: 0% 0%; }", 0)
        ourtakeSheet.insertRule("#logo { position: absolute; top: 12%; left: 35%; display: block; margin-left: auto; margin-right: auto; width: 30%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 100%; padding: 0px 0px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topLeftOut { position: absolute; top: 4%; width: 50%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule("#topLeftIn { position: absolute; top: 4%; width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topright { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 3% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Lato", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 22%; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonOut { font-family: "Lato", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 44%; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonIn { font-family: "Lato", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 22%; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('#buttonPizza { border-radius: 50%; width: 35%; height: 75%; display: inline-block; vertical-align: middle; border: 1px solid #484848; }', 0);

    }
}
