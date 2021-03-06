import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

import PlayerCards from "../components/PlayerCards"
import StackCards from "../components/StackCards"
import CardStore from "../stores/cardStore"
import GameStore from "../stores/gameStore"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


@observer
export default class SaveModal extends React.Component {

  constructor(props){
    super(props);
    CardStore.fetchSavings();
  }
    render() {
     var {playersFromServer} = CardStore;
     var playerArray;
     if(playersFromServer!=undefined){
       playerArray = [...playersFromServer];
     }

     var {middleFromServer} = CardStore;
     var middleArray;
     if(middleFromServer!=undefined){
       middleArray = [...middleFromServer];
     }

     var {usedFromServer} = CardStore;
     var usedArray;
     if(usedFromServer!=undefined){
       usedArray = [...usedFromServer];
     }

     var {round} = CardStore;
     var roundFromServer;
     if(round!=undefined){
       roundFromServer=round.value;
     }

     var alert = [];
     if(GameStore.gameBoard.players.length==playerArray.length && GameStore.gameBoard.cardsInMiddle.length==middleArray.length && GameStore.gameBoard.usedCards.length==usedArray.length && GameStore.round==roundFromServer){
       alert.push(<h2 key="Player-Heading"> Saved Players </h2>);
       const savedPlayers = playerArray.map((player, key) =>{
           return(<div key={player.idPlayer}><p>{player.playerName}</p></div>);
       });
       alert.push(savedPlayers);
       alert.push(<h2 key="MiddleCards"> Cards in Middle: {middleArray.length}</h2>);
       alert.push(<h2 key="UsedCards"> Used Cards: {usedArray.length}</h2>);
       alert.push(<h2 key="Round"> Round: {roundFromServer}</h2>);
     }else{
       alert.push("loading...")
     }
        return (
            <Modal show={GameStore.saveshow} onHide={GameStore.setSaveShow.bind(false)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>{alert}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" href="/">
                    Quit
                  </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
