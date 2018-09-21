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
        clout: 0,
        credits: 5,
        votes: 0,
        editor: false
    });
    }
  });
  console.log("update received");
}

function updateUser(userUpdate) {
  user = userUpdate;

  if (user) {
    firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
      userInfo = snapshot.val();

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

    });
  }
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

    var instructionsSpace = document.createElement("div");
    instructionsSpace.id = "instructionsSpace";
    var existingContributions = document.createElement("div");
    var candidateContributions = document.createElement("div");
    var buttonSpace = document.createElement("div");
    buttonSpace.id = "buttonSpace";

    contribute.appendChild(instructionsSpace);
    contribute.appendChild(existingContributions);
    contribute.appendChild(candidateContributions);
    contribute.appendChild(buttonSpace);

    firebase.database().ref('posts/'  + String(articleID) + '/title').once('value').then(function(snapshot) {
      title = snapshot.val();
      var titleSlot = document.createElement("h2");
      titleSlot.innerHTML = title;
      var titleSpace = document.getElementById("titleSpace");
      while (titleSpace.firstChild){
        titleSpace.removeChild(titleSpace.firstChild);
      }
      titleSpace.appendChild(titleSlot);
    });

    var paragraph_count = -1;

    firebase.database().ref('posts/'  + String(articleID) + '/paragraph_count').once('value').then(function(snapshot) {
      paragraph_count = snapshot.val();
    });

    waitForParaCount();

    function waitForParaCount() {
      if (paragraph_count !== -1){

        if (paragraph_count > 1) {
            var dotSpace = document.createElement("p");
            dotSpace.innerHTML = "...";
            existingContributions.appendChild(dotSpace);
        }

        var i = 0;
        var rootRef = firebase.database().ref();
        var urlRef = rootRef.child("posts/" + String(articleID) + "/contributions").orderByChild("paragraph_number");
        urlRef.once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            var contribution = child.val();
            var key = child.key;

            var dateTimestamp = new Date(contribution.timestamp);
            var countDownDate = dateTimestamp.addHours(24).getTime();
            var subtext = document.createElement("div");

            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            if (contribution.accepted == true) {
                var newReadPara = document.createElement("p");
                newReadPara.innerHTML = contribution.body;
                read.appendChild(newReadPara);

                var newReviewPara = document.createElement("h4");
                newReviewPara.innerHTML = contribution.body;
                var reviewInfoName = document.createElement("p");
                reviewInfoName.className = "reviewDetails";
                reviewInfoName.innerHTML = "<i>Author</i>: " + contribution.author + " <i>Upvotes</i>: " + contribution.upvotes + " <i>Downvotes</i>: " + contribution.downvotes;;
                newReviewPara.appendChild(reviewInfoName);
                review.appendChild(newReviewPara);

                //only show the last paragraph.
                if (user && contribution.paragraph_number > (paragraph_count - 1)){

                    var newContributePara = document.createElement("p");
                    newContributePara.innerHTML = contribution.body;
                    existingContributions.appendChild(newContributePara);

                    var replaceDiv = document.createElement("div");
                    replaceDiv.id = "div" + String(i);
                    existingContributions.appendChild(replaceDiv);

                    var newlineDiv = document.createElement("div");
                    newlineDiv.id = "newline";
                    existingContributions.appendChild(newlineDiv);

                  }
            }
          });
        });

        var rootRef = firebase.database().ref();
        var urlRef = rootRef.child("posts/" + String(articleID) + "/contributions");
        urlRef.once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            var contribution = child.val();
            var key = child.key;

            var dateTimestamp = new Date(contribution.timestamp);
            var countDownDate = dateTimestamp.addHours(24).getTime();
            var subtext = document.createElement("div");

            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;
            if (contribution.accepted == false && user && distance > 0 && contribution.active == true) {
                var containerDiv = document.createElement("div");
                var para = document.createElement("div");
                para.id = "leftjustify" + String(key);
                para.className = "conditional";
                var t = document.createTextNode(contribution.body);
                para.appendChild(t);

                var submitInfo = document.createElement("div");
                submitInfo.id = "rightjustify"

                containerDiv.appendChild(para);
                containerDiv.appendChild(submitInfo);
                candidateContributions.appendChild(containerDiv);

                addCountdown(submitInfo, contribution.timestamp, contribution.author);
                addCounter(submitInfo, key, articleID);
                i++;
            }
            else if (contribution.accepted == false && user && distance <= 0 && contribution.active == true) {
              firebase.database().ref('posts/' + String(articleID)).once('value').then(function(snapshot) {
                post = snapshot.val();
                var newActivect = post.activect - 1;
                updates = {};
                updates['posts/' + String(articleID) + "/contributions/" + key + '/active'] = false;
                updates['posts/' + String(articleID) + '/activect'] = newActivect;
                firebase.database().ref().update(updates);
              });
            }
          });
          if (!user){
            var contributeAlert = document.createElement("p");
            contributeAlert.innerHTML = "Sign In to Contribute!"
            contribute.appendChild(contributeAlert);
          }
          else {
            var instructions = document.createElement("p");
            console.log(i);
            if (i > 0){
              instructions.innerHTML = "Vote on existing contributions to the article. If something is missing, write your own!";
            }
            else if (i == 0) {
              instructions.innerHTML = "There are no active contributions. Write your own!";
            }
            instructions.id = "instructions";
            instructionsSpace.appendChild(instructions);
          }

          
          if (user) {
            addButton(i,articleID);
          }
        });
      }
      else {
        setTimeout(waitForParaCount, 250);
      }
    }
}

