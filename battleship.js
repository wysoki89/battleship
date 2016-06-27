//class coordinates
class Coordinate{
    constructor(row,col){ 
        this.row = row;
        this.col = col;
        this.isHit = false;
    };
};



function displayUsersShips(){
    usersCollection.ships.forEach(item=>{ //for each existing ship
        item.positions.forEach(item=>{ // for each position in existing ship
            $('#usersBoard td').eq(item.row*7+item.col).html('<img src="ship.png">');
        })
    })
};

function isWin(){
    if (computersCollection.hits === computersCollection.allShips)
    {
        computersCollection.noMistakes = computersCollection.guesses-computersCollection.allShips;
        usersView.win();
        return true;
    }
};
            
class View{
    // create board to play
    createBoard (params){
        $(params.where).append("<table></table>")
        for(let i=0;i<params.size;i++)
        {
            $(`${params.where} table`).append("<tr></tr>")
            for(let j=0;j<params.size;j++)
            {
                $(`${params.where} table tr`).eq(i).append("<td></td>")
            }               
        }
        this.boardSize = params.size
        }
    // display ship after hit or cross after missed
    displayHitOrMissed(cell, msg, target){
        var cellOnBoard = $(`${target} td`).eq(cell.row*7+cell.col);
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
    }


    // display message hit or missed after clicking td
    displayMessage(msg){
        $('#message').css({ "color": "black"});
        setTimeout(function(){
            $('#message').html(msg)
        },100);
        $('#message').css({ "color": "white"});
    }
    
    // display number of mistakes and message of winning, hide board and ships and display next step
    win(){
        $('#mistakes').html(`Number of mistakes: ${computersCollection.noMistakes}`);
        usersView.displayMessage("You won!");
        setTimeout(function(){
            $('#boards').hide();
            $('#divName').show();
        },2000);
    };

    addWinner(){
        var userName = $('#newUserName').val();
        $.post( "https://sheetsu.com/apis/v1.0/0744fb34d780", { Nick: userName, Mistakes:computersCollection.noMistakes} );
        $('#results').append(`<tr><td>${userName}</td><td>${computersCollection.noMistakes}</td></tr>`);
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
        usersView.displayMessage("");
    };

}
    

//class model with methods that are changing model
class Model{
    constructor(params){
        this.positions=[];    
        this.size = params.size;
        this.hits=0;
    }
}
    
class Collection{
    constructor(ships){
        this.ships=ships;
        this.hits = 0;
        this.guesses=0;
        this.noMistakes=0;
        // lodash map for taking into array values of size from each ship and than lodash sum
        this.allShips = _.sum(_.map(this.ships, 'size'));
    }

    setPositions(){
        this.ships.forEach(item=>{ //for each ship
            do{
            item.positions[0]= new Coordinate (Math.floor((Math.random()*(8-item.size))), Math.floor((Math.random()*(8-item.size))));//maximum position of first location of the ship
            if ( Math.random() > 0.5) // horizontal
            {
                // create next positions
                for (let i=1; i < item.size; i++)
                {
                    item.positions[i]= new Coordinate(item.positions[i-1].row, item.positions[i-1].col + 1);
                }    
            }
            else //vertical
            {
                // create next positions
                for (let i=1; i < item.size; i++)
                {
                    item.positions[i]= new Coordinate(item.positions[i-1].row + 1, item.positions[i-1].col);
                }
            }
            }
            while(this.collision(item)>item.size); //if number of collisions is greater than ship's size - create positions again    
        });
    }; 
    // outputs number of collisions
    collision(ship){
            var collisions=0;
            this.ships.forEach(item=>{ //for each existing ship
                item.positions.forEach(item=>{ // for each position in existing ship
                    var checkedPosition = item;
                    ship.positions.forEach(item=>{ //check each position of new ship 
                        if(checkedPosition.col===item.col && checkedPosition.row===item.row){
                            collisions++;
                        }    
                    });
                });
            });
            return collisions;
        };   
    // set random positions of each ship
    fire(col,row,target){
                var that = this; 
                var currentHits = this.hits;
                var shotCell = {};
                shotCell.col = col; 
                shotCell.row = row;
                this.ships.forEach((item,index)=>{ //for each ship
                        var currentShip = item;
                        var currentShipNumber = index;
                        item.positions.forEach((item,index)=>{ //for each position in current ship
                            if( (shotCell.col === item.col) && (shotCell.row === item.row) && (currentShip.positions[index].isHit===false))
                            {
                                currentShip.positions[index].isHit=true;
                                currentHits++;
                                usersView.displayHitOrMissed(shotCell, "hit",target);
                                usersView.displayMessage("Hit!");
                                currentShip.hits++;
                                that.isSunk(currentShip);
                            }
                        });
                });
                if (this.hits === currentHits) //if there wasn't made another hit
                {
                        usersView.displayHitOrMissed(shotCell,"missed",target);
                        usersView.displayMessage("Missed!");
                };
                this.hits=currentHits;
                isWin();
    };
    processGuess(col,row,target){ 
            this.guesses++;
            this.fire(col,row,target);
        };
    // check if ship should sink
    isSunk(ship){
        if(ship.hits===ship.size)
            {
            usersView.displayMessage(`${ship.size}-ship sunk`);
            }
    };
}

var computersView = new View();
computersView.createBoard({size:7, where:'#computersBoard'});
var computersCollection = new Collection([new Model({size:1}), new Model({size:2}),new Model({size:3}),new Model({size:4})]);
var usersView = new View();
var usersCollection = new Collection([new Model({size:1}), new Model({size:2}),new Model({size:3}),new Model({size:4})]);
usersView.createBoard({size:7, where:'#usersBoard'});
function init(){
    computersCollection.setPositions();
    usersCollection.setPositions();
    displayUsersShips();
    usersView.displayMessage("Your turn");
    $('#usersBoard table').addClass("notActive");
    $('#divName').hide();
    $('#results-container').hide();
};
function getResults(){
    var resultsUrl = "https://sheetsu.com/apis/v1.0/0744fb34d780";
    $.ajax({
       url: resultsUrl,
       dataType: 'json',
       type: 'GET',
      success: function(data) {
         data.forEach(item=>{
             $('#results').append(`<tr><td>${item.Nick}</td><td>${item.Mistakes}</td></tr>`);
          })
          $('#results tr').addClass("table table-striped text-center");
       },
      // handling error response
       error: function(data) {
         console.log(data);
       }
     });
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
            usersView.displayMessage("My turn");
            $('#computerssBoard table').addClass("notActive");
            $('#usersBoard table').removeClass("notActive");
            },1200);
            setTimeout(function(){usersView.displayMessage("...shooting")}
            ,2300);
            setTimeout(function(){
            usersCollection.processGuess(Math.floor(computersView.boardSize*Math.random()),Math.floor(computersView.boardSize*Math.random()),"#usersBoard")}
            ,3600);
            setTimeout(function(){
            usersView.displayMessage("Your turn");
            $('#computerssBoard table').removeClass("notActive");
            $('#usersBoard table').addClass("notActive");}
            ,4900);
    }
});

// input user's name action
$('#btnName').on('click', function(){
    usersView.addWinner();
    usersView.showResults();
});
// input user's name action on pressing enter
$('#newUserName').on('keypress', function(e){
    if(e.keyCode===13){
        usersView.addWinner();
        usersView.showResults();        
    }
});
// play again action
$('.play').on('click', function(){
    usersView.restartView();
    init();
});

$('#resultsMenu').on('click', function(){
    usersView.showResults();
});

init(); 
getResults();