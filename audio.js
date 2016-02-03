var globalProcessor;

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
      console.log(buffer[0]);
      const sum = buffer.reduce( (prev, curr) => prev + Math.abs(curr) );
      circle.setAttribute('r', 1000 * sum / buffer.length);
    }

    source.connect(processor);
    processor.connect(context.destination);

  }, error => {
    h.innerHTML = 'You must allow your microphone.';
    console.log(error);
  });
})(this);
