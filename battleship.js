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
};

function Coordinate (row,col){ //function adding coordinates to new object Coordinate
    this.row = row;
    this.col = col;
}

var ship1 = new Ship (1); //new object Ship
var ship2 = new Ship (2); //new object Ship
var ship3 = new Ship (3); //new object Ship    
var ship4 = new Ship (4); //new object Ship
var ships = [ship1, ship2, ship3, ship4];



//!!! dodaj do funkcji setPositions sprawdzenie czy już nie ma takiego statku! - tylko nie wiem jak 

var hits = 0;
var guesses = 0;
var isSunk = false;

$('td').on('click', function(){
     if( ($(this).index() === ship1.positions[0].col && $(this).parent().index() === ship1.positions[0].row)  ||
     ($(this).index() === ship2.positions[0].col && $(this).parent().index() === ship2.positions[0].row) ||
     ($(this).index() === ship2.positions[1].col && $(this).parent().index() === ship2.positions[1].row) ||
     ($(this).index() === ship3.positions[0].col && $(this).parent().index() === ship3.positions[0].row) ||
     ($(this).index() === ship3.positions[1].col && $(this).parent().index() === ship3.positions[1].row) ||
     ($(this).index() === ship3.positions[2].col && $(this).parent().index() === ship3.positions[2].row) ||
     ($(this).index() === ship4.positions[0].col && $(this).parent().index() === ship4.positions[0].row) ||
     ($(this).index() === ship4.positions[1].col && $(this).parent().index() === ship4.positions[1].row) ||
     ($(this).index() === ship4.positions[2].col && $(this).parent().index() === ship4.positions[2].row) ||
     ($(this).index() === ship4.positions[3].col && $(this).parent().index() === ship4.positions[3].row))
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
     if (hits == ship1.size + ship2.size + ship3.size + ship4.size)
     {
        isSunk == true;
        $('#results p').html('Ilość błędów: ' + (guesses-(ship1.size + ship2.size + ship3.size + ship4.size)));
        alert("Wygrałeś");
        }
});     