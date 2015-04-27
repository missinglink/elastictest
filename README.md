A simple test harness for elasticsearch functional testing

### Install

```bash
npm install elastictest --save
```

[![NPM](https://nodei.co/npm/elastictest.png?downloads=true&stars=true)](https://nodei.co/npm/elastictest/)

### Example Script

```javascript
var suite = new elastictest.Suite();

var doc = {
  index: suite.props.index,
  type: 'mytype',
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
    t.equal( res.count, 1, 'record count' );
    done();
  });
});

suite.run();
```

### Usage

#### Create a new test suite

```javascript
var suite = new elastictest.Suite();
```

#### Perform an 'action' on the database before running assertions

`suite.client` is an instance of the elasticsearch javascript client, so you can do anything that is [supported by that API](http://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html).

You **must** call `done()` when your async operations are complete. You may add as many `suite.action` sections as you wish per suite.

**note** the test suite will handle refreshing your index so that the data is up-to-date before the assert operations are run.

```javascript
suite.action( function( done ){
  suite.client.index( {}, done );
});
```

#### Run an 'assert' on the database to test if the actions were successful

`suite.assert` allows you to run assertion code against the responses from `suite.client` calls to the database. You can use whatever assertion library you wish as long as it handles the exception catching. In the example below I am using `t.equals` from `npm tape`. A full example can be found in `./test`.

You **must** call `done()` when your async operations are complete. You may add as many `suite.assert` sections as you wish per suite.

```javascript
suite.assert( function( done ){
  suite.client.count({
    index: doc.index,
    type: doc.type
  }, function( err, res ){
    t.equal( res.count, 1, 'record count' );
    done();
  });
});
```

#### Run the suite

You may provide an `optional_callback` function to run once the suite is complete. This is useful for telling your alerting your testing framework that work is done for this unit of work.

```javascript
suite.run( optional_callback );
```

---

## License

(The MIT License)

Copyright (c) 2013 Peter Johnson &lt;@insertcoffee&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
