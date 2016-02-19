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
    const buffer = new Float32Array(analyser.fftSize);
    audioStream.connect(analyser);

    function animate() {
      analyser.getFloatTimeDomainData(buffer);
      const power = buffer.reduce( (sum, x) => sum + x*x, 0 );
      const loudness = Math.log10(power + 1);
      // use sqrt for radius so that area is proportional to loudness:
      circle.setAttribute('r', 50 * Math.sqrt(loudness));

      requestAnimationFrame(animate);
    }
    animate();
  }, error => {
    h.innerHTML = 'You must allow your microphone.';
    console.log(error);
  });
})(this);
