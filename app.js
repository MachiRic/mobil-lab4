var pubnub = null;
var ready = false;

function sendMessageFromForm(event) {
    event.preventDefault();
    if (ready) {
        var message = document.getElementById("messageInput").value;
        pubnub.publish({ message: { "text": message }, channel: document.getElementById("header").innerHTML });
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

            if (msg.channel == document.getElementById("header").innerHTML) {
                document.getElementById("messages").append(element);
            }
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['Unknown', "North", "East", "South", "West"]
    });
}

if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', function(event) {
        var absolute = event.absolute;
        var alpha    = event.alpha;
        var beta     = event.beta;
        var gamma    = event.gamma;

        var heading = 0;

        if (typeof event.webkitCompassHeading !== "undefined") {
            alpha = event.webkitCompassHeading; //for iOS devices
            heading = alpha
        }
        else {
            heading = 360 - alpha; //heading [0, 360)
        }

        var headingStr = "Unknown";
        if (heading >= 315 || heading <= 45) {
            headingStr = "North";
        }
        else if (heading >= 45 && heading <= 135) {
            headingStr = "East";
        }
        else if (heading >= 135 && heading <= 225) {
            headingStr = "South";
        }
        else if (heading >= 225 && heading <= 315) {
            headingStr = "West";
        }

        document.getElementById("header").innerHTML = headingStr;
    }, false);
} else {
    alert("Your device does not support orientation.");
}