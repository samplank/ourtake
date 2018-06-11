var user = null;

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
      credits: 10,
      votes: 0
    });
    }
  });
}

function updateUser(userUpdate) {
  user = userUpdate;
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function loadText(articleID) {

    var read = document.getElementById("ReadText");
    // read.innerHTML = '';
    while (read.firstChild) {
      read.removeChild(read.firstChild);
    }
    var review = document.getElementById("ReviewText");
    // review.innerHTML = '';
    while (review.firstChild) {
      review.removeChild(review.firstChild);
    }
    var contribute = document.getElementById("ContributeText");
    // contribute.innerHTML = '';
    while (contribute.firstChild) {
      contribute.removeChild(contribute.firstChild);
    }

    var i = 0;
    var rootRef = firebase.database().ref();
    var urlRef = rootRef.child("posts/" + String(articleID) + "/contributions");
    urlRef.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        var contribution = child.val();
        var key = child.key;

        var dateTimestamp = new Date(contribution.timestamp);
        var countDownDate = dateTimestamp.addHours(3).getTime();
        var subtext = document.createElement("div");

        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        if (contribution.accepted == true) {
            var newReadPara = document.createElement("p");
            newReadPara.innerHTML = contribution.body;
            read.appendChild(newReadPara);

            var newReviewPara = document.createElement("p");
            newReviewPara.innerHTML = contribution.body;
            var reviewInfoName = document.createElement("h4");
            reviewInfoName.innerHTML = "Author: " + contribution.author;
            var reviewInfoDateVotes = document.createElement("h4");
            reviewInfoDateVotes.innerHTML = "Upvotes: " + contribution.upvotes + " Downvotes: " + contribution.downvotes; 
            newReviewPara.appendChild(reviewInfoName);
            newReviewPara.appendChild(reviewInfoDateVotes);
            review.appendChild(newReviewPara);

            if (user){

                var newContributePara = document.createElement("p");
                newContributePara.innerHTML = contribution.body;
                contribute.appendChild(newContributePara);

                var replaceDiv = document.createElement("div");
                replaceDiv.id = "div" + String(i);
                contribute.appendChild(replaceDiv);

                var newlineDiv = document.createElement("div");
                newlineDiv.id = "newline";
                contribute.appendChild(newlineDiv);
              }

            i++;

        }

        else if (contribution.accepted == false && user && distance > 0) {
            var para = document.createElement("div");
            para.id = "leftjustify" + String(key);
            para.className = "conditional";
            var t = document.createTextNode(contribution.body);
            para.appendChild(t);

            var submitInfo = document.createElement("div");
            submitInfo.id = "rightjustify"

            contribute.appendChild(para);
            contribute.appendChild(submitInfo);

            addCountdown(submitInfo, contribution.timestamp, contribution.author);
            addCounter(submitInfo, key, articleID);
        }
      });
    i--;

    if (!user){
      var contributeAlert = document.createElement("p");
      contributeAlert.innerHTML = "Sign In to Contribute!"
      contribute.appendChild(contributeAlert);
    }
    else {
      addButton(i, articleID);
    }
    });
}

function addTextBox(i,articleID) {

    var txtBox = document.createElement("input");

    txtBox.setAttribute("type", "text");
    txtBox.setAttribute("value", "");
    txtBox.setAttribute("name", "Test Name");
    txtBox.maxLength = 500;
    txtBox.id = "txtbox" + String(i);

    var undoButton = document.createElement("button");
    undoButton.innerHTML = "Cancel";
    undoButton.setAttribute('onclick','addButton('+String(i)+','+'"'+String(articleID)+'"'+')');

    var submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.setAttribute('onclick','submitText('+String(i)+','+'"'+String(articleID)+'"'+')');

    var textDiv = document.getElementById("div" + String(i));
    while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
    }
    textDiv.appendChild(txtBox);
    textDiv.appendChild(undoButton);
    textDiv.appendChild(submitButton);
}

function addButton(i,articleID) {
    var contributeButton = document.createElement("button");
    contributeButton.innerHTML = "Contribute to this article!";
    contributeButton.setAttribute('onclick','addTextBox('+String(i)+','+'"'+String(articleID)+'"'+')');
    var textDiv = document.getElementById("div" + String(i));
    if(textDiv){
      while (textDiv.firstChild) {
        textDiv.removeChild(textDiv.firstChild);
      }
    }
    else {
      var contribute = document.getElementById("ContributeText");
      var textDiv = document.createElement("div");
      textDiv.id = "div" + String(-1);
      contribute.appendChild(textDiv);
    }
    textDiv.appendChild(contributeButton);
}

function submitText(i,articleID) {

    var databaseRef = firebase.database().ref('users/' + user.uid + '/votes');

    // this isn't working right because on listens for changes and we only want to get the value once.
    var votes = 0
    firebase.database().ref('users/' + user.uid + '/votes').once('value').then(function(snapshot) {
      votes = snapshot.val();
        if (votes >= 5) {
            var textInput = document.getElementById("txtbox" + String(i)).value;

            var now = new Date().getTime();

            var contributionID = writeNewContribution(textInput,0,0,false,user.displayName,now,articleID);

            loadText(articleID);
            var updates = {};
            updates['users/' + user.uid + '/votes'] = 0;

            firebase.database().ref().update(updates);
        }
        else {
            alert("To contribute, you must have voted at least five times since your last contribution.");
        }
    });
}

Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}


