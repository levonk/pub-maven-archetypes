function(head, req) {
    var currentTitle=null;

    var currentObject=null;
    var ids=null;

    var loopCounter=0;
    if(req.query.ids){
      ids=  JSON.parse(req.query.ids);
    }


    var row=getRow();
    if(row ==null) return;

    var targetRow=getRow();
    if(targetRow==null){
      sendCurrentRow(row, ids);
      return;
    }

    do{
        //if only one row or the first two are not in the same tree
        if( targetRow.key[0] != row.key[0]){
          if(row !=null) sendCurrentRow(row, ids);
          row=targetRow;
          targetRow=getRow();
          continue;
        }
       //start next set of recursion. item with key.length==1
        var retRow=extendCurrentRow(row, targetRow);
        if(retRow!=null && retRow.key.length==1){
            row=retRow;targetRow=getRow();
        }else{
            targetRow=retRow;
        }

    }while(targetRow!=null) ;

    return;



    function extendCurrentRow(currentRow, targetRow){
             var newCurrent=mergeRow(currentRow, targetRow);

             var nextRow=getRow();
             //next row is the children of the current row
             if(nextRow!=null && nextRow.key.length > targetRow.key.length){
                  return extendCurrentRow(newCurrent, nextRow);
             }else if(nextRow!=null && nextRow.key.length > currentRow.key.length){   //next row is the  siblings of the current row.
                  sendCurrentRow(newCurrent, ids);
                  return extendCurrentRow(currentRow, nextRow);
             }else{                                     //next row is the parent of the current row.
                sendCurrentRow(newCurrent, ids);
                return nextRow;
             }

    }

    function sendCurrentRow(currentRow, ids){
       if(ids!=null && ids.indexOf(currentRow.value._id)>=0){
            send(JSON.stringify(currentRow)+"\n");
       }else if (ids ==null){
            send(JSON.stringify(currentRow)+"\n");
       }

    }

    function mergeRow(curRow, newRow){

          //  send(curRow.key+" <- "+ newRow.key+" ");
          // send("++"+JSON.stringify(curRow)+"\n" );
          // send("++"+JSON.stringify(newRow)+"\n" );
           var tempRow= JSON.parse(JSON.stringify(curRow));

           for ( attrname in newRow.value) { tempRow.value[attrname] = newRow.value[attrname]; }
           tempRow.key = newRow.key;
           tempRow.id=newRow.id;
           //send("=="+JSON.stringify(curRow)+"\n" );
           return tempRow;

    }
}