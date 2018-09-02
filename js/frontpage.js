var user = null;

function updateUser(userUpdate) {
  user = userUpdate;

  if (user) {
    firebase.database().ref('users/' + user.uid + '/credits').once('value').then(function(snapshot) {
      credits = snapshot.val();

      var authDiv = document.getElementById("topright");
      while (authDiv.firstChild) {
        authDiv.removeChild(authDiv.firstChild);
      }

      var creditButton = document.createElement("button");
      creditButton.className = "topButton";
      var creditRef = firebase.database().ref('users/' + user.uid + '/credits');
      creditRef.on('value', function(snapshot) {
        creditButton.innerHTML = "<span style='color:#fc643f;'>SlicedCredit: </span>" + snapshot.val();
      });
      authDiv.appendChild(creditButton);

      var cloutButton = document.createElement("button");
      cloutButton.className = "topButton";
      var cloutRef = firebase.database().ref('users/' + user.uid + '/clout');
      cloutRef.on('value', function(snapshot) {
        cloutButton.innerHTML = "<span style='color:#fc643f;'>SlicedClout: </span>" + snapshot.val();
      });
      authDiv.appendChild(cloutButton);

      var signOutButton = document.createElement("button");
      signOutButton.id = "signOut";
      signOutButton.className = "topButton";
      signOutButton.innerHTML = "Sign Out";
      signOutButton.addEventListener('click', function(event) {
        firebase.auth().signOut();
      });
      authDiv.appendChild(signOutButton);

    });
  }
}

function loadArticles() {
	var articleArray = [];

	var rootRef = database.ref();
    var urlRef = rootRef.child("posts");
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        var contribution = child.val();
        var key = child.key;
        
        var link = document.createElement("div");
        link.className = "frontHolder"
        var aref = document.createElement("a");
        aref.className = "front";
        link.appendChild(aref);
        aref.href = "article.html?article=" + String(key);

        postRef = urlRef.child(String(key));

        postRef.child('contributions').orderByChild('paragraph_number').equalTo(1).on("value", function(snapshot) {
            val = snapshot.val();
            body = val.body;

            aref.innerHTML = "<span style='font-weight:bold;'>" + contribution.title + "</span>" + '\n' + body;

            articleArray.push(link);
        });

    console.log(articleArray);
    });

    var textDiv = document.getElementById("existingArticle");
	while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }

    var arrayLength = articleArray.length;
	for (var i = 0; i < arrayLength; i++) {

		var link = articleArray.pop();

        textDiv.appendChild(link);
    }

    });
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
	console.log(user);
	var databaseRef = firebase.database().ref('users').child(user.uid).child('credits');

	databaseRef.transaction(function(credits) {
	  if (credits != null) {
	  	console.log(credits);
	    credits = credits + 50;
	  }
	  return credits;
	});

}


