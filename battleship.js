//function adding coordinates to new object Coordinate
function Coordinate(row,col){ 
    this.row = row;
    this.col = col;
    this.isHit = false;
};

// display ship after hit or cross after missed
function displayHitOrMissed (cell, msg, target){
    var cellOnBoard = $(target + ' td').eq(cell.row*7+cell.col);
    if(msg === "hit")
    {
        cellOnBoard.addClass("hit");
        cellOnBoard.html('X');
    }
    else if (msg==="missed" && !cellOnBoard.hasClass("hit"))
    {
        cellOnBoard.html("X");
        cellOnBoard.addClass("missed");
    }    
};

function showResults(){
        $('#boards').hide();
        $('#divName').hide();
        $('#results-container').show();
    };

// display message hit or missed after clicking td
function displayMessage (msg){
    $('#message').css({ "color": "black"});
    setTimeout(function(){
        $('#message').html(msg)
    },100);
    $('#message').css({ "color": "white"});
};
            
// display number of mistakes and message of winning, hide board and ships and display next step
function displayUsersShips(){
    usersCollection.ships.forEach(function(item){ //for each existing ship
        item.positions.forEach(function(item){ // for each position in existing ship
            $('#usersBoard td').eq(item.row*7+item.col).html('<img src="ship.png">');
        })
    })
};

// restart view
function restartView(){
    $('#results-container').hide();
    $('#boards').show();
    $('#mistakes').html("");
    $('#newUserName').val("");
    $('#boards td').html("");
    $('#boards td').removeClass("hit");
    $('#boards td').removeClass("missed");
    $('#boards td').removeClass("guess");
    displayMessage("");
};

function isWin(){
    if (computersCollection.hits === computersCollection.allShips)
    {
        computersCollection.noMistakes = computersCollection.guesses-computersCollection.allShips;
        win();
        return true;
    }
};
            
function win(){
    $('#mistakes').html('Number of mistakes: ' + computersCollection.noMistakes);
    displayMessage("You won!");
    setTimeout(function(){
        $('#boards').hide();
        $('#divName').show();
    },2000);
};

// constructor function for new instances of game
var Battleship = function(){};

//object view with methods that are changing user's view
Battleship.prototype.View = (function View(){
    var View = function(){};
    // create board to play
    View.prototype.createBoard = function(params){
        $(params.where).append("<table></table>")
        for(i=0;i<params.size;i++)
        {
            $(params.where + ' table').append("<tr></tr>");
            for(j=0;j<params.size;j++)
            {
                $(params.where + ' table tr').eq(i).append("<td></td>");
            }               
        }
        this.boardSize = params.size;
        };
        return View;
})();

            
//object model with methods that are changing model
Battleship.prototype.Model = (function(){
        var Model = function(){
        Model.prototype.Ship = function(params){
            this.positions=[];    
            this.size = params.size;
            this.hits=0;
        };
    };
return Model;
})();

