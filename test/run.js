
var tape = require('tape');
var common = {};

var tests = [
  require('./example'),
  require('./custom_schema')
];

tests.map(function(t) {
  t.all(tape, common);
});