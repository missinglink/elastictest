
var elastictest = require('../');

module.exports.tests = {};

var custom_schema = {
  settings: { index: { refresh_interval: '-1' } },
  mappings: { mytype: { properties: { name: { type: 'long' } } } }
};

// test creating index with custom schema
module.exports.tests.custom_schema = function(test, common) {

  test('mappings', function(t) {

    var suite = new elastictest.Suite( null, { schema: custom_schema });

    // ensure custom mappings are set
    suite.assert( function( done ){
      suite.client.indices.getMapping({
        index: suite.props.index,
        type: 'mytype'
      }, function( err, res ){
        t.deepEqual( res[suite.props.index].mappings, custom_schema.mappings, 'mappings set' );
        done();
      });
    });

    suite.run( t.end );

  });

  test('settings', function(t) {

    var suite = new elastictest.Suite( null, { schema: custom_schema });

    // ensure custom settings are set
    suite.assert( function( done ){
      suite.client.indices.getSettings({
        index: suite.props.index
      }, function( err, res ){
        t.deepEqual( res[suite.props.index].settings.index_concurrency, custom_schema.settings.index_concurrency, 'settings set' );
        done();
      });
    });

    suite.run( t.end );

  });
};

// test creating index with default schema
module.exports.tests.default_schema = function(test, common) {

  test('mappings', function(t) {

    var suite = new elastictest.Suite();

    // ensure custom mappings are set
    suite.assert( function( done ){
      suite.client.indices.getMapping({
        index: suite.props.index
      }, function( err, res ){
        var expected = {};
        expected[suite.props.index] = { mappings: {} };
        t.deepEqual( res, expected, 'default mappings' );
        done();
      });
    });

    suite.run( t.end );

  });

  test('settings', function(t) {

    var suite = new elastictest.Suite();

    // ensure custom settings are set
    suite.assert( function( done ){
      suite.client.indices.getSettings({
        index: suite.props.index
      }, function( err, res ){
        t.deepEqual( res[suite.props.index].settings.index_concurrency, undefined, 'default settings' );
        done();
      });
    });

    suite.run( t.end );

  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Suite: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};