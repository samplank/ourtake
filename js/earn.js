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

              var authDiv = document.getElementById("topright");
              while (authDiv.firstChild) {
                authDiv.removeChild(authDiv.firstChild);
              }

              var signOutButton = document.createElement("button");
              signOutButton.id = "signOut";
              signOutButton.className = "topButtonRight";
              signOutButton.innerHTML = userInfo.username + "<br><span style='color:#fc643f;'>SlicedClout: </span>" + userInfo.clout;
              signOutButton.addEventListener('click', function(event) {
                firebase.auth().signOut();
              });
              authDiv.appendChild(signOutButton);

              var cloutButton = document.createElement("button");
              cloutButton.className = "topButtonRight";
              cloutButton.innerHTML = "Leaderboard";
              cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
              authDiv.appendChild(cloutButton);

              var howToButton = document.createElement("button");
              howToButton.className = "topButtonRight";
              howToButton.innerHTML = "How To Slice"
              howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
              authDiv.appendChild(howToButton);

              var flowDiv = document.getElementById("topleft");
              while (flowDiv.firstChild) {
                  flowDiv.removeChild(flowDiv.firstChild);
              }

              var earnButton = document.createElement("button");
              earnButton.className = "topButtonLeft";
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
              voteButton.className = "topButtonLeft";
              // voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
              voteButton.setAttribute('onclick', "voteButtonActions()");
              flowDiv.appendChild(voteButton);

              var arrow2 = document.createElement("img");
              // arrow2.src = "https://sliced.us/arrow.jpg";
              arrow2.className = "arrow";
              flowDiv.appendChild(arrow2);

              var contribButton = document.createElement("button");
              contribButton.className = "topButtonLeft";
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
                contributionArray.push([key, x, val[x], contribution.title]);
                n++
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
                titleContainer.innerHTML = title;

                var reviewContainer = document.getElementById("contrib" + String(i))
                reviewContainer.innerHTML = contrib.body;


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

