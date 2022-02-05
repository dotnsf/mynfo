
var base_url = 'https://mastermind-restapi.herokuapp.com';
//var base_url = 'http://localhost:8080';

async function mmPing(){
  return new Promise( function( resolve, reject ){
    $.ajax({
      type: "GET",
      url: base_url + "/api/ping",
      success: function( result ){
        console.log( 'mmPing', result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
  });
}

async function mmInit( length = 4, highlow = 0, name = '' ){
  return new Promise( function( resolve, reject ){
    $.ajax({
      type: "GET",
      url: base_url + "/api/init?length=" + length + "&highlow=" + highlow + "&name=" + name,
      success: function( result ){
        console.log( 'mmInit', result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
  });
}

async function mmGuess( id, value ){
  return new Promise( function( resolve, reject ){
    $.ajax({
      type: "GET",
      url: base_url + "/api/guess?id=" + id + "&value=" + value,
      success: function( result ){
        console.log( 'mmGuess', result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
  });
}

async function mmGiveup( id ){
  return new Promise( function( resolve, reject ){
    $.ajax({
      type: "GET",
      url: base_url + "/api/giveup?id=" + id,
      success: function( result ){
        console.log( 'mmGiveup', result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
  });
}

async function mmStatus( id ){
  return new Promise( function( resolve, reject ){
    $.ajax({
      type: "GET",
      url: base_url + "/api/status?id=" + id,
      success: function( result ){
        console.log( 'mmStatus', result );
        resolve( result );
      },
      error: function( e0, e1, e2 ){
        console.log( e0, e1, e2 );
        resolve( null );
      }
    });
  });
}

function mmValidate( g_value, h_value, h_hit, h_error, h_highlow ){
  var result = true;

  //. hit の validate
  var cnt = 0;
  for( var i = 0; i < g_value.length; i ++ ){
    var c1 = g_value.charAt( i );
    var c2 = h_value.charAt( i );
    if( c1 == c2 ){
      cnt ++;
    }
  }
  result = ( cnt == h_hit );

  //. error の validate
  if( result ){
    cnt = 0;
    for( var i = 0; i < g_value.length; i ++ ){
      var c1 = g_value.charAt( i );
      var idx = h_value.indexOf( c1 );
      if( idx > -1 && idx != i ){
        cnt ++;
      }
    }
    result = ( cnt == h_error );
  }

  //. highlow の validate
  if( result && h_highlow ){
    switch( h_highlow ){
    case 'high':
      result = ( g_value < h_value );
      break;
    case 'low':
      result = ( g_value > h_value );
      break;
    }
  }

  return result;
}

function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}

