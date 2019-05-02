var pubnub = null;
var ready = false;

function sendMessageFromForm(event) {
    event.preventDefault();
    if (ready) {
		let message = document.getElementById("messageInput").value;
		var me = document.getElementById("userInput").value;
        pubnub.publish({ message: { "text": message, "user": me }, channel: 'demo_tutorial' });
        document.getElementById("messageInput").value = "";
    }
}

window.onload = function() {
    pubnub = new PubNub({
        publishKey: 'pub-c-59697c06-f283-4238-8e6e-80683e33d185',
        subscribeKey: 'sub-c-ef28c7fe-6cba-11e9-a1d6-2a8c316da507'
    });

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                ready = true;
            }
        },
        message: function(msg) {
			var me = document.getElementById("userInput").value;
			console.log(msg);
			console.log("publisher: ", msg.publisher.split("-")[5])
            let element = document.createElement("div");
            
			element.innerHTML = msg.message.text;
			let usr = document.createElement("div");
			usr.className = "usr";
			usr.innerHTML = `user: ${msg.message.user}`;
			if (msg.message.user===me) {
				element.className = "message message-other";
			}
			else {
				element.className = "message-other";
			}
			element.appendChild(usr);
			document.getElementById("messages").append(element);
			
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['demo_tutorial']
    });
}

function deviceOrientationListener(event) {
  var alpha   = event.alpha; //z axis rotation [0,360)
  var beta     = event.beta; //x axis rotation [-180, 180]
  var gamma   = event.gamma; //y axis rotation [-90, 90]

  //Check if absolute values have been sent
  if (typeof event.webkitCompassHeading !== "undefined") {
    alpha = event.webkitCompassHeading; //for iOS devices
    var heading = alpha
    document.getElementById("heading").innerHTML = heading.toFixed([0]);
  }
  else {
    alert("Your device is reporting relative alpha values, so this compass won't point north :(");
    var heading = 360 - alpha; //heading [0, 360)
    document.getElementById("heading").innerHTML = heading.toFixed([0]);
  }
}
