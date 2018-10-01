var user = null;
var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;

function updateUser(userUpdate) {
    user = userUpdate;
    if (user) {

        var userInfo;

        waitForRef();

        function waitForRef() {

          firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
            userInfo = snapshot.val();
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
              signOutButton.innerHTML = userInfo.username + "<br><span style='color:#fc643f;'>SlicedClout: </span>" + userInfo.clout;
              signOutButton.addEventListener('click', function(event) {
                firebase.auth().signOut();
              });
              authDivMove.appendChild(signOutButton);

              var cloutButton = document.createElement("button");
              cloutButton.className = "topButtonRight";
              cloutButton.innerHTML = "Leaderboard";
              cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
              authDivMove.appendChild(cloutButton);

              var howToButton = document.createElement("button");
              howToButton.className = "topButtonRight";
              howToButton.innerHTML = "How To Slice"
              howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
              authDivMove.appendChild(howToButton);

              var earnButton = document.createElement("button");
              earnButton.className = "topButtonLeft";
              earnButton.innerHTML = "Earn Votes" + "<br><span>Vote Credits: </span>" + userInfo.credits;
              earnButton.setAttribute('onclick', "location.href='https://sliced.us/earn'");
              leftDivMove.appendChild(earnButton);

              var arrow1 = document.createElement("img");
              // arrow1.src = "https://sliced.us/arrow.jpg";
              arrow1.className = "arrow";
              leftDivMove.appendChild(arrow1);

              var neededVotes = 5 - userInfo.votes;
              neededVotes = neededVotes < 0 ? 0 : neededVotes;

              var voteButton = document.createElement("button");
              voteButton.className = "topButtonLeft";
              // voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
              voteButton.setAttribute('onclick', "voteButtonActions()");
              leftDivMove.appendChild(voteButton);

              var arrow2 = document.createElement("img");
              // arrow2.src = "https://sliced.us/arrow.jpg";
              arrow2.className = "arrow";
              leftDivMove.appendChild(arrow2);

              var contribButton = document.createElement("button");
              contribButton.className = "topButtonLeft";
              // contribButton.innerHTML = "Contribute";
              contribButton.setAttribute('onclick', "contributeButtonActions()");
              leftDivMove.appendChild(contribButton);

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
            }
            else {
                setTimeout(waitForRef, 250);
            }
        }
    }
}

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
        credits: 0,
        votes: 0,
        editor: false
    });
    }
  });
  console.log("update received");
}

function loadAuthor(author) {
  var authorDiv = document.getElementById("authorDiv");

  var authorName;
  var authorRef = firebase.database().ref('users/' + userId);
  authorRef.once("value").then((snapshot) => {
    val = snapshot.val();
    authorName = val.username;
    authorDiv.innerHTML = authorName;
  })




}