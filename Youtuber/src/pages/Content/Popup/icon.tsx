import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PopupIn from './popup';
import 'arrive';

const Icon: React.FC = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleIconClick = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom,
        left: rect.right - 750,
      });
    }
    setIsPopup((prev) => !prev);
  };

  return (
    <div
      className="icon-container"
      ref={iconRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <img
        src={chrome.runtime.getURL('channel.png')}
        alt="Youtube Extension Icon"
        style={{ width: '24px', height: '24px', display: 'block' }}
        onClick={handleIconClick}
      />
      {isPopup && <PopupIn position={popupPosition} />}
    </div>
  );
};

export const injectIcon = async () => {
  (document as any).arrive(
    'ytd-notification-topbar-button-renderer',
    (targetContainer: Element) => {
      const buttons = document.querySelector('ytd-masthead #end #buttons');
      if (!buttons) return;
      if (document.querySelector('#my-extension-icon')) return;

      const iconContainer = document.createElement('div');
      iconContainer.id = 'my-extension-icon';
      iconContainer.style.display = 'inline-block';
      iconContainer.style.marginRight = '12px';
      iconContainer.style.marginLeft = '12px';

      buttons.insertBefore(iconContainer, targetContainer);
      ReactDOM.render(<Icon />, iconContainer);
    }
  );
};

export default Icon;