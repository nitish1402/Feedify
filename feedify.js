//IIFE

'use strict';


/** Main app Module **/

(function(){
  angular
    .module('Feedify',['ngDialog'])
    .controller('FeedCtrl',['$scope','FeedService','FeedResource','ngDialog',FeedCtrl]);

    //our feed ctrl
    function FeedCtrl($scope,FeedService,FeedResource,ngDialog){
      $scope.resource = FeedResource.getResource();

      $scope.loadText = "Select Feed Resource From here";

      $scope.addResource = function() {
        ngDialog.open({
          template: 'addFeedForm',
          controller : ['$scope','FeedResource', addFeedController],
          scope : $scope,
        });
      };

      $scope.loadFeed = function(resource){
        $scope.loadText = resource.title;
        FeedService.parseFeed(resource.url).then(function(res){
          $scope.feeds=res.data.responseData.feed.entries;
          console.log($scope.feeds);
        });
      }



      $scope.removeResource = function(resource){
        FeedResource.deleteResource(resource);
      }
    };

    function addFeedController($scope,FeedResource){
      console.log($scope);
      $scope.resource = {};

      $scope.submitNewResource = function(){
        FeedResource.addResource($scope.resource.title,$scope.resource.url);
        $scope.closeThisDialog();
      }

    }
})();


/** Services **/

(function(){
  angular
    .module('Feedify')
    .factory('FeedService',['$http',function($http){
      return {
        parseFeed : function(url){
          return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
      }
    }])
    .factory('FeedResource',function(){
      var resource = [{
        title:'McAfee Blogs',
        url: 'https://community.mcafee.com/blogs/feeds/blogs',
      },{
        title:'Google news',
        url: 'https://news.google.com/?output=rss',
      },{
        title:'Hacker Earth',
        url:'http://blog.hackerearth.com/feed',
      },{
        title:'YCombinator',
        url:'https://news.ycombinator.com/rss',
      }];
      return {
        addResource : function(title,url){
          resource.push({title:title,url:url});
        },
        getResource : function(){
          return resource;
        },
        deleteResource : function(res){
          var i = resource.indexOf(res);
          resource.splice(i, 1);
        }
      }
    })
})();
