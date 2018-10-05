var user = null;
var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;

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

            // while (leftDivMove.firstChild) {
            //   leftDivMove.removeChild(leftDivMove.firstChild);
            // }

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
  var infoDiv = document.getElementById("infoDiv");
  var activeDiv = document.getElementById("active");
  var acceptedDiv = document.getElementById("accepted");
  var nameSpot = document.getElementById("nameSpot");
  var cloutSpot = document.getElementById("cloutSpot");
  var creditsSpot = document.getElementById("creditsSpot");
  var votesSpot = document.getElementById("votesSpot");

  var authorName;
  var authorRef = firebase.database().ref('users/' + author);
  authorRef.once("value").then((snapshot) => {
    val = snapshot.val();

    cloutSpot.innerHTML = "<span style='color:#fc643f;'>SlicedClout: </span>" + val.clout;

    if (snapshot.key == user.uid) {
      // var theProcess = document.getElementById("theProcess");
      // theProcess.innerHTML = 'The Process';

      creditsSpot.innerHTML = "Vote credits: " + val.credits;

      var theProcess = document.getElementById("theProcess");
      var processInstructions = document.getElementById("processInstructions");

      var leftDivMove = document.getElementById("topleft");
      var voteButton = document.createElement("button");
      var contribButton = document.createElement("button");

      theProcess.innerHTML = "The Sliced Process"

      var earnButton = document.createElement("button");
      earnButton.className = "topButton";
      earnButton.innerHTML = "Earn Votes";
      earnButton.setAttribute('onclick', "location.href='https://sliced.us/earn'");
      leftDivMove.appendChild(earnButton);

      var arrow1 = document.createElement("img");
      // arrow1.src = "https://sliced.us/arrow.jpg";
      arrow1.className = "arrow";
      leftDivMove.appendChild(arrow1);

      var neededVotes = 5 - val.votes;
      neededVotes = neededVotes < 0 ? 0 : neededVotes;
      votesSpot.innerHTML = "Votes needed to contribute: " + neededVotes;

      voteButton.className = "topButton";
      // voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
      voteButton.setAttribute('onclick', "voteButtonActions()");
      leftDivMove.appendChild(voteButton);

      var arrow2 = document.createElement("img");
      // arrow2.src = "https://sliced.us/arrow.jpg";
      arrow2.className = "arrow";
      leftDivMove.appendChild(arrow2);

      contribButton.className = "topButton";
      // contribButton.innerHTML = "Contribute";
      contribButton.setAttribute('onclick', "contributeButtonActions()");
      leftDivMove.appendChild(contribButton);

      if (val.credits == 0 && val.votes < 5) {
        arrow1.src = "https://sliced.us/arrow.jpg"
        arrow2.src = "https://sliced.us/arrow.jpg"
        voteButton.disabled = true;
        contribButton.disabled = true;
        voteButton.innerHTML = "<span style='color:#D3D3D3'>Vote</span>";
        contribButton.innerHTML = "<span style='color:#D3D3D3'>Contribute</span>";

        processInstructions.innerHTML = "Earn credits to vote!";
      }
      else if (val.credits > 0 && val.votes < 5) {
        arrow1.src = "https://sliced.us/arrow2.jpg"
        arrow2.src = "https://sliced.us/arrow.jpg"
        voteButton.disabled = false;
        contribButton.disabled = true;
        voteButton.innerHTML = "Vote";
        contribButton.innerHTML = "<span style='color:#D3D3D3'>Contribute</span>";

        var neededVotes = 5 - val.votes;
        neededVotes = neededVotes < 0 ? 0 : neededVotes;

        processInstructions.innerHTML = "Vote " + neededVotes + " more times to be able to contribute!";
      }
      else if (val.votes >= 5) {
        arrow1.src = "https://sliced.us/arrow2.jpg"
        arrow2.src = "https://sliced.us/arrow2.jpg"
        voteButton.disabled = false;
        contribButton.disabled = false;
        voteButton.innerHTML = "Vote";
        contribButton.innerHTML = "Contribute";

        processInstructions.innerHTML = "Add your voice by contributing!";
      }
    }

    authorName = val.username;
    nameSpot.innerHTML = authorName;


    var numActive = 0;
    var numAccepted = 0;
    var contributions = val.contributions;
    if (contributions) {
      for (var key in contributions) {
        if (contributions[key].active == true) {
          var container = document.createElement("a");
          container.className = "containerDiv";
          container.href = 'https://sliced.us/article.html?article=' + String(contributions[key].articleID) + '#vote';
          var title = document.createElement("h2");
          var body = document.createElement("p");
          title.innerHTML = contributions[key].title;
          body.innerHTML = contributions[key].body;
          container.appendChild(title);
          container.appendChild(body);
          activeDiv.appendChild(container);
          numActive++;
        }
        if (contributions[key].accepted == true) {
          var container = document.createElement("div");
          container.className = "containerDiv";
          container.href = 'https://sliced.us/article.html?article=' + String(contributions[key].articleID);
          var title = document.createElement("h2");
          var body = document.createElement("p");
          title.innerHTML = contributions[key].title;
          body.innerHTML = contributions[key].body;
          container.appendChild(title);
          container.appendChild(body);
          acceptedDiv.appendChild(container);
          numAccepted++;
        }

      }
      if (numActive == 0) {
        while (activeDiv.firstChild) {
          activeDiv.removeChild(activeDiv.firstChild);
        }
      }
      if (numAccepted == 0) {
        while (acceptedDiv.firstChild) {
          acceptedDiv.removeChild(acceptedDiv.firstChild);
        }
      }
    }
  });
}

