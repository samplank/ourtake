var user = null;

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
              signOutButton.className = "topButton";
              signOutButton.innerHTML = user.displayName + "<br><span style='color:#fc643f;'>SlicedClout: </span>" + userInfo.clout;
              signOutButton.addEventListener('click', function(event) {
                firebase.auth().signOut();
              });
              authDiv.appendChild(signOutButton);

              var cloutButton = document.createElement("button");
              cloutButton.className = "topButton";
              cloutButton.innerHTML = "Leaderboard";
              cloutButton.setAttribute('onclick', "location.href='https://sliced.us/leaderboard'");
              authDiv.appendChild(cloutButton);

              var howToButton = document.createElement("button");
              howToButton.className = "topButton";
              howToButton.innerHTML = "How To Slice"
              howToButton.setAttribute('onclick', "location.href='https://sliced.us/howto'");
              authDiv.appendChild(howToButton);

              var flowDiv = document.getElementById("topleft");
              while (flowDiv.firstChild) {
                  flowDiv.removeChild(flowDiv.firstChild);
              }

              var earnButton = document.createElement("button");
              earnButton.className = "topButton";
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
              voteButton.className = "topButton";
              // voteButton.innerHTML = "Vote" + "<br><span>Votes Needed: </span>" + neededVotes;
              voteButton.setAttribute('onclick', "voteButtonActions()");
              flowDiv.appendChild(voteButton);

              var arrow2 = document.createElement("img");
              // arrow2.src = "https://sliced.us/arrow.jpg";
              arrow2.className = "arrow";
              flowDiv.appendChild(arrow2);

              var contribButton = document.createElement("button");
              contribButton.className = "topButton";
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
    addButton();
}

function addButton(name) {

    if (user) {
        waitForRef();
    }

    function waitForRef() {
        var userProf;
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
      location.href = 'https://sliced.us/article.html?article=' + String(key) + '#contribution';

    });
  });
    // location.href='https://sliced.us';
}

function contributeButtonActions() {
    location.href='https://sliced.us';
    alert("Go to the contribute section of any article to write your own contributions!");
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
