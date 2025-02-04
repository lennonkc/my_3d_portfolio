import { Link } from "react-router-dom";

import { arrow } from "../assets/icons";

const HomeInfo = ({ currentStage }) => {

  if (currentStage === 5)
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
        <div id="drawAnimation"></div>
        <span className='font-semibold mx-2 text-white'>DRAW TO EXPLORE</span>
      </h1>
    );

  if (currentStage === 3)
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
        Hi, I'm
        <span className='font-semibold mx-2 text-white'>KunCheng Li</span>
        👋
        <br />
        A Software Engineer from China 🇨🇳
      </h1>
    );

  if (currentStage === 2) {
    return (
      <div className='info-box'>
        <p className='font-medium sm:text-xl text-center'>
        My experience showcases my ambitions and skills, reflecting my dedication to achieving ongoing success.
        </p>

        <Link to='/about' className='neo-brutalism-white neo-btn'>
          ABOUT ME
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 1) {
    return (
      <div className='info-box'>
        <p className='font-medium text-center sm:text-xl'>
        I have a great interest in applications within the field of AI. 
        <br />Check it out!
        </p>

        <Link to='/gallery' className='neo-brutalism-white neo-btn'>    
          MY AI APPS
          <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className='info-box'>
      <p className='font-medium sm:text-xl text-center'>
        Need a project done or looking for a dev? <br/> I'm just a few keystrokes away
      </p>

      <Link to='/contact' className='neo-brutalism-white neo-btn'>
        Let's talk
        <img src={arrow} alt='arrow' className='w-4 h-4 object-contain' />
      </Link>
    </div>
    );
  }

  return null;
};

export default HomeInfo;
