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

    var evalLineFromTemplate = function(line, template, item){
    	var r = /\$(\w+):(\w+)\$/gi;
    	var matches = line.match(r);
    	if(matches){
    		//console.log(line);
    		for(var i in matches){
    			r.exec('');
    			//console.log(+i, matches[+i], r, r.exec(''));
    			var expressions = r.exec(''+matches[+i]);
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
	    				line = (checkVal)?line.replace(matching, ''):'';
	    			break;


	    			//not recognized, clean
	    			default:
		    			line = line.replace(matching, '');
	    			break;
	    		}
    		}
    		//console.log(line);
    	}
    	return line;
    }

    factory.parseZoteroItemWithTemplate = function(template, item){

    	var lines = template.split(/\r\n?|\n/);
    	var output = [];
    	for(var i in lines){
    		output.push(evalLineFromTemplate(lines[i], template, item));
    	}
    	return output.join('\n');
    }

    return factory;
  });
