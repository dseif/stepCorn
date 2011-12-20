// PARSER: 0.3 JSON

(function (Popcorn) {
  Popcorn.parser( "parseSM", function( data ) {

    var dataObj = [];
    data.text.replace( /#([\s\S]*?);/g, function( all, match1 ) {
      match1.replace( /([\s\S]*?):([\s\S]*)/, function( all, smatch1, smatch2 ) {
        dataObj[ smatch1 ] = smatch2;
      });
    });
    
    dataObj.NOTES = dataObj.NOTES.split( ":" );
    dataObj.NOTES[ 5 ] = dataObj.NOTES[ 5 ].split( "," );
    for ( var i = 0; i < dataObj.NOTES[ 5 ].length; i++ ) {
      var notes = [];
      dataObj.NOTES[ 5 ][ i ].replace( /^(\w\w\w\w)$/gm, function( all, match ) {
      
        notes.push( match );
      });
      dataObj.NOTES[ 5 ][ i ] = notes;
    }

    // find #BPMS
    var bpms = dataObj.BPMS.split( "=" )[ 1 ],
        offSet = 0 - +dataObj.OFFSET.split( ":" ),
        beatRate = 60 / bpms,
        currentTime = 0 + offSet, 
        dataNotes = dataObj.NOTES,
        measures = dataNotes[ dataNotes.length - 1 ],
        retObj = {
          data: []
        };
    
    console.log( "START TIME WITH OFFSET", currentTime );
    for ( var i = 0; i < measures.length; i++ ) {
    
      var notes = measures[ i ],
          numNotes = notes.length;
      
      var noteRate = notes.length / 4;
      for ( var j = 0; j < notes.length; j++ ) {
      
        var noteStart = currentTime + ( beatRate /  noteRate );

        currentTime = noteStart;
        if( notes[ j ] !== "0000" ) {
          retObj.data.push({
            start: noteStart,
            note: notes[ j ],
            bpm: bpms,
            beatRate: beatRate,
            offSet: offSet
          });
        }
      }
    }
        
    Popcorn.forEach( dataObj.data, function ( obj, key ) {
      retObj.data.push( obj );
    });

    return retObj;
  });

})( Popcorn );
