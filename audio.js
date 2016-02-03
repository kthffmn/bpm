((window, undefined) => {
  navigator.getUserMedia =  navigator.getUserMedia       ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia    ||
                            null;

  const h = document.querySelector('h1');
  const circle = document.querySelector('circle');


  navigator.getUserMedia({audio: true}, stream => {
    h.innerHTML = 'Thanks';
    h.setAttribute('style', 'opacity: 0;');

    const audioContext = new AudioContext();
    const audioStream = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    audioStream.connect(analyser);

    function animate() {
      analyser.getByteTimeDomainData(buffer);
      const sum = buffer.reduce( (prev, curr) => prev + Math.abs(curr - 128) );
      circle.setAttribute('r', sum / buffer.length);

      requestAnimationFrame(animate);
    }
    animate();
  }, error => {
    h.innerHTML = 'You must allow your microphone.';
    console.log(error);
  });
})(this);
