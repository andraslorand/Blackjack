const Deck = require("./modules/deck");
//tis is where we create a simple http server
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
//const state={}
//const clientRooms = {};
const deck = new Deck();

let playerDeck,
playerDeck2,
  dealerDeck,
  i = 4,
  ace = false,
  joinedmembers=0,
  player1id,
  player2id,
  player1count=0,
  player2count=0
  playerTeszt = "keepon";
let playerDeckCount = 0,
playerDeckCount2=0,
  dealerDeckCount = 0;

app.use(express.static(__dirname + "/../client")); //we direct the whole thing into the client server
//there will appear and work the server

console.log("Server is listening on http://localhost:3000/app.html"); //localhost:3000 wasn't good, we need to specifie the file that worked

const users = {}; //to hold the users
const typers = {}; //to hold the typers

io.on("connection", (socket) => {
  console.log("connected...");

  //io.to("some room").emit("some event",korte)
  function korte(){
    console.log("korte")
  }

  //socket.on("start new game", handleNewGame)
  //socket.on("joingame",handlejoingame)
  socket.on("user connected", (payload) => {
    //this is the response for the event in the app.js
    users[socket.id] = {
      id: socket.id, //data from the app.js about the user and socket
      name: payload.name,
      avatar: payload.avatar,
      chips: payload.chips,
      playerDeck: payload.playerDeck,
    };

    socket.broadcast.emit("user connected", users[socket.id]); //broadcast back to the client (the broadcast wont send back to you yous data)
  });

  //! main change take one
  //socket.on("start game", startGame);
  //io.socket.in("some room").on("start game",startGame)
  function startGame() {
    playerDeckCount = 0;
    dealerDeckCount = 0;
    deck.suffle();
    playerDeck = new Deck(deck.cards.slice(0, 2));
    //users[socket.id].playerDeck = playerDeck;
    dealerDeck = new Deck(deck.cards.slice(4, 6));
    playerDeckCount = counting(deck.cards[0].value, playerDeckCount);
    playerDeckCount = counting(deck.cards[1].value, playerDeckCount);
    playerDeck2 = new Deck(deck.cards.slice(2, 4));
    playerDeckCount2 = counting(deck.cards[2].value, playerDeckCount2);
    playerDeckCount2 = counting(deck.cards[3].value, playerDeckCount2);

    if(playerDeckCount===21){
      socket.emit("win/lose","win")
      ace = false;
    }

    dealerDeckCount = counting(deck.cards[4].value, dealerDeckCount);
    dealerDeckCount = counting(deck.cards[5].value, dealerDeckCount);
    socket.emit("starting deck", {
      card1s: deck.cards[0].suit,
      card1v: deck.cards[0].value,
      card2s: deck.cards[1].suit,
      card2v: deck.cards[1].value,
      card3s: deck.cards[2].suit,
      card3v: deck.cards[2].value,
      card4s: deck.cards[3].suit,
      card4v: deck.cards[3].value,
      card5s: deck.cards[4].suit,
      card5v: deck.cards[4].value,
      
    });
    console.log("player1:", playerDeckCount);
    console.log("dealer", dealerDeckCount);
    

    console.log("playerdack",playerDeck);
    console.log("dealerdeck",dealerDeck);
    console.log("playerdack2",playerDeck2)
    if (playerDeckCount == 21) {
      console.log("you win");
      startGame;
    }
  }

  socket.on("hit me", function(data){
    console.log("data from the hitme", data)
    hitMe(data)
    //io.to("some room").emit("some event",korte)
  });

  socket.on("joinroom",function (data){
    console.log("valami fontos data", data)
    joinroom(data)
  })
  socket.on("try",canjoin)
  socket.on("disc",disconnectroom)

  function canjoin(){
    socket.emit("count",joinedmembers)
  }

  function joinroom(data){
    joinedmembers++
    if(joinedmembers!=2)
    {socket.join("some room")
    player1id=data
    console.log("playerid1=", player1id)}
   
   else if(joinedmembers==2)
    {player2id=data
      console.log("playerid2=", player2id)
      socket.broadcast.to("some room").emit("start game",startGame)}
  }
  function disconnectroom(){
    socket.leave("some room")
    joinedmembers--
  }

  console.log("a szorny szuletese", deck.cards[i].suit);

  function hitMe(id) {
    console.log("pl1id===",player1id)
    console.log("pl2id====",player2id)
    socket.emit("get card", {
      suit: deck.cards[i].suit,
      value: deck.cards[i].value,
    });
    if(id===player1id){
      playerDeck.push(deck.cards[i]);
      playerDeckCount = counting(deck.cards[i].value, playerDeckCount);
      testing(playerDeckCount);
    }
    else{
      playerDeck2.push(deck.cards[i])
      playerDeckCount2 = counting(deck.cards[i].value, playerDeckCount2);
      testing(playerDeckCount2);
    }
   
    console.log("a number amit convertelin alkarok", deck.cards[i].value);

    console.log(playerDeck);

    //!change this becouse this is a shit like this

    

    console.log(playerDeckCount);
   
    console.log(playerTeszt);
    i++;
    
  }

  function getCard() {
    console.log("lets try again", deck.cards[i].suit);
  }

  function testing(playerc) {
    if (playerc < 21) playerTeszt = "keepon";
    if (playerc > 21) {
      playerTeszt = "loser";
      socket.emit("win/lose","lose")
      ace = false;
      startGame();
      
    }
    if (playerc === 21) {
      playerTeszt = "winner";
      socket.emit("win/lose","win")
      ace = false;
      startGame();
    }
  }

  function counting(card, pl) {
    let addChange = 0;
    //playerDeckCount+=card_value[card.value]

    if (card === "2") {
      addChange = 2;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "3") {
      addChange = 3;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "4") {
      addChange = 4;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "5") {
      addChange = 5;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "6") {
      addChange = 6;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "7") {
      addChange = 7;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "8") {
      addChange = 8;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "9") {
      addChange = 9;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "10") {
      addChange = 10;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "J") {
      addChange = 10;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "Q") {
      addChange = 10;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "K") {
      addChange = 10;
      if (pl + addChange > 21 && ace == true) {
        pl -= 10;
        ace = false;
      }
    }
    if (card === "A") {
      if (pl + 11 <= 21) {
        addChange = 11;
        ace = true;
      } else addChange = 1;
    }

    pl += addChange;
    return pl;
    //playerDeckCount+=card.value
  }

  /*function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[users[socket.id]] = roomName;
    socket.emit("gameCode", roomName);
    state[roomName]=startGame
    socket.join(roomName)
    socket.number=1
    socket.emit('playernumber',1)
  }
  function handlejoingame(gamecode){
    const room=socket.adapter.rooms[gamecode]

    let allUsers
    if(room){
      allUsers=room.socket
    }
    let numclients=0
    if(allUsers){
      numclients=Object.keys(allUsers).length
    }

    if(numclients===0){
      socket.emit('unknowgame')
      return
    }
    else if(numclients>1){
      socket.emit('toomanyplayers')
      return
    }
    clientRooms[users[socket.id]]=gamecode
    socket.join(gamecode)
    socket.number=2
    socket.emit('playernumber',2)
    startGame
  }

  function startGameInterval(roomName){
    const intenalId= setInterval(()=>{

    })
  }
  function makeid(length){
    var result=''
    var characters='QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789'
    var carlength=characters.length
    for(var i=0;i<length;i++){
      result+=characters.charAt(Math.floor(Math.random()*carlength))
    }
    return result
  }*/
  function stand2(plcount) {
    if (
      dealerDeckCount < 18 &&
      dealerDeckCount < plcount 
    ) {
      dealerDeck.push(deck.cards[i]);
      socket.emit("get card", {
        suit: deck.cards[i].suit,
        value: deck.cards[i].value,
      });
      console.log(dealerDeck);
      console.log("dealers cards count",dealerDeckCount)
      dealerDeckCount = counting(deck.cards[i].value, dealerDeckCount);
      i++;
      stand2(plcount);
    } else {
      console.log("something is working");
      if (dealerDeckCount > 21) {
        console.log("you win");
        socket.emit("win/lose", "win");
        ace = false;
        startGame();
      } else if (dealerDeckCount <= plcount) {
        console.log("you win");
        socket.emit("win/lose", "win");
        ace = false;
        startGame();
      } else if (dealerDeckCount === 21 || dealerDeckCount > plcount) {
        console.log("dealer win");
        socket.emit("win/lose", "lose");
        ace = false;
        startGame();
      }
    }
  }

  //!fontooos

  socket.on("stand", stand2);

  
  socket.on("user typing", () => {
    typers[socket.id] = 1;

    socket.broadcast.emit("user typing", {
      //similar to the user connected, we sand back those who type to the app.js
      user: users[socket.id].name,
      typers: Object.keys(typers).length,
    });
  });

  socket.on("user stopped typing", () => {
    delete typers[socket.id];

    socket.broadcast.emit("user stopped typing", Object.keys(typers).length);
  });

  socket.on("send message", (payload) => {
    //similarry to the typers this send back the data from other users
    delete typers[socket.id];

    socket.broadcast.emit("send message", {
      user: payload.user,
      message: payload.message,
      typers: Object.keys(typers).length,
    });
  });
});

http.listen(3000); //here we give the port number
