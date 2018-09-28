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
function loadArticles() {
	var articleArray = [];
    var n = 0;

	var rootRef = database.ref();
    var urlRef = rootRef.child("posts");
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        n++;
        var contribution = child.val();
        var key = child.key;
        
        var link = document.createElement("div");
        link.className = "frontHolder"
        var aref = document.createElement("a");
        aref.className = "front";
        link.appendChild(aref);
        aref.href = "article.html?article=" + String(key);

        var activect = "<i>Active Contributions</i>: " + contribution.activect;

        updatedTimestamp = contribution.updatedTimestamp

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = now - updatedTimestamp;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        var t = new Date(updatedTimestamp);
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var m = month[t.getMonth()];
        var d = t.getDate();
        var y = t.getFullYear();


        if (days > 3) {
            var timeago = "Last Update: " + m + " " + d + ", " + y;
        }
        else if (days > 0) {
            var timeago = "Last Update: " + days + "d ago";
        }
        else if (hours > 0) {
            var timeago = "Last Update: " + hours + "h ago";
        }
        else {
            var timeago = "Last Update: " + minutes + "m ago";
        }

        var articleDetails = timeago;




        postRef = urlRef.child(String(key));

        var body = '';

        postRef.child('contributions').orderByChild('paragraph_number').equalTo(1).on("value", function(snapshot) {
            val = snapshot.val();
            if (!val) {
                body = "   ";
            }
            else {
                val = val[Object.keys(val)[0]];
                body = val.body;
            }
        });


        waitForBody();

        function waitForBody() {
            if (body != '') {
                aref.innerHTML = "<span style='font-weight:bold; font-size: 28px'>" + contribution.title + '</span><p class="reviewDetails">' + articleDetails + '</p>' + body;
                buttonDiv = document.createElement("div");
                buttonDiv.className = "buttonDiv";
                addToButton = document.createElement("button");
                addToButton.className = "addToArticle";
                addToButton.setAttribute('onclick','location.href="article.html?article=' + String(key) +'#contribute"');
                addToButton.innerHTML = "Contribute to this Article";
                otherButton = document.createElement("button");
                otherButton.innerHTML = "other button!";
                otherButton.className = "addToArticle";
                buttonDiv.appendChild(addToButton);
                buttonDiv.appendChild(otherButton);
                link.appendChild(buttonDiv);
                articleArray.push(link);
                console.log(link);
            }
            else {
                setTimeout(waitForBody, 250);
            }
        }

      });

    });

    waitforTitleLoad();

    function waitforTitleLoad() {
        if (articleArray.length == n && n !== 0) {
            var textDiv = document.getElementById("existingArticle");
            while (textDiv.firstChild) {
                textDiv.removeChild(textDiv.firstChild);
            }

            var arrayLength = articleArray.length;
            for (var i = 0; i < arrayLength; i++) {

                var link = articleArray.pop();

                textDiv.appendChild(link);
            }
        }
        else {
            setTimeout(waitforTitleLoad, 250);
        }
    }
    addButton();
}

function addButton(name) {

    var userProf;

    if (user) {
        waitForRef();
    }

    function waitForRef() {
        var userRef = firebase.database().ref('users/' + user.uid);
        userRef.once("value").then((snapshot) => {
            userProf = snapshot.val();
        });
        if (userProf) {
            console.log(userProf);
            if (userProf.editor == true) {
                var contributeButton = document.createElement("button");

                contributeButton.innerHTML = "Add a new article!";
                contributeButton.setAttribute('onclick','addTextBox(' + '"' +  name + '"' + ')');
                contributeButton.id = "newArticleButton";

                var textDiv = document.getElementById("addArticle");

                if (textDiv) {
                    while (textDiv.firstChild) {
                    textDiv.removeChild(textDiv.firstChild);
                }
                textDiv.appendChild(contributeButton);
                }
            }
        }
        else {
            console.log("waiting");
            setTimeout(waitForRef, 250);
        }
    }
}

function removeButton() {
	var textDiv = document.getElementById("addArticle");

	if (textDiv) {
		while (textDiv.firstChild) {
        	textDiv.removeChild(textDiv.firstChild);
    	}
	}
}

