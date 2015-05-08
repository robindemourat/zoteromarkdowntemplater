'use strict';

/**
 * @ngdoc service
 * @name zoteromarkdownApp.ZoteroTemplateParser
 * @description
 * # ZoteroTemplateParser
 * Service in the zoteromarkdownApp.
 */
angular.module('zoteromarkdownApp')
  .factory('ZoteroTemplateParser', function () {
    var factory = {};

    var templatesModels = {
    	'title' : ['data', 'title'],
    	'creators' : ['data', 'creators'],
    	'type' : ['data', 'itemType'],
    	'url' : ['data', 'url'],
    	'date' : ['data', 'date'],
    	'creator_1_first_name' : ['data', 'creators', 0, 'firstName'],
    	'creator_1_last_name' : ['data', 'creators', 0, 'lastName'],
    	'creator_1_type' : ['data', 'creators', 0, 'creatorType'],

    	'creator_2_first_name' : ['data', 'creators', 1, 'firstName'],
    	'creator_2_last_name' : ['data', 'creators', 1, 'lastName'],
    	'creator_2_type' : ['data', 'creators', 1, 'creatorType'],

    	'creator_3_first_name' : ['data', 'creators', 2, 'firstName'],
    	'creator_3_last_name' : ['data', 'creators', 2, 'lastName'],
    	'creator_3_type' : ['data', 'creators', 2, 'creatorType'],

    	'creator_4_first_name' : ['data', 'creators', 3, 'firstName'],
    	'creator_4_last_name' : ['data', 'creators', 3, 'lastName'],
    	'creator_4_type' : ['data', 'creators', 3, 'creatorType'],

    	'creator_5_first_name' : ['data', 'creators', 4, 'firstName'],
    	'creator_5_last_name' : ['data', 'creators', 4, 'lastName'],
    	'creator_5_type' : ['data', 'creators', 4, 'creatorType'],

    };

    var findValInItem = function(val, item){
    	var templatePath = templatesModels[val],
    		cursor = item, 
    		prop;
    	for(var i in templatePath){
    		prop = templatePath[i];
    		cursor = cursor[prop];
    		if(!cursor)
    			break;
    	}
    	return cursor;
    }

    var fetchVal = function(val, item){
    	var n = findValInItem(val, item);
    	return (n)?n:'';
    };

    var checkVal = function(val, item){
    	return (findValInItem(val,item))?true:false;
    }

    var populateTemplate = function(template, item){
    	var r = /\$(\w+):(\w+)\$/gi;
        var line = template;
    	var matches = line.match(r);
    	if(matches){
    		for(var i in matches){
    			r.exec('');
    			var expressions = r.exec(matches[+i]);
    			var statement = expressions[1];
	    		var val = expressions[2];
	    		var matching = new RegExp('\\\$'+statement+':'+val+'\\\$', 'g');
	    		switch(statement){
	    			//replace by value
	    			case 'set':
	    				var newVal = fetchVal(val, item);
	    				line = line.replace(matching, newVal);
	    			break;

	    			//conditionnal
	    			case 'if':
                        //var catchIf = new RegExp('(\\\$'+statement+':'+val+'\\\$).*(\\\$endif\\\$)', 'g');
                        //var catchAll = new RegExp('(\\\$\w+:\w+\\\$.*\\\$endif\\\$)', 'g');
                        var catchExpression = new RegExp('(\\\$'+statement+':'+val+'\\\$)[\\\s|\\\w|\\\S]*(\\\$endif\\\$)', 'gi');
                        var catchAll = new RegExp('(\\\$'+statement+':'+val+'\\\$[\\\s|\\\w|\\\S]*\\\$endif\\\$)', 'gi');
                        var toDelete = (checkVal(val, item))?catchExpression.exec(line):catchAll.exec(line);
                        if(toDelete){
                            line = line.replace(toDelete[1], '').replace(toDelete[2], '');
                        }
                        //line = line.replace(catchIf, 'deleted');
	    				//line = (checkVal(val, item))?line.replace(catchIf, ''):line.replace(catchAll, '');
	    			break;


	    			//not recognized, clean
	    			default:
		    			line = line.replace(matching, '');
	    			break;
	    		}
    		}
    	}
    	return line;
    }

    factory.parseZoteroItemWithTemplate = function(template, item){
    	return populateTemplate(template, item);
    }

    return factory;
  });
