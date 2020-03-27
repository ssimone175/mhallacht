import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import PlayerCards from "../components/PlayerCards"
import CardStore from "../stores/cardStore"
// import MobxInteraction from "../pages/MobxInteraction"



// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');

class Card {
    constructor(value,id) {
        this.value = value;
        this.id= id;
    }
}class Deck {
    constructor() {
        this.cards = [];
    }
    createDeck() {
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
        let id =0;
        for (let j = 0; j < values.length; j++) {
          for (let i=0; i < 4; i++){
              this.cards.push(new Card(values[j],id));
              id++;
          }
        }
    }
    shuffleDeck() {
       let location1, location2, tmp;
       for (let i = 0; i < 1000; i++) {
           location1 = Math.floor((Math.random() * this.cards.length));
           location2 = Math.floor((Math.random() * this.cards.length));
           tmp = this.cards[location1];
           this.cards[location1] = this.cards[location2];
           this.cards[location2] = tmp;
        }
    }
}class Player {
    constructor(name) {
        this.playerName = name;
        this.playerCards = [];
    }
}class Board {
    constructor() {
        this.cardsInMiddle = [];
        this.usedCards = [];
        this.players = [];
    }
    start(playerNames) {
        let d = new Deck();
        d.createDeck();
        d.shuffleDeck();
        for (var i = 0; i < playerNames.length; i++) {
          this.players.push(new Player(playerNames[i]));
          this.players[i].playerCards = d.cards.splice(i*4, 4);
        }
        this.cardsInMiddle=d.cards;
    }
}
// function chooseCard(player,playerCard){
//   for(let i = 0; i < this.gameBoard.players[player].playerCards.length; i++){
//     if(this.gameBoard.players[player].playerCards[i]==playerCard){
//       console.log(i);
//       this.setState({chosenCardIndex:i});
//     }
//   }
// }
function swapCards(playerIndex,playerCardIndex){
  console.log(playerCardIndex);
  let playerCard = this.gameBoard.players[playerIndex].playerCards.splice(playerCardIndex,1);
  let stackCard = this.gameBoard.cardsInMiddle.splice(0,1);
  this.gameBoard.usedCards.splice(0,0,playerCard[0]);
  this.gameBoard.players[playerIndex].playerCards.splice(playerCardIndex,0,stackCard[0]);
  this.setState({chosenCardIndex:undefined});
}
function throwCards(){
  let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
  this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
  this.setState({rerender:true});

}
function chooseCard(e,playerCard){
  for(let j=0; j < this.gameBoard.players.length; j++){
    for(let i = 0; i < this.gameBoard.players[j].playerCards.length; i++){
      if(this.gameBoard.players[j].playerCards[i]==playerCard){
        console.log(playerCard);
        this.setState({chosenCardIndex:i});
        this.setState({chosenCardPlayerIndex:j})
      }
    }
  }
}

// durch die Annotation @observer
@observer
export default class Game extends React.Component {
  constructor(props){
    super(props);
        this.gameBoard = new Board();
        this.gameBoard.start(props.players);
        this.state = {
          rerender:false,
          chosenCardIndex:undefined,
          chosenCardPlayerIndex:undefined,
        }
  }
    render() {
     console.log(this.gameBoard);
      const items = this.gameBoard.players.map((item, key) =>
         <div key={item.playerName}>
          <h2>{item.playerName}</h2>
          <PlayerCards item={item.playerCards}/>
         </div>
       );
      //Make SwapButton invisible if no Card is chosen
      let swapButton;
      if(this.state.chosenCardIndex!=undefined){
        swapButton =<Button onClick={swapCards.bind(this,this.state.chosenCardPlayerIndex,this.state.chosenCardIndex)}>Swap</Button>;
      }
      const chosenCard = CardStore.chosenCard;
      console.log(chosenCard);
      let chooseButton;
      if(chosenCard){
        chooseButton =<Button onClick={chooseCard.bind(this,0,this.gameBoard.players[0].playerCards[3])}>Choose Card</Button>;
      }
        return (
            <div>
              {items}
              <h2>Kartenstapel</h2>
              <PlayerCards item={this.gameBoard.cardsInMiddle}/>
              <br/><br/>
              <h2>Ablegestapel</h2>
              <PlayerCards item={this.gameBoard.usedCards}/>
              <br/><br/>
              {chooseButton}
              {swapButton}
              <Button onClick={throwCards.bind(this)}>Throw</Button>
            </div>
        );
    }
}
