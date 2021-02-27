$(document).ready(() => {

  game()

  $('.main__game-restart').click(function() {
    game()
  })
  $('.main__rules-box').click(function() {
    $('.rules').addClass('opened')
  })
  $('.modal__close').click(function() {
    $('.modal').removeClass('opened')
  })
})

const score = $('.score__value')
const gameStartBlock = $('.main__game-start')
const gamePlayBlock = $('.main__game-play')
const gamePlayerPickBlock = $('.main__game-player-pick')
const gameHousePickBlock = $('.main__game-house-pick')
const gameResultBlock = $('.main__game-result')
const gameResultTitle = $('.main__game-result-title')

const game = () => {
  startGame().then( playerChoice => {

    showPlayBlock()
    showPlayerChoice(playerChoice)
    return getGameChoices(playerChoice) // return player and house choices

  }).then( gameСhoices  => {

    showHouseChoice(gameСhoices.houseChoice)
    return calculateWinner(gameСhoices)

  }).then( winnerStatus => {

    showWinner(winnerStatus)
    changeScore(winnerStatus)
    displayScore()

  })
}

const startGame = () => {
  resetToDefault()
  showStartBlock()
  initiateScore()
  displayScore()
  return new Promise( (resolve, reject) => {
    $('.game-variant-box').click(function() {
       resolve($(this).data('choice'))
    })
  })
}
const initiateScore = () => {
  if(!localStorage.getItem('score')) {
    localStorage.setItem('score', 0)
  }
}
const displayScore = () => {
  const currentScore = localStorage.score || 0
  score.text(currentScore)
}
const changeScore = (changes) => {
  const currentScore = localStorage.score || 0
  const newScore = +currentScore + changes >= 0 ? +currentScore + changes : 0
  localStorage.setItem('score', newScore)
}
const resetToDefault = () => {
  gameHousePickBlock.attr('class', 'main__game-house-pick game-variant-box')
  gameHousePickBlock.children().attr('class', 'game-icon')
  gameResultBlock.addClass('disabled')
  gamePlayerPickBlock.removeClass('winner')
  gameHousePickBlock.removeClass('winner')
}
const showWinner = (status) => {
  let statusText = 'draw'
  if(status === 1) {
    statusText = 'you win'
    gamePlayerPickBlock.addClass('winner')
  }
  if(status === -1) {
    statusText = 'you lose'
    gameHousePickBlock.addClass('winner')
  }
  gameResultTitle.text(statusText)
  gameResultBlock.removeClass('disabled')
}

const showStartBlock = () => {
  gameStartBlock.removeClass('hidden')
  gamePlayBlock.addClass('hidden')
}
const showPlayBlock = () => {
  gameStartBlock.addClass('hidden')
  gamePlayBlock.removeClass('hidden')
}
const showPlayerChoice = (playerChoice) => {
  gamePlayerPickBlock.attr('class', `game-variant-box ${playerChoice}-box`)
  gamePlayerPickBlock.children().attr('class', `game-icon ${playerChoice}-icon`)
}
const showHouseChoice = (houseChoice) => {
  const variantTitle = houseChoice.title
  gameHousePickBlock.attr('class', `game-variant-box ${variantTitle}-box`)
  gameHousePickBlock.children().attr('class', `game-icon ${variantTitle}-icon`)
}
const getGameChoices = (playerChoice) => {
  return new Promise(resolve => {
    resolve(getHouseChoice())
  }).then(houseChoice => {
    return {
      playerChoice: gameData[playerChoice],
      houseChoice
    }
  })
}
const getHouseChoice = () => {
  return new Promise( (resolve) => {
    const randomInt = Math.round(-0.5 + Math.random() * 5)
    const houseChoice = Object.values(gameData)[randomInt]
    setTimeout(() => resolve(houseChoice), 1500) // timeout before house send choice
  })
}

const calculateWinner = ({playerChoice, houseChoice}) => {
   let status = 0; // - 1 = house win 1 - player win 0 - draw
   if(playerChoice.win.includes(houseChoice.title)) {
     status = 1
   } else if(playerChoice.lose.includes(houseChoice.title)) {
     status = -1
   }
   return status;
}

const gameData = {
  'paper': {
    title: 'paper',
    win: ['rock', 'spock'],
    lose: ['scissors', 'lizard']
  },
  'rock': {
    title: 'rock',
    win: ['scissors', 'lizard'],
    lose: ['paper', 'spock']
  },
  'scissors': {
    title: 'scissors',
    win: ['paper', 'lizard'],
    lose: ['rock', 'spock']
  },
  'lizard': {
    title: 'lizard',
    win: ['paper', 'spock'],
    lose: ['scissors', 'rock']
  },
  'spock': {
    title: 'spock',
    win: ['rock', 'scissors'],
    lose: ['paper', 'lizard']
  }
}