function addCountdown(subinfo, timestamp, justname) {

    var dateTimestamp = new Date(timestamp);
    var countDownDate = dateTimestamp.addHours(3).getTime();
    var subtext = document.createElement("div");
    subinfo.appendChild(subtext);

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var name = document.createTextNode("Submitted by: " + justname);
      var b = document.createElement("br");
      var timeleft = document.createTextNode("Time left: " + hours + "h " + minutes + "m ");

      while (subtext.firstChild) {
          subtext.removeChild(subtext.firstChild);
      }

      subtext.appendChild(name);
      subtext.appendChild(b);
      subtext.appendChild(timeleft);

      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        subtext.innerHTML = "EXPIRED";

      }
    }, 1000);    

}

function addCounter(subinfo, contributionID, articleID) {


    updown = document.createElement('div');
    upcounter = document.createElement('button');
    upcounter.id = "upper" + String(contributionID);
    downcounter = document.createElement('button');
    downcounter.id = "downer" + String(contributionID);

    upcounter.innerHTML = "Upvote";
    downcounter.innerHTML = "Downvote";

    upcounter.setAttribute('onclick','onClick(' + '"upvotes",' + '"' + String(contributionID) + '"' + ',' + '"' + String(articleID) + '"' +')');
    downcounter.setAttribute('onclick','onClick(' + '"downvotes",' + '"' + String(contributionID) + '"' + ',' + '"' + String(articleID) + '"'+')');


    upcount = document.createElement("p");
    upcount.id = "up" + String(contributionID);
    upcount.innerHTML = "0";
    downcount = document.createElement("p");
    downcount.id = "down" + String(contributionID);
    downcount.innerHTML = "0";

    upcounter.appendChild(upcount);
    updown.appendChild(upcounter);
    downcounter.appendChild(downcount);
    updown.appendChild(downcounter);
    subinfo.appendChild(updown);

    var upvoteRef = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID + '/upvotes');
    upvoteRef.on('value', function(snapshot) {
        votes = document.getElementById("up" + String(contributionID))
        votes.innerHTML = String(snapshot.val());
    });

    var downvoteRef = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID + '/downvotes');
    downvoteRef.on('value', function(snapshot) {
        votes = document.getElementById("down" + String(contributionID))
        votes.innerHTML = String(snapshot.val());
    });


}

function onClick(direction, contributionID, articleID) {

    console.log("click");

    firebase.database().ref('users/' + user.uid + '/credits').once('value').then(function(snapshot) {
        var currentCredits = snapshot.val();
        console.log(currentCredits);
        if (currentCredits){
          var newCredits = currentCredits - 1;

          firebase.database().ref('users/' + user.uid + '/votes').once('value').then(function(snapshot) {

              var updates = {};

              var currentVotes = snapshot.val();
              if (currentVotes != null) {
                console.log(currentVotes);
                var newVotes = currentVotes + 1;
                console.log(newVotes);
                updates['users/' + user.uid + '/votes'] = newVotes;
              }
              else {
                updates['users/' + user.uid + '/votes'] = 1;
              }
              updates['users/' + user.uid + '/credits'] = newCredits;
              console.log(updates['users/' + user.uid + '/votes']);

              firebase.database().ref().update(updates);

          });

        }
        else {
          console.log("Add credits to vote on contributions");
      }
    });

    var ref = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID + '/' + direction);
    ref.transaction(function(currentClicks) {
    // If node/clicks has never been set, currentRank will be `null`.
      var newValue = (currentClicks || 0) + 1;
      if (newValue >= 10) {
        if (direction == 'upvotes') {
            integrateText(contributionID, articleID);
        }
        else if (direction == 'downvotes') {
            removeText(contributionID, articleID);
        }
      }
      return newValue;
    });
  }

function integrateText(contributionID, articleID) {

    var updates = {};
    updates['posts/' + String(articleID) + '/contributions/' + contributionID + '/accepted'] = true;

    firebase.database().ref().update(updates);

    loadText(articleID);



}

function removeText(contributionID, articleID) {
    var ref = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID);
    ref.remove();
    loadText(articleID);
}


function writeNewContribution(body, upvotes, downvotes, accepted, author, timestamp, articleID) {
  // A post entry.
  var contributionData = {
    body: body,
    upvotes: upvotes,
    downvotes: downvotes,
    accepted: accepted,
    author: author,
    timestamp: timestamp
  };

  // Get a key for a new Post.
  var newContributionKey = firebase.database().ref().child('posts/' + String(articleID) + '/contributions').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['posts/' + String(articleID) + '/contributions/' + newContributionKey] = contributionData;

  var datRef = firebase.database().ref();
  datRef.update(updates);

  return newContributionKey;

}

