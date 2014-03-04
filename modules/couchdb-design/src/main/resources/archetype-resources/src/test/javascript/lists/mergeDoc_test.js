describe("MergeDoc Spec", function() {
    var functionUrl="/src/jarvis/lists/mergedDoc.js"
    var testFunction;

    var resultSend=[];
    var getRow;
	

	it("empty result", function() {
    	var head= new Object();
        var req=new Object();
        req.query=new Object();

        getRow=function(){
            return null;
        }
        testFunction(head,req);
    	
		expect(resultSend.length).toBe(0);
    });

    it("single doc result", function() {
        var head= new Object();
        var req=new Object();
        req.query=new Object();

        var testData=getTestData("spec/lists/singleDocTest.json");
       
        var i=0;
        getRow=function(){
            var retVal= testData[i];
            i++
            return retVal;
        }

        testFunction(head,req);
        
        expect(resultSend.length).toBe(1);
    });

    it("merge documetns", function() {
        var head= new Object();
        var req=new Object();
        req.query=new Object();

        var testData=getTestData("spec/lists/mergeDocTest.json");
       
        var j=0;
        getRow=function(){
            var retVal= testData[j];
            j++
            return retVal;
        }

        testFunction(head,req);
       
       expect(resultSend.length).toBe(4);
       expect(resultSend[1].value.name).toBe("level 3 name");
       expect(resultSend[1].value.RadarGroupID).toBe(2);
       expect(resultSend[2].value.umid).toBe("12345678sa");
       expect(resultSend[3].value.umid).toBe("98745156sd");
         
    });

    it("merge documetns return by id", function() {
        var head= new Object();
        var req=new Object();
        req.query=new Object();
        req.query.ids="[\"54c57206-e8b1-4ff2-bda0-dd0052aa094b\"]";

        var testData=getTestData("spec/lists/mergeDocTest.json");
       
        var j=0;
        getRow=function(){
            var retVal= testData[j];
            j++
            return retVal;
        }

       testFunction(head,req);
       expect(resultSend.length).toBe(1);
       expect(resultSend[0].value.name).toBe("level 3 name");
       expect(resultSend[0].value.RadarGroupID).toBe(2);
         
    });

    

	/* test help method */
	function getTestData(testDataUrl){
		var retVal;
		jQuery.ajax({
		 async:   false,
         url:    testDataUrl,
         success: function(data) {
					retVal= data;
			      },
         error: function(e){console.error("error when retrieving "+functionUrl);},
         type: "GET",
         dataType: "json"
    	});     
    	return retVal;
	}
    
    beforeEach(function() {
    	resultSend=[];
   		jQuery.ajax({
		 async:   false,
         url:    functionUrl,
         success: function(data) {
					eval(" testFunction = "+ data);
			      },
         error: function(e){console.error("error when retrieving "+functionUrl);},
         type: "GET",
         dataType: "text"
    	});      
   	});
   	afterEach(function() {
   		
   	});
	
    function send(doc){
		resultSend.push(jQuery.parseJSON(doc));
	}

    
	
	


    
});