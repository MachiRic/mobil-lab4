var pubnub = null;
var ready = false;

function sendMessageFromForm(event) {
    event.preventDefault();
    if (ready) {
        var message = document.getElementById("messageInput").value;
        pubnub.publish({ message: { "text": message }, channel: 'demo_tutorial' });
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
            console.log(msg);
            var element = document.createElement("div");
            element.className = "message";
            element.innerHTML = msg.message.text;
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
