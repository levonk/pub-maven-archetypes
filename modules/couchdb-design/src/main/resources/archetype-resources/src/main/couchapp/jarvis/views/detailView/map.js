function(doc) {
 if(doc.doc_type=="title"){
    emit([doc._id], doc);
 }
 if(doc.doc_type=="language"){
 	emit([doc.path[0], doc._id], doc);
 }
 if(doc.doc_type=="languageLocal"){
 	emit([doc.path[0], doc.path[1], doc._id], doc);
 }
}