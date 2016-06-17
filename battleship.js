            //function adding coordinates to new object Coordinate
        function Coordinate(row,col){ 
            this.row = row;
            this.col = col;
            this.isHit = false;
        }

        //object view with methods that are changing user's view
        var view = { 
            
            createSideShips: function(){
            model.ships.forEach(function(item,index){
                    $('#ships').append("<div></div>");
                    var shipIndex = index;
                        item.positions.forEach(function(item,index){
                            $('#ships div').eq(shipIndex).append('<img src="ship.png">');
                        });
                });    
            },
            // create board to play 
            createBoard: function(size){
                for(i=0;i<size;i++){
                    $('#board table').append("<tr></tr>");
                    for(j=0;j<size;j++){
                        $('#board table tr').eq(i).append("<td></td>");
                    }               
                }
            },
            
            // display message hit or missed after clicking td
            displayMessage: function(msg){
                $('#message').css({ "color": "black"});
                setTimeout(function(){
                    $('#message').html(msg)
                },100);
                $('#message').css({ "color": "white"});
            },
            
            // display ship after hit or cross after missed
            displayHitOrMissed: function(cell, msg){
                var cellOnBoard = $('#board td').eq(cell.row*7+cell.col);
                if(msg === "hit")
                {
                    cellOnBoard.addClass("hit");
                    cellOnBoard.html('<img src="ship.png">');
                }
                else if (msg==="missed" && !cellOnBoard.hasClass("hit"))
                {
                    cellOnBoard.html("X");
                    cellOnBoard.addClass("missed");
                }    
            },
            
            //sink ship - change opacity of sunk ship on side    
            sinkShip: function(shipNumber){
                $('#ships div').eq(shipNumber).addClass("shipSunk");
            },
            
            // display number of mistakes and message of winning, hide board and ships and display next step
            win: function(){
                $('#mistakes p').html('Number of mistakes: ' + controller.noMistakes);
                    this.displayMessage("You won!");
                    setTimeout(function(){
                        $('#board').hide();
                        $('#ships').hide();
                        $('#divName').show();
                    },3000);
            },
            
            // restart view
            restart: function(){
                $('#results-container').hide();
                $('#board').show();
                $('#mistakes p').html("");
                $('input').val("");
                $('#board td').html("");
                $('#board td').removeClass("hit");
                $('#board td').removeClass("missed");
                $('#board td').removeClass("guess");
                $('#ships').show();
                $('#ships div').removeClass("shipSunk");
                this.displayMessage("");
            },
            
            results: function(){
                $('#ships').hide();
                $('#board').hide();
                $('#divName').hide();
                $('#results-container').show();
            },
        };
        
        //object model with methods that are changing model
        var model = {
            boardSize:7,
            ships:[],
            Ship: function(size){
                this.positions=[];    
                this.size = size;
                this.hits=0;
            },
            
            // set random positions of each ship
            setPositions: function()
                {
                this.ships.forEach(function(item){ //for each ship
                    do{
                    var coordinate = {}
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
                    while(model.collision(item)>item.size); //if number of collisions is greater than ship's size - create positions again    
                    });   
                },
            
            // outputs number of collisions
            collision: function(ship){
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
            },   
            
            // restart model
            restart: function(){
                this.ships.forEach(function(item) { //for each ship
                item.positions.forEach(function(item){ //for each position in current ship
                    item.isHit = false;
                });
                item.hits=0;
            });
            this.setPositions();
            }
        };

        // creating ships and their positions
        model.ships = [new model.Ship(1),new model.Ship(2),new model.Ship(3),new model.Ship(4)];
        // lodash map for taking into array values of size from each ship and than lodash sum
        model.allShips = _.sum(_.map(model.ships, 'size'));
        //checks if the ship is hit
        model.fire = function(col,row){
                    var currentHits = controller.hits;
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
                                    controller.hits++;
                                    view.displayHitOrMissed(shotCell, "hit");
                                    view.displayMessage("Hit!");
                                    currentShip.hits++;
                                    controller.isSunk(currentShip);
                                }
                            });
                    });
                    if (controller.hits === currentHits) //if there wasn't made another hit
                    {
                            view.displayHitOrMissed(shotCell,"missed");
                            view.displayMessage("Missed!");
                    };
                    controller.isWin();
        };

        // controller joins view and model
        var controller = {
            // gives data to model and increase number of guesses
            processGuess: function(col,row){
                this.guesses++;
                model.fire(col,row);
            },
            // restart controller
            restart:function(){
                this.noMistakes = 0;
                this.hits = 0;
                this.guesses = 0;
            },
            // check if number of hits = number of ship's positions
            isWin:function(){
                if (this.hits === model.allShips)
                    {
                    this.noMistakes = this.guesses-model.allShips;
                    view.win();
                    }
            },
            // check if ship should sink
            isSunk: function(ship){
            if(ship.hits===ship.size)
                {
                view.sinkShip(model.ships.indexOf(ship));
                view.displayMessage("Sunk");
                }
            }, 
        };
        function init(){
            view.createBoard(model.boardSize);
            controller.restart();
            model.restart();
            view.restart();
            view.createSideShips();
            
            // gives location of hit after clicking on td
            $('#board td').on('click', function(){
                if(!$(this).hasClass("guess")){
                    $(this).addClass("guess");
                    controller.processGuess($(this).index(), $(this).parent().index());
                }
            });
            
            // input user's name action
            $('#btnName').on('click', view.results);

            // input user's name action on pressing enter
            $('#newUserName').on('keypress', function(e){
                if(e.keyCode===13){
                    view.results();        
                }
            });

            // play again action
            $('.play').on('click', function(){
                view.restart();
                model.restart();
                controller.restart();
            });
            
            $('#resultsMenu').on('click', function(){
                view.results();
            });
                
        };
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
                    $scope.users.push({'name':$('input').val(), 'mistakes':controller.noMistakes});
                };
                
            });
     