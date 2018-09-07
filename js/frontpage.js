var user = null;

function updateUser(userUpdate) {
  user = userUpdate;

  if (user) {
    firebase.database().ref('users/' + user.uid + '/credits').once('value').then(function(snapshot) {
      credits = snapshot.val();

      var authDiv = document.getElementById("topright");
      // while (authDiv.firstChild) {
      //   authDiv.removeChild(authDiv.firstChild);
      // }

      var creditCount = document.createElement("p");
      // creditButton.className = "topButton";
      creditCount.id = "creditCount";
      var creditRef = firebase.database().ref('users/' + user.uid + '/credits');
      creditRef.on('value', function(snapshot) {
        creditCount.innerHTML = "<span style='color:#fc643f;'>SlicedCredit: </span>" + snapshot.val();
      });
      authDiv.appendChild(creditCount);

      var increaseCreditButton = document.createElement("button");
      increaseCreditButton.setAttribute('onclick','increaseCredits()');
      increaseCreditButton.innerHTML = '+';
      increaseCreditButton.id = "increaseCreditButton";
      authDiv.appendChild(increaseCreditButton);


      // var cloutButton = document.createElement("button");
      // cloutButton.className = "topButton";
      // var cloutRef = firebase.database().ref('users/' + user.uid + '/clout');
      // cloutRef.on('value', function(snapshot) {
      //   cloutButton.innerHTML = "<span style='color:#fc643f;'>SlicedClout: </span>" + snapshot.val();
      // });
      // authDiv.appendChild(cloutButton);

      // var signOutButton = document.createElement("button");
      // signOutButton.id = "signOut";
      // signOutButton.className = "topButton";
      // signOutButton.innerHTML = "Sign Out";
      // signOutButton.addEventListener('click', function(event) {
      //   firebase.auth().signOut();
      // });
      // authDiv.appendChild(signOutButton);

      var nameDropDown = document.createElement("div");
      nameDropDown.className = "dropdown"
      var dropDownButton = document.createElement("button");
      dropDownButton.className = "topButton";
      var dropDownContent = document.createElement("div");
      dropDownContent.className = "dropdown-content";
      dropDownContent.innerHTML = user.displayName;
      var cloutRef = firebase.database().ref('users/' + user.uid + '/clout');
      cloutRef.on('value', function(snapshot) {
        dropDownContent.innerHTML = "<span style='color:#fc643f;'>" + user.displayName + "<br>SlicedClout: " + snapshot.val() + "</span>";
      });
      var rankingsList = document.createElement("a");
      rankingsList.href = "#";
      rankingsList.innerHTML = "SlicedClout Rankings"
      // rankingsList.setAttribute('onclick','addTextBox(' + '"' +  name + '"' + ')')
      var votesSince = document.createElement("a");
      votesSince.href = "#";
      var voteRef = firebase.database().ref('users/' + user.uid + '/votes');
      voteRef.on('value', function(snapshot) {
        votesSince.innerHTML = "Votes Since Contribution: " + snapshot.val();
      });
      var signOutButton = document.createElement("a");
      signOutButton.href = "#";
      signOutButton.innerHTML = "Sign Out";
      signOutButton.setAttribute('onclick', 'firebase.auth().signOut()')

      dropDownContent.appendChild(rankingsList);
      dropDownContent.appendChild(votesSince);
      dropDownContent.appendChild(signOutButton);
      nameDropDown.appendChild(dropDownButton);
      nameDropDown.appendChild(dropDownContent);
      authDiv.appendChild(nameDropDown);

    });
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

        postRef = urlRef.child(String(key));

        var body = '';

        postRef.child('contributions').orderByChild('paragraph_number').equalTo(1).on("value", function(snapshot) {
            val = snapshot.val();
            val = val[Object.keys(val)[0]];
            body = val.body;
        });


        waitForBody();

        function waitForBody() {
            if (body != '') {
                aref.innerHTML = "<span style='font-weight:bold; font-size: 28px'>" + contribution.title + '</span><br style="line-height: 40px" />' + body;

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
}

function addButton(name) {
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
    console.log(typeof(name));
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
	    timestamp: timestamp,
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
        credits: 5,
        votes: 0
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


