/* @pjs preload="assets/down-arrow.png,assets/up-arrow.png,assets/left-arrow.png,assets/right-arrow.png,assets/down-arrow-pulse.png,assets/up-arrow-pulse.png,assets/left-arrow-pulse.png,assets/right-arrow-pulse.png"; */

Popcorn(function() {

  var StepCorn = {},
      arrows = [];

  function stepCornInit ( processing ) {
    processing.setup = function() {
      processing.size( 400, 800 );
      processing.frameRate( 60 );
      var directions = [ "assets/left-arrow.png", "assets/down-arrow.png", "assets/up-arrow.png", "assets/right-arrow.png" ],
          x = 50;

      for ( var i = 0; i < 4; i++ ) {
        arrows.push( new StepCorn.Arrow( x, 25, directions[ i ] ) );
        x += 75;
      }
    }

    StepCorn.Arrow = function( px, py, src ) {

      var that = this,
          p = processing,
          posx = px,
          posy = py,
          imgsrc = src,
          pulseSrc = ( src.split( "." )[ 0 ] + "-pulse.png" ),
          img = p.loadImage( imgsrc );

      this.getPx = function getPx() {
        return posx;
      };

      this.getPy = function getPy() {
        return posy;
      };

      this.getRotation = function getRotation() {
        return rotation;
      };

      this.draw = function draw( context ) {
        p.pushMatrix();
        p.translate( posx, posy );
        p.image( img, 0, 0 );
        p.popMatrix();
      };

      this.pulse = function() {
        img = p.loadImage( pulseSrc );
        setTimeout( function() {
          img = p.loadImage( imgsrc );
        }, 150);
      };

      return this;
    };

    function drawArrows() {
      for ( var i = 0; i < 4 ; i++ ) {
        arrows[ i ].draw();
      }
    }

    processing.draw = function() {
      processing.background( 205 );
      drawArrows();
    };
  }

  var p = new Processing( document.getElementById( "canvas" ), stepCornInit );

  var pulseArrows = function() {
    for ( var i = 0; i < 4; i++ ) {
      arrows[ i ].pulse();
    }
  };

  var popcorn = Popcorn( "#stepCorn", {
    frameAnimation: true
  }),
  stepsLeft = document.getElementById( "stepsLeft" ),
  stepsDown= document.getElementById( "stepsDown" ),
  stepsUp = document.getElementById( "stepsUp" ),
  stepsRight = document.getElementById( "stepsRight" ),
  steps = document.getElementById( "steps" ),
  keysDown = [ false, false, false, false ],
  arrowsPressed = {

    37: function( val )  {
      keysDown[ 0 ] = val;
      stepsLeft.innerHTML = +val;
    },
    38: function( val ) {
      keysDown[ 1 ] = val;
      stepsUp.innerHTML = +val;
    },
    39: function( val ) {
      keysDown[ 2 ] = val;
      stepsRight.innerHTML = +val;
    },
    40: function( val ) {
      keysDown[ 3 ] = val;
      stepsDown.innerHTML = +val;
    }
  },
  keyPress = function( keyCode, pressed ) {

    arrowsPressed[ keyCode ] && arrowsPressed[ keyCode ]( pressed );
  };

  window.addEventListener( "keydown", function( event ) {

    keyPress( event.keyCode, true );
  });

  window.addEventListener( "keyup", function( event ) {

    keyPress( event.keyCode, false );
  });

  popcorn.listen( "canplayall", function() {

    // Neccissary in order for seeking backwards
    popcorn.exec( 0, function() {

      steps.innerHTML = "0000";
    });

    popcorn.parseSM( "stepfiles/nirvanaDestiny.sm", function( data ) {

      var beatRate = data[ 0 ].beatRate;

      for( var i = data[ 0 ].start; i < popcorn.duration(); i += beatRate ) {

        popcorn.exec( i, function() {

          pulseArrows();
        });
      }

      for( var i = 0, l = data.length; i < l; i++ ) {

        (function( count ) {

          popcorn.exec( data[ count ].start, function() {

            steps.innerHTML = data[ count ].note;
          });
        })( i )
      }
    });
  });
});