Battleship.prototype.Collection = (function(){
    var Collection = function(ships){
        this.ships=ships;
        this.hits = 0;
        this.guesses=0;
        this.noMistakes=0;
        // lodash map for taking into array values of size from each ship and than lodash sum
        this.allShips = _.sum(_.map(this.ships, 'size'));
}
// outputs number of collisions
Collection.prototype.collision = function(ship){
        var collisions=0;
        this.ships.forEach(function(item){ //for each existing ship
            item.positions.forEach(function(item){ // for each position in existing ship
                var checkedPosition = item;
                ship.positions.forEach(function(item){ //check each position of new ship 
                    if(checkedPosition.col===item.col && checkedPosition.row===item.row){
                        collisions++;
                    }    
                });
            });
        });
        return collisions;
    };   
    
// set random positions of each ship
Collection.prototype.setPositions = function(){
        this.hits=0;
        var currentCollection = this;
        this.ships.forEach(function(item){ //for each ship
            do{
            item.positions[0]= new Coordinate (Math.floor((Math.random()*(8-item.size))), Math.floor((Math.random()*(8-item.size))));//maximum position of first location of the ship
            if ( Math.random() > 0.5) // horizontal
            {
                // create next positions
                for (i=1; i < item.size; i++)
                {
                    item.positions[i]= new Coordinate(item.positions[i-1].row, item.positions[i-1].col + 1);
                }    
            }
            else //vertical
            {
                // create next positions
                for (i=1; i < item.size; i++)
                {
                    item.positions[i]= new Coordinate(item.positions[i-1].row + 1, item.positions[i-1].col);
                }
            }
            }
            while(currentCollection.collision(item)>item.size); //if number of collisions is greater than ship's size - create positions again    
        });
}; 
Collection.prototype.fire = function(col,row,target){
            var currentCollection = this; 
            var currentHits = this.hits;
            var shotCell = {};
            shotCell.col = col; 
            shotCell.row = row;
            this.ships.forEach(function(item,index) { //for each ship
                    var currentShip = item;
                    var currentShipNumber = index;
                    item.positions.forEach(function(item,index){ //for each position in current ship
                        if( (shotCell.col === item.col) && (shotCell.row === item.row) && (currentShip.positions[index].isHit===false))
                        {
                            currentShip.positions[index].isHit=true;
                            currentHits++;
                            displayHitOrMissed(shotCell, "hit",target);
                            displayMessage("Hit!");
                            currentShip.hits++;
                            currentCollection.isSunk(currentShip);
                        }
                    });
            });
            if (this.hits === currentHits) //if there wasn't made another hit
            {
                    displayHitOrMissed(shotCell,"missed",target);
                    displayMessage("Missed!");
            };
            this.hits=currentHits;
            isWin();
};

Collection.prototype.processGuess = function(col,row,target){ 
        this.guesses++;
        this.fire(col,row,target);
    };
// check if ship should sink
Collection.prototype.isSunk = function(ship){
    if(ship.hits===ship.size)
        {
        displayMessage(ship.size + "-ship sunk");
        }
};
return Collection;
})();

    
var computersGame = new Battleship();
var computersView = new computersGame.View();
computersView.createBoard({size:7, where:'#computersBoard'});
var computersModel = new computersGame.Model();
var computersCollection = new computersGame.Collection([new computersModel.Ship({size:1}), new computersModel.Ship({size:2}),new computersModel.Ship({size:3}),new computersModel.Ship({size:4})]);

var usersGame = new Battleship();
var usersView = new usersGame.View();
var usersModel = new usersGame.Model();
var usersCollection = new usersGame.Collection([new usersModel.Ship({size:1}), new usersModel.Ship({size:2}),new usersModel.Ship({size:3}),new usersModel.Ship({size:4})]);
usersView.createBoard({size:7, where:'#usersBoard'});
function init(){
    computersCollection.setPositions();
    usersCollection.setPositions();
    displayUsersShips();
    displayMessage("Your turn");
    $('#usersBoard table').addClass("notActive");
    $('#divName').hide();
    $('#results-container').hide();
};
    
// gives location of hit after clicking on td
$('#computersBoard td').on('click', function(){
    if(!$(this).hasClass("guess")){
        $(this).addClass("guess");
        computersCollection.processGuess($(this).index(), $(this).parent().index(),"#computersBoard");
        if(isWin()){
            return false;
        }
        setTimeout(function(){
            displayMessage("My turn");
            $('#computerssBoard table').addClass("notActive");
            $('#usersBoard table').removeClass("notActive");
            },1200);
            setTimeout(function(){displayMessage("...shooting")}
            ,2300);
            setTimeout(function(){
            usersCollection.processGuess(Math.floor(computersView.boardSize*Math.random()),Math.floor(computersView.boardSize*Math.random()),"#usersBoard")}
            ,3600);
            setTimeout(function(){
            displayMessage("Your turn");
            $('#computerssBoard table').removeClass("notActive");
            $('#usersBoard table').addClass("notActive");}
            ,4900);
    }
});

// input user's name action
$('#btnName').on('click', showResults);
// input user's name action on pressing enter
$('#newUserName').on('keypress', function(e){
    if(e.keyCode===13){
        showResults();        
    }
});
// play again action
$('.play').on('click', function(){
    restartView();
    init();
});

$('#resultsMenu').on('click', function(){
    showResults();
});

// $('#resultsMenu').on('click', function(){
//     view.results();
// });
        
init(); 
//initialize data for winer's table and add new user after clicking button 
var myModule = angular.module('myModule', []);
myModule.controller('myController', function myController($scope){
        $scope.users = [
        {name:'Generał Tomasz', mistakes:0},
        {name:'Marek12', mistakes:39},
        {name:'elcia', mistakes:12},    
        ];
        $scope.addUser = function(){
            $scope.users.push({'name':$('input').val(), 'mistakes':computersCollection.noMistakes});
        };
        
});