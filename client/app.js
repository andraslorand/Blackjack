const socket = io(); //loading the socket.io library, the io function will mace the connection with the server/index.js
const dom = {
  //linking parameters with the tags from the app.html
  nameInput: document.querySelector(".name-input"),
  joinButton: document.querySelector(".join"),
  inputAvatar: document.querySelector(".messaging-form .avatar"),
  welcomeMessage: document.querySelector("h1"),
  feed: document.querySelector(".feed"),
  feedback: document.querySelector(".feedback"),
  hitMe: document.querySelector(".hitme"),
  stand: document.querySelector(".stand"),
  bid: document.querySelector('input[name="chp"]:checked'),
  bidd: document.getElementsByName("chp"),
  cardrow: document.querySelector(".cardrow"),
  yourcards: document.querySelector(".yourcard"),
  newg: document.querySelector(".newg"),
  info: document.querySelector(".info"),
  dealer: document.querySelector(".dealercards"),
  game: document.querySelector(".game"),
  player2: document.querySelector(".pl2"),
  join: document.querySelector(".joingame"),
  disc: document.querySelector(".disconnect"),
  ch1: document.querySelector(".chips1"),
  ch2: document.querySelector(".chips2"),
};


let playernumber;

//dom.createBTN.addEventListener('click',newGame)
//dom.joinBTN.addEventListener('click',joinGame)

/*socket.on('gameCode',function (gacode){
  handlegamecode(gacode)
})

function handlegamecode(gcode){
  dom.displaying.innerHTML=gcode
}

function handleinit(number){
  playernumber=number
}*/
/*function newGame(){
  dom.game.style.display="unset"
    //socket.emit("start new game")
   

}
function joinGame(){
    const codee=dom.code.value
    socket.emit("join game",codee)
    dom.game.style.display="none"
}*/

const user = {
  //this will hold the users who join the party
  name: null,
  avatar: null,
  chips: 100,
  playerDeck: null,
};



