import React from 'react';
import { initialStyle } from '../../styles';
import Button, { btnClicked } from '../../button';

interface SingleSectionProps {
  onSectionChange: (section: number) => void;
}

const SingleSection: React.FC<SingleSectionProps> = ({ onSectionChange }) => {
  return (
    <div className="single-section">
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <Button
          btnId="subscribe-btn"
          onClick={() => btnClicked('Subscribe')}
          customStyle={{ width: '180px' }}
        >
          Subscribe
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <Button
          btnId="like-btn"
          onClick={() => btnClicked('Like')}
          customStyle={{ width: '180px' }}
        >
          Like
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <Button
          btnId="comment-btn"
          onClick={() => btnClicked('Comment')}
          customStyle={{ width: '180px' }}
        >
          Comment
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <Button
          btnId="slc-btn"
          onClick={() => btnClicked('SLC')}
          customStyle={{ width: '180px' }}
        >
          S.L.C
        </Button>
      </div>
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <Button
          btnId="back-btn"
          onClick={() => onSectionChange(0)}
          customStyle={{ width: '180px' }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default SingleSection;