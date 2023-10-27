chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    if (!stream) {
        console.error("Failed to capture tab audio.");
        return;
    }

    // Use the captured audio stream for recording with MediaRecorder.
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    // WebSocket code (assuming you have a 'socket' object defined)
    socket.onmessage = msg => {
        const { transcript } = JSON.parse(msg.data).channel.alternatives[0];
        if (transcript) {
            console.log(transcript); // Log the transcript to the console
        }
    };

    recorder.addEventListener('dataavailable', evt => {
        if (evt.data.size > 0 && socket.readyState === 1) {
            socket.send(evt.data);
        }
    });

    socket.onopen = () => {
        recorder.start(250);
    };
});