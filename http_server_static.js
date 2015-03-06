var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html";
http.createServer(function (request, response)
{
  var urlObj = url.parse(request.url, true, false);


  if(urlObj.pathname.indexOf("getcity") != -1)
  {
    // execute "getcity" REST service...

    console.log(ROOT_DIR + urlObj.pathname);
    console.log("URL search: " + urlObj.search);
    if( urlObj.search )
    {
      console.log("does 'q' exist? " + urlObj.search.indexOf("q"));
      if( urlObj.search.indexOf("q") >= 0 )
      {
        console.log("URL query: " + urlObj.query['q']);

        fs.readFile(ROOT_DIR + "/CS360/cities.dat.txt", function (err, data)
        {
          if(err) throw err;
          var cities = data.toString().split("\n");
          var myRegEx = new RegExp("^"+urlObj.query['q']);
          var jsonresult = [];
          for(var i=0; i<cities.length; i++)
          {
            if( cities[i].search(myRegEx) != -1 )
              jsonresult.push({city:cities[i]}); // only add cities that contain search string
          }
          response.writeHead(200);
          response.end(JSON.stringify(jsonresult));
        });
      }
    }
  }
  else
  {
    // serve static files...

    fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data)
    {
      if( err )
      {
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200);
      response.end(data);
    });
  }
}).listen(80);
