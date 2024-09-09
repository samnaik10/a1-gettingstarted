const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

let appdata = [
  { "workout": "Full Body", "date": "2024-09-01", "stime": "13:00", "etime": "14:30", "time": "90" },
  { "workout": "Lower Body", "date": "2024-09-03", "stime": "16:00", "etime": "17:15", "time": "75" },
  { "workout": "Upper Body", "date": "2024-09-05", "stime": "15:42", "etime": "16:54", "time": "72" } 
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if( request.method === 'DELETE' ){
    console.log("this deletee")
    handleDel( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }if( request.url === '/gets' ) {
    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  }else{
    sendFile( response, filename )
  }
}

const handleDel = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }if( request.url === '/delete') {
    console.log("delete!")
    
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })

    request.on( 'end', function() {

      const entry = JSON.parse( dataString )

      console.log("delete debugg")
      console.log(entry)

      appdata = appdata.filter(data => !(data.workout === entry.workout && data.date === entry.date && data.stime === entry.stime && data.etime === entry.etime))

      response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
      response.end(JSON.stringify(appdata))
    })
  } else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    
    const entry = JSON.parse( dataString )
    

    appdata.push(entry)

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end(JSON.stringify(appdata))
  })
    
  }


const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
