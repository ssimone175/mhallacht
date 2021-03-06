import { observable, action } from 'mobx';
import { observer } from "mobx-react";
import CardStore from "../stores/cardStore"
import React from "react"



//Classes that make up the Board Game
class Card {
    constructor(value,id) {
        this.value = value;
        this.id= id;
    }
}class Deck {
    constructor() {
        this.cards = [];
        this.roleCards = [];
    }
    createDeck() {
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
        let id =0;
        for (let j = 0; j < values.length; j++) {
          let number;
          switch(Math.abs(values[j]-(values.length-1)/2)){
            case 4.5: case 3.5:
              number = 3;
              break;
            case 2.5: case 1.5:
              number = 6;
              break;
            case 0.5:
              number = 9;
              break;

          }
          for (let i=0; i < number ; i++){
              this.cards.push(new Card(values[j],values[j]+"-"+id));
              id++;
          }
        }
        for (let i=0; i < 12; i++){
            this.cards.push(new Card("show","show-"+id));
            this.cards.push(new Card("double","double-"+id));
            id++;
        }
        for (let i=0; i < 9; i++){
            this.cards.push(new Card("swap","swap-"+id));
            this.cards.push(new Card("end","end-"+id));
            id++;
        }
        for (let i=0; i < 6; i++){
            this.cards.push(new Card("skip","skip-"+id));
            this.cards.push(new Card("role-swap","role-swap-"+id));
            id++;
        }
        let roles = ["abenteurer", "haendler", "alter-mann", "wanderer", "kobold", "prediger", "gottheit", "buerokrat", "koenig", "bettler", "scharlatan", "mitlaeufer"];
        //let roles =["kobold","kobold","kobold","kobold","kobold","kobold","kobold"];
        for (let i = 0; i < roles.length; i++) {
              this.roleCards.push(roles[i]);
        }
    }

    shuffleDeck() {
       let location1, location2, tmp;
       for (let i = 0; i < 2000; i++) {
           location1 = Math.floor((Math.random() * this.cards.length));
           location2 = Math.floor((Math.random() * this.cards.length));
           tmp = this.cards[location1];
           this.cards[location1] = this.cards[location2];
           this.cards[location2] = tmp;


           location1 = Math.floor((Math.random() * this.roleCards.length));
           location2 = Math.floor((Math.random() * this.roleCards.length));
           tmp = this.roleCards[location1];
           this.roleCards[location1] = this.roleCards[location2];
           this.roleCards[location2] = tmp;
        }
    }
}class Player {
    constructor(name, role) {
        this.playerName = name;
        this.playerCards = [];
        this.playerValue;
        this.playerRole = role;
        this.roleActive = true;
    }
}class Board {
    constructor() {
        this.cardsInMiddle = [];
        this.usedCards = [];
        this.players = [];
        this.rolesInMiddle =[];
    }
    start(playerNames) {
        let d = new Deck();
        d.createDeck();
        d.shuffleDeck();
        for (let i = 0; i < playerNames.length; i++) {
          let role = d.roleCards.splice(0,1)
          this.players.push(new Player(playerNames[i],role[0]));
          if(role[0]=="abenteurer"){
              this.players[i].playerCards = d.cards.splice(0, 5);
          }else{
            this.players[i].playerCards = d.cards.splice(0, 4);
          }
        }
        this.cardsInMiddle=d.cards;
        this.rolesInMiddle=d.roleCards;
    }
    load(playersDB, middleDB, usedDB) {
      this.players.length=0;
      for (let i = 0; i < playersDB.length; i++) {
          this.players.push(new Player(playersDB[i].playerName));
          var cardOne =  new Card(playersDB[i].playerCardOne,playersDB[i].playerName+"-Card-One");
          var cardTwo =  new Card(playersDB[i].playerCardTwo,playersDB[i].playerName+"-Card-Two");
          var cardThree =  new Card(playersDB[i].playerCardThree,playersDB[i].playerName+"-Card-Three");
          var cardFour =  new Card(playersDB[i].playerCardFour,playersDB[i].playerName+"-Card-Four");
          if(playersDB[i].playerCardFive != ""){
            var cardFive =  new Card(playersDB[i].playerCardFive,playersDB[i].playerName+"-Card-Five");
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour,cardFive];
          }else{
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour];
          }
          this.players[i].playerRole = playersDB[i].playerRole;
      }
      this.cardsInMiddle.length =0;
      for (let i = 0; i < middleDB.length; i++) {
         this.cardsInMiddle.push(new Card (middleDB[i].value,middleDB[i].idCard));
      }
      this.usedCards.length =0;
      for (let i = 0; i < usedDB.length; i++) {
         this.usedCards.push(new Card (usedDB[i].value,usedDB[i].idCard));
      }
      this.rolesInMiddle = ["gottheit","abenteurer", "haendler", "alter-mann", "wanderer", "kobold", "prediger", "buerokrat", "koenig", "bettler"];
      for(let i = 0; i < this.players.length; i++){
        if(this.rolesInMiddle.includes(this.players[i].playerRole)){
          var index = this.rolesInMiddle.indexOf(this.players[i].playerRole);
          if (index != -1) this.rolesInMiddle.splice(index, 1);
        }
      }
      let location1, location2, tmp;
      for (let i = 0; i < 3000; i++) {
      location1 = Math.floor((Math.random() * this.rolesInMiddle.length));
      location2 = Math.floor((Math.random() * this.rolesInMiddle.length));
      tmp = this.rolesInMiddle[location1];
      this.rolesInMiddle[location1] = this.rolesInMiddle[location2];
      this.rolesInMiddle[location2] = tmp;
      }
    }
    reuseCards(){
        this.cardsInMiddle = this.usedCards;
        this.usedCards = [];
        let location1, location2, tmp;
        for (let i = 0; i < 3000; i++) {
        location1 = Math.floor((Math.random() * this.cardsInMiddle.length));
        location2 = Math.floor((Math.random() * this.cardsInMiddle.length));
        tmp = this.cardsInMiddle[location1];
        this.cardsInMiddle[location1] = this.cardsInMiddle[location2];
        this.cardsInMiddle[location2] = tmp;
        }
    }
}

