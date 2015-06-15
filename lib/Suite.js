
var randomstring = require('randomstring'),
    elasticsearch = require('elasticsearch'),
    async = require('async');

function Suite( clientOpts, props ){
  this.actions = [];
  this.asserts = [];
  this.client = null;
  this.clientOpts = clientOpts || {
    host: 'localhost:9200',
    keepAlive: true,
    // log: 'trace'
  };
  this.props = props || {};
  if( !this.props.hasOwnProperty('index') ){
    this.props.index = 'testindex-' + randomstring.generate(7).toLowerCase();
  }
}

Suite.prototype.action = function( action ){
  this.actions.push( action );
};

Suite.prototype.assert = function( assert ){
  this.asserts.push( assert );
};

Suite.prototype.start = function( cb ){
  this.client = new elasticsearch.Client( this.clientOpts );
  cb();
};

Suite.prototype.create = function( cb ){
  var cmd = { index: this.props.index };
  if( this.props.hasOwnProperty('schema') ){
    cmd.body = this.props.schema;
  }
  this.client.indices.create( cmd, cb );
};

Suite.prototype.delete = function( cb ){
  var cmd = { index: this.props.index };
  this.client.indices.delete( cmd, cb );
};

Suite.prototype.refresh = function( cb ){
  var cmd = { index: this.props.index };
  this.client.indices.refresh( cmd, cb );
};

Suite.prototype.run = function( cb ){
  var self = this;
  self.start( function(){
    self.create( function(){
      async.series( self.actions, function(){
        self.refresh( function(){
          async.series( self.asserts, function(){
            self.delete( function(){
              self.client.close();
              if( 'function' === typeof cb ){
                cb();
              }
            });
          });
        });
      });
    });
  });
};

module.exports = Suite;