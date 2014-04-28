
function CMSketch(accuracy, confidence, seed) {

  // Create storage for counts
  var width = Math.ceil(3 / accuracy);
  var depth = Math.ceil(-Math.log(1.0 - confidence));
  var counts = new Array(depth);
  for (var i = 0; i < depth; ++i) {
    counts[i] = new Array(width);
    for (var j = 0; j < counts[i].length; ++j) {
      counts[i][j] = 0.0;
    }
  }

  // Seedable prng function
  var seed = seed || new Date().getSeconds();
  var prng = new Math.seedrandom(this.seed);

  // Distribute universal hash functions
  var hash_a = new Array(depth);
  for (var i = 0; i < depth; ++i) {
    hash_a[i] = prng();
  }

  var hash = function(a, value) {
    // Only really need universal hash functions, pair-wise is extra.
    var h = murmurhash3_32_gc(value.toString(), seed);
    return Math.floor(a*h) % counts[0].length;
  }

  // Update the counter for a given value.
  this.update = function(value, count) {
    var result = Number.MAX_VALUE;
    for (var i = 0; i < hash_a.length; ++i) {
      var j = hash(hash_a[i], value);
      counts[i][j] += count;
      result = Math.min(result, counts[i][j]);
    }
    return result;
  }

  this.lookup = function(value) {
    var result = Number.MAX_VALUE;
    for (var i = 0; i < hash_a.length; ++i) {
      var j = hash(hash_a[i], value);
      result = Math.min(result, counts[i][j]);
    }
    return result;
  }

  // Get the space used by the filter in bytes.
  this.space = function() {
    return width * depth * 4;
  }

  // Get the accuracy.
  this.accuracy = function() {
    return accuracy;
  }

  // Get the confidence.
  this.confidence = function() {
    return confidence;
  }

}
