import React from 'react';
import map from './septa-zone-map.jpg';
import './Modal.css';

const modal = props => {
  const cssClasses = ['Modal', props.show ? 'ModalOpen' : 'ModalClosed'];

  return (
    <div className={cssClasses.join(' ')} onClick={props.closed}>
      <img src={map} />
      <button className="Button" onClick={props.closed}>
        Close Map
      </button>
    </div>
  );
};

export default modal;
