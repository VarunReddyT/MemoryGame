  import React, { useState, useEffect, useContext } from 'react';
  import wordsData from '../words.json';
  import { useNavigate } from 'react-router-dom';
  import Confetti from 'react-confetti';
  import { GameContext } from './GameContext.js';
  import { Popover } from 'bootstrap';

  export default function MissingLetterGame() {
    const navigate = useNavigate();
    const { selectedSetId, setTries, timer, setTimer } = useContext(GameContext);

    useEffect(() => {
      if (selectedSetId === null) {
        navigate('/');
      }
    }, [selectedSetId, navigate]);

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    // eslint-disable-next-line
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl))

    const [index, setIndex] = useState(selectedSetId || 0);
    const level2Data = wordsData['words'];
    const [w, setW] = useState([]);
    const [buttonColors, setButtonColors] = useState(Array(15).fill(''));
    const [noOfTries, setNoOfTries] = useState(0);
    const [nextButtonVisible, setNextButtonVisible] = useState(false);
    const [correctTries, setCorrectTries] = useState(0);
    const [correctIndex, setCorrectIndex] = useState([]);
    const [startTime, setStartTime] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    let wordArr = [], alphabetArr = [], tempArr = [];
    let singleAlphabet = [];

    for (let j in level2Data[index]) {
      wordArr.push(j);
      tempArr.push(level2Data[index][j]);
      alphabetArr.push(tempArr);
      tempArr = [];
    }

    useEffect(() => {
      let underWord = [];
      if (index > 8) {
        for (let i = 0; i < 5; i++) {
          let modifyWord = wordArr[i];
          modifyWord = modifyWord.replace(wordArr[i][0], "_");
          modifyWord = modifyWord.replace(wordArr[i][1], "_");
          underWord.push(modifyWord);
        }
      } else {
        for (let i = 0; i < 5; i++) {
          underWord.push(wordArr[i].replace(wordArr[i][0], "_"));
        }
      }
      setW(underWord);
      setButtonColors(Array(15).fill(''));
      // eslint-disable-next-line
    }, [index]);

    const handleTime = () => {
      if (!startTimer) {
        setStartTime(new Date());
        setStartTimer(true);
        console.log('start');
      }
    };

    const instructions = () => {
      const audio = new Audio('/instructions.wav');
      audio.play();
    }

    const checkLetter = async (letter, word, indexW, i) => {
      setNoOfTries(noOfTries + 1);

      const audio = new Audio(`/Audio/${letter}.mp3`);
      await audio.play();

      if (((index < 9 && letter === word[0]) || (index > 8 && letter === word.slice(0, 2))) && (correctIndex.indexOf(i) === -1)) {
        setTimeout(() => {
          eachLetter(wordArr[indexW]);
        }, 1000);
        setTimeout(() => {
          rightClick(wordArr[indexW]);
        }, 2500);

        setCorrectIndex([...correctIndex, i]);
        const newW = [...w];
        newW[indexW] = word;
        console.log(correctTries);
        const newButtonColors = [...buttonColors];
        newButtonColors[i] = "#14fc03";
        setButtonColors(newButtonColors);
        setW(newW);
        setCorrectTries(prevCorrectTries => {
          const correctTries = prevCorrectTries + 1;
          if (correctTries === 5) {
            setNextButtonVisible(true);
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          }
          return correctTries;
        });
        const button = document.getElementById(i);
        button.classList.add('correct-animation');

        setTimeout(() => {
          button.classList.remove('correct-animation');
        }, 1000);

        return true;
      }
    };

    const handleNext = () => {
      const audio = new Audio('/GoodJob.wav');
      audio.play();
      setStartTimer(false);
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 1000;
      setStartTime(timeDiff);
      setTimer(prevTimer => prevTimer + timeDiff);
      console.log(timer);
      setCorrectTries(0);
      setIndex(prevIndex => prevIndex + 1);
      setNextButtonVisible(false);
      setCorrectIndex([]);
      setTries(noOfTries);
      if ((selectedSetId === 1 && index === 5) || (selectedSetId === 6 && index === 10)) {
        navigate('/end');
      }
    };

    const rightClick = (word) => {
      const audio = new Audio(`/Audio/${word}.mp3`);
      audio.play();
    };

    const eachLetter = (word) => {
      const audio = new Audio(`/EachAudio/${word}.mp3`);
      audio.play();
    };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        singleAlphabet.push(alphabetArr[i][0][j]);
      }
    }

    const groupedButtons = [];
    for (let i = 0; i < 5; i++) {
      const buttonGroup = [];
      for (let j = 0; j < 3; j++) {
        const letterIndex = i * 3 + j;
        const letter = singleAlphabet[letterIndex];
        const correctWord = wordArr[i];
        buttonGroup.push(
          <button
            key={letterIndex}
            id={letterIndex}
            className="btn letter-button p-3 mb-3"
            onClick={() => { handleTime(); checkLetter(letter, correctWord, i, letterIndex); }}
            style={{ backgroundColor: buttonColors[letterIndex] }}
          >
            {letter}
          </button>
        );
      }
      groupedButtons.push(
        <div key={i} className="button-group-horizontal d-flex">
          <div className="button-group-vertical">
            {buttonGroup}
          </div>
          <button key={`rbutton${i}`} id={`rbutton${i}`} className="btn btn-lg word-button" onClick={() => rightClick(wordArr[i])}>
            {w[i]}
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className='justify-content-center d-flex'>
        <div className='head'>
          <h1 className="text-center mt-2">Find the Missing Letters</h1>
          <div className="d-flex mt-4 inst">
            <div>
            <button className="btn btn-danger me-5" onClick={() => navigate('/')} >Exit</button>
            </div>
            <div>
              <span><h3>Tries : {noOfTries}</h3></span>
            </div>
            <div className='instruction-container'>
              <div className='d-flex justify-content-center'>

                <button type="button" className="btn btn-warning me-1" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="left" data-bs-content="Make sure to turn up the volume!">
                  Instructions
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={instructions} width="35" height="35" fill="red" className="bi bi-play-circle-fill me-1" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className='outerDiv'>

          <div className="grid-container flex-column justify-content-center align-items-center mt-4">
            {groupedButtons}
          </div>
          <div className='nextButton mt-5'>
            
            {nextButtonVisible && <button className="btn btn-success btn-lg next-button" onClick={handleNext}>Next</button>}
          </div>
          <div style={{ marginBottom: '50px' }}></div>
          {showConfetti && <Confetti/>}
        </div>
      </div>
    );
  }
