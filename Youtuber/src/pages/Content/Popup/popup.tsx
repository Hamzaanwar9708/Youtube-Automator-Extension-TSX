import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

import Mainsection from '../Sections/Main/MainSection';
import SingleSection from '../Sections/Single/SingleSection';
import MultipleSection from '../Sections/Multiple/MultipleSection';
import PlaylistSection from '../Sections/Playlist/PlaylistSection';
import ChannelSection from '../Sections/Channel/ChannelSection';
import FilterSection from '../Sections/filter/FilterSection';

import {
  closeButtonStyle,
  popupMainContainerStyle,
  popupInjectContainerStyle,
  popupContainerStyle,
  popupHeaderStyle,
  popupTitleStyle,
  popupButtonStyle,
  popupImgStyle,
} from '../styles';

import Button from '../button';

interface PopupInjectProps {
  position: { top: number; left: number };
}

interface PopupProps {
  onClose: () => void;
}

interface PopupUIProps {
  title?: string;
  children?: React.ReactNode;
  onSectionChange?: (section: number) => void;
  currentSection?: number;
}

const PopupUI: React.FC<PopupUIProps> = ({
  title,
  children,
  onSectionChange,
  currentSection,
}) => {
  const showRangeButton = currentSection === 2 || currentSection === 3;

  return (
    <div className="popup-ui" style={popupContainerStyle}>
      <div className="popup-h1" style={popupHeaderStyle}>
        <h1 id="popup-h1" style={popupTitleStyle}>
          {title}
        </h1>
        {showRangeButton && (
          <Button
            btnId="range-btn"
            onClick={() => onSectionChange?.(5)}
            customStyle={popupButtonStyle(null)}
          >
            <img
              src={chrome.runtime.getURL('filter2.png')}
              alt="filter icon"
              style={popupImgStyle}
            />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const [section, setSection] = useState(0);
  const [previousSection, setPreviousSection] = useState<number | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['activeSection'], (result) => {
      if (typeof result.activeSection === 'number') {
        setSection(result.activeSection);
      }
    });
  }, []);

  const handleSectionChange = (
    newSection: number,
    rememberPrevious: boolean = true
  ) => {
    if (rememberPrevious) {
      setPreviousSection(section);
    }
    setSection(newSection);
    chrome.storage.local.set({ activeSection: newSection });
  };

  const goToPreviousSection = () => {
    if (previousSection !== null) {
      setSection(previousSection);
      chrome.storage.local.set({ activeSection: previousSection });
    } else {
      setSection(0);
      chrome.storage.local.set({ activeSection: 0 });
    }
  };

  return (
    <div className="popup-container" style={popupMainContainerStyle}>
      <button
        style={closeButtonStyle}
        onClick={onClose}
        aria-label="Close popup"
      >
        &times;
      </button>
      <PopupUI
        title="Youtuber"
        onSectionChange={handleSectionChange}
        currentSection={section}
      >
        {section === 0 && <Mainsection onSectionChange={handleSectionChange} />}
        {section === 1 && (
          <SingleSection onSectionChange={handleSectionChange} />
        )}
        {section === 2 && (
          <MultipleSection onSectionChange={handleSectionChange} />
        )}
        {section === 3 && (
          <PlaylistSection onSectionChange={handleSectionChange} />
        )}
        {section === 4 && (
          <ChannelSection onSectionChange={handleSectionChange} />
        )}
        {section === 5 && (
          <FilterSection
            onSectionChange={handleSectionChange}
            goBack={goToPreviousSection}
            rememberPrevious={previousSection ?? 0}
          />
        )}
      </PopupUI>
    </div>
  );
};

const PopupInject: React.FC<PopupInjectProps> = ({ position }) => {
  const [isVisible, setIsVisible] = useState(true);

  const modalRoot = useMemo(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    return root;
  }, []);

  const style = popupInjectContainerStyle(position.top, position.left);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div style={style}>
      <Popup onClose={() => setIsVisible(false)} />
    </div>,
    modalRoot
  );
};

export default PopupInject;