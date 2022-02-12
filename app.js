//. app.js
var express = require( 'express' ),
    basicAuth = require( 'basic-auth-connect' ),
    ejs = require( 'ejs' ),
    fs = require( 'fs' ),
    marked = require( 'marked' ),
    session = require( 'express-session' ),
    app = express();

var settings = require( './settings' );

var dbtype = 'DBTYPE' in process.env ? process.env.DBTYPE : ( settings.dbtype ? settings.dbtype : "" ); 
//var database_url = 'DATABASE_URL' in process.env ? process.env.DATABASE_URL : settings.database_url; 
if( dbtype ){
  var db = require( './api/db_' + dbtype );
  app.use( '/_api/db', db );
}

var redisClient = require( './api/db_redis' );

app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

var RedisStore = require( 'connect-redis' )( session );

//. Session
var sess = {
  secret: 'mynfo',
  cookie: {
    path: '/',
    maxAge: (7 * 24 * 60 * 60 * 1000)
  },
  resave: false,
  saveUninitialized: false //true
};
if( redisClient ){
  sess.store = new RedisStore( { client: redisClient } );
}
app.use( session( sess ) );

//. Env values
var settings_basic_username = 'BASIC_USERNAME' in process.env ? process.env.BASIC_USERNAME : ( settings.basic_username ? settings.basic_username : "" ); 
var settings_basic_password = 'BASIC_PASSWORD' in process.env ? process.env.BASIC_PASSWORD : ( settings.basic_password ? settings.basic_password : "" ); 

if( settings_basic_username && settings_basic_password ){
  app.all( '/*', basicAuth( function( user, pass ){
    return( user === settings_basic_username && pass === settings_basic_password );
  }));
}

//. #15
var settings_github_repo_url = 'GITHUB_REPO_URL' in process.env ? process.env.GITHUB_REPO_URL : ( settings.github_repo_url ? settings.github_repo_url : "" ); 
var settings_github_branch = 'GITHUB_BRANCH' in process.env ? process.env.GITHUB_BRANCH : ( settings.github_branch ? settings.github_branch : "" ); 
while( settings_github_repo_url.endsWith( '/' ) ){
  settings_github_repo_url = settings_github_repo_url.substr( 0, settings_github_repo_url.length - 1 );
}

//. #20
var settings_contents_title = 'CONTENTS_TITLE' in process.env ? process.env.CONTENTS_TITLE : ( settings.contents_title ? settings.contents_title : "Mynfo" ); 
var settings_contents_image_url = 'CONTENTS_IMAGE_URL' in process.env ? process.env.CONTENTS_IMAGE_URL : ( settings.contents_image_url ? settings.contents_image_url : "/img/icon.png" ); 

//. #3
app.get( '/_api/files', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  try{
    var folder = req.query.folder;
    if( folder ){
      if( !folder.startsWith( '/' ) ){
        folder = '/' + folder;
      }
      if( !folder.endsWith( '/' ) ){
        folder = folder + '/';
      }
      var dirname = __dirname + '/md' + folder;
      fs.readdir( dirname, function( err, filenames ){
        if( err ){
          res.status( 400 );
          res.write( JSON.stringify( { status: false, error: err }, null, 2 ) );
          res.end();
        }else{
          var files = [];
          var directories = [];
          filenames.forEach( function( filename ){
            var stats = fs.statSync( dirname + filename );
            if( stats.isDirectory() ){
              directories.push( filename );
            }else{
              if( filename != '.gitkeep' ){
                files.push( filename );
              }
            }
          });

          res.write( JSON.stringify( { status: true, folder: folder, directories: directories, files: files }, null, 2 ) );
          res.end();
        }
      });
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'parameter "folder" need to be specified.' }, null, 2 ) );
      res.end();
    }
  }catch( e ){
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: e }, null, 2 ) );
    res.end();
  }
});

//. 全てのパスに対応可能
app.get( '/*', async function( req, res ){
  try{
    var path = req.originalUrl;
    if( path.indexOf( '?' ) > -1 ){
      var tmp = path.split( '?' );
      path = tmp[0];
      tmp[1].split( '&' ).forEach( function( param ){
        var p = param.split( '=' );
        req.query[p[0]] = p[1];
      });
    }

    if( path == '/' ){
      path = '/index';
    }

    if( !path.toLowerCase().endsWith( '.md' ) ){
      path += '.md';
    }

    var filepath = __dirname + '/md' + path;
    fs.readFile( filepath, { encoding: 'utf8' }, function( err, file ){
      if( err ){
        //console.log( err );
        res.render( 'error', { error: JSON.stringify( err, null, 2 ) } );
      }else{
        var html = marked.parse( file );
        var github_file_url = '';
        if( settings_github_repo_url && settings_github_branch ){
          //. https://github.com/dotnsf/mynfo/blob/dotnsf-mynfo/md/w3/cisco_anyconnect.md
          github_file_url = settings_github_repo_url + '/blob/' + settings_github_branch + '/md' + path;
        }
        res.render( 'md', { path: path, html: html, github_file_url: github_file_url, title: settings_contents_title, image_url: settings_contents_image_url } );
      }
    });
  }catch( e ){
    console.log( e );
    res.render( 'error', { error: e } );
  }
});


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
