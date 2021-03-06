/**
 * @class Coordinate
 */
class Coordinate{
    constructor(row,col){ 
        this.row = row;
        this.col = col;
        this.isHit = false; 
    }
}
/**
 * display users ships on computers board
 * 
 * @function displayUsersShips
 */
function displayUsersShips(){
    usersGame.collection.ships.forEach(item => { 
        item.positions.forEach(item => { 
            $('#usersBoard td').eq(item.row*7 + item.col).html('<img draggable="true" src="ship.png">');
        })
    })
}
/**
 * check if user won
 * 
 * @function isWin
 */
function isWin(){
    if (computersGame.collection.hits === computersGame.collection.allShips){
        computersGame.collection.noMistakes = computersGame.collection.guesses - computersGame.collection.allShips;
        usersGame.view.win();
        return true;
    }
}

    

//class model with methods that are changing model
class Model{
    constructor(params){
        this.positions = [];    
        this.size = params.size;
        this.hits = 0;
    }
}

class Battleship{
    constructor(){
        this.view = (function view(){
            /**
             * @class View
             */            
            class View{
                /**
                 * creates board in dom
                 * 
                 * @method createBoard
                 * @param {Object.Number} size
                 */
                createBoard (params){
                    var table = document.createElement("table");
                    for(let i = 0; i < params.size; i++){
                        var row = document.createElement("tr");
                        table.appendChild(row);
                        for(let j = 0; j < params.size; j++){
                            var cell = document.createElement("td");
                            table.children[i].appendChild(cell);
                        }               
                    }
                    this.boardSize = params.size;
                    return table;
                }

                /**
                 * display ship after hit or cross after missed
                 * 
                 * @method displayHitOrMissed
                 * @param {Object Coordinate} cell
                 * @param {String} msg
                 * @param {DOM Object} target
                 */
                displayHitOrMissed(cell, msg, target){
                    var cellOnBoard = $(`${target} td`).eq(cell.row*7+cell.col);
                    if(msg === "hit"){
                        cellOnBoard.addClass("hit");
                        cellOnBoard.html('X');
                    }
                    else if (msg==="missed" && !cellOnBoard.hasClass("hit")){
                        cellOnBoard.html("X");
                        cellOnBoard.addClass("missed");
                    }    
                }
                /**
                 * display message hit or missed after clicking td
                 * 
                 * @method displayMessage
                 * @param {String} msg 
                 */

                displayMessage(msg){
                    $('#message').css({ "color": "black"});
                    setTimeout(function(){
                        $('#message').html(msg);
                    }, 100);
                    $('#message').css({ "color": "white"});
                }
                
                /**
                 * display number of mistakes and message of winning, hide board and and display next step
                 * 
                 * @method win
                 */
                win(){
                    $('#mistakes').html(`Number of mistakes: ${computersGame.collection.noMistakes}`);
                    usersGame.view.displayMessage("You won!");
                    setTimeout(function(){
                        $('#boards').hide();
                        $('#divName').show();
                    }, 2000);
                }

                addWinner(){
                    var userName = $('#newUserName').val();
                    if(userName === "Sabina"){
                        alert("Sabina! Wpadłaś w oko generałowi Tomaszowi ;)")
                    }
                    $.post("/addUser", {nick: userName, mistakes:computersGame.collection.noMistakes});
                    $('#results tr').not(':eq(0)').html("");
                    getResults();
                    $('#results tr').addClass("table table-striped text-center");

                }

                showResults(){
                    $('#boards').hide();
                    $('#divName').hide();
                    $('#results-container').show();
                }
                // restart view
                restartView(){
                    $('#results-container').hide();
                    $('#boards').show();
                    $('#mistakes').html("");
                    $('#newUserName').val("");
                    $('#boards td').html("");
                    $('#boards td').removeClass("hit");
                    $('#boards td').removeClass("missed");
                    $('#boards td').removeClass("guess");
                    usersGame.view.displayMessage("");
                }
            }
            return new View;
            }())
                    
            this.collection = (function collection(){
                class Collection{
                    constructor(ships){
                        this.ships=ships;
                        this.hits = 0;
                        this.guesses = 0;
                        this.noMistakes = 0;
                        // lodash map for taking into array values of size from each ship and than lodash sum
                        this.allShips = _.sum(_.map(this.ships, 'size'));
                    }
                    // set random positions of each ship
                    setPositions(){
                        this.ships.forEach(item => { //for each ship
                            do{
                            item.positions[0]= new Coordinate(Math.floor((Math.random()*(8 - item.size))), Math.floor((Math.random()*(8 - item.size))));//maximum position of first location of the ship
                            if (Math.random() > 0.5){ // horizontal
                                // create next positions
                                for (let i = 1; i < item.size; i++){
                                    item.positions[i]= new Coordinate(item.positions[i-1].row, item.positions[i-1].col + 1);
                                }    
                            }
                            else{ //vertical
                                // create next positions
                                for (let i = 1; i < item.size; i++){
                                    item.positions[i]= new Coordinate(item.positions[i-1].row + 1, item.positions[i-1].col);
                                }
                            }
                            }
                            while(this._collision(item)>0); //if number of collisions is greater than ship's size - create positions again    
                        })
                    } 
                    // outputs number of collisions
                    _collision(ship){
                            var collisions = 0;
                            this.ships.forEach(checkedShip => { //for each existing ship
                                if(checkedShip === ship){
                                    return false;
                                }
                                else{
                                    checkedShip.positions.forEach(checkedPos => { // for each position in existing ship
                                        var checkedPosition = checkedPos;
                                        ship.positions.forEach(newShipsPos => { //check each position of new ship
                                            var dist = Math.sqrt(Math.pow(checkedPosition.col - newShipsPos.col,2)+Math.pow(checkedPosition.row - newShipsPos.row,2));
                                            if(dist<=1.44){
                                                collisions++;
                                            }    
                                        })
                                    })
                                }
                            })

                            return collisions;
                    }   
                    
                    fire(col,row,target){
                                this.guesses++;
                                var that = this; 
                                var currentHits = this.hits;
                                var shotCell = {};
                                shotCell.col = col; 
                                shotCell.row = row;
                                this.ships.forEach((item,index) => { //for each ship
                                        var currentShip = item;
                                        var currentShipNumber = index;
                                        item.positions.forEach((item,index) => { //for each position in current ship
                                            if( (shotCell.col === item.col) && (shotCell.row === item.row) && (currentShip.positions[index].isHit===false)){
                                                currentShip.positions[index].isHit=true;
                                                that.hits++;
                                                usersGame.view.displayHitOrMissed(shotCell, "hit", target);
                                                usersGame.view.displayMessage("Hit!");
                                                currentShip.hits++;
                                                that.isSunk(currentShip);
                                                isWin();
                                            }
                                        })
                                })
                                if (this.hits === currentHits){ //if there wasn't made another hit
                                        usersGame.view.displayHitOrMissed(shotCell, "missed", target);
                                        usersGame.view.displayMessage("Missed!");
                                        return false;
                                }
                    }
                    // check if ship should sink
                    isSunk(ship){
                        if(ship.hits===ship.size){
                            usersGame.view.displayMessage(`${ship.size}-ship sunk`);
                            }
                    }
                }
            return new Collection([new Model({size: 4}), new Model({size: 3}),new Model({size: 2}),new Model({size: 1})]);
            }())
        }
}

