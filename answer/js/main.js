'use strict';

let feedOfferButton;
let feedOfferTextArea;
let answerTextArea;

let iceTextArea;
let feedIceButton;
let feedIceTextArea;

let startButton;
let callButton;
let remoteVideo;

let localStream;
let pc;

window.onload = function() {
    feedOfferButton = document.getElementById('feed_offer');
    feedOfferTextArea = document.getElementById('feed_offer_textarea');
    feedOfferButton.onclick = feedOffer;

    answerTextArea = document.getElementById('answer_textarea');

    iceTextArea = document.getElementById('local_ice');
    feedIceTextArea = document.getElementById('feed_ice');
    feedIceButton = document.getElementById('feed_ice_button');
    feedIceButton.onclick = feedIce;

    remoteVideo = document.getElementById('remoteVideo');
};

function gotStream(stream) {
  localStream = stream;
  callButton.disabled = false;
}

function start() {
  startButton.disabled = true;
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  .then(gotStream)
  .catch(function(e) {
    alert('getUserMedia() error: ' + e.name);
  });
}

function feedOffer() {
    let text = feedOfferTextArea.value;
    let desc = JSON.parse(text);

    let servers = {
        'iceServers': [
            {
                'url': 'stun:stun.l.google.com:19302'
            }
        ]
    };
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = function (e) {
        onIceCandidate(pc, e);
    };
    pc.ontrack = gotRemoteStream;

    pc.setRemoteDescription(desc).then(
        function () {
        },
        function (err) {
        }
    );
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc.createAnswer().then(
        onCreateAnswerSuccess,
        function (err) {
        }
    );
}

function gotRemoteStream(e) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
  }
}

function onCreateAnswerSuccess(desc) {
  answerTextArea.innerText = JSON.stringify(desc);

  pc.setLocalDescription(desc).then(
      function() {},
      function (err) {}
  );
}

function onIceCandidate(pc, event) {
  iceTextArea.innerText = iceTextArea.value + "\n" + JSON.stringify(event.candidate);
}

function feedIce() {
    let candidate = JSON.parse(feedIceTextArea.value);
    pc.addIceCandidate(candidate);
}

