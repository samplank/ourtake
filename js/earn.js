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

function loadReview() {
  var contributionArray = [];
    var n = 0;

  var rootRef = database.ref();
    var urlRef = rootRef.child("posts");
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        var contribution = child.val();
        var key = child.key;
        var val = '';

        postRef = urlRef.child(String(key));

        postRef.child('contributions').orderByChild('accepted').equalTo(false).on("value", function(snapshot) {
            val = snapshot.val();
        });


        waitForBody();

        function waitForBody() {
            if (val != '' && val !== null) {
              for (x in val) {
                console.log(val[x].active);
                if (val[x].active == true) {
                  contributionArray.push([key, x, val[x], contribution.title]);
                  n++;
                }
              }
            }
            else {
                setTimeout(waitForBody, 250);
            }
        }

      });

    });

    waitforArrayLoad();

    function waitforArrayLoad() {
        if (contributionArray.length == n && n !== 0) {

            var readSpace = document.getElementById("readcontainer");

            var shuffledArray = shuffle(contributionArray);

            for (var i = 0; i < 3; i++) {

                var pair = shuffledArray.pop();
                var title = pair[3];
                var contrib = pair[2];

                var titleContainer = document.getElementById("contrib" + String(i) + "title");
                titleContainer.innerHTML = "<span style='color:#484848;'> From: </span>" + title;

                var reviewContainer = document.getElementById("contrib" + String(i))
                reviewContainer.innerHTML = "<span style='color:#484848;'> Contribution: </span>" + contrib.body;


                var radioButtons = document.getElementsByName("contribreview" + String(i) + "s");
                Array.from(radioButtons).forEach(
                  function(currentValue, currentIndex, listObj) { 
                    currentValue.name = [pair[0],pair[1]]; 
                  }
                )

            }
        }
        else {
            setTimeout(waitforArrayLoad, 250);
        }
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRadioValues() {
  var postUpdateComplete = false;
  var creditUpdateComplete = false;

  var checkedValue0;
  var key0 = document.getElementById('contribreview0r0').name.split(",");
  var article0 = key0[0];
  var contrib0 = key0[1];
  var checkedValue1;
  var key1 = document.getElementById('contribreview1r0').name.split(",");
  var article1 = key1[0];
  var contrib1 = key1[1];
  var checkedValue2;
  var key2 = document.getElementById('contribreview2r0').name.split(",");
  var article2 = key2[0];
  var contrib2 = key2[1];

  if (document.getElementById('contribreview0r0').checked) {
    checkedValue0 = document.getElementById('contribreview0r0').value;
  }
  else if (document.getElementById('contribreview0r1').checked) {
    checkedValue0 = document.getElementById('contribreview0r1').value;
  }
  else {
    alert("You must review all contributions");
  }

  if (document.getElementById('contribreview1r0').checked) {
    checkedValue1 = document.getElementById('contribreview1r0').value;
  }
  else if (document.getElementById('contribreview1r1').checked) {
    checkedValue1 = document.getElementById('contribreview1r1').value;
  }
  else {
    alert("You must review all contributions");
  }

  if (document.getElementById('contribreview2r0').checked) {
    checkedValue2 = document.getElementById('contribreview2r0').value;
  }
  else if (document.getElementById('contribreview2r1').checked) {
    checkedValue2 = document.getElementById('contribreview2r1').value;
  }
  else {
    alert("You must review all contributions");
  }

  if (checkedValue0 && checkedValue1 && checkedValue2) {
    firebase.database().ref('posts').once('value').then(function(snapshot) {

      val = snapshot.val();

      contribution0 = val[article0].contributions[contrib0];
      contribution0reviewct = contribution0.reviewct;
      contribution0toxicct = contribution0.toxicct;

      contribution1 = val[article1].contributions[contrib1];
      contribution1reviewct = contribution1.reviewct;
      contribution1toxicct = contribution1.toxicct;

      contribution2 = val[article2].contributions[contrib2];
      contribution2reviewct = contribution2.reviewct;
      contribution2toxicct = contribution2.toxicct;

      var newReviewct0 = contribution0reviewct + 1;
      if (checkedValue0 == "Toxic") {
        var newToxicct0 = contribution0toxicct + 1;
      }
      else {
        var newToxicct0 = contribution0toxicct;
      }

      var newReviewct1 = contribution1reviewct + 1;
      if (checkedValue1 == "Toxic") {
        var newToxicct1 = contribution1toxicct + 1;
      }
      else {
        var newToxicct1 = contribution1toxicct;
      }

      var newReviewct2 = contribution2reviewct + 1;
      if (checkedValue2 == "Toxic") {
        var newToxicct2 = contribution2toxicct + 1;
      }
      else {
        var newToxicct2 = contribution2toxicct;
      }

      var updates = {};

      updates['posts/' + article0 + '/contributions/' + contrib0 + '/reviewct'] = newReviewct0;
      updates['posts/' + article0 + '/contributions/' + contrib0 + '/toxicct'] = newToxicct0;
      updates['posts/' + article1 + '/contributions/' + contrib1 + '/reviewct'] = newReviewct1;
      updates['posts/' + article1 + '/contributions/' + contrib1 + '/toxicct'] = newToxicct1;
      updates['posts/' + article2 + '/contributions/' + contrib2 + '/reviewct'] = newReviewct2;
      updates['posts/' + article2 + '/contributions/' + contrib2 + '/toxicct'] = newToxicct2;

      firebase.database().ref().update(updates);

      postUpdateComplete = true;

    });

    firebase.database().ref('users/' + user.uid + '/credits').transaction(function(currentCredits) {
      var newValue = (currentCredits || 0) + 5;

      creditUpdateComplete = true;
      return newValue;
    });

    waitForUpdates();

    function waitForUpdates () {
      if (postUpdateComplete && creditUpdateComplete) {
        window.location.replace("https://sliced.us");
      }
      else {
        setTimeout(waitForUpdates, 250);
      }
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
        ourtakeSheet.insertRule('.authorPage { font-weight:bold; font-size: 30px; line-height: 40px; font-family: "Lato"; color: #484848; padding: 3% 0% 0% 0%;}', 0);
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