var computersGame = new Battleship();
var usersGame = new Battleship();
$('#computersBoard').append(computersGame.view.createBoard({size: 7}));
$('#usersBoard').append(usersGame.view.createBoard({size: 7}))
function init(){
    computersGame.collection.setPositions();
    usersGame.collection.setPositions();
    computersGame.collection.hits=0;
    computersGame.collection.noMistakes=0;
    computersGame.collection.guessses=0;
    usersGame.collection.hits=0;
    usersGame.collection.noMistakes=0;
    usersGame.collection.guessses=0;
    displayUsersShips();
    usersGame.view.displayMessage("Your turn");
    $('#usersBoard table').addClass("notActive");
    $('#divName').hide();
    $('#results-container').hide();
}
function getResults(){
    $.get("/results", function (data) {
        data = data.sort(function(a,b){
            return a.mistakes > b.mistakes;
        }).slice(0,10);
        data.forEach(item => {
             $('#results').append(`<tr><td>${item.nick}</td><td>${item.mistakes}</td></tr>`);
          })
          $('#results tr').addClass("table table-striped text-center");
       })
}

    
$('#computersBoard td').on('click', function action(){
    if(!$(this).hasClass("guess")){
        var n =0;
        $(this).addClass("guess");
        if (computersGame.collection.fire($(this).index(), $(this).parent().index(),"#computersBoard") !== false){
            return false;
        }
        if(isWin()){
            return false;
        }
        //remove event listener
        $('#computersBoard td').off();
        setTimeout(function(){
            $('#computersBoard td').on('click', action);
        },3000)
        setTimeout(function(){
            usersGame.view.displayMessage("My turn");
            $('#computersBoard table').addClass("notActive");
            $('#usersBoard table').removeClass("notActive");
        }, 1000);
        setTimeout(function a(){
            var isShot = usersGame.collection.fire(Math.floor(computersGame.view.boardSize*Math.random()),Math.floor(computersGame.view.boardSize*Math.random()),"#usersBoard");
            if (isShot !== false){
                n++;
                console.log(isShot);
                setTimeout(a,500);
            }    
        }, 2000);
        setTimeout(function(){
            usersGame.view.displayMessage("Your turn");
            $('#computersBoard table').removeClass("notActive");
            $('#usersBoard table').addClass("notActive");
        }, 3000+n*500);
    }
})

// input user's name action
$('#btnName').on('click', function(){
    usersGame.view.addWinner();
    usersGame.view.showResults();
})
// input user's name action on pressing enter
$('#newUserName').on('keypress', function(e){
    if(e.keyCode === 13){
        usersGame.view.addWinner();
        usersGame.view.showResults();        
    }
})
// play again action
$('.play').on('click', function(){
    usersGame.view.restartView();
    init();
})

$('#resultsMenu').on('click', function(){
    usersGame.view.showResults();
})


init(); 
getResults();