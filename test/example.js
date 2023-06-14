
var elastictest = require('../');

module.exports.tests = {};

module.exports.tests.example = function(test, common) {

  test('example', function(t) {

    var suite = new elastictest.Suite();

    var doc = {
      index: suite.props.index,
      type: '_doc',
      id: '1',
      body: {
        foo: 'bar'
      }
    };

    suite.action( function( done ){
      suite.client.index( doc, done );
    });

    suite.assert( function( done ){
      suite.client.count({
        index: doc.index,
        type: doc.type
      }, function( err, res ){
        t.equal( res.body.count, 1, 'record count' );
        done();
      });
    });

    suite.assert( function( done ){
      suite.client.get({
        index: doc.index,
        type: doc.type,
        id: doc.id
      }, function( err, res ){
        const body = res.body;
        t.equal( body.found, true );
        t.equal( body._id, doc.id );
        t.equal( body._index, doc.index );
        t.deepEqual( res.body._source, doc.body );
        t.equal( body._version, 1 );
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