function addTextBox(name) {

	var txtBox = document.createElement("input");


    txtBox.setAttribute("type", "text");
    txtBox.setAttribute("value", "");
    txtBox.setAttribute("name", "Test Name");
    txtBox.maxLength = 100;
    txtBox.id = "txtbox";

    var undoButton = document.createElement("button");
    undoButton.innerHTML = "Cancel";
    undoButton.setAttribute('onclick','addButton(' + '"' +  name + '"' + ')');

    var submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.setAttribute('onclick','submitText(' + '"' +  name + '"' + ')');

    var textDiv = document.getElementById("addArticle");
    while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }
    textDiv.appendChild(txtBox);
    textDiv.appendChild(undoButton);
    textDiv.appendChild(submitButton);
}


function submitText(name) {

    var title = document.getElementById("txtbox").value;
    console.log(title);

    var now = new Date().getTime();

    var contributionID = writeNewPost(title,user.displayName,now);

    location.reload(true);

}

function writeNewPost(title,author,timestamp) {
	var postData = {
	    title: title,
	    author: author,
	    createdTimestamp: timestamp,
        updatedTimestamp: timestamp,
	    paragraph_count: 0
	 };

	 console.log(postData);

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('posts').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/posts/' + newPostKey] = postData;

	var datRef = firebase.database().ref();
	datRef.update(updates);

	location.reload(true);

	return newPostKey;
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

function increaseCredits() {
  var ref = firebase.database().ref('users/' + user.uid + '/credits');
  ref.transaction(function(currentCredits) {
    console.log(currentCredits);
  // If node/clicks has never been set, currentRank will be `null`.
    var newValue = (currentCredits || 0) + 5;

    return newValue;
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
    location.href='https://sliced.us';
    alert("Go to the contribute section of any article to write your own contributions!");
}

function checkMobile() {
    ourtakeSheet = document.styleSheets[0];
    if (!is_mobile) {
        ourtakeSheet.insertRule("#readcontainer { padding: 0% 10%; }", 0);
        ourtakeSheet.insertRule("#logo { display: block; margin-left: auto; margin-right: auto; width: 12%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 40%; position:absolute; top: 4%; right: 2%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule("#topright { flex-grow: 1; }", 0);
        ourtakeSheet.insertRule("#topleft { width: 30%; position:absolute; top: 4%; right: 66%; padding: 6px 12px; display: flex;}", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 4% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Trebuchet MS", sans-serif; font-size: 18px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Trebuchet MS", sans-serif; font-size: 18px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 50px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.addToArticle { font-family: "Trebuchet MS", sans-serif; font-size: 22px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 50px; width: 45%; vertical-align: top; white-space: normal;}', 0);
        ourtakeSheet.insertRule('.frontHolder { padding: 24px; margin: 10% 0% 0% 0%; }', 0);
    } else if (is_mobile) {
        ourtakeSheet.insertRule("#readcontainer { padding: 0% 0%; }", 0)
        ourtakeSheet.insertRule("#logo { display: block; margin-left: auto; margin-right: auto; width: 25%; }", 0);
        ourtakeSheet.insertRule("#topcontainer { width: 100%; padding: 0px 0px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topleft { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule("#topright { width: 100%; padding: 6px 12px; display: flex; }", 0);
        ourtakeSheet.insertRule(".arrow { display: block; width: 5%; height: 5%; margin: 3% 0%; }", 0);
        ourtakeSheet.insertRule('.topButtonRight { font-family: "Trebuchet MS", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 31%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.topButtonLeft { font-family: "Trebuchet MS", sans-serif; font-size: 24px; display: inline-block; background: white; color: black; width: 26.75%; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; vertical-align: top; float: right }', 0);
        ourtakeSheet.insertRule('.addToArticle { font-family: "Trebuchet MS", sans-serif; font-size: 30px; display: inline-block; background: white; color: black; border-radius: 5px; box-shadow: 1px 1px 1px grey; white-space: nowrap; margin: 5px; height: 100px; width: 45%; vertical-align: top; white-space: normal;}', 0);
        ourtakeSheet.insertRule('.frontHolder { padding: 24px; margin: 15% 0% 0% 0%; }', 0)
    }
}
