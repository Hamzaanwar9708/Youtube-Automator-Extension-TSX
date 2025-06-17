import React, { useState } from 'react';
import { baseStyle } from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnId: string;
  customStyle?: React.CSSProperties;
}

export const btnClicked = (message: string) => {
  chrome.runtime.sendMessage({ action: message });
};

const Button: React.FC<ButtonProps> = ({
  btnId,
  customStyle,
  children,
  onClick,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleMouseEnter = () => setIsHovered(btnId);
  const handleMouseLeave = () => setIsHovered(null);

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...baseStyle(btnId, isHovered), ...customStyle }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;