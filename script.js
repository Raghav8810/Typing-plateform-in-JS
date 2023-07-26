const words = 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable.'.split(' ');
const wordsCount = words.length;

const gameTime = 30 * 1000; //1000 = 1sec so it will 30 second;
window.timer = null; 
window.gameStart = null;



//for adding class and remove in word cheak from keyword
function addClass(el,name){
    el.className += ' '+name; 
// element.classList.add(name);
}
function removeClass(el,name){
    el.className = el.className.replace(name,'');
// element.classList.remove(name);
}

//function that return random words 
function randomWord(){
    const randomIndex = Math.ceil(Math.random() * wordsCount );
    return words[randomIndex - 1];
}

//format all words after getting random words
 function formatWords(word){
    if(word !== undefined){
        return `<div class="word"><span class="letter">${word.split("").join('</span><span class="letter">')}</span></div>`;
    }else{
        console.log("not executed");
    }
  
 }
//  ${word.split('').join('</span><span class="letter">')}

function newGame(){
    document.getElementById('words').innerHTML = '';
     for(let i = 0; i < 200; i++){
        document.getElementById('words').innerHTML += formatWords(randomWord());
     }
     
     addClass(document.querySelector('.word'),'current'); 
      addClass(document.querySelector('.letter'),'current');   
      document.getElementById('info').innerHTML = (gameTime / 1000) + '';
      window.timer = null;                      
}

//word per minutes
   function wpm(){
    const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
   }

///gameover
function gameOver(){
   clearInterval(window.timer);
   addClass(document.getElementById('game'), 'over');
    const result = wpm();
    console.log({result});
   document.getElementById('info').innerHTML = `WPM : ${result}`;
}





// typing on game
const gamepad = document.getElementById("game");

gamepad.addEventListener('keyup',ev =>{
   const key = ev.key;
   const currentLetter = document.querySelector('.letter.current');
   const currentWord = document.querySelector('.word.current');
   const expected = currentLetter?.innerHTML || ' ';

   const isletter = key.length === 1 && key !== ' ';
   const isSpace = key === ' ';
   const isBackspace = key === 'Backspace';
   const isFirstLetter = currentLetter === currentWord.firstChild;


   if(document.getElementById('#game.over')){
    return;
   }
  //we want to start timer when we write first letter so cheak if timer null , start
   if(!window.timer && isletter){
    // alert('startthe timer');
        window.timer = setInterval( () =>{
           if(!window.gameStart){
            window.gameStart = (new Date()).getTime();
           }

           const currentTime = (new Date()).getTime();
           const mspassed = currentTime - window.gameStart;
           const secondsConvert = Math.round(mspassed/1000);
           //for reverse count
           const secondleft = (gameTime / 1000) - secondsConvert;
           if(secondleft <= 0){
            gameOver();
             return;
           }
           document.getElementById('info').innerHTML = secondleft+ '';
        }, 1000);
     }

   console.log({key,expected});

   if(isletter){
      if(currentLetter){
        // alert(key === expected ? 'ok' : 'wrong');
        addClass(currentLetter, key===expected ? 'correct' : 'incorrect');
        removeClass(currentLetter, 'current');
        if(currentLetter.nextSibling){
            addClass(currentLetter.nextSibling,'current'); 
        }
       
      }else{
        const incorrectLetter = document.createElement('span');
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = 'letter incorrect extra';
        currentWord.appendChild(incorrectLetter);
      }
   }
 
    //cheack space and handle space
     if(isSpace){
        if(expected !== ' '){
            const letterToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            letterToInvalidate.forEach(letter =>{
                addClass(letter, 'incorrect');
            });
        }
           removeClass(currentWord, 'current');
           addClass(currentWord.nextSibling,'current');

           if(currentLetter){
            removeClass(currentLetter,'current');
           }
           addClass(currentWord.nextSibling.firstChild, 'current');

     }

     //backspace
       if(isBackspace){
          if(currentLetter && isFirstLetter){
            //make previous word, last letter current
             removeClass(currentWord, 'current');
             addClass(currentWord.previousSibling, 'current');

             removeClass(currentLetter, 'current');
             addClass(currentWord.previousSibling.lastChild, 'current');
             removeClass(currentWord.previousSibling.lastChild, 'incorrect');
             removeClass(currentWord.previousSibling.lastChild, 'correct');

          }

          if(currentLetter && !isFirstLetter){
            //move back to current letter to previous letter in word
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
          }
          //for last letter in word
          if(!currentLetter){
             addClass(currentWord.lastChild, 'current');
             removeClass(currentWord.lastChild, 'incorrect');
             removeClass(currentWord.lastChild, 'correct');

          }

       }

       //liness will me overflow in game div so move cursor word
       if(currentWord.getBoundingClientRect().top > 250){
        // alert('move');
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin -35) + 'px';
   }

      
      /// move cursor with typing 
      // we need to move it to next letter or next word so first decalre it varibalr
      const nextletter = document.querySelector('.letter.current');
      const cursor = document.getElementById('cursor');
      const nextWord = document.querySelector('.word.current');
       if(nextletter){
           cursor.style.top = nextletter.getBoundingClientRect().top + 2 +'px';
           cursor.style.left = nextletter.getBoundingClientRect().left + 'px';
       }else{
         cursor.style.top = nextWord.getBoundingClientRect().top + 2 +'px';
         cursor.style.left = nextWord.getBoundingClientRect().right + 'px'; 
       }


});

document.getElementById('newgameBtn').addEventListener('click',() =>{
  gameOver();
  newGame();
})


newGame();

