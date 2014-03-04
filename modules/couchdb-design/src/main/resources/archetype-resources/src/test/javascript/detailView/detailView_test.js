describe("DetailView Spec", function() {
    var functionUrl="/src/jarvis/views/detailView/map.js"
    var testFunction;

    var emitResult=new Object();
	

	it("title doc", function() {
    	
    	testFunction(getTestData("spec/detailView/detailViewTestData_title.json"));
    	

		expect(emitResult.key[0]).toBe("e65fb223-f831-41c4-9746-3401583aad1b");
		expect(emitResult.doc.name).toBe("M3iWRUkgzvl4T9OWZHDs4ENh3ti7mw1OVDI0bKIZGw9iZIgteE");
		expect(emitResult.doc.umid).toBe("OkP43snQAanjmEZAvmLd");
		
    });

	it("laugauge doc", function() {
    	
    	testFunction(getTestData("spec/detailView/detailViewTestData_language.json"));
    	
    	expect(emitResult.key[0]).toBe("e65fb223-f831-41c4-9746-3401583aad1b");
		expect(emitResult.key[1]).toBe("04dcbe63-6eb6-4a01-b0ea-3a4dcb4aae29");
		
		expect(emitResult.doc.title).toBe("TcKNQNeflJoHbOARK0I4thFqqj2lT3YwXHspwFCH4kwewv5dGd");
		expect(emitResult.doc.language).toBe("hU");
		
    });

	it("laugauge local doc", function() {
    	
    	testFunction(getTestData("spec/detailView/detailViewTestData_languagelocale.json"));
    	
    	expect(emitResult.key[0]).toBe("92a47dc3-7d12-4537-a6e4-a62354709154");
		expect(emitResult.key[1]).toBe("72855c2c-035d-42fb-a910-14646436e516");
		expect(emitResult.key[2]).toBe("b5565b9e-b91b-4d77-aa8e-888f78e399dc");
		
		expect(emitResult.doc.locale).toBe("tL_hW");
		
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
    	emitResult=new Object();
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
   		//emitResult=new Object();
   	});
	
    function emit(key,doc){
		emitResult.key=key;
		emitResult.doc=doc;
	}

    
	
	


    
});