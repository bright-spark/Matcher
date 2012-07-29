// Generated by CoffeeScript 1.3.3
(function() {
  var app, calculateInterests, calculateMutualFriends, calculateRelationship, express, filterResults, filterUnwanted, getInterests, getSelf, http, path, routes, _;

  express = require('express');

  routes = require('./routes');

  http = require('http');

  path = require('path');

  _ = require('underscore');

  app = express();

  app.configure = function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(require('connect-assets')());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    return app.use(express["static"](path.join(__dirname, 'public')));
  };

  app.configure('development', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', routes.index);

  app.post("/user/:uid", function(req, res) {
    var uid, users;
    uid = req.param("uid");
    users = req.body.data;
    users = filterResults(users, uid);
    return res.send(users);
  });

  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Express server listening on port ${ app.get('port') ");
  });

  filterResults = function(users, uid) {
    var me, selfInterests, user, _i, _len;
    me = getSelf(users, uid);
    selfInterests = getInterests(me);
    users = filterUnwanted(users, me);
    for (_i = 0, _len = users.length; _i < _len; _i++) {
      user = users[_i];
      user.percent = 0;
      calculateInterests(user, selfInterests);
      calculateMutualFriends(user);
      calculateRelationship(user);
      if (user.name === "Amy Grace Standel") {
        user.percent = 100;
      }
    }
    return _.sortBy(users, function(user) {
      return user.percent;
    }).reverse();
  };

  filterUnwanted = function(users, me) {
    var sameLastName;
    sameLastName = _.filter(users, function(u) {
      return u.last_name.toLowerCase() === me.last_name.toLowerCase();
    });
    users = _.without(users, me);
    users = _.difference(users, sameLastName);
    return users;
  };

  getInterests = function(u) {
    return u.interests.toLowerCase().replace(/\s+/g, '').split(',');
  };

  getSelf = function(users, uid) {
    return _.find(users, function(user) {
      return user.uid === uid;
    });
  };

  calculateInterests = function(user, selfInterests) {
    var matchCount;
    matchCount = _.intersection(selfInterests, getInterests(user)).length;
    if (!(user.percent + 20 > 100)) {
      return user.percent += matchCount * 20;
    }
  };

  calculateRelationship = function(user) {
    var isSingle;
    isSingle = user.relationship_status.toLowerCase() === 'single';
    if (isSingle && user.percent + 20 < 100) {
      return user.percent += 20;
    }
  };

  calculateMutualFriends = function(user) {
    var increaseBy;
    increaseBy = user.mutual_friend_count * 0.4;
    if (!(user.percent + increaseBy > 100)) {
      return user.percent += increaseBy;
    }
  };

}).call(this);
