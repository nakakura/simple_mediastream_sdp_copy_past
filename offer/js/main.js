'use strict';

let createOfferButton;
let offerTextArea;

let feedAnswerButton;
let feedAnswerTextArea;

let iceTextArea;
let feedIceTextArea;
let feedIceButton;

let startButton;
let callButton;

let startTime;
let localVideo;

let localStream;
let pc;
let offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

window.onload = function() {
    createOfferButton = document.getElementById('create_offer');
    offerTextArea = document.getElementById('offer_textarea');

    feedAnswerButton = document.getElementById('feed_answer');
    feedAnswerTextArea = document.getElementById('feed_answer_textarea');
    feedAnswerButton.onclick = feedAnswer;

    iceTextArea = document.getElementById('local_ice');
    feedIceTextArea = document.getElementById('feed_ice');
    feedIceButton = document.getElementById('feed_ice_button');
    feedIceButton.onclick = feedIce;

    startButton = document.getElementById('startButton');
    callButton = document.getElementById('callButton');
    callButton.disabled = true;
    startButton.onclick = start;
    callButton.onclick = call;

    localVideo = document.getElementById('localVideo');
    localVideo.addEventListener('loadedmetadata', function () {
    });
};

function gotStream(stream) {
    localVideo.srcObject = stream;
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

function call() {
    callButton.disabled = true;
    startTime = window.performance.now();
    let videoTracks = localStream.getVideoTracks();
    let audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
    }
    if (audioTracks.length > 0) {
    }
    let servers = {
        'iceServers': [
            {
                'url': 'stun:stun.l.google.com:19302'
            }
        ]
    };
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = function(e) {
        onIceCandidate(pc, e);
    };

    localStream.getTracks().forEach(
        function(track) {
            pc.addTrack(
                track,
                localStream
            );
        }
    );

    pc.createOffer(
        offerOptions
    ).then(
        onCreateOfferSuccess,
        function (err) {});
}

function onCreateOfferSuccess(desc) {
    offerTextArea.innerText = JSON.stringify(desc);

    pc.setLocalDescription(desc).then(
        function() {},
        function (err) { }
    );
}

function feedAnswer() {
    let text = feedAnswerTextArea.value;
    let desc = JSON.parse(text);

    pc.setRemoteDescription(desc).then(
        function () {},
        function (err) {}
    );
}

function feedIce() {
    let candidate = JSON.parse(feedIceTextArea.value);
    pc.addIceCandidate(candidate)
        .then(
            function() {},
            function(err) {}
        );
}

function onIceCandidate(pc, event) {
    iceTextArea.innerText = iceTextArea.value + "\n" + JSON.stringify(event.candidate);
}
