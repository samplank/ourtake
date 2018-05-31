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

function addButton(name) {
	console.log(name);
    var contributeButton = document.createElement("button");

    contributeButton.innerHTML = "Add a new article!";

    contributeButton.setAttribute('onclick','addTextBox(' + name + ')');
    var textDiv = document.getElementById("addArticle");

    console.log("hit");
    while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }
    textDiv.appendChild(contributeButton);
    console.log("hit");

}

function addTextBox(name) {
	console.log("hit");

	var txtBox = document.createElement("input");

	console.log("hit");

    txtBox.setAttribute("type", "text");

    console.log("hit");
    txtBox.setAttribute("value", "");
    console.log("hit");
    txtBox.setAttribute("name", "Test Name");
    console.log("hit");
    txtBox.maxLength = 100;
    console.log("hit");
    txtBox.id = "txtbox";
    console.log("hit");

    var undoButton = document.createElement("button");
    console.log("hit");
    undoButton.innerHTML = "Cancel";
    console.log("hit");
    console.log(typeof(name));
    undoButton.setAttribute('onclick','addButton(' + name + ')');
    console.log("hit");

    var submitButton = document.createElement("button");
    console.log("hit");
    submitButton.innerHTML = "Submit";
    console.log("hit");
    submitButton.setAttribute('onclick','submitText(' + name + ')');
    console.log("hit");

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

    var contributionID = writeNewPost(title,name,now);

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