function addTextBox(i,articleID) {

    var buttonSpace = document.getElementById("buttonSpace");
    console.log(buttonSpace);
    while (buttonSpace.firstChild) {
      buttonSpace.removeChild(buttonSpace.firstChild);
    }

    var txtBox = document.createElement("textarea");

    txtBox.cols = 75;
    txtBox.rows = 5;
    txtBox.maxLength = 650;
    txtBox.id = "txtbox" + String(i);

    var undoButton = document.createElement("button");
    undoButton.innerHTML = "Cancel";
    undoButton.setAttribute('onclick','addPrompt('+String(i)+','+'"'+String(articleID)+'"'+')');
    undoButton.className = "undoSubmit";

    var submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.setAttribute('onclick','submitText('+String(i)+','+'"'+String(articleID)+'"'+')');
    submitButton.className = "undoSubmit";

    var txtDiv = document.createElement("div")
    txtDiv.id = "addContribution";
    txtDiv.appendChild(txtBox);
    txtDiv.appendChild(undoButton);
    txtDiv.appendChild(submitButton);
    buttonSpace.appendChild(txtDiv);
}

function addButton(i,articleID) {

    var contributeButton = document.createElement("button");
    contributeButton.innerHTML = "Write your own!";
    contributeButton.setAttribute('onclick','addTextBox('+String(i)+','+'"'+String(articleID)+'"'+')');
    contributeButton.id = "contributeButton";

    var buttonSpace = document.getElementById("buttonSpace");
    buttonSpace.appendChild(contributeButton);
}

function addPrompt(i,articleID) {
    var buttonSpace = document.getElementById("buttonSpace");
    while (buttonSpace.firstChild) {
      buttonSpace.removeChild(buttonSpace.firstChild);
    }
    addButton(i,articleID);

}

function submitText(i,articleID) {

    var votes = 0
    firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
      user_value = snapshot.val();
        if (user_value.votes >= 5 || user_value.free_contributions == 1) {
            var textInput = document.getElementById("txtbox" + String(i)).value;

            var now = new Date().getTime();

            var contributionID = writeNewContribution(textInput,0,0,false,user.displayName,user.uid,now,articleID,0,0,true);

            loadText(articleID);
            var updates = {};

            if (user_value.free_contributions == 1) {
              updates['users/' + user.uid + '/free_contributions'] = 0
            }
            else {
              updates['users/' + user.uid + '/votes'] = 0;
            }

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
    var countDownDate = dateTimestamp.addHours(24).getTime();
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
    upcounter.className = "voteButton";
    downcounter = document.createElement('button');
    downcounter.id = "downer" + String(contributionID);
    downcounter.className = "voteButton";

    upcounter.innerHTML = "Upvote";
    downcounter.innerHTML = "Downvote";

    upcounter.setAttribute('onclick','onClick(' + '"upvotes",' + '"' + String(contributionID) + '"' + ',' + '"' + String(articleID) + '"' +')');
    downcounter.setAttribute('onclick','onClick(' + '"downvotes",' + '"' + String(contributionID) + '"' + ',' + '"' + String(articleID) + '"'+')');


    upcount = document.createElement("p");
    upcount.id = "up" + String(contributionID);
    upcount.innerHTML = "0";
    upcount.className = "voteText";
    downcount = document.createElement("p");
    downcount.id = "down" + String(contributionID);
    downcount.innerHTML = "0";
    downcount.className = "voteText";

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

    var authorUid = '';
    firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID + '/' + 'uid').once('value').then(function(snapshot) {
      authorUid = snapshot.val();
    });

    waitforUid();

    function waitforUid() {
      if (authorUid !== ''){

        if (authorUid !== user.uid) {

          firebase.database().ref('users/' + user.uid + '/credits').once('value').then(function(snapshot) {
          var currentCredits = snapshot.val();
          console.log(currentCredits);
          if (currentCredits){
            console.log(currentCredits);
            var newCredits = currentCredits - 1;

            firebase.database().ref('users/' + user.uid + '/votes').once('value').then(function(snapshot) {

                var updates = {};

                var currentVotes = snapshot.val();
                if (currentVotes != null) {
                  var newVotes = currentVotes + 1;
                  updates['users/' + user.uid + '/votes'] = newVotes;
                }
                else {
                  updates['users/' + user.uid + '/votes'] = 1;
                }
                updates['users/' + user.uid + '/credits'] = newCredits;

                firebase.database().ref().update(updates);

            });

            var ref = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID + '/' + direction);
            ref.transaction(function(currentClicks) {
            // If node/clicks has never been set, currentRank will be `null`.
              var newValue = (currentClicks || 0) + 1;

              if (newValue >= 10) {
                if (direction == 'upvotes') {
                    integrateText(contributionID, articleID, authorUid);
                }
                else if (direction == 'downvotes') {
                    removeText(contributionID, articleID);
                }
              }
              return newValue;
            });

          }
          else {
            alert("Add credits to vote on contributions");
        }
      });

        }
        else {
          alert("You can't vote on your own contributions. Check out what others have written!");
        }
      }
      else {
        setTimeout(waitforUid, 250);
      }

    }
  }

