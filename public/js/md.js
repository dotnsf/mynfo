
async function mynfoFiles( folder ){
  return new Promise( function( resolve, reject ){
    if( folder ){
      resolve( null );
    }else{
    $.ajax({
      type: "GET",
      url: "/_api/files",
      success: function( result ){
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
    }
  });
}

function mynfoFileList( folder ){
  $('#files_dir').html( '' );
  $('#target_folder').html( '<img src="/img/icon_folder.png" width="30"/> <b>' + folder + '</b>' );
  $.ajax({
    type: 'GET',
    url: '/_api/files?folder=' + folder,
    success: function( result ){
      if( result && result.status ){
        if( folder != '/' ){
          var tmp = folder.split( '/' );
          tmp.splice( tmp.length - 2, 2 );
          var parent_folder = tmp.join( '/' );
          if( parent_folder == '' ){ parent_folder = '/'; }

          var li = '<li><a href="#" onClick="mynfoFileList(\'' + parent_folder + '\');"><img src="/img/icon_folder.png" width="30"/> <b>..</b></a></li>';
          $('#files_dir').append( li );
        }
        result.directories.forEach( function( directory ){
          if( !directory.endsWith( '/' ) ){
            directory += '/';
          }
          var li = '<li><a href="#" onClick="mynfoFileList(\'' + folder + directory + '\');"><img src="/img/icon_folder.png" width="30"/> ' + directory + '</a></li>';
          $('#files_dir').append( li );
        });
        result.files.forEach( function( file ){
          var li = '<li><a href="#" onClick="mynfoFileLoad(\'' + folder + file + '\');"><img src="/img/icon_file.png" width="30"/> ' + file + '</a></li>';
          $('#files_dir').append( li );
        });
      }
    },
    error: function( e0, e1, e2 ){
      console.log( e0, e1, e2 );
    }
  });
}

function mynfoFileLoad( file ){
  window.location.href = file;
}
