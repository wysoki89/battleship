//function adding coordinates to new object Coordinate
function Coordinate (row,col){ 
    this.row = row;
    this.col = col;
    this.isHit = false;
}

//object view with methods that are changing the user's view
var view = { 
    
    displayMessage: function(msg){
        $('#message').html("");
        setTimeout(function(){
            $('#message').html(msg)},100)
    },
    
    displayHit: function(cell){
        
    $('td').eq(cell.row*7+cell.col).addClass("hit");
    $('td').eq(cell.row*7+cell.col).html('<img src="ship.png">');
    },
    
    displayMiss: function(cell){
        if(!$('td').eq(cell.row*7+cell.col).hasClass("hit"))
        {
            $('td').eq(cell.row*7+cell.col).html("X");
            $('td').eq(cell.row*7+cell.col).addClass("missed");
        }
    }       
};

var model = {
    boardSize: 7,
    numShips: 4,
    shipsSunk:0,
    //function adding parameters to new object Ship
    ships:[],
    makeShip: function (size){
        this.size = size;
        this.SetPositions = function(shipSize)
        {   
        var tempPositions = [];
        
        tempPositions[0]= new Coordinate (Math.floor((Math.random()*(8-shipSize))), Math.floor((Math.random()*(8-shipSize))));//maximum position of first location of the ship
        if ( Math.random() > 0.5) // horizontal
        {
            for (i=1; i < shipSize; i++)
            {
                tempPositions[i]= new Coordinate(tempPositions[i-1].row, tempPositions[i-1].col + 1);
            }    
        }
        else //vertical
        {
            for (i=1; i < shipSize; i++)
            {
                tempPositions[i]= new Coordinate(tempPositions[i-1].row + 1, tempPositions[i-1].col);
                tempPositions.isHit = false;
            }
        }
        return tempPositions;
        }   
        this.positions = this.SetPositions(this.size);
    }
};

// model.ships = [new model.makeShip(1),new model.makeShip(2),new model.makeShip(3),new model.makeShip(4)];
model.ships = [new model.makeShip(1),new model.makeShip(2),new model.makeShip(3),new model.makeShip(4)];
model.fire = function(){
             var currentHits = hits;
             var shotCell = this;
             shotCell.col = $(this).index(); 
             shotCell.row = $(this).parent().index();
             model.ships.forEach(function(item) { //for each ship
                    var currentShip = item;
                    item.positions.forEach(function(item,index){ //for each position in current ship
                        if( (shotCell.col === item.col) && (shotCell.row === item.row) && (currentShip.positions[index].isHit===false))
                        {
                            currentShip.positions[index].isHit=true;
                            hits++;
                            view.displayHit(shotCell);
                            view.displayMessage("Trafiłeś!");
                        }
                    });
             });
             if (hits === currentHits) //if there wasn't made another hit
             {
                     view.displayMiss(shotCell);
                     view.displayMessage("Pudło!");
             }
            guesses++;
            if (hits === model.ships[0].size + model.ships[1].size + model.ships[2].size + model.ships[3].size)
            {
            noMistakes = guesses-(model.ships[0].size + model.ships[1].size + model.ships[2].size + model.ships[3].size);
            $('#mistakes p').html('Ilość błędów: ' + noMistakes);
            view.displayMessage("Wygrałeś!");
            $('table').hide();
            $('#divName').show();
            }
}
//!!! dodaj do funkcji setPositions sprawdzenie czy już nie ma takiego statku! - tylko nie wiem jak 

var noMistakes = 0;
var hits = 0;
var guesses = 0;

$('td').on('click', model.fire);
$('#btnName').on('click', function(){
    $('#divName').hide();
    $('#results').show();
    $('#results').append('<tr><td>' + $('input').val() + '</td><td>' + noMistakes + '</td></tr>')
    $('#results tr').addClass('table table-striped');   
});