function voteButtonActions() {

  firebase.database().ref('posts').orderByChild('activect').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      key = child.key;
      location.href = 'https://sliced.us/article.html?article=' + String(key) + '#vote';
    });
  });
    // location.href='https://sliced.us';
}

function contributeButtonActions() {
  firebase.database().ref('posts').orderByChild('createdTimestamp').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      key = child.key;
      location.href = 'https://sliced.us/article.html?article=' + String(key) + '#contribute';
    });
  });
}

function checkMobile() {
    ourtakeSheet = document.styleSheets[0];
    if (!is_mobile) {
        console.log("desktop");
        ourtakeSheet.insertRule("#readcontainer { position: absolute; top: 25%; padding: 0% 15% 5% 15%; }", 0);
        
        ourtakeSheet.insertRule("#logo { position: absolute; top: 0%; left: 40%; display: block; margin-left: auto; margin-right: auto; width: 20%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 40%; position:absolute; top: 4%; right: 2%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule("#topright { flex-grow: 1; }", 0);
        ourtakeSheet.insertRule("#topleft { display: flex;}", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 1% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Lato", sans-serif; font-size: 22px; display: inline-block; background: white; color: black; border-radius: 3px; box-shadow: 0px 0px 0px grey; white-space: nowrap; margin: 5px; width: 40%; height: 50px; vertical-align: middle; float: right; cursor: pointer;}', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Lato", sans-serif; font-size: 18px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; width: 25%; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.conditional { float: left; padding: 3% 0%; width: 60%; margin: 10px 0px; font-size: 24px; line-height: 34px; font-family: "Lora", serif;}', 0);
        ourtakeSheet.insertRule('#rightjustify { float: right; padding: 3% 0%; width: 25%; margin: 10px 0px; font-size: 24px; line-height: 34px; color: black; font-family: "Lato", sans-serif;}', 0);
        ourtakeSheet.insertRule('.voteButton { background-color: #fff4db; font-size: 18px; width: 40%; height: 50%; margin: 0% 3% 0% 0%;}', 0);
        ourtakeSheet.insertRule('.tab { font-size: 18px; font-family: "Lato", sans-serif; overflow: hidden; background-color: #fff9ea; }', 0);
        ourtakeSheet.insertRule('.tab button { font-family: "Lato", sans-serif; font-size: 22px; background-color: inherit; float: left; border: none; outline: none; cursor: pointer; padding: 14px 16px; transition: 0.3s; }', 0);
        ourtakeSheet.insertRule('.tab button:hover { font-family: "Lato", sans-serif; font-size: 22px; background-color: #fff4db; }', 0);
        ourtakeSheet.insertRule('.tab button.active { font-family: "Lato", sans-serif; font-size: 22px; background-color: #ffeeb7; }', 0);
        ourtakeSheet.insertRule('.tabcontent { font-size: 22px; font-family: "Lato", sans-serif; display: none; padding: 6px 12px; border-top: none; }', 0);
        ourtakeSheet.insertRule('h2 { font-family: "Lora", serif; font-weight: bold; font-size: 30px; text-decoration: none; color: black;}', 0);
        ourtakeSheet.insertRule('p { font-family: "Lora", serif; font-size: 22px; line-height: 34px; text-decoration: none; color: black;}', 0);
        ourtakeSheet.insertRule('.authorPage { font-weight:bold; font-size: 28px; line-height: 40px; font-family: "Lato"; color: #484848; padding: 3% 0% 2% 0%;}', 0);
    }
    else if (is_mobile) {
        console.log("mobile");
        ourtakeSheet.insertRule("#readcontainer { padding: 0% 0%; }", 0)
        ourtakeSheet.insertRule("#logo { display: block; margin-left: auto; margin-right: auto; width: 25%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 100%; padding: 0px 0px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topleft { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topright { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 3% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Lato", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 31%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Lato", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 26.75%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.conditional { float: left; padding: 3%; width: 95%; margin: 10px 0px; font-size: 24px; line-height: 48px; font-family: "Lora", serif;}', 0);
        ourtakeSheet.insertRule('#rightjustify { float: right; width: 92%; padding: 3%; margin: 10px 0px; font-size: 34px; line-height: 48px; color: black; font-family: "Lato", sans-serif;}', 0);
        ourtakeSheet.insertRule('.voteButton { background-color: #fff4db; font-size: 30px; width: 40%; height: 50%; margin: 0% 3% 0% 0%;}', 0);
        ourtakeSheet.insertRule('.tab { font-size: 34px; font-family: "Lato", sans-serif; overflow: hidden; background-color: #fff9ea; }', 0);
        ourtakeSheet.insertRule('.tab button { font-family: "Lato", sans-serif; font-size: 34px; background-color: inherit; float: left; border: none; outline: none; cursor: pointer; padding: 14px 16px; transition: 0.3s; }', 0);
        ourtakeSheet.insertRule('.tab button:hover { font-family: "Lato", sans-serif; font-size: 34px; background-color: #fff4db; }', 0);
        ourtakeSheet.insertRule('.tab button.active { font-family: "Lato", sans-serif; font-size: 34px; background-color: #ffeeb7; }', 0);
        ourtakeSheet.insertRule('.tabcontent { font-size: 34px; font-family: "Lato", sans-serif; display: none; padding: 6px 12px; border-top: none; }', 0);
        ourtakeSheet.insertRule('h2 { font-family: "Lora", serif; font-weight: bold; font-size: 40px; text-decoration: none;}', 0)
        ourtakeSheet.insertRule('p { font-family: "Lora", serif; font-size: 22px; line-height: 48px; text-decoration: none;}', 0);

    }
}


