$(document).ready(function () {

	// reset button will reset the table
	$('#reset').click(function () {
		if (confirm("Resetting resets you to 500 ᓚᘏᗢ. Are you sure you wish to continue?")) {
			console.log("reset")
			resetVar()
			hide();
			$('li').remove();
			$('.pscore p').remove();
			$('.score h1').remove();
			$('.dealers_cards').css("height", "90px");
			window.scrollTo(0, 0);
			startEl.textContent = 'START'
			player.chips = 500
		} else {
			console.log('player chose not to reset')
		}
	});

	// start button will reset the table and start the game
	$('#start').click(function () {
		console.log('start ' + canBet)
		resetVar()
		view()
		pageScroll()
		startEl.textContent = 'REPLAY'
		$('li').remove();
		$('.pscore p').remove();
		$('.score h1').remove();
		playGame();
	});


	$('#hit').click(function () {
		console.log('hit')
		canBet = false
		douBtnGrey()

		playerHand.hitMe("p");
		result = firstResultCheck();

		/* complicated if statement simplied to if/else statement below:
		if (isNumeric(result) || result === "BJ!") {
			if (result === "BJ!") {
				console.log('jacks')
				isAlive = false
				revealDealerHand(dealerHand)
            }
			inputUserScore(result);
		}*/
		if (isNumeric(result)) {
			inputUserScore(result);
		} else {
			console.log('bust or bj or tie')
			isAlive = false
			revealDealerHand(dealerHand)
		}
		console.log(win)
		if (isAlive) {
			viewConsole();
		} else {
			hideConsole();
			return;
		}
	});


	$('#stand').click(function () {
		console.log('stand')
		canBet = false
		douBtnGrey()

		console.log(dealerHand.score()+' vs '+playerHand.score())

		if (dealerHand.score()	 < playerHand.score() || dealerHand.score() === playerHand.score()) {
			console.log('stan1')
			while (dealerHand.score() < 17) {
				countingDealersCards = 0;
				dealerHand.hitMe("b");
			}
			result = finalResultCheck();
		}
		else {
			console.log('stan2')
			//isAlive = false
			result = "L Bozo"
        }
		revealDealerHand(dealerHand);
		hideConsole();
		//updateChips()
		console.log(dealerHand.score() + ' vs ' + playerHand.score())
		console.log(win)
		return;

	});
	
	$('#double').click(function () {
		if (betAmt * 2 > player.chips) {
			douBtnGrey()
			console.log('too little ᓚᘏᗢ')
			alert('You have too little ᓚᘏᗢ to double. Reduce the amount and try again, or Stand')

		}
		else if (canDouble) {
			console.log('doubled')
			canBet = false
			douBet()
			douBtnGrey()
			playerHand.hitMe("p");
			result = firstResultCheck();
			
			if (isAlive) {
				viewConsole();
			} else {
				hideConsole();
				return;
			}

			console.log(dealerHand.score() + ' vs ' + playerHand.score())

			if (playerHand.score() > 21) {
				console.log('insta bust')
				result = "Bust"
			}
			else if (dealerHand.score() < playerHand.score() || dealerHand.score() === playerHand.score()) {
				console.log('dou1')
				while (dealerHand.score() < 17) {
					countingDealersCards = 0;
					dealerHand.hitMe("b");
				}
				result = finalResultCheck();
			}
			else {
				console.log('dou2')
				//isAlive = false
				result = "L Bozo"
			}
			revealDealerHand(dealerHand);
			hideConsole();
			//updateChips()
			console.log(dealerHand.score() + ' vs ' + playerHand.score())
			console.log(win)
			return;
		} else {
			console.log('not doubled')
			douBtnGrey()
			//send an alert player can no longer double
			alert('You already Hit so you can no longer double bets')
        }
    })

	$('#minus').click(function () {
		subBet()
		
	});

	$('#plus').click(function () {
		addBet()
		
	});
});

let player = {
	name: "Player 1",
	chips: 500
}

var isAlive = true;
var win = false;
var tie = false;
var canDouble = true;
var betAmt = 100
var canBet = true;

let playerEl = document.getElementById("player-el")
let betEl = document.getElementById("bet-el")
let startEl = document.getElementById("start")

startEl.textContent = "START"

var resetVar = function () {
	//reset variables
	isAlive = true
	win = false;
	tie = false;
	canDouble = true
	canBet = true
	if (player.chips >= 100) {
		betAmt = 100
	}
	else {
		betAmt = player.chips
    }

	//reset textContent
	betEl.textContent = betAmt + "ᓚᘏᗢ"
	playerEl.textContent = player.name + ": " + player.chips + 'ᓚᘏᗢ'

	//reset color
	douBtnDefault()
	document.getElementById("pscore").style.background = "lightgrey"
	document.getElementById("pscore").style.color = "#feab92"
}

