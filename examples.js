'use strict';

/**
 * Tomeczku
 * Z takich błędów - to możesz całą apkę wrzucić sobie w domknięcie i wtedy masz pewność
 * że żaden lib / dependencja nie nadpisze zmiennej globalnej jakiej użyłeś np. model, czy view. :)
 * Więc zacznijmy od tego prostego domknięcia. 
 * Druga rzecz, używaj na początu 'use strict' abyś wymuszał użycie es5;
 * PS. Zacznij korzystać/eksperymentować i zrozumieć biblioteke lodash - na prawde warto już od początku w to wchodzić.
 */

(function (window, jQuery, angular) {
  /**
   * Tutaj masz miejsce na całą swoją appke - staraj się trzymać takiego stylu, 
   * masz pewność, że inne rzeczy Ci nie rozdupczą tego co napsiałeś
   */

  /**
   * Zakładam, że będę chciał zrobić Model, Kolekcje, Widok ale np.
   * Poza planszą gry będę chciał sobie zrobić jeszcze tablice wyników etc,
   * Zastosuje więc prosty namespace
   * W takim przypadku zdefiniuje sobie 
   */

  /**
   * Namespace (znów stosuje domknięcie)
   */
  var BattleShip = (function BattleShip() {

    /**
     * @param element - element, w którym będzie renderowany view - defaultowo <body>
     */
    
    var BattleShip = function () {}
    /**
     * A tutaj nadpiszemy prototyp metodami
     */
    BattleShip.prototype.Model = (function Model() {
      var Model = function (params) {
        //Tworzymy model
        this.size = params.size || 1; //domyślnie 1
        this.crashed = false; //Stan początkowy
        this.x = params.x || 0;
        this.y = params.y || 0;
      }
      
      return Model;
    
    })()

    BattleShip.prototype.Collection = (function Collection() {
      var Collection = function (models) {
        this.ships = models || []; //Domyślnie pusta kolekcja
      }

      /**
       * Metoda zwróci wszystkie statki o rozmiarze 1 z twojej kolekcji.
       */
      Collection.prototype.getShipsBySize = function (size) {
        return this.ships.filter(function (model, index) {
          return model.size === size;
        })
      }

      /**
       * Metoda sprawdzi czy na polu X i Y znajduje sie statek
       */
      Collection.prototype.checkShipAtXY = function (x, y) {
        return this.ships.filter(function (model, index) {
          return model.x === x && model.y === y;
        })
      }
      
      /**
       * Metoda sprawdzi czy na polu X i Y znajduje sie statek
       */
      Collection.prototype.fire = function (x, y) {
        this.checkShipAtXY(x,y).map(function(model){
          model.crashed = true;
        });
      }
      
      return Collection;

    })()

    BattleShip.prototype.View = (function View() {

      var View = function (collection, el) {
        this.collection = collection || []; //Domyślnie pusta kolekcja
        this.$el = $(el || 'body'); //I od teraz mozesz posługiwać się this.$el wewnątrz funkcji  
      }

      /**
       * Metoda zwróci wszystkie statki o rozmiarze 1 z twojej kolekcji.
       */
      View.prototype.placeShips = function () {
        //Kod co układa randomodo statki  
      }

      /**
       * Metoda sprawdzi czy na polu X i Y znajduje sie statek
       */
      View.prototype.render = function () {
        this.$el.html('<p>Tutaj bedzie plansza</p>') //Tutaj kod co renderuje plansze
        this.placeShips(); //I wywołanie przy każdym renderze układania statków bo i tak trzeba ułożyć
      }

      return View;

    })()

    return BattleShip;
  })()


  /**
   * I w takiej realizacji możemy przejść do pisania aplikacji czyli
   */

  //Tworzę instancje gry
  var GameInstance = new BattleShip('body');
  
  //Collection
  var ShipCollection = new GameInstance.Collection([
    new GameInstance.Model({
      size: 2,
      x: 1,
      y: 1,
    }),
    new GameInstance.Model({
      size: 1,
      x: 4,
      y: 5,
    }),
    new GameInstance.Model({
      size: 1,
      x: 8,
      y: 4,
    }),
  ]);
  
  //Zobacz w konsoli jak to wygląda
  console.log(ShipCollection)
  //Powinnien zwrócić tylko dwa statki bo trzeci ma size = 2
  console.log(ShipCollection.getShipsBySize(1))
  
  //Widok
  var ShipView = new GameInstance.View(ShipCollection)
  
  //I teraz w kontrolerze jak bedziesz chcial cos zrobic to masz proste metody:
  ShipView.render()
  
})(window, jQuery, angular)

//Jeżeli korzystasz z jakiś bibliotek typu angular, jquery, możesz je przekazać lokalnie do zasięgu swojego scope.
//Właśnie w tym () domnikęciu :)