// Generated by CoffeeScript 1.3.3
(function() {
  var calculateAge, calculateFriends, calculateInterests, calculateRelationship, filterUnwanted, getInterests, getSelf, _;

  _ = require('underscore');

  exports.filterResults = function(users, uid) {
    var me, selfInterests, user, _i, _len;
    me = getSelf(users, uid);
    selfInterests = getInterests(me);
    users = filterUnwanted(users, me);
    for (_i = 0, _len = users.length; _i < _len; _i++) {
      user = users[_i];
      user.percent = 0;
      calculateInterests(user, selfInterests);
      calculateRelationship(user);
      calculateFriends(user);
      if ((me.birthday_date != null) && (user.birthday_date != null)) {
        calculateAge(user, me.birthday_date);
      }
      if (user.percent > 100) {
        user.percent = 100;
      }
      if (user.percent < 0) {
        user.percent = 0;
      }
    }
    return _.sortBy(users, function(user) {
      return user.percent;
    }).reverse();
  };

  getInterests = function(u) {
    return u.interests.toLowerCase().replace(/\s+/g, '').split(',');
  };

  getSelf = function(users, uid) {
    return _.find(users, function(user) {
      return user.uid === uid;
    });
  };

  filterUnwanted = function(users, me) {
    var sameLastName;
    users = _.without(users, me);
    sameLastName = _.filter(users, function(u) {
      return u.last_name.toLowerCase() === me.last_name.toLowerCase();
    });
    users = _.difference(users, sameLastName);
    return users;
  };

  calculateInterests = function(user, selfInterests) {
    var matchCount;
    matchCount = _.intersection(selfInterests, getInterests(user)).length;
    return user.percent += matchCount * 25;
  };

  calculateRelationship = function(user) {
    var inRelationship, relationships, status;
    status = user.relationship_status.toLowerCase();
    relationships = ['married', 'engaged', 'in a relationship'];
    inRelationship = _.include(relationships, status);
    if (inRelationship) {
      return user.percent -= 15;
    } else {
      return user.percent += 15;
    }
  };

  calculateFriends = function(user) {
    return user.percent += user.mutual_friend_count * 0.5;
  };

  calculateAge = function(user, myAge) {
    var myYear, userYear;
    myYear = myAge.getFullYear();
    userYear = user.birthday_date.getFullYear();
    return user.percent -= (myYear - userYear).abs();
  };

}).call(this);
