function loadArticles() {
	var textDiv = document.getElementById("existingArticle");

	var rootRef = database.ref();
    var urlRef = rootRef.child("posts");
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        var contribution = child.val();
        var key = child.key;
        
        var link = document.createElement("li");
        var aref = document.createElement("a");
        link.appendChild(aref);
        aref.href = "article.html?article=" + String(key);
        aref.innerHTML = contribution.title;

        textDiv.appendChild(link);

      });
    });
}

function addButton() {
    var contributeButton = document.createElement("button");
    contributeButton.innerHTML = "Add a new article!";
    contributeButton.setAttribute('onclick','addTextBox()');
    var textDiv = document.getElementById("addArticle");
    while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }
    textDiv.appendChild(contributeButton);

}

function addTextBox() {
	var txtBox = document.createElement("input");

    txtBox.setAttribute("type", "text");
    txtBox.setAttribute("value", "");
    txtBox.setAttribute("name", "Test Name");
    txtBox.maxLength = 100;
    txtBox.id = "txtbox";

    var undoButton = document.createElement("button");
    undoButton.innerHTML = "Cancel";
    undoButton.setAttribute('onclick','addButton()');

    var submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.setAttribute('onclick','submitText()');

    var textDiv = document.getElementById("addArticle");
    while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }
    textDiv.appendChild(txtBox);
    textDiv.appendChild(undoButton);
    textDiv.appendChild(submitButton);
}


function submitText() {

    var title = document.getElementById("txtbox").value;
    console.log(title);

    var now = new Date().getTime();

    var contributionID = writeNewPost(title,"Sam Plank",now);

    addButton();

}

function writeNewPost(title,author,timestamp) {
	var postData = {
	    title: title,
	    author: author,
	    timestamp: timestamp
	 };

	 console.log(postData);

	// Get a key for a new Post.
	var newPostKey = firebase.database().ref().child('posts').push().key;

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/posts/' + newPostKey] = postData;

	var datRef = firebase.database().ref();
	datRef.update(updates);

	return newPostKey;
}