var subBet = function () {
	if (betAmt - 10 < 0) {
		return
	}
	if (canBet) {
		console.log('less')
		//console.log(canDouble)
		if ((betAmt - 10) * 2 <= player.chips) {
			douBtnDefault()
		} else {
			douBtnGrey()
		}

		betAmt = betAmt - 10;
		var audio = new Audio('audio/app-negative.mp3');
		audio.play();
	}
	else {
		console.log('play sound')
		var audio = new Audio('audio/mixkit-system-beep-buzzer-fail-2964.wav');
		audio.play();
	}
	betEl.textContent = betAmt + "ᓚᘏᗢ"
}

var addBet = function () {
	if (betAmt + 10 > player.chips) {
		return
	}
	if (canBet) {
		console.log('more')

		//console.log(canDouble)
		if ((betAmt + 10) * 2 > player.chips) {
			douBtnGrey()
		} else {
			douBtnDefault()
        }
		betAmt = betAmt + 10;
		var audio = new Audio('audio/mixkit-positive-interface-beep-221.wav');
		audio.play();
	}
	else {
		console.log('play sound')
		var audio = new Audio('audio/mixkit-system-beep-buzzer-fail-2964.wav');
		audio.play();
	}
	betEl.textContent = betAmt + "ᓚᘏᗢ"
}

var douBet = function () {
	if (canDouble) {
		canDouble = false
		betAmt = betAmt * 2;
	}
	betEl.textContent = betAmt + "ᓚᘏᗢ"
}

var updateChips = function () {
	if (tie) {
		
	}else if (win) {
		player.chips = player.chips + betAmt
	} else {
		player.chips = player.chips - betAmt
    }
	playerEl.textContent = player.name + ": " + player.chips + 'ᓚᘏᗢ'
}
//color changes
//change btn gray w/ js
var douBtnDefault = function () {
	canDouble = true
	document.getElementById("double").style.background = "rgba(240,248,255,1)"
	document.getElementById("double").style.boxShadow = "0px 9px 0px rgba(160,237,218,1), 0px 9px 25px rgba(0,0,0,.7)"
}
var douBtnGrey = function () {
	canDouble = false
	document.getElementById("double").style.background = "gainsboro"
	document.getElementById("double").style.boxShadow = "0px 9px 0px rgba(192,192,192, 1), 0px 9px 25px rgba(0, 0, 0, .7)"
}

var resultDefault = function () {
	document.getElementById('pscore').style.background = "lightgray"
	document.getElementById("pscore").style.color = "#feab92"
}
var resultRed = function () {
	document.getElementById("pscore").style.background = "indianred"
	document.getElementById("pscore").style.color = "darkred"
}
var resultGreen = function () {
	document.getElementById("pscore").style.background = "lightgreen"
	document.getElementById("pscore").style.color = "#016f32"
}

function pageScroll() {
	/*console.log("Scrolling...");
	window.scrollBy(0, 10);
	window.scrollBy(0, window.innerHeight);
	scrolldelay = setTimeout(pageScroll, 10);*/
	window.scrollTo(0, window.innerHeight/2);
}

//popups

var chipsFew = function () {
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
}


//Card face finder
function cardFace(suit, figure) {
	suits = { 1: "clubs", 2: "diamonds", 3: "hearts", 4: "spades" };
	figures = { 1: "ace", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "jack", 12: "queen", 13: "king" };
	var c = figures[figure] + "_of_" + suits[suit] + ".svg";
	return c;
}

//Deck_constructor
function deck() {
	this.create = function () {
		var cardArray = [];
		var i = 1;
		var j = 1;
		for (i = 1; i < 14; i++) {
			for (j = 1; j < 5; j++) {
				cardArray.push(new Card(j, i));
			}
		}
		return shuffle(shuffle(cardArray));
	};
}

//check The Deck Constructor
function deckChecker() {
	var array = new deck();
	var array = array.create();
	for (i = 0; i < 52; i++) {
		console.log(array[i].getNumber() + " of suit " + array[i].getSuit());
	}
}

//Deck suffling
function shuffle(a) {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
	return a;
}

//Card Constructor
function Card(suit, number) {
	var CardSuit = suit;
	var CardNumber = number;
	this.getSuit = function () {
		return CardSuit;
	};
	this.getNumber = function () {
		return CardNumber;
	};
	this.getValue = function () {
		if (number === 1) {
			return 11;
		} else if (number > 9) {
			return 10;
		} else {
			return number;
		}
	};
}

function revealDealerHand(hand) {

	inputUserScore('...')
	isAlive = false
	var hand = hand.getHand();
	for (i = 0; i < hand.length; i++) {
		//$('.dealers_cards ul').pop();

		$('.dealers_cards li').remove();
		task(i)
		//console.log("dealing")
	}
	function task(i) {
		setTimeout(function () {
			// show cards with a delay
			$('.dealers_cards ul').append('<li><a href="#"><img src="cards/' + cardFace(hand[i].getSuit(), hand[i].getNumber()) + '" /></a></li>');			

			//reveal game results after cards are dealt
			//console.log("r1")
			if (i === hand.length - 1) {
				inputUserScore(result)
				if (win) {
					var audio = new Audio('audio/Quiz-correct-with-applause.mp3');
					audio.play();
					resultGreen()
				} else if (tie) {
					console.log('TIE')
					resultDefault()
				}else {
					var audio = new Audio('audio/Oof-sound.mp3');
					audio.play();
					resultRed()
				}	
				updateChips()
			}
		}, 1000 * i);
	}
	//console.log("reached")


}

