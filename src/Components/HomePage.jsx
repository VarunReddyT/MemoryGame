import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GameContext } from './GameContext.jsx';
import homeImage from '../assets/images/img1.jpg';

export default function HomePage() {
  const { setSelectedSetId } = useContext(GameContext);
  const handleSetSelection = (setId) => {
    setSelectedSetId(setId);
  };
  return (
    <div className='d-flex align-items-center justify-content-center home'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 text-center'>
            <div className='mt-2'>
              <p style={{ fontSize: '4rem' }}>Memory Game</p>
            </div>
          </div>
        </div>
        <div className='row d-flex align-items-center justify-content-center' style={{ minHeight: '70vh' }}>
          <div className='col-md-6'>
            <div className='card mb-3' style={{ borderRadius: '55px' }}>
              <div className='card-body d-flex flex-column align-items-center'>
                <Link to="/play" onClick={() => handleSetSelection(1)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={homeImage} alt="Memory Game" className='img-fluid mb-3' />
                </Link>
                <Link to="/play" onClick={() => handleSetSelection(1)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <p style={{ fontSize: '30px' }} className='card-text'>Set A</p>
                </Link>
                <Link to="/play" onClick={() => handleSetSelection(1)} className='btn btn-lg btn-primary'>Start Game</Link>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card mb-3' style={{ borderRadius: '55px' }}>
              <div className='card-body d-flex flex-column align-items-center'>
                <Link to="/play" onClick={() => handleSetSelection(6)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={homeImage} alt="Memory Game" className='img-fluid mb-3' />
                </Link>
                <Link to="/play" onClick={() => handleSetSelection(6)} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <p style={{ fontSize: '30px' }} className='card-text'>Set B</p>
                </Link>
                <Link to="/play" onClick={() => handleSetSelection(6)} className='btn btn-lg btn-primary'>Start Game</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <Link className='btn btn-warning btn-lg' to={window.location.origin + "/games"}>Back to home</Link>
        </div>
      </div>
    </div>
  );
}