dom.joinButton.onclick = (e) => {
  //this where you can join the party
  e.preventDefault(); //with this the submiting wont happen automatically, it will wait to be sublitted

  if (!dom.nameInput.value) {
    dom.nameInput.parentElement.classList.add(".error"); //if its not filled the name
  } else {
    enterChannel(); //function for entring the channel
    dom.join.onclick=(e)=>{
      socket.on("some event",function(data){
        console.log("valami data",data)
      })
      console.log("alma")
      socket.emit("try")
      socket.on("count",function(data){
        console.log(data)
        if(data==0){socket.emit("joinroom",socket.id)
        console.log("faszomhuzzambeleazegeszbe")
      }
       else if(data==1){
          dom.ch1.innerHTML=100
          dom.ch2.innerHTML=100
          console.log(socket.id)
          socket.emit("joinroom",socket.id)
          
          dom.game.style.display="unset"
          //socket.emit("start game").to("some room");
          //socket.emit("start game")
          
          
        }
        else{
          console.log("nincs hely")
        }
      })
    }

    dom.disc.onclick=(e)=>{
      socket.emit("disc")
      dom.game.style.display="none"
    }

    

    socket.on("starting deck", function (data) {
      dom.cardrow.innerHTML = "";
      dom.cardrow.innerHTML = "";
      dom.dealer.innerHTML = "";
      dom.player2.innerHTML=""
      
      shortly(data.card1v,data.card1s,dom.cardrow)
      shortly(data.card2v,data.card2s,dom.cardrow)
      shortly(data.card3v,data.card3s,dom.player2)
      shortly(data.card4v,data.card4s,dom.player2)
      shortly(data.card5v,data.card5s,dom.dealer)
     

      socket.on("ultrawin", function (data) {
        if (data == true) {
          alert("win at the begining");
          socket.emit("start game");
        }
      });
    });

    function shortly(value,suit,where){
      const carddiv=document.createElement("div")
      carddiv.innerHTML = `${value} ${suit}`;
      if (suit === "♣" || suit === "♠") {
        carddiv.classList.add("black");
      } else {
        carddiv.classList.add("red");
      }
      carddiv.classList.add("cardrow");
      carddiv.classList.add("card");
      carddiv.dataset.value = `${value} ${suit}`;
      where.appendChild(carddiv);
    }
    socket.once("win/lose", function (data) {
      //  dom.cardrow.innerHTML=''
      //dom.yourcards.innerHTML=''
      //alert("new game")
      let wl = 0;
      if (data == "win") {
        console.log(data);
        dom.bidd.forEach((radio) => {
          if (radio.checked) {
            console.log(radio.value);
            wl = radio.value;
          }
        });
        user.chips += parseInt(wl);
        const information = document.createElement("div");
        information.innerHTML = "you won";
        dom.info.appendChild(information);
        console.log("winner");
        alert("win");
      }
      //dom.info.innerHTML=''
    });
    dom.newg.onclick = (e) => {
      //! itt van valahol a varazslat nyitja
      socket.once("win/lose", function (data) {
        //  dom.cardrow.innerHTML=''
        //dom.yourcards.innerHTML=''
        //alert("new game")
        let wl = 0;
        if (data == "win") {
          console.log(data);
          dom.bidd.forEach((radio) => {
            if (radio.checked) {
              console.log(radio.value);
              wl = radio.value;
            }
          });
          user.chips += parseInt(wl);
          const information = document.createElement("div");
          information.innerHTML = "you won";
          dom.info.appendChild(information);
          console.log("winner");
          alert("win");
        } else {
          dom.bidd.forEach((radio) => {
            if (radio.checked) {
              wl = radio.value;
              console.log(radio.value);
            }
          });
          user.chips -= parseInt(wl);
          console.log(user.chips);
          console.log("loser");
          alert("lose");
        }
        //dom.info.innerHTML=''
      });
      socket.emit("start game");
    };
    dom.hitMe.onclick = (e) => {
      console.log(socket.id)
      let chackedbtn = false;
      dom.bidd.forEach((radio) => {
        if (radio.checked) {
          console.log(radio.value);
          chackedbtn = true;
        }
      });

      if (chackedbtn == true) {
        if (user.chips >= 5) {
          console.log(dom.bid);

          socket.emit("hit me",socket.id);

          

          socket.once("get card", function (data) {
            getHTML(data, dom.cardrow);
          });

          /* socket.once("win/lose", function (data) {
          //  dom.cardrow.innerHTML=''
            //dom.yourcards.innerHTML=''
           
            let wl = 0;
            if (data == "win") {
              console.log(data);
              dom.bidd.forEach((radio) => {
                if (radio.checked) {
                  console.log(radio.value);
                  wl = radio.value;
                }
              });
              user.chips += parseInt(wl);

              console.log("winner");
              console.log(user.chips);
            } else {
              dom.bidd.forEach((radio) => {
                if (radio.checked) {
                  wl = radio.value;
                  console.log(radio.value);
                }
              });
              user.chips -= parseInt(wl);
              console.log(user.chips);
              console.log("loser")
            }
          });*/
        } else {
          console.log("you are broke, take a bit of a time of the computer");
        }
      } else {
        alert("radiobutton");
      }
    };
    dom.stand.onclick = (e) => {
      if (user.chips >= 0) {
        socket.emit("stand");
        socket.once("get card", function (data) {
          getHTML(data, dom.dealer);
        });
        socket.once("win/lose", function (data) {
          let wl = 0;
          if (data == "win") {
            console.log(data);
            dom.bidd.forEach((radio) => {
              if (radio.checked) {
                console.log(radio.value);
                wl = radio.value;
              }
            });
            user.chips += parseInt(wl);
            const information = document.createElement("div");
            information.innerHTML = "you won";
            dom.info.appendChild(information);
            console.log("winner");
            alert("win");
          } else {
            dom.bidd.forEach((radio) => {
              if (radio.checked) {
                wl = radio.value;
                console.log(radio.value);
              }
            });
            user.chips -= parseInt(wl);
            console.log(user.chips);
            console.log("loser");
            alert("lose");
          }
        });
      } else {
        console.log("fuck you");
      }
    };
    dom.nameInput.onkeyup = (e) => {
      //if the input box is in use we send an event to the server
      socket.emit("user typing");

      if (e.keyCode === 13) {
        const message = e.target.value; //chack if the user pressed the enter key

        socket.emit("send message", {
          //sending it to the server
          message,
          user,
        });

        addEntry({ user, message }, true); //adding the message to the cah with the addEntry function

        e.target.value = ""; //then deleting the value from the input area
      }

      if (e.target.value === "") {
        socket.emit("user stopped typing");
      }
    };
  }
};