class GameStore {

    //Global Variables, that will be set in other Functions

    @observable gameBoard = new Board();

    @observable round = 0;
    @action.bound setRound(roundNumber){
      this.round = roundNumber;
    }

    @observable activePlayerIndex = 0;
    @action.bound setActive(active){
      this.activePlayerIndex=active;
    }

    @observable alert = "";
    @action.bound setAlert(alertText){
      this.alert = alertText;
    }

     @observable endingRound="";
     @action.bound setEndRound(round){
       this.endingRound = round;
     }

    @observable endPlayer="";
    @action.bound setEndPlayer(player){
      this.endPlayer = player;
    }

    @observable end = false;
    @action.bound setEnd(isEnd){
      this.end = isEnd;
    }

    @observable drawn=0;
    @action.bound setDrawn(drawNumber){
      this.drawn = drawNumber;
    }

    @observable actionDrawn=false;
    @action.bound setActionDrawn(action){
      this.actionDrawn = action;
    }

    @observable koboldEndIndex="";
    @action.bound setKoboldEnd(koboldIndex){
      this.koboldEndIndex=koboldIndex;
    }

    @observable koboldEndRound="";
    @action.bound setKoboldRound(koboldRound){
      this.koboldEndRound=koboldRound;
    }

    @observable koboldSelect={};
    @action.bound setKoboldSelect(select){
      this.koboldSelect = select;
    }

    @observable mitlaeuferChosen;
    @action.bound setMitlaeuferChosen(select){
      this.mitlaeuferChosen = select;
    }

    @observable mitlaeuferUsed = false;
    @action.bound setMitlaeuferUsed(used){
      this.mitlaeuferUsed = used;
    }

    @observable gottheitRound="";
    @action.bound setGottheitRound (round){
      this.gottheitRound = round;
    }

    @observable direction="left";
    @action.bound setDirection(dir){
      this.direction=dir;
    }

    @observable warningshow=false;
    @action.bound setWarningShow(warning){
      this.warningshow = warning;
    }

    @observable saveshow=false;
    @action.bound setSaveShow(save){
      this.saveshow = save;
    }

    @observable  modalClose= () => {this.closeModal};
    @action.bound setModalClose(close){
      this.modalClose = close;
    }

    @observable playerCardClick="";
    @action.bound setPlayerCardClick(click){
      this.playerCardClick = click;
    }

    @observable  playerClick=() => {};
    @action.bound setPlayerClick(click){
      this.playerClick = click;
    }

    @observable dismiss= "";
    @action.bound setDismiss(dis){
      this.dismiss=dis;
    }

    @observable predigershow=false;
    @action.bound setPredigerShow(show){
      this.predigershow = show;
    }

    @observable ruleshow= false;
    @action.bound setRuleShow(show){
      this.ruleshow = show;
    }

    @observable tutorialShow= false;
    @action.bound setTutorialShow(show){
      this.tutorialShow = show;
    }

      //new Game after Finish: Reset all Variables and create a new gameBoard with the current PlayerNames
      @action.bound newGame(){
        let playerNames =[];
        for (let i = 0; i < this.gameBoard.players.length; i++) {
          playerNames[i]= this.gameBoard.players[i].playerName;
        }
        this.gameBoard = new Board();
        this.gameBoard.start(playerNames);
        this.setEnd(false);
        this.setRound(0);
        this.setActive(0);
        this.setEndRound("");
        this.setEndPlayer("");
        this.setGottheitRound("");
      }

      //reuse Cards from the used stack, when the middle Stack is empty
      @action.bound mixCards(){
        this.setAlert("Oh nein! Das war die letzte Karte vom Kartenstapel. Die Karten vom Ablagestapel werden neu gemischt und kommen auf den Kartenstapel.")
        this.setModalClose(this.closeModal);
        this.setWarningShow(true);

        this.gameBoard.reuseCards();
      }


