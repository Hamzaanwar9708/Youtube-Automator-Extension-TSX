import React, { useState } from 'react';
import {
  initialStyle,
  multipleSectionInputWrapperStyle,
  multipleSectionInputStyle,
  multipleSectionAddButtonWrapperStyle,
  multipleSectionAddButtonStyle,
  multipleSectionButtonRowStyle,
  multipleSectionActionButtonStyle,
} from '../../styles';
import Button, { btnClicked } from '../../button';
import UnifiedModal from '../../Modals/FinalModal';

interface ChannelSectionProps {
  onSectionChange: (section: number) => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ onSectionChange }) => {
  const [channelName, setChannelName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showRangeModal, setShowRangeModal] = useState<boolean>(false);

  const handleSearch = () => {
    const name = channelName.trim();

    if (!name) {
      setError('Please enter a channel name.');
      return;
    }

    const urlPattern = /^(https?:\/\/|www\.|.+\..+\/)/i;
    if (urlPattern.test(name)) {
      setError('Please enter only the channel name, not a URL.');
      return;
    }

    const validNamePattern = /^[\w\s-]+$/;
    if (!validNamePattern.test(name)) {
      setError(
        'Channel names may only contain letters, numbers, spaces, dashes or underscores.'
      );
      return;
    }

    setError('');
    btnClicked('SearchChannel');
    chrome.storage.local.set({ ytdChannel: name }, () => {
      console.log('ytdChannel saved:', name);
    });
  };

  return (
    <div className="channel-section">
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <div style={multipleSectionInputWrapperStyle}>
          <input
            id="channel-input"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            style={multipleSectionInputStyle}
            placeholder="Enter channel Name"
          />
          {error && (
            <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
              {error}
            </div>
          )}
        </div>
        <div style={multipleSectionAddButtonWrapperStyle}>
          <Button
            btnId="search-btn"
            customStyle={multipleSectionAddButtonStyle}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
      <div style={{ ...initialStyle(), ...multipleSectionButtonRowStyle }}>
        <Button
          btnId="Channel-Range-btn"
          customStyle={multipleSectionActionButtonStyle}
          onClick={() => {
            btnClicked('Channelrange');
            setShowRangeModal(true);
          }}
        >
          Range
        </Button>
        <Button
          btnId="back-btn"
          customStyle={multipleSectionActionButtonStyle}
          onClick={() => onSectionChange(0)}
        >
          Back
        </Button>
      </div>
      {showRangeModal && (
        <UnifiedModal
          mode="channel-range"
          onClose={() => setShowRangeModal(false)}
        />
      )}
    </div>
  );
};

export default ChannelSection;
