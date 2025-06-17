import React from 'react';
import { initialStyle } from '../../styles';
import Button, { btnClicked } from '../../button';

interface MainSectionProps {
  onSectionChange: (section: number) => void;
}

const MainSection: React.FC<MainSectionProps> = ({ onSectionChange }) => {
  return (
    <div className="main-section">
      <div style={initialStyle()}>
        <Button
          btnId="single-btn"
          onClick={() => {
            onSectionChange(1);
            btnClicked('SingleVideo');
          }}
          customStyle={{ width: '180px' }}
        >
          Single Video
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '10px' }}>
        <Button
          btnId="multiple-btn"
          onClick={() => {
            onSectionChange(2);
            btnClicked('MultipleVideo');
          }}
          customStyle={{ width: '180px' }}
        >
          Multiple Videos
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '10px' }}>
        <Button
          btnId="playlist-btn"
          onClick={() => {
            onSectionChange(3);
            btnClicked('Playlist');
          }}
          customStyle={{ width: '180px' }}
        >
          Playlist
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '10px' }}>
        <Button
          btnId="channel-btn"
          onClick={() => {
            onSectionChange(4);
            btnClicked('Channel');
          }}
          customStyle={{ width: '180px' }}
        >
          Channel
        </Button>
      </div>
    </div>
  );
};

export default MainSection;
