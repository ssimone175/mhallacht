import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"


class PlayerCards extends React.Component{
    render() {
      //Get ChosenCard from CardStore
      let {chosenCard} = CardStore;
      let {enemyCard} = CardStore;
      let {showCard} = CardStore;
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {

        var cardClass = "bg-warning";
        if(card ==chosenCard){
          cardClass = "bg-primary";
        }
        if(card ==enemyCard){
          cardClass = "bg-danger";
        }
        if(card != showCard){
          cardClass+=" card-down";
        }
        var cardClick;
        if(this.props.cardClick!=undefined){
          cardClick=this.props.cardClick.bind(this,card);
        }

        return (
          <Card key={card.id} className={cardClass} onClick={cardClick}>
            <Card.Body><Card.Title>{card.value}</Card.Title></Card.Body>
          </Card>);
        });

        return (
          <div class={this.props.deckClass}>
            <h2 class="deckHeading">{this.props.heading}</h2>
            <div class="deck playerCards">{cards}</div>
          </div>
        );
    }
}
export default PlayerCards;