function getHTML(data, dad) {
  const cardDiv = document.createElement("div");
  cardDiv.innerHTML = `${data.value} ${data.suit}`;
  cardDiv.dataset.value = `${data.value} ${data.suit}`;
  if (data.card1s === "♣" || data.card1s === "♠") {
    cardDiv.classList.add("black");
  } else {
    cardDiv.classList.add("red");
  }
  cardDiv.classList.add("yourcards");
  cardDiv.classList.add("card");
  dad.appendChild(cardDiv);
}

const enterChannel = () => {
  const avatar = getAvatar();
  const name = dom.nameInput.value; //adding the name and avatar to the name

  dom.joinButton.remove();
  dom.welcomeMessage.remove(); //gettin rid of the joinning button and the welcome messsage

  dom.nameInput.value = "";
  dom.nameInput.placeholder = "Send a message for the channel..."; //reusing the nameinout for the messages

  dom.inputAvatar.innerText = "";
  dom.inputAvatar.style.backgroundImage = avatar;
  dom.inputAvatar.style.backgroundSize = "contain"; //avatar

  user.name = name;
  user.avatar = avatar; //storing data in the user object

  addWelcomeMessage({ avatar }, true);

  socket.emit("user connected", {
    //setting this event to the server, so the socket knows that the user joined the party
    //firt parameter is teh name of the event (user conected)
    name,
    avatar, //second parameter the name and avatar of the user so later we can so them to other users
  });
};
const getAvatar = () => {
  //a random avatar picture
  const size = Math.floor(Math.random() * 100) + 25;

  return `url(https://i.pravatar.cc/${size}/${size})`;
};
const addWelcomeMessage = (user, you) => {
  const welcomeMessage = document.createElement("li"); //we create li-s for the ul
  const message = you
    ? "You have joined the conversation" //if you joined to the party
    : `<span class="user-name">${user.name}</span> has joined the conversation`; //if an othep joined to the party

  const avatar = you
    ? ""
    : `<span class="avatar" style="background: ${user.avatar}; background-size: contain;"></span>`; //othe persons avatar

  welcomeMessage.classList = "welcome-message";
  welcomeMessage.innerHTML = `
        <hr />
        <div class="welcome-message-text">
            ${avatar}
            ${message}
        </div>
    `;

  dom.feed.appendChild(welcomeMessage); //addin the li to the ul
};
socket.on("user connected", (payload) => addWelcomeMessage(payload, false)); //if another user conected to the party we will use the addWelcomeMassage function

socket.on("user typing", ({ user, typers }) => {
  dom.feedback.innerHTML =
    typers > 1 ? "Several people are typing" : `<i>${user}</i> is typing`;
});
//here we change the feedback accordingly if there are typers or not
socket.on("user stopped typing", (typers) => {
  if (!typers) {
    dom.feedback.innerHTML = "";
  }
});
const addEntry = ({ user, message }, you) => {
  //the whole thing is similar to the addWelcomeMessage
  const entry = document.createElement("li"); //creating an li for the ul so we can write out the message
  const date = new Date();

  entry.classList = `message-entry${you ? " message-entry-own" : ""}`;
  entry.innerHTML = `
        <span class="avatar" style="background: ${
          user.avatar
        }; background-size: contain;"></span>
        <div class="message-body">
            <span class="user-name">${you ? "You" : user.name}</span>
            <time>@ ${date.getHours()}:${date.getMinutes()}</time>
            <p>${message}</p>
        </div>
    `;

  dom.feed.appendChild(entry);
};

socket.on("send message", (payload) => {
  //adding the new message to the feed
  addEntry(payload);

  if (!payload.typers) {
    dom.feedback.innerHTML = "";
  }
});