      //Role Scharlatan doesn't show his cards, so there's a Modal shown, before he can draw
      @action.bound covertDraw(){
        var warning = "Bitte Schau weg solange " + this.gameBoard.players[this.activePlayerIndex].playerName + " zieht";
        this.setAlert(warning);
        this.setWarningShow(true);
        this.setModalClose(() => {this.closeModal(); this.draw();})
      }

      //Draw the first Card of the Stack
      @action.bound draw(){
            CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
            this.setDrawn(this.drawn+1);
      }

      //draw a new Role for the card role-swap
      @action.bound drawRole(){
        if(this.gameBoard.players[this.activePlayerIndex].playerRole == "abenteurer" && CardStore.chosenCard == undefined){
          this.setAlert("Wähle eine Karte aus, die du ablegen möchtest, um diese Rolle abzulegen und setze die Karte erneut ein");
          this.setWarningShow(true);
          this.setModalClose(this.closeModal);
        }else{
          let newRole = this.gameBoard.rolesInMiddle.splice(0,1);
          if(this.gameBoard.players[this.activePlayerIndex].playerRole == "abenteurer"){
            for (let i = this.gameBoard.players[this.activePlayerIndex].playerCards.length -1; i >= 0; i--) {
              if(this.gameBoard.players[this.activePlayerIndex].playerCards[i] == CardStore.chosenCard){
                let thrownCard = this.gameBoard.players[this.activePlayerIndex].playerCards.splice(i,1);
                this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
              }
            }
          }
          this.gameBoard.players[this.activePlayerIndex].playerRole=newRole[0];
          if(CardStore.stackCard == this.gameBoard.cardsInMiddle[0]){
            this.throwCards();
          }
        }
      }

      //Throw a Card that the Player doesnt want on the used Cards Stack
      @action.bound throwCards(){
          let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
          this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
          CardStore.unselectCards();
      }

      //Throw a specific Card from the middle Stack to the used Stack (used for Double Cards)
      @action.bound throwCardbyObject(card){
        var cardIndex = 0;
        for (let i = 0; i < this.gameBoard.cardsInMiddle.length; i++) {
          if(this.gameBoard.cardsInMiddle[i]==card){
            cardIndex = i;
          }
        }
        let thrownCard = this.gameBoard.cardsInMiddle.splice(cardIndex,1);
        this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
      }

