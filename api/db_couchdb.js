//. db_cloudant.js
var express = require( 'express' ),
    multer = require( 'multer' ),
    bodyParser = require( 'body-parser' ),
    request = require( 'request' ),
    uuidv1 = require( 'uuid/v1' ),
    api = express();

var settings = require( '../settings' );

//. env values
var database_url = 'COUCHDB_DATABASE_URL' in process.env ? process.env.COUCHDB_DATABASE_URL : settings.couchdb_database_url; 

var db = '';
var db_headers = { 'Accept': 'application/json' };

var tmp = database_url.split( '/' );
if( tmp.length > 0 ){
  db = tmp[tmp.length-1];
}

tmp = database_url.split( '//' );
if( tmp.length > 0 ){
  tmp = tmp[1].split( '@' );
  if( tmp.length > 0 ){
    var db_basic = Buffer.from( tmp[0] ).toString( 'base64' );
    db_headers['Authorization'] = 'Basic ' + db_basic;
  }
}

//. POST メソッドで JSON データを受け取れるようにする
api.use( multer( { dest: '../tmp/' } ).single( 'image' ) );
api.use( bodyParser.urlencoded( { extended: true } ) );
api.use( bodyParser.json() );
api.use( express.Router() );


//. 新規作成用関数
api.createItem = function( item, id ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var t = ( new Date() ).getTime();
      item.created = t;
      item.updated = t;

      var option = {
        url: database_url + '/' + id,
        method: 'PUT',
        json: item,
        headers: db_headers
      };
      request( option, ( err, res, body ) => {
        if( err ){
          resolve( { status: false, error: err } );
        }else{
          resolve( { status: true, result: body } );
        }
      });
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

api.createItems = function( items ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var t = ( new Date() ).getTime();
      for( var i = 0; i < items.length; i ++ ){
        items[i].created = t;
        items[i].updated = t;
      }

      var option = {
        url: database_url + '/_bulk_docs',
        method: 'POST',
        json: { docs: items },
        headers: db_headers
      };
      request( option, ( err, res, body ) => {
        if( err ){
          resolve( { status: false, error: err } );
        }else{
          resolve( { status: true, result: body } );
        }
      });
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

//. １件取得用関数
api.readItem = function( id ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      if( id ){
        var option = {
          url: database_url + '/' + id,
          method: 'GET',
          headers: db_headers
        };
        request( option, ( err, res, doc ) => {
          if( err ){
            resolve( { status: false, error: err } );
          }else{
            doc = JSON.parse( doc );
            resolve( { status: true, result: doc } );
          }
        });
      }else{
        resolve( { status: false, error: 'no id' } );
      }
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

//. 複数件取得用関数
api.readItems = function( limit, start ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var url = database_url + '/_all_docs?include_docs=true';
      if( limit ){
        url += '&limit=' + limit;
      }
      if( start ){
        url += '&skip=' + start;
      }
      var option = {
        url: url,
        method: 'GET',
        headers: db_headers
      };
      request( option, ( err, res, body ) => {
        if( err ){
          resolve( { status: false, error: err } );
        }else{
          body = JSON.parse( body );
          var docs = [];
          if( body && body.rows ){
            body.rows.forEach( function( doc ){
              docs.push( doc.doc );
            });
          }
          resolve( { status: true, results: docs } );
        }
      });
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

api.queryItems = function( key, limit, start ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var url = database_url + '/_find';
      var option = {
        url: url,
        method: 'POST',
        json: { selector: { name: key } },
        headers: db_headers
      };
      request( option, ( err, res, body ) => {
        if( err ){
          resolve( { status: false, error: err } );
        }else{
          body = JSON.parse( body );
          var docs = [];
          if( body && body.docs ){
            body.docs.forEach( function( doc ){
              docs.push( doc );
            });
          }

          if( start ){
            docs.splice( 0, start );
          }
          if( limit ){
            docs.splice( limit )
          }
          resolve( { status: true, results: docs } );
        }
      });
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

//. １件更新用関数
api.updateItem = function( item ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      if( !item._id ){
        resolve( { status: false, error: 'id needed.' } );
      }else{
        var option = {
          url: database_url + '/' + item._id,
          method: 'GET',
          headers: db_headers
        };
        request( option, ( err, res, body ) => {
          if( err ){
            resolve( { status: false, error: err } );
          }else{
            body = JSON.parse( body );
            option = {
              url: database_url + '/' + item._id + '?rev=' + body._rev,
              method: 'PUT',
              json: item,
              headers: db_headers
            };
            request( option, ( err, res, result ) => {
              if( err ){
                resolve( { status: false, error: err } );
              }else{
                //result = JSON.parse( result );
                resolve( { status: true, result: result } );
              }
            });
          }
        });
      }
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

//. １件削除用関数
api.deleteItem = function( id ){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      if( !id ){
        resolve( { status: false, error: 'id needed.' } );
      }else{
        var option = {
          url: database_url + '/' + id,
          method: 'GET',
          headers: db_headers
        };
        request( option, ( err, res, doc ) => {
          if( err ){
            resolve( { status: false, error: err } );
          }else{
            doc = JSON.parse( doc );
            option = {
              url: database_url + '/' + id + '?rev=' + doc._rev,
              method: 'DELETE',
              headers: db_headers
            };
            request( option, ( err, res, body ) => {
              if( err ){
                resolve( { status: false, error: err } );
              }else{
                body = JSON.parse( body );
                resolve( { status: true, body: body } );
              }
            });
          }
        });
      }
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};

api.deleteItems = function(){
  return new Promise( ( resolve, reject ) => {
    if( db ){
      var url = database_url + '/_all_docs?include_docs=true';
      var option = {
        url: url,
        method: 'GET',
        headers: db_headers
      };
      request( option, ( err, res, body ) => {
        if( err ){
          resolve( { status: false, error: err } );
        }else{
          body = JSON.parse( body );
          if( body && body.rows ){
            var docs = [];
            body.rows.forEach( function( doc ){
              doc.doc._deleted = true;
              docs.push( doc.doc );
            });

            //. バルク削除して resolve
            url = database_url + '/_bulk_docs';
            option = {
              url: url,
              method: 'POST',
              json: { docs: docs },
              headers: db_headers
            };
            request( option, ( err, res, body ) => {
              if( err ){
                console.log( err );
                resolve( { status: false, error: err } );
              }else{
                resolve( { status: true } );
              }
            });
          }else{
            resolve( { status: false, error: 'no items found.' } );
          }
        }
      });
    }else{
      resolve( { status: false, error: 'no db' } );
    }
  });
};


api.post( '/item', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var item = req.body;
  item.price = parseInt( item.price );
  if( !item.id ){
    item.id = uuidv1();
    item._id = item.id;
  }

  api.createItem( item, item.id ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.post( '/items', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var items = req.body;
  items.forEach( function( item ){
    item.price = parseInt( item.price );
    if( !item.id ){
      item.id = uuidv1();
    }
  });

  api.createItems( items ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.get( '/item/:id', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var item_id = req.params.id;
  api.readItem( item_id ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.get( '/items', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var limit = 0;
  var start = 0;
  if( req.query.limit ){
    try{
      limit = parseInt( req.query.limit );
    }catch( e ){
    }
  }
  if( req.query.start ){
    try{
      start = parseInt( req.query.start );
    }catch( e ){
    }
  }
  api.readItems( limit, start ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.get( '/items/:key', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var key = req.params.key;
  api.queryItems( key ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.put( '/item/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var item_id = req.params.id;
  var item = req.body;
  //item.id = item_id;
  item._id = item_id;
  api.updateItem( doc ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.delete( '/item/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var item_id = req.params.id;
  api.deleteItem( item_id ).then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});

api.delete( '/items', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  api.deleteItems().then( function( result ){
    res.status( result.status ? 200 : 400 );
    res.write( JSON.stringify( result, null, 2 ) );
    res.end();
  });
});


//. api をエクスポート
module.exports = api;
