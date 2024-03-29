
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

function mynfoFileList( folder, path, github_file_url ){
  $('#files_dir').html( '' );
  var img = '<img src="/img/icon_folder.png" width="20"/> <b>' + folder + '</b>';
  if( github_file_url ){
    var tmp = github_file_url.split( '/' );
    if( tmp.length > 1 ){
      tmp.splice( tmp.length - 1, 1 );
      var github_folder_url = tmp.join( '/' );
      img = '<div class="dropdown" id="files_dropdown">'
          + '<a href="#" class="btn btn-xs btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" id="dropdownFolderLink" aria-haspopup="true" aria-expandable="false">'
          + '<i class="fab fa-github"></i>'
          + '</a>'
          + img
          + '<div class="dropdown-menu" aria-labelledby="dropdownFolderLink">'
          + '<a class="dropdown-item" id="dropdown-githubfolderview" target="_blank" href="' + github_folder_url.split( 'blob' ).join( 'tree' ) + folder + '">GitHub フォルダ参照</a>'
          + '<a class="dropdown-item" id="dropdown-githubfolderedit" target="_blank" href="' + github_folder_url.split( 'blob' ).join( 'new' ) + folder + '">GitHub 新規ファイル追加</a>'
          + '</div>'
          + '</div>';
    }
  }
  $.ajax({
    type: 'GET',
    url: '/_api/files?folder=' + folder,
    success: function( result ){
      if( result && result.status ){
        $('#files_dir').append( img );
        if( folder != '/' ){
          var tmp = folder.split( '/' );
          tmp.splice( tmp.length - 2, 2 );
          var parent_folder = tmp.join( '/' );
          if( parent_folder == '' ){ parent_folder = '/'; }

          var li = '<li><a href="#" onClick="mynfoFileList(\'' + parent_folder + '\',\'' + path + '\',\'' + github_file_url + '\');"><img src="/img/icon_folder.png" width="20"/> <b>..</b></a></li>';
          $('#files_dir').append( li );
        }
        result.directories.forEach( function( directory ){
          if( !directory.endsWith( '/' ) ){
            directory += '/';
          }
          var li = '<li><a href="#" onClick="mynfoFileList(\'' + folder + directory + '\',\'' + path + '\',\'' + github_file_url + '\');"><img class="icon" src="/img/icon_folder.png" width="20"/> ' + directory + '</a></li>';
          $('#files_dir').append( li );
        });
        result.files.forEach( function( file ){
          var li = '<li><a href="#" onClick="mynfoFileLoad(\'' + folder + file + '\');"><img src="/img/icon_file.png" width="20"/> ' + removeLastMd( file ) + '</a></li>';
          if( path.endsWith( file ) ){
            li = '<li><a href="#" class="selectedfile" onClick="mynfoFileLoad(\'' + folder + file + '\');"><img src="/img/icon_file.png" width="20"/> ' + removeLastMd( file ) + '</a></li>';
          }
          $('#files_dir').append( li );
        });
      }
    },
    error: function( e0, e1, e2 ){
      //. 存在しないフォルダが指定された場合
      console.log( e0, e1, e2 );
    }
  });
}

function mynfoFileLoad( file ){
  window.location.href = file;
}

function removeLastMd( path ){
  if( path.toLowerCase().endsWith( '.md' ) ){
    path = path.substring( 0, path.length - 3 );
  }

  return path;
}

//. #29
$(function(){
  $('.openbtn').click( function(){
    $(this).toggleClass( 'active' );
    $('#g-nav').toggleClass( 'panelactive' );
  });

  $('#g-nav a').click( function(){
    $('.openbtn').removeClass( 'active' );
    $('#g-nav').removeClass( 'panelactive' );
  })
});
