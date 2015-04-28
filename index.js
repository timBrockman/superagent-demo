/*

this was just created as a quick exercise to
mess around with superagent and handlebars.

It's nice to have sample content when building
handlebars templates.
 */

//require handles
var   express       = require('express'),
      superagent    = require('superagent'),
      consolidate   = require('consolidate'),
      hbs           = require('handlebars'),
      fs            = require('fs'),
      config        = require('./config.js');

var   app = express();


//configure template engine
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


// register partial(s)
var partialsDir = __dirname + '/views/partials';
var partialFiles = fs.readdirSync(partialsDir);

function helpRegisterPartial(partialFile){
  var partName = /^([a-zA-Z0-9-_]+)\.hbs$/.exec(partialFile);
  if(!partName){
    console.log('partial not registered!');
    return false;
  }
  var partial = fs.readFileSync(partialsDir + '/' + partialFile, {encoding:'utf-8'});
  hbs.registerPartial(partName[1], partial)
}

partialFiles.forEach(helpRegisterPartial);
//hbs.registerPartial('test', fs.readFileSync(__dirname + '/views/partials/temp.hbs',{encoding:'utf-8'}));


//static folder
app.use(express.static(__dirname + '/public'));

//api config and stuff

/* youtube v2
var getUrl      = 'https://gdata.youtube.com/feeds/api/videos?q=spock&max-results=5&alt=json';
*/

// youtube v3
var getUrl      = 'https://www.googleapis.com/youtube/v3/search/';
var queryObj    = {part:'snippet',
                  q:'spock',
                  maxResults:5,
                  key:config.api.key};//needs key or forbidden
//*/

//routes
app.get('/', function(req,res){
  superagent.get(getUrl)
    .query(queryObj)
    .set({Accept: 'application/json'})
    .end(function(e, apiResponse){
      //touch of error cheese
      if(e) console.log(e);

      //send response to template
      //v2 returns goods in format handlebars hates
      //console.log(apiResponse.body.feed.entry[0].media$group.media$thumbnail);
      //return res.render('index', apiResponse.body);

      //v3 returns goods in reasonable format
      //console.log(apiResponse.body);

      return res.render('index', apiResponse.body);
    });
});

//server listen
app.listen(8080);
console.log('listening..');
