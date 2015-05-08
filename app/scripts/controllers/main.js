'use strict';

/**
 * @ngdoc function
 * @name zoteromarkdownApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zoteromarkdownApp
 */
angular.module('zoteromarkdownApp')
  .controller('MainCtrl', function ($scope, $log, $http, $timeout, ZoteroQueryHandler, ZoteroQueryBuilder, ZoteroTemplateParser) {
    var query;
  	var loadTemplate = function(url){
  		$http
  			.get(url)
  			.success(function(d){
  				$scope.activeTemplate = d;
  			})
  			.error(function(e){
  				$log.error('Couldn t load template', e);
  			});
  	};

  	var initVariables = function(){
  		loadTemplate('md-templates/fiche.md');
  		$http.get('credentials/credentials.json')
  			.success(function(credentials){
  				$scope.userId = credentials.userId;
  				$scope.apiKey = credentials.apiKey;
  			}).error(function(){
  				$scope.userId = 1142649;
  	    		$scope.apiKey = '';
  	    		$log.error('credentials not found. Write them in root/credentials/credentials.json with an object containing properties userId and apiKey, or paste your API in the interface.')
  			}).then(function(){
  	    		query = ZoteroQueryBuilder.init($scope.apiKey, $scope.userId).searchItemType('-attachment');
		  	    $scope.overallItems = [];
		  	    $scope.selectedItems = [];
		  	    $scope.overallQueryStart = 0;
		  	    $scope.getMore();
  			});
  		
  	};

  	var updatePreview = function(template){
    	if(!template|| !$scope.overallItems)
        return;
  		else if(!$scope.selectedItems){
  			if($scope.overallItems.length > 0){
  				$scope.processedPreview = ZoteroTemplateParser.parseZoteroItemWithTemplate($scope.activeTemplate, $scope.overallItems[0]).body;
  			}
  			else $scope.processedPreview = $scope.activeTemplate;
  		}else if($scope.selectedItems.length === 0){
  			if($scope.overallItems.length > 0)
  				$scope.processedPreview = ZoteroTemplateParser.parseZoteroItemWithTemplate($scope.activeTemplate, $scope.overallItems[0]).body;
  		}else {
  			$scope.processedPreview = ZoteroTemplateParser.parseZoteroItemWithTemplate($scope.activeTemplate, $scope.selectedItems[0]).body;
  		}
  		
  		if($scope.processedPreview)	
  			$scope.displayedPreview = markdown.toHTML($scope.processedPreview);
  	};

  	var initWatchers = function(){
  		$scope.$watch('activeTemplate', updatePreview);
  		$scope.$watchCollection('selectedItems', updatePreview);
  		$scope.$watchCollection('overallItems', updatePreview);

  	};

  	var itemExists = function(item, collection){
  		for(var i in collection){
  			if(collection[i].key === item.key)
  				return true;
  		}
  		return false;
  	};

  	var findItem = function(item, collection){
  		for(var i in collection){
  			if(collection[i].key === item.key)
  				return i;
  		}
  	};

  	var appendToListOfItems = function(d){
  		for(var i in d){
  			var item = d[i];
  			if(!itemExists(item, $scope.overallItems))
  				$scope.overallItems.push(item);
  		}
  	}

  	var prependToListOfItems = function(d){
  		for(var i in d){
  			var item = d[i];
  			if(!itemExists(item, $scope.overallItems)){
  				if($scope.overallItems)
  					$scope.overallItems.unshift(item);
  			}
  		}
  	};

  	$scope.addToSelected = function(index){
  		var d = $scope.overallItems[index];
  		if(!itemExists(d, $scope.selectedItems)){
  			$scope.selectedItems.push($scope.overallItems[index]);
  		}
  	};

  	$scope.removeFromSelected = function(index){
  		$scope.selectedItems.splice(index, 1);
  	};

  	$scope.getMore = function(){
  		if($scope.searchQuery){
  			if($scope.searchQuery.length == 0)
	  			query.quickSearch(null);
	  		else $scope.newZoteroQuery($scope.searchQuery);
  		}

  		query.start($scope.overallQueryStart);
  		ZoteroQueryHandler.getItems(query.get(), appendToListOfItems);
  		$scope.overallQueryStart += 100;
  	};

  	$scope.addAllMatching = function(){
  		var matching = $scope.overallItems.filter($scope.searchInItem);
  		for(var i in matching){
  			var index = findItem(matching[i], $scope.overallItems);
  			if(index)
  				$scope.addToSelected(index);
  		}
  	};

  	$scope.searchInItem = function(item){
  		var match = false;
  		if($scope.searchQuery && item.data){
  			for(var i in item.data){
  				var val = item.data[i];
  				if(!val)
  					continue;
  				else if(typeof val == 'object' && val.length){
  					for(var k in val){
  						var val2 = val[k];
  						if(typeof val2 == 'object'){
	  						for(var j in val2){
		  						if((""+val2[j]).toLowerCase().indexOf($scope.searchQuery.toLowerCase()) > -1){
		  							match = true;
		  							break;
								}
		  					}
	  					}else if((""+val2[j]).toLowerCase().indexOf($scope.searchQuery.toLowerCase()) > -1){
	  							match = true;
	  							break;
						}
  					}
  				}else if(typeof val == 'object'){
  					for(var j in val){
  						if((""+val[j]).toLowerCase().indexOf($scope.searchQuery.toLowerCase()) > -1){
  							match = true;
  							break;
						}
  					}
  				}else if((""+val).toLowerCase().indexOf($scope.searchQuery.toLowerCase()) > -1){
  							match = true;
  							break;
				  }
  			}
  			return match;
  		}
  		else return true;
  	};

  	$scope.newZoteroQuery = function(expression){
  		query.quickSearch(expression).start(0);
  		$log.info('new query to zotero', expression);
  		ZoteroQueryHandler.getItems(query.get(), prependToListOfItems);
  	};

  	$scope.changeAPIKey = function(apiKey){
  		$log.info('new api key', apiKey);
  		query.apiKey(apiKey);
  	};

  	$scope.copyToClipboard = function(str){
  		return str;
  	};


  	initVariables();
  	initWatchers();
  });