// Deal function provides players with cards and prepend card images with jQuery
var deal = function (whos) {
	var newCard = gameDeck.pop();
	if (whos == "b") {
		countingDealersCards += 1;
	}
	// I would like to automate the correct div selection, but it dosn't work for now.
	if (whos == "p") {
		$('.players_cards ul').prepend('<li><a href="#"><img src="cards/' + cardFace(newCard.getSuit(), newCard.getNumber()) + '" /></a></li>');
	} else if (whos == "b" && countingDealersCards < 2) {
		$('.dealers_cards').css("height", "");
		$('.dealers_cards ul').prepend('<li><a href="#"><img src="cards/' + cardFace(newCard.getSuit(), newCard.getNumber()) + '" /></a></li>');
	} else if (whos == "b" && countingDealersCards == 2) {
		$('.dealers_cards ul').prepend('<li><a href="#"><img src="cards/back.jpg" /></a></li>');
	}
	return newCard;
};

//Hand Object is keeping the score
function Hand(whos, howManyCards) {
	var who = whos;
	var cardArray = [];
	for (i = 0; i < howManyCards; i++) {
		cardArray[i] = deal(who);
	}
	this.getHand = function () {
		return cardArray;
	};

	this.score = function () {
		var handSum = 0;
		var numofaces = 0;
		for (i = 0; i < cardArray.length; i++) {
			handSum += cardArray[i].getValue();
			if (cardArray[i].getNumber() === 1) {
				numofaces += 1;
			}
		}
		if (handSum > 21 && numofaces != 0) {
			for (i = 0; i < numofaces; i++) {
				if (handSum > 21) {
					handSum -= 10;
				}
			}
		}
		return handSum;
	};
	this.printHand = function () {
		var string = "";
		for (i = 0; i < cardArray.length; i++) {
			string = string + cardArray[i].getNumber() + " of suit " + cardArray[i].getSuit() + ", ";
		}
		return string;
	};
	this.hitMe = function (whos) {
		cardArray.push(deal(whos));
		this.getHand();
	};
}

var finalResultCheck = function () {
	console.log('final check')
	var pS = playerHand.score();
	var dS = dealerHand.score();
	if (pS > 21) {
		if (dS > 21) {
			tie = true;
			return "Tide";
		}
		else {
			return "Bust";
		}
	}
	else if (dS > 21) {
		win = true;
		return "Win!";
	}
	else if (pS > dS) {
		win = true;
		return "Win!";
	}
	else if (pS < dS) {
		return "L Bozo";
	}
	else if (pS === dS) {
		tie = true;	
		return "Tide";
	}
	else if (pS === 21) {
		win = true
		hideConsole()
		return "BJ!"
    }
	else {
		return "Bust";
	}
};

var inputUserScore = function (input) {
	$('.pscore p').remove();
	$('.pscore').prepend("<p>" + input + "</p>");
}

var firstResultCheck = function () {
	console.log('first check')
	pS = playerHand.score();
	dS = dealerHand.score();
	if (pS === 21) {
		win = true
		hideConsole()
		return "BJ!";
	}
	else if (pS > 21) {
		if (dS > 21) {
			return "TideOver";
		}
		else {
			return "Bust";
        }
	}
	else if (dS > 21) {
		win = true
		return "Win!";
	}
	else {
		return pS;
	}
};

var phaseOne = function () {
	dealerHand = new Hand("b", 2);
	playerHand = new Hand("p", 2);
	result = firstResultCheck();

	inputUserScore(result);
	if (result == "BJ!") {
		console.log("insta bj")
		canBet = false
		hideConsole();
		revealDealerHand(dealerHand)
		return
	}
	if (isAlive) {
		viewConsole();
	} else {
		hideConsole();
		return;
	}
};

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var viewConsole = function () {
	$('.gameConsole').css("visibility", "");
}

var view = function () {
	$('.pscore').css("visibility", "");
	$('.results').css("visibility", "");
	$('.gamble').css("visibility", "");
}

var hideConsole = function () {
	$('.gameConsole').css("visibility", "hidden");
}

var hide = function () {
	$('.pscore').css("visibility", "hidden");
	$('.results').css("visibility", "hidden");
	$('.gameConsole').css("visibility", "hidden");
	$('.gamble').css("visibility", "hidden");
}

var playGame = function () {
	var gdeck = new deck();
	countingDealersCards = 0;
	// global variable
	gameDeck = gdeck.create();
	phaseOne();
};
