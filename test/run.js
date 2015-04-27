
var tape = require('tape');
var common = {};

var tests = [
  require('./example')
];

tests.map(function(t) {
  t.all(tape, common);
});