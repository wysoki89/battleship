var view = { //object view with methods that are changing the user's view
    
    displayMessage: function(msg){
        $('#message').html("");
        setTimeout(function(){
            $('#message').html(msg)},100)
    },
    
    displayHit: function(location){
        $(location).addClass("hit");
        $(location).html('<img src="ship.png">');
    },
    
    displayMiss: function(location){
    $(location).html("X");
    $(location).addClass("missed");
    }       
};

var model = {
    boardSize: 7,
    numShips: 4,
    shipsSunk:0,
    
    ships:[new Ship(1),new Ship(2),new Ship(3),new Ship(4)]
};

function Ship (size)
{ //function adding parameters to new object Ship
    this.size = size;
    this.SetPositions = function(shipSize)
    {   
    var TempPositions = [];
    TempPositions[0]= new Coordinate (Math.floor((Math.random()*(8-shipSize))), Math.floor((Math.random()*(8-shipSize))));//maximum position of first location of the ship
    if ( Math.random() > 0.5) // horizontal
    {
        for (i=1; i < shipSize; i++)
        {
            TempPositions[i]= new Coordinate(TempPositions[i-1].row, TempPositions[i-1].col + 1)
        }    
    }
    else //vertical
    {
        for (i=1; i < shipSize; i++)
        {
            TempPositions[i]= new Coordinate(TempPositions[i-1].row + 1, TempPositions[i-1].col)
        }
    }
    return TempPositions;
    }   
    this.positions = this.SetPositions(this.size);
    this.hits = ["","",""];
};

function Coordinate (row,col){ //function adding coordinates to new object Coordinate
    this.row = row;
    this.col = col;
}





//!!! dodaj do funkcji setPositions sprawdzenie czy już nie ma takiego statku! - tylko nie wiem jak 

var hits = 0;
var guesses = 0;
var isSunk = false;

$('td').on('click', function(){
     if( ($(this).index() === model.ships[0].positions[0].col && $(this).parent().index() === model.ships[0].positions[0].row)  ||
     ($(this).index() === model.ships[1].positions[0].col && $(this).parent().index() === model.ships[1].positions[0].row) ||
     ($(this).index() === model.ships[1].positions[1].col && $(this).parent().index() === model.ships[1].positions[1].row) ||
     ($(this).index() === model.ships[2].positions[0].col && $(this).parent().index() === model.ships[2].positions[0].row) ||
     ($(this).index() === model.ships[2].positions[1].col && $(this).parent().index() === model.ships[2].positions[1].row) ||
     ($(this).index() === model.ships[2].positions[2].col && $(this).parent().index() === model.ships[2].positions[2].row) ||
     ($(this).index() === model.ships[3].positions[0].col && $(this).parent().index() === model.ships[3].positions[0].row) ||
     ($(this).index() === model.ships[3].positions[1].col && $(this).parent().index() === model.ships[3].positions[1].row) ||
     ($(this).index() === model.ships[3].positions[2].col && $(this).parent().index() === model.ships[3].positions[2].row) ||
     ($(this).index() === model.ships[3].positions[3].col && $(this).parent().index() === model.ships[3].positions[3].row))
     {
            hits++;
            view.displayHit(this);
            view.displayMessage("Trafiłeś!");
     }
     else
     {
            view.displayMiss(this);
            view.displayMessage("Pudło!");
     }
     console.log(hits);
     guesses++;
     if (hits == model.ships[0].size + model.ships[1].size + model.ships[2].size + model.ships[3].size)
     {
        isSunk == true;
        $('#results p').html('Ilość błędów: ' + (guesses-(ship1.size + ship2.size + ship3.size + ship4.size)));
        alert("Wygrałeś");
        }
});     