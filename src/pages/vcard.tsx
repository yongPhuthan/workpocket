import React, { FC, MouseEventHandler } from 'react';

const generateVCard: MouseEventHandler = (event) => {
  event.preventDefault();
  window.open('/api/generateVCard', '_blank');
};

const Home: FC = () => {
  return (
    <div className="App">
      {/* The rest of your code... */}
      <a
        className="btn-card btn-download"
        onClick={generateVCard}
        href="#"
      >
        <i className="bx bx-download">GOOOO</i>
      </a>
      {/* The rest of your code... */}
    </div>
  );
};

export default Home;
