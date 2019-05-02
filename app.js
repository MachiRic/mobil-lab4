window.onload = function() {
    var pubnub = new PubNub({
        publishKey: 'pub-c-59697c06-f283-4238-8e6e-80683e33d185',
        subscribeKey: 'sub-c-ef28c7fe-6cba-11e9-a1d6-2a8c316da507'
    });

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                pubnub.publish({ message: { "color": "blue" }, channel: 'demo_tutorial' });
            }
        },
        message: function(msg) {
            console.log(msg.message);
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
