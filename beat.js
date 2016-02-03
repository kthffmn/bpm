var Beat = function(buffer) {
  this.buffer = buffer;
  this.peaks;
  this.initialThresold = 0.9;
  this.thresold = this.initialThresold;
  this.minThresold = 0.3;
  this.minPeaks = 30;
  this.filter();
  this.init();
}

Beat.prototype.init = function() {
  this.peaks = getPeaksAtThreshold(this.buffer.getChannelData(0), this.thresold);
  this.intervals = countIntervalsBetweenNearbyPeaks(this.peaks);
  this.groups = groupNeighborsByTempo(this.intervals, this.buffer.sampleRate);
}

function getPeaksAtThreshold(data, threshold) {
  var peaksArray = [];
  var length = data.length;
  for(var i = 0; i < length;) {
    if (data[i] > threshold) {
      peaksArray.push(i);
      i += 10000;
    }
    i++;
  }
  return peaksArray;
}

function countIntervalsBetweenNearbyPeaks(peaks) {
  var intervalCounts = [];
  peaks.forEach(function(peak, index) {
    for(var i = 0; i < 10; i++) {
      var interval = peaks[index + i] - peak;
      var foundInterval = intervalCounts.some(function(intervalCount) {
        if (intervalCount.interval === interval)
          return intervalCount.count++;
      });
      if (!foundInterval) {
        intervalCounts.push({
          interval: interval,
          count: 1
        });
      }
    }
  });
  return intervalCounts;
}

function groupNeighborsByTempo(intervalCounts, sampleRate) {
  var tempoCounts = [];
  intervalCounts.forEach(function(intervalCount, i) {
    if (intervalCount.interval !== 0) {
      var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      theoreticalTempo = Math.round(theoreticalTempo);
      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo)
          return tempoCount.count += intervalCount.count;
      });
      if (!foundTempo) {
        tempoCounts.push({
          tempo: theoreticalTempo,
          count: intervalCount.count
        });
      }
    }
  });
  return tempoCounts;
}