function integrateText(contributionID, articleID, authorUid) {

    firebase.database().ref('posts/' + String(articleID)).once('value').then(function(snapshot) {
      var article = snapshot.val();
      console.log(article);
      var currentParagraphs = article.paragraph_count;
      var newParagraphCount = currentParagraphs + 1;

      console.log(article.contributions)

      var upvotes = article.contributions[String(contributionID)].upvotes;
      var downvotes = article.contributions[String(contributionID)].downvotes;

      console.log(upvotes)
      console.log(downvotes)

      var cloutBoost = upvotes - downvotes;

      var now = new Date().getTime();

      var updates = {};
      updates['posts/' + String(articleID) + '/contributions/' + contributionID + '/accepted'] = true;
      updates['posts/' + String(articleID) + '/contributions/' + contributionID + '/paragraph_number'] = newParagraphCount;
      updates['posts/' + String(articleID) + '/paragraph_count'] = newParagraphCount;
      updates['posts/' + String(articleID) + '/timestamp'] = now;
      firebase.database().ref().update(updates);

      firebase.database().ref('users/' + String(authorUid) + '/clout').transaction(function(currentClout) {
        var newClout = (currentClout || 0) + cloutBoost;
        return newClout;
      });

      loadText(articleID);


    });
}

function removeText(contributionID, articleID) {
    //this should be updated at some point so that the content is logged.
    // var ref = firebase.database().ref('posts/' + String(articleID) + '/contributions/' + contributionID);
    // ref.remove();
    updates = {};
    updates['posts/' + String(contributionID) + '/' + String(articleID) + '/active'] = false
    firebase.database().ref().update(updates);

    loadText(articleID);
}


function writeNewContribution(body, upvotes, downvotes, accepted, author, uid, timestamp, articleID, reviewct, toxicct, active) {
  // A post entry.
  var contributionData = {
    body: body,
    upvotes: upvotes,
    downvotes: downvotes,
    accepted: accepted,
    author: author,
    uid: uid,
    timestamp: timestamp,
    reviewct: reviewct,
    toxicct: toxicct,
    active: active
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
    location.href='https://sliced.us';
    alert("Go to the contribute section of any article to find contributions to vote on!");
}

function contributeButtonActions() {
    location.href='https://sliced.us';
    alert("Go to the contribute section of any article to write your own contributions!");
}

function pageLoad() {
    if (window.location.hash === "#contribution") {
      var contribTab = document.getElementById("contribTab");
      var readTab = document.getElementById("defaultOpen");
      var contribDiv = document.getElementById("Contribute");
      var readDiv = document.getElementById("Read");
      contribTab.className = "tablinks active";
      readTab.className = "tablinks";
      contribDiv.style = "display: block;";
      readDiv.style = "display: none";
      alert("Go to the contribute section of any article to find contributions to vote on!");
    }
}

window.onload = function() {
  pageLoad();
};