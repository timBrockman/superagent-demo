/*

this was just created as a quick exercise to
mess around with superagent and handlebars.

It's nice to have sample content when building
handlebars templates.
 */

//require handles
var   express       = require('express'),
      superagent    = require('superagent'),
      consolidate   = require('consolidate');

var   app = express();

//configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//static folder
app.use(express.static(__dirname + '/public'));

//api config and stuff
var getUrl      = '';
var queryObj    = {};


//routes
app.get('/', function(req,res){
  superagent.get(getUrl)
/*    .query(queryObj)
*/    .set({Accept: 'application/json'})
    .end(function(e, apiResponse){
      //touch of error cheese
      if(e) console.log(e);

      //send response to template
      return res.render('index', apiResponse.body.content);
    });
});

//server listen
app.listen(8080);
console.log('listening..');

/*
//routes defined
homeRoute = function(req,res){
  superagent.get('http://api.storify.com/v1/stories' +
  user + '/' + storySlug)
    .query({api_key: apiKey,
      username: userName,
      token: apiToken})
    .set({Accept: 'application/json'})
    .end(function(e, apiResponse){
      if(e) {
        return next(e);
      }
      return res.render('index', apiResponse.body.content);
    });
};
*/