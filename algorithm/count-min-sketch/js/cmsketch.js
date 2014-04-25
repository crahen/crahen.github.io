
function CMSketch(accuracy, confidence, seed) {

  // Create storage for counts
  probError = (1.0 - confidence);
  var width = Math.ceil(Math.E / accuracy)|0;
  var depth = Math.ceil(-Math.log(probError)/Math.log(Math.E))|0;
  var counts = new Array(depth);
  for (var i = 0; i < depth; ++i) {
    counts[i] = new Array(width);
  }
  for (var i = 0; i < depth; ++i) {
    for (var j = 0; j < width; ++j) {
      counts[i][j] = 0;
    }
  }
  size = 0;

  // Seedable prng function
  var seed = seed || new Date().getSeconds();
  var prng = new Math.seedrandom(this.seed);

  // Distribute universal hash functions
  var hash_a = new Array(depth);
  var hash_b = new Array(depth);
  for (var i = 0; i < depth; ++i) {
    hash_a[i] = prng();
    hash_b[i] = prng();
  }

  var hash = function(a, b, item) {
    var hash = 0, i, chr, len;
    item = item.toString();
    if (item.length > 0) {
      for (i = 0, len = item.length; i < len; i++) {
        chr = item.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
    }
    return Math.round(Math.abs((a*hash) + b)) % counts[0].length;
  }

  // Update the counter for a given value.
  this.update = function(value, count) {
    var result = Number.MAX_VALUE - 1;
    count = count || 1
      for (var i = 0; i < depth; ++i) {
        var j = hash(hash_a[i], hash_b[i], value);
        counts[i][j] += count;
        result = Math.min(result, counts[i][j]);
      }
    size++;
    return result;
  }

  this.lookup = function(value) {
    var result = Number.MAX_VALUE - 1;
    for (var i = 0; i < depth; ++i) {
      var j = hash(hash_a[i], hash_b[i], value);
      result = Math.min(result, counts[i][j]);
    }
    return result;
  }

  // Get the space used by the filter in bytes.
  this.space = function() {
    return width * depth * 4;
  }

  // Get the number of items that passed through the filter.
  this.size = function() {
    return size++;
  }

}
