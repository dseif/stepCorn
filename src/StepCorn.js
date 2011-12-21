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
  count = 0,
  stepsLeft = document.getElementById( "stepsLeft" ),
  stepsDown= document.getElementById( "stepsDown" ),
  stepsUp = document.getElementById( "stepsUp" ),
  stepsRight = document.getElementById( "stepsRight" ),
  steps = document.getElementById( "steps" ),
  keysDown = [false, false, false, false];
  arrowsDown = {

    37: function()  {
      keysDown[ 0 ] = true;
      stepsLeft.innerHTML = "1";
    },
    38: function() {
      keysDown[ 1 ] = true;
      stepsUp.innerHTML = "1";
    },
    39: function() {
      keysDown[ 2 ] = true;
      stepsRight.innerHTML = "1";
    },
    40: function() {
      keysDown[ 3 ] = true;
      stepsDown.innerHTML = "1";
    }
  },
  arrowsUp = {

    37: function()  {
      keysDown[ 0 ] = false;
      stepsLeft.innerHTML = "0";
    },
    38: function() {
      keysDown[ 1 ] = false;
      stepsUp.innerHTML = "0";
    },
    39: function() {
      keysDown[ 2 ] = false;
      stepsRight.innerHTML = "0";
    },
    40: function() {
      keysDown[ 3 ] = false;
      stepsDown.innerHTML = "0";
    }
  };

  window.addEventListener( "keydown", function( event ) {

    arrowsDown[ event.keyCode ] && arrowsDown[ event.keyCode ]();
    console.log( keysDown );
  });

  window.addEventListener( "keyup", function( event ) {

    arrowsUp[ event.keyCode ] && arrowsUp[ event.keyCode ]();
  });

  popcorn.listen( "canplayall", function() {

    popcorn.parseSM( "stepfiles/nirvanaDestiny.sm", function( data ) {

      var beatRate = data[ 0 ].beatRate;

      for( var i = data[ 0 ].start; i < popcorn.duration(); i += beatRate ) {

        popcorn.exec( i, function() {

          pulseArrows();
          steps.style.backgroundColor = "#22ff00";

          setTimeout(function() {
            steps.style.backgroundColor = "#FFFFFF";
          }, 250 );
        });
      }

      for( var i = 0, l = data.length; i < l; i++ ) {

        popcorn.exec( data[ i ].start, function() {

          steps.innerHTML = data[ count ].note;
          count++;
        });
      }
    });
  });
});