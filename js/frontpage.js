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

            var topLeftOut = document.getElementById("topLeftOut");
            var topLeftIn = document.getElementById("topLeftIn")

            while (topLeftOut.firstChild) {
              topLeftOut.removeChild(topLeftOut.firstChild);
            }

            while (topLeftIn.firstChild) {
              topLeftIn.removeChild(topLeftIn.firstChild);
            }

            var cloutButton = document.createElement("button");
            cloutButton.className = "topButtonIn";
            cloutButton.innerHTML = "Leaderboard";
            cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
            topLeftIn.appendChild(cloutButton);

            var howToButton = document.createElement("button");
            howToButton.className = "topButtonIn";
            howToButton.innerHTML = "How To Slice"
            howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
            topLeftIn.appendChild(howToButton);

            var signOutButton = document.createElement("button");
            signOutButton.id = "signOut";
            signOutButton.className = "topButtonRight";
            signOutButton.innerHTML = "Log Out";
            signOutButton.addEventListener('click', function(event) {
              firebase.auth().signOut();
            });

            var myProfile = document.createElement("button");
            myProfile.className = "topButtonRight";
            myProfile.innerHTML = '<span style="vertical-align:middle;">My Profile </span><img src="' + userInfo.plane + '.jpg" id="buttonPizza">';
            var href = '"https://sliced.us/author.html?author=' + userUid + '"'; 
            myProfile.setAttribute('onclick', 'location.href=' + href);

            if (is_mobile) {
              topLeftIn.appendChild(myProfile);
              topLeftIn.appendChild(signOutButton);
            }
            else if (!is_mobile) {
              authDivMove.appendChild(signOutButton);
              authDivMove.appendChild(myProfile);
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
        var article = child.val();
        var key = child.key;
        
        var link = document.createElement("div");
        link.className = "frontHolder"
        var aref = document.createElement("a");
        aref.className = "front";
        link.appendChild(aref);
        aref.href = "article.html?article=" + String(key);

        var activect = "<i>Active Contributions</i>: " + article.activect;

        updatedTimestamp = article.updatedTimestamp

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

        var authors = [];


        for (contribution in article.contributions) {
          if (article.contributions[contribution].accepted == true) {
            authors.push(article.contributions[contribution].author);
          }
        }

        var uniqueAuthors = authors.filter(onlyUnique);

        var authorHTML = 'Authors: ';

        for (each in uniqueAuthors) {
          authorHTML = authorHTML + String(uniqueAuthors[each]) + ', ';
        }

        authorHTML = authorHTML.slice(0, -2);

        var articleDetails = timeago + "<br>" + authorHTML;




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
                aref.innerHTML = '<p class="title">' + article.title + '</p></span><p class="reviewDetails">' + articleDetails + '</p>' + body;
                buttonDiv = document.createElement("div");
                buttonDiv.className = "buttonDiv";
                readButton = document.createElement("button");
                if (article.paragraph_count == 1) {
                  readButton.innerHTML = "Read " + article.paragraph_count + " accepted contribution";
                }
                else {
                  readButton.innerHTML = "Read " + article.paragraph_count + " accepted contributions";
                }
                readButton.className = "addToArticle";
                readButton.setAttribute('onclick','location.href="article.html?article=' + String(key) + '"');
                addToButton = document.createElement("button");
                addToButton.className = "addToArticle";
                addToButton.setAttribute('onclick','location.href="article.html?article=' + String(key) +'#contribute"');
                addToButton.innerHTML = "Add your own thoughts";
                buttonDiv.appendChild(readButton);
                buttonDiv.appendChild(addToButton);
                link.appendChild(buttonDiv);
                articleArray.push(link);
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

  var planes = ["plane_upright", "plane_downright", "plane_upleft", "plane_downleft"];

  var plane = planes[Math.floor(Math.random() * planes.length)];

	userRef.once("value").then((snapshot) => {
	  if (snapshot.exists()) { 
	  	
	  } else {
	  	firebase.database().ref('users/' + userId).set({
	    username: name,
	    email: email,
        clout: 0,
        credits: 0,
        votes: 0,
        editor: false,
        plane: plane
		});
	  }
	});
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function increaseCredits() {
  var ref = firebase.database().ref('users/' + user.uid + '/credits');
  ref.transaction(function(currentCredits) {
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
        ourtakeSheet.insertRule("#readcontainer { position: absolute; top: 20%; padding: 0% 10%; }", 0);
        ourtakeSheet.insertRule("#logo { position: absolute; top: 5%; left: 45%; display: block; margin-left: auto; margin-right: auto; width: 15%; }", 0);
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

    } else if (is_mobile) {
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
        ourtakeSheet.insertRule('.addToArticle { font-family: "Lato", sans-serif; font-size: 30px; display: inline-block; background: #fff4db; color: black; border-radius: 3px; white-space: nowrap; margin: 5px; height: 100px; width: 45%; vertical-align: top; white-space: normal;}', 0);
        ourtakeSheet.insertRule('.frontHolder { padding: 24px; margin: 15% 0% 0% 0%; }', 0);
        ourtakeSheet.insertRule('p { font-family: "Lora", serif; font-size: 32px; line-height: 48px; }', 0);
        ourtakeSheet.insertRule('.front { font-family: "Lora", serif; font-size: 32px; line-height: 40px; color: black; text-decoration: none; }', 0);
        ourtakeSheet.insertRule('.title { font-weight: bold; font-size: 40px; line-height: 40px; }', 0);
    }
}
