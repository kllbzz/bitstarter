#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var futures = require('futures')
var restler = require('restler')
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://desolate-crag-2736.herokuapp.com/"

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var downloadHtmlFile = function(url) {
    var ret;
    var Join = futures.join();
   //futures.join(
//	futures.sequence().then(
//	    function(){
	    	restler.get(url).on('complete', function(data) {
			//console.log("Data = %s", data); // auto convert to object
			ret = data;
			Join.add();
		});
//	    }
//	).join();
    //);
   Join.when
    return ret;
}
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
//	var data = downloadHtmlFile(htmlfile);
//	if (data instanceof Error ){
//	    console.log("Error = ", data);
//	    return cheerio.load(fs.readFileSync(htmlfile));
//	}		
//	else {
//		console.log("Success = ", data);
//	    return cheerio.load(data);
//	}
};

var cheerioUrl = function(url, onData) {
                restler.get(url).on('complete', function(data) {
                        //console.log("Data = %s", data); // auto convert to object
			if (data instanceof Error ){
          			//console.log("Error downloading file");
      			}
			else{
				//console.log("Dowloaded successfully");
			}
			onData(cheerio.load(data));

                });
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile, onRet) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    onRet(out);
};

var checkUrl = function(url, checksfile, onRet) {
       cheerioUrl(url, function(data) {
       var checks = loadChecks(checksfile).sort();
       var out = {};
       for(var ii in checks) {
          var present = data(checks[ii]).length > 0;
          out[checks[ii]] = present;
       }
       onRet(out);
    });
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
  return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL to html file')       
	.parse(process.argv);
    
    var printJson = function(checkedJson){
	var outJson = JSON.stringify(checkedJson, null, 4);
    	console.log(outJson);
    }; 

//	console.log("url = %s", program.url);
	if (program.url)
	    checkUrl(program.url, program.checks, printJson);
	else
	    checkHtmlFile(program.file, program.checks, printJson);
	
    //if (program.file)
    //var checkJson = checkHtmlFile(program.file, program.checks);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
