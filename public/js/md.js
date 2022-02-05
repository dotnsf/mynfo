
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