      //Swap a Card from the current player with the first Card from the Stack
      @action.bound swapStackCard(chosenCard){
          //if a Card has been chosen, swap the first Card in the Stack with the chosenCard
          if(chosenCard!=undefined){
              var chosenCardIndex;
                for(let i = 0; i < this.gameBoard.players[this.activePlayerIndex].playerCards.length; i++){
                  if(this.gameBoard.players[this.activePlayerIndex].playerCards[i]==chosenCard){
                    chosenCardIndex=i;
                  }
                }
              let playerCard = this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
              let stackCard = this.gameBoard.cardsInMiddle.splice(0,1);
              this.gameBoard.usedCards.splice(0,0,playerCard[0]);
              this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,0,stackCard[0]);
              if(isNaN(parseInt(this.gameBoard.usedCards[0].value))){
                CardStore.selectStackCard(this.gameBoard.usedCards[0]);
              }else{

                CardStore.unselectCards();
              }

          //if the chosenCard hasn't been defined yet, give out a warning
          }else{
            this.setAlert("Such dir eine deiner Karten aus, die getauscht werden soll");
            this.setWarningShow(true);
            this.setModalClose(this.closeModal);
          }
      }

      //Swap a Card from the current player with the first Card from the Used Stack
      @action.bound swapUsedCard(chosenCard){
          //if a Card has been chosen, swap the first Card in the Stack with the chosenCard

          if(chosenCard!=undefined){
            this.setDrawn(this.drawn +1);
              var chosenCardIndex;
                for(let i = 0; i < this.gameBoard.players[this.activePlayerIndex].playerCards.length; i++){
                  if(this.gameBoard.players[this.activePlayerIndex].playerCards[i]==chosenCard){
                    chosenCardIndex=i;
                  }
                }
              let playerCard = this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
              let stackCard = this.gameBoard.usedCards.splice(0,1);
              this.gameBoard.usedCards.splice(0,0,playerCard[0]);

              this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,0,stackCard[0]);
              if(isNaN(parseInt(this.gameBoard.usedCards[0].value))){
                CardStore.selectStackCard(this.gameBoard.usedCards[0]);
              }else{

                CardStore.unselectCards();
              }

          //if the chosenCard hasn't been defined yet, give out a warning
          }else{
            this.setAlert("Such dir eine deiner Karten aus, die getauscht werden soll");
            this.setWarningShow(true);
            this.setModalClose(this.closeModal);
          }
      }

      //Swap a Card from the active Player with a Card from another player
      @action.bound swapPlayerCard(chosen,enemy){
        this.setActionDrawn(true);
        let chosenCard = CardStore.chosenCard;
        let enemyCard = CardStore.enemyCard;
        //if chosenCard and enemyCard are both defined
        if(chosenCard!=undefined&&enemyCard!=undefined){

          //getCardIndex of ChosenCard
          var chosenCardIndex;
            for(let i = 0; i < this.gameBoard.players[this.activePlayerIndex].playerCards.length; i++){
              if(this.gameBoard.players[this.activePlayerIndex].playerCards[i]==chosenCard){
                chosenCardIndex=i;
              }
            }

          //getCardIndex and PlayerIndex of enemyCard
          var enemyCardIndex;
          var enemyPlayerIndex;
          for(let j=0; j < this.gameBoard.players.length; j++){
            for(let i = 0; i < this.gameBoard.players[j].playerCards.length; i++){
              if(this.gameBoard.players[j].playerCards[i]==enemyCard){
                enemyCardIndex=i;
                enemyPlayerIndex=j;
              }
            }
          }
          //Delete chosenCard and enemyCard out of their normal places and store them in an array
          let playerCard = this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
          let otherCard = this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,1);

          //Insert chosenCard at place of enemyCard and Insert enemyCard inplace of chosenCard
          this.gameBoard.players[this.activePlayerIndex].playerCards.splice(chosenCardIndex,0,otherCard[0]);
          this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,0,playerCard[0]);


          // put the StackCard on the UsedCard Staple and EndTUrn
          if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
            let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
            this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
          }
          //this.endTurn();

          CardStore.unselectCards();

        //if one Card isn't chosen yet give out a warning
      }else{
          if(chosenCard==undefined && enemyCard==undefined){
              this.setAlert("Such dir eine deiner Karten und eine Karte eines Gegners aus, um zu tauschen!");
              this.setWarningShow(true);
              this.setModalClose(this.closeModal);
          }
          if(chosenCard==undefined && enemyCard!=undefined){

                this.setAlert("Such dir eine deiner Karten aus, um zu tauschen!");
                this.setWarningShow(true);
                this.setModalClose(this.closeModal);
          }
          if (enemyCard==undefined && chosenCard!=undefined){
                this.setAlert("Such dir eine Karte von einem deiner Gegner aus, um zu tauschen!");
                this.setWarningShow(true);
                this.setModalClose(this.closeModal);
          }
        }
      }


      //Skip over the next player and go direclty to the player after that
      @action.bound skipNext(){
        this.setActionDrawn(true);
        // put the StackCard on the UsedCard Staple
        if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
          let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
          this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
        }
        //if theres 2 more players in the array it's their turn, so we unselect all Cards and count up the activePlayerIndex by Two
          if(this.activePlayerIndex+2<this.gameBoard.players.length){
            this.setActive(this.activePlayerIndex+2);
            this.setDrawn(0);
            this.setActionDrawn(false);
            CardStore.unselectCards();
          }else{
        //if theres no next player in the array a new Round begins and we start with the first player again
            this.endRound(this.activePlayerIndex+2-this.gameBoard.players.length);
            this.setDrawn(0);
            this.setActionDrawn(false);
          }


      }

      //Draw two Cards and choose one of them
      @action.bound drawDouble(){
          this.setActionDrawn(true);
        if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
          let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
          this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
        }
          CardStore.unselectCards();
          CardStore.selectDoubleCards(this.gameBoard.cardsInMiddle[0],this.gameBoard.cardsInMiddle[1]);
      }

      //Modal for cards to be shown
      @action.bound showCardModal(card, secondCard){
          // warning for others to look away
          this.setActionDrawn(true);
          var warning = "Bitte Schau weg solange " + this.gameBoard.players[this.activePlayerIndex].playerName + " Karten anschaut";
          this.setAlert(warning);
          this.setWarningShow(true);
        // if two cards need to be showm, call the ShowFirst function that shows the outer cards
        if(card!=undefined && secondCard.value !=undefined){
          this.setModalClose(() => {this.closeModal(); this.showFirst(card,secondCard);})

        // if one card needs to be shown, call show(card) function
        }else if(card!=undefined && secondCard.value==undefined){
          this.setModalClose(() => {this.closeModal(); this.show(card);})

        //if no card is chosen give out a warning
        }else{
          this.setAlert("Such dir ein Karte aus, die angezeigt werden soll");
          this.setWarningShow(true);
          this.setModalClose(this.closeModal);
        }
      }

      //Show one of the activePlayers Cards
      @action.bound show(card){
          this.setActionDrawn(true);
        if(card!=undefined){
            //if the Card to Show is defined, show the Card Value for 3 seconds
            CardStore.selectShowCard(card);
            setTimeout(() => {CardStore.unselectCards();}, 3000);
            if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
              let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
              this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
            }
            this.setModalClose(this.closeModal);
          }
      }

      //Show the outer Cards of the players at the beginning of the Game
      @action.bound showFirst(leftCard,rightCard){
          CardStore.selectShowCard(leftCard)
          setTimeout(() => {CardStore.selectShowCard(rightCard)}, 3000);
          setTimeout(() => {this.endTurn()}, 6000);

      }

      //After the activePlayer has performed an action his Turn is over
      @action.bound endTurn(){
        //reset variables
        this.setActionDrawn(false);
        this.setPlayerCardClick("");
        this.setPlayerClick(()=>{});
        this.setDrawn(0);

        //check for Role Events that end after exactly one turn
        if(this.koboldEndRound!=""){
          this.checkKoboldEnd();
        }
          if(this.gottheitRound!=""){
            this.checkGottheit();
          }
        //if the EndGame has been defined, we check if the Game is over yet
          if(this.endingRound!=""){
            this.checkEndGame();
          }
          switch (this.direction){
            case "left":
            //if theres a next player in the array it's his turn, so we unselect all Cards and count up the activePlayerIndex
              if(this.activePlayerIndex+1<this.gameBoard.players.length){
                this.setActive(this.activePlayerIndex+1);
                CardStore.unselectCards();
              }else{
            //if theres no next player in the array a new Round begins and we start with the first player again
                this.endRound(0);
              }
              break;
            case "right":this.closeModal
            //if theres a before player in the array it's his turn, so we unselect all Cards and count down the activePlayerIndex
              if(this.activePlayerIndex-1>=0){
                this.setActive(this.activePlayerIndex-1);
                CardStore.unselectCards();
              }else{
            //if theres no before  player in the array a new Round begins and we start with the last player again
                this.endRound(this.gameBoard.players.length-1);
              }
              break;
          }
      }

      //if all Players had their turn a new round beings
      @action.bound endRound(nextPlayer){
          this.setRound(this.round+1);
          this.setActive(nextPlayer);
          CardStore.unselectCards();
      }

      //if a player presses the EndGame Button, the point in time when the Game will end (one Round after the player pressed) is defined
      @action.bound setEndGame(){
        switch(this.direction){
          case "left":
            if(this.endingRound=="" && this.endPlayer==""){
              //the endPlayer is one before the activePlayer who pressed the button, so the players who ended doesnt get another turn
              if(this.activePlayerIndex-1>=0){
                this.setEndPlayer(this.activePlayerIndex-1);
                this.setEndRound(this.round+1);
              }else{

                  this.setEndPlayer(this.gameBoard.players.length-1);
                  this.setEndRound(this.round);
              }
            }
            break;
          case "right":
            if(this.endingRound=="" && this.endPlayer==""){
                //the endPlayer is one after the activePlayer who pressed the button, so the players who ended doesnt get another turn
              if(this.activePlayerIndex+1<this.gameBoard.players.length){
                this.setEndPlayer(this.activePlayerIndex+1);
                this.setEndRound(this.round+1);
              }else{

                  this.setEndPlayer(0);
                  this.setEndRound(this.round);
              }
            }
            break;
        }

        if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
          let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
          this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
        }
      }


      //if the defined point when the game ends has come, the results are posted
      @action.bound checkEndGame(){
        let endingTrue = false;
        switch(this.direction){
          case "left":
            if(this.round >= this.endingRound && this.activePlayerIndex >= this.endPlayer){
              endingTrue = true;
            }
            break;
          case "right":
            if(this.round >= this.endingRound && this.activePlayerIndex <= this.endPlayer){
              endingTrue = true;
            }
            break;
        }
        //if end is true, add up values of the players
        if(endingTrue){
          for(let i=0; i<this.gameBoard.players.length; i++){
              this.gameBoard.players[i].playerValue=0;
                for (let j = 0; j < this.gameBoard.players[i].playerCards.length; j++) {
                  if(!isNaN(parseInt(this.gameBoard.players[i].playerCards[j].value))){
                      var integer = parseInt(this.gameBoard.players[i].playerCards[j].value, 10);
                      this.gameBoard.players[i].playerValue += integer;
                  }else{
                    this.gameBoard.players[i].playerValue += 10;
                  }
                }
          }
          var endPlayers=[...this.gameBoard.players];
          endPlayers.sort((a, b) => a.playerValue - b.playerValue);

          //if the player with the Role "Bettler" has the most points (end of list after sorting), his points get cut in half and the others' get doubled
          if(endPlayers[this.gameBoard.players.length-1].playerRole == "bettler"){
            for(let s = 0; s < endPlayers.length; s++){
              if(endPlayers[s].playerRole == "bettler"){
                endPlayers[s].playerValue *= 0.5;
              }else{
                endPlayers[s].playerValue *= 2;
              }
            }
            this.deactivateRole("bettler");
            endPlayers.sort((a, b) => a.playerValue - b.playerValue);
          }

          //two Counters, so we know where in the list we actually are, but the places are accurately displayed if several people have the same points
          let realCounter = 0;
          let showCounter;
          let lastValue = -1;
           const endList = endPlayers.map((player, key) =>{
             realCounter++;
             if(player.playerValue != lastValue ){
               showCounter = realCounter;
             }
             lastValue = player.playerValue;
               return(<div key={player.playerName}>#{showCounter}: {player.playerName} mit {player.playerValue} Punkten </div>);
           });
          this.setAlert(endList);
          this.setWarningShow(true);
          this.setEnd(true);
          this.setModalClose(this.closeModal);
        }
      }

      //Save all Date (not optimized)
      @action.bound save(){
          CardStore.deleteAll();
          for(let i = 0; i < this.gameBoard.players.length; i++){
            if(this.activePlayerIndex==i){
              if(this.gameBoard.players[i].playerRole=="abenteurer"){
                  CardStore.addNewAbenteurer(this.gameBoard.players[i],true);
              }else{
                  CardStore.addNewPlayer(this.gameBoard.players[i],true);
              }
            }else{

              if(this.gameBoard.players[i].playerRole=="abenteurer"){
                  CardStore.addNewAbenteurer(this.gameBoard.players[i],false);
              }else{
                  CardStore.addNewPlayer(this.gameBoard.players[i],false);
              }
            }
          }
          //CardStore.addPlayers(this.gameBoard.players[0]);
          for(let i = 0; i < this.gameBoard.cardsInMiddle.length; i++){
              CardStore.addMiddleCard(this.gameBoard.cardsInMiddle[i]);
          }
          for(let i = 0; i < this.gameBoard.usedCards.length; i++){
              CardStore.addUsedCard(this.gameBoard.usedCards[i]);
          }
          CardStore.addRound(this.round);
          CardStore.fetchSavings();
          this.setSaveShow(true);

      }

      //Close AlertModal
      @action.bound closeModal(){
        this.setWarningShow(false);
        this.setDismiss("");
      }




      ///roles
      @action.bound useRole(role){

          switch(role){
            case "abenteurer":
              this.deactivateRole(role);
              break;
            case "alter-mann":
            if(this.drawn==0){
                this.alterMann();
            }else{
              this.setAlert("Deine Rolle kann nur genutzt werden, wenn du noch nicht gezogen hast!");
              this.setWarningShow(true);
              this.setModalClose(this.closeModal);
            }
              break;
            case "buerokrat":
              if(this.drawn==1){
                  this.buerokrat();
              }else{
                  this.setAlert("Du kannst diese Rolle erst nach deinem Zug einsetzen.");
                  this.setWarningShow(true);
                  this.setModalClose(this.closeModal);
              }
              break;
            case "gottheit":
              this.gottheit();
              break;
            case "haendler":
              if(this.drawn==1){
                this.haendler();
              }else{
                  this.setAlert("Du kannst diese Rolle erst nach deinem Zug einsetzen.");
                  this.setWarningShow(true);
                  this.setModalClose(this.closeModal);
              }
              break;
            case "kobold":
              if(this.drawn==1){
                this.kobold();
              }else{
                  this.setAlert("Du kannst diese Rolle erst nach deinem Zug einsetzen.");
                  this.setWarningShow(true);
                  this.setModalClose(this.closeModal);
              }
              break;
            case "koenig":
              if(this.drawn==1){
                this.koenig();
              }else{
                  this.setAlert("Du kannst diese Rolle erst nach deinem Zug einsetzen.");
                  this.setWarningShow(true);
                  this.setModalClose(this.closeModal);
              }
              break;
            case "prediger":
            if(CardStore.stackCard == undefined){
              this.prediger();
            }else{
                this.setAlert("Beende zuerst deinen Zug, bevor du diese Rolle einsetzt");
                this.setWarningShow(true);
                this.setModalClose(this.closeModal);
            }
              break;
            case "wanderer":
              if(this.drawn==1){
                this.wanderer();
              }else{
                  this.setAlert("Du kannst diese Rolle erst nach deinem Zug einsetzen.");
                  this.setWarningShow(true);
                  this.setModalClose(this.closeModal);
              }
              break;

            case "bettler":
            this.setAlert("Diese Rolle wird immer automatisch bei der Wertung eingesetzt. Möchtest du diese Rolle jetzt ablegen?");
            this.setWarningShow(true);
            this.setModalClose(()=>{this.closeModal(); this.deactivateRole(role);});
            this.setDismiss(this.closeModal);
              break;

            case "scharlatan":
            this.setAlert("Möchtest du diese Rolle jetzt ablegen?");
            this.setWarningShow(true);
            this.setModalClose(()=>{this.closeModal(); this.deactivateRole(role);});
            this.setDismiss(this.closeModal);
              break;

            case "mitlaeufer":
            if(this.drawn<=0){
              this.setDrawn(this.drawn+1);
              this.setAlert("Such dir einen Spieler aus, dessen Rolle du verwenden möchtest");
              this.setWarningShow(true);
              this.setModalClose(()=>{this.closeModal();});
              this.setPlayerClick(this.setMitlaeuferChosen);
            }else{
                this.setAlert("Du kannst diese Rolle nur statt deinem normalen Zug einsetzen");
                this.setWarningShow(true);
                this.setModalClose(()=>{this.closeModal();});
            }
              break;

            default:
                this.setAlert("Du hast im Moment keine Rolle");
                this.setWarningShow(true);
                this.setModalClose(this.closeModal);
              break;
          }
      }

        //DEACTIVATE ROLE // ABENTEURER

          @action.bound deactivateRole(playerRole){
            if(!this.mitlaeuferUsed){
              for (let i = 0; i < this.gameBoard.players.length; i++) {
                if(this.gameBoard.players[i].playerRole == playerRole){
                  if(playerRole == "abenteurer"){
                    if(CardStore.chosenCard!=undefined){
                        var chosenCardIndex;
                          for(let j = 0; j < this.gameBoard.players[i].playerCards.length; j++){
                            if(this.gameBoard.players[i].playerCards[j]==CardStore.chosenCard){
                              chosenCardIndex=j;
                            }
                          }
                        let playerCard = this.gameBoard.players[i].playerCards.splice(chosenCardIndex,1);
                        this.gameBoard.usedCards.splice(0,0,playerCard[0]);
                            this.gameBoard.players[i].playerRole = " ";
                    }else{
                      this.setAlert("Such dir eine deiner Karten aus, die abgelegt werden soll, um die Rolle abzulegen.");
                      this.setWarningShow(true);
                      this.setModalClose(this.closeModal);

                    }
                  }else{
                      this.gameBoard.players[i].playerRole = " ";
                  }
                  CardStore.unselectExceptPredigerCards();
                }
              }
            }
          }


          //HAENDLER

          @action.bound haendler(){
            for (let i = 0; i < this.gameBoard.players.length; i++) {
              if(this.gameBoard.players[i].playerRole == "haendler"){

                  var c=0;
                  for(let j = this.gameBoard.players[i].playerCards.length-1; j >= 0 ; j--){

                     setTimeout(() => {
                     let playerCard = this.gameBoard.players[i].playerCards.splice(j,1);
                     this.gameBoard.usedCards.splice(0,0,playerCard[0]);
                     CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
                   }, 500+c*2000);

                    setTimeout(() => {


                    let stackCard = this.gameBoard.cardsInMiddle.splice(0,1);
                    this.gameBoard.players[i].playerCards.splice(0,0,stackCard[0]);
                    CardStore.selectShowCard(this.gameBoard.players[i].playerCards[0]);
                  }, (c+1)*2000);

                  CardStore.unselectCards();
                    c++;
                  }
                  setTimeout(()=>{
                  CardStore.unselectCards();
                  this.deactivateRole("haendler")},
                  (c+1)*2000);

              }
            }
          }

          //ALTER MANN

          @action.bound alterMann(){
            this.deactivateRole("alter-mann");
            this.setDrawn(this.drawn+1)
            CardStore.selectCircleUsedCard(this.gameBoard.usedCards[0]);
            CardStore.selectStackCard(this.gameBoard.usedCards[0]);
          }

          @action.bound circleBack(){
            let thrownCard = this.gameBoard.usedCards.splice(0,1);
            this.gameBoard.usedCards.splice(this.gameBoard.usedCards.length,0,thrownCard[0]);
            CardStore.unselectCards();
            this.alterMann();
          }

          //WANDERER

          @action.bound wanderer(){
            CardStore.unselectCards();
            this.setAlert("Sucht alle eine Karte aus, die nach links weitergegeben werden soll.");
            this.setWarningShow(true);
            this.setPlayerCardClick(CardStore.selectWanderCard);
            this.setModalClose(this.closeModal);
          }

          @action.bound cardsToLeft(){
            let indices = {};
            for (let i = 0; i < this.gameBoard.players.length; i++) {
              for (let j = 0; j < this.gameBoard.players[i].playerCards.length; j++) {
                if(Object.values(CardStore.wanderCards).includes(this.gameBoard.players[i].playerCards[j])){
                  indices[i]=j;
                }
              }
            }

            let tmp = this.gameBoard.players[0].playerCards.splice(indices[0],1);
            let target;
            for (let s = 1; s < this.gameBoard.players.length; s++) {
              target = this.gameBoard.players[s].playerCards.splice(indices[s],1);
              this.gameBoard.players[s].playerCards.splice(indices[s],0,tmp[0]);
              tmp = target;
            }
            this.gameBoard.players[0].playerCards.splice(indices[0],0,tmp[0]);

            this.setPlayerCardClick("");
            this.deactivateRole("wanderer");
          }


          //KOBOLD

          @action.bound kobold(){
            this.setPlayerClick((player) => {this.setKoboldSelect(player)});
            this.setAlert("Such dein Opfer aus");
            this.setWarningShow(true);
            this.setModalClose(this.closeModal);
          }

          @action.bound setKoboldVictim(player){
            CardStore.selectKoboldVictim(player);
            let playerIndex;
            for (let i = 0; i < this.gameBoard.players.length; i++) {
              if(this.gameBoard.players[i].playerRole == "kobold"){
                playerIndex = i-1;
                if(playerIndex < 0){
                  playerIndex= this.gameBoard.players.length-1;
                }
              }
            }
            this.setKoboldEnd(playerIndex);
            this.setKoboldRound(this.round+1);
            this.setKoboldSelect({});
            this.setPlayerClick("");
            this.deactivateRole("kobold");
          }

          @action.bound checkKoboldEnd(){
            if(this.round>=this.koboldEndRound && this.activePlayerIndex >= this.koboldEndIndex){
              CardStore.unselectKoboldVictim();
            }
          }

          //GOTTTHEIT

          @action.bound gottheit(){
            this.setAlert("Beim nächsten Zug der Gottheit werden alle Karten nach rechts weitergegeben.");
            this.setWarningShow(true);
            this.setModalClose(this.closeModal);
            switch(this.direction){
              case "left":
                if(this.activePlayerIndex-1 >= 0 ){
                  this.setGottheitRound(this.round+1);
                }else{
                  this.setGottheitRound(this.round);
                }
                break;
              case "right":
                if(this.activePlayerIndex+1 < this.gameBoard.players.length ){
                  this.setGottheitRound(this.round+1);
                }else{
                  this.setGottheitRound(this.round);
                }
                break;
              default:
                this.setGottheitRound(this.round+1);
                break;
            }
          }

          @action.bound checkGottheit(){
            let nextPlayer;
            switch (this.direction){
              case "left":
                if(this.activePlayerIndex+1 < this.gameBoard.players.length){
                  nextPlayer = this.gameBoard.players[this.activePlayerIndex+1];
                }else{
                  nextPlayer = this.gameBoard.players[0];
                }
                break;
              case "right":
                if(this.activePlayerIndex-1 >= 0){
                  nextPlayer = this.gameBoard.players[this.activePlayerIndex-1];
                }else{
                  nextPlayer = this.gameBoard.players[this.gameBoard.players.length-1];
                }
                break;
            }
            if(this.round == this.gottheitRound && nextPlayer.playerRole == "gottheit"){
              this.setAlert("Die ersten vier Karten von links werden nach rechts weitergegeben");
              this.setWarningShow(true);
              this.setModalClose(this.closeModal);
              this.setGottheitRound("");

              let first = [...this.gameBoard.players[0].playerCards];

              for (let i = 0; i < this.gameBoard.players.length; i++) {
                if(this.gameBoard.players[i+1]!=undefined){
                  for (let j = 0; j < 4; j++) {
                    this.gameBoard.players[i].playerCards[j]=this.gameBoard.players[i+1].playerCards[j];
                  }
                }else{
                  for (let j = 0; j < 4; j++) {
                  this.gameBoard.players[i].playerCards[j]=first[j];
                  }
                }
              }
              this.deactivateRole("gottheit");
            }
          }

          //BÜROKRAT

          @action.bound buerokrat(){
            if(this.round > 3 && !this.actionDrawn){
              this.setEndRound(this.round);
              this.setEndPlayer(this.activePlayerIndex);
              this.setAlert("Die Runde wird nach deinem Zug beendet");
              this.setWarningShow(true);
              this.setModalClose(this.closeModal);
            }else{

              this.setAlert("Du darfst die Runde erst nach Runde 3 beenden und keine Aktionskarte einsetzen");
              this.setWarningShow(true);
              this.setModalClose(this.closeModal);
            }
          }

          //KÖNIG

          @action.bound koenig(){
            this.setDrawn(0);
            this.setDirection("right");
            this.deactivateRole("koenig");
          }

          //PREDIGER

          @action.bound prediger(){
            this.setAlert("Such dir nun einen Gegner und zwei seiner Karten aus, die du richtig benennen kannst");
            this.setWarningShow(true);
            this.setModalClose(this.closeModal);
            this.setPlayerCardClick(CardStore.predigerCardSelect);
            this.setPlayerClick(CardStore.predigerSelect);
            CardStore.unselectCards;
          }

          @action.bound predigerCheck(rightAnswer,userAnswer){
            let same = true;
            for (let i = 0; i < rightAnswer.length; i++) {
              if(rightAnswer[i]!=userAnswer[i]){
                same=false;
              }
            }
            if(same){
              this.setAlert("Dein Tipp war richtig! Du darfst nun eine der beiden Karten mit deinen eigenen tauschen");
            }else{+
                this.setAlert("Dein Tipp war falsch. Lass deinen Gegner auswählen welche Karten getauscht werden");
            }

              this.setPredigerShow(false);

              this.setWarningShow(true);
              this.setPlayerClick("");
              this.setPlayerCardClick("");

              this.deactivateRole("prediger");

                let stackCard = new Card("swap","util");
                CardStore.selectStackCard(stackCard);
          }


}
const store = new GameStore();

export default store;
