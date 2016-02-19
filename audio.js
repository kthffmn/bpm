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

    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    source.connect(filter);

    const processor = context.createScriptProcessor();
    globalProcessor = processor;
    processor.onaudioprocess = event => {
      const buffer = event.inputBuffer.getChannelData(0);
      const power = buffer.reduce((sum, x) => sum + x*x, 0);
      // log to get loudness, sqrt to get radius:
      circle.setAttribute('r', 50 * Math.sqrt(Math.log10(power + 1)));
    }
    filter.connect(processor);

    // must connect processor to output to 'pull' on it,
    // but that's fine because output buffer defaults to zero:
    processor.connect(context.destination);
  }, error => {
    h.innerHTML = 'You must allow your microphone.';
    console.log(error);
  });
})(this);
