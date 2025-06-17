import React, { useState, useEffect } from 'react';
import Button from '../button';
import {
  modalOverlayStyle,
  modalContainerStyle,
  modalTitleStyle,
  modalMessageStyle,
  filterInputStyle,
  modalButtonStyle,
  closeButtonStyle,
} from '../styles';

export type ModalMode =
  | 'filter-error'
  | 'channel-range'
  | 'playlist-add'
  | 'playlist-dropdown';

export interface PlaylistOption {
  id: number;
  name: string;
  link: string;
}

export interface UnifiedModalProps {
  mode: ModalMode;
  onClose: () => void;
  message?: string;
  existingPlaylists?: PlaylistOption[];
  onAddPlaylist?: (playlist: string, name: string) => void;
  onProcess?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

interface ChannelRangeObj {
  min: number;
  max: number;
}

const STORAGE_KEY = 'channelRangeObj';

const UnifiedModal: React.FC<UnifiedModalProps> = ({
  mode,
  onClose,
  message,
  existingPlaylists = [],
  onAddPlaylist,
  onProcess,
  onCancel,
  onDelete,
}) => {
  const [minValue, setMinValue] = useState('1');
  const [maxValue, setMaxValue] = useState('10');
  const [error, setError] = useState('');
  const [playlistInput, setPlaylistInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (mode !== 'channel-range') return;
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const stored = result[STORAGE_KEY] as ChannelRangeObj;
      setMinValue(String(stored.min));
      setMaxValue(String(stored.max));
    });
  }, [mode]);

  const handleApply = () => {
    const min = Number(minValue);
    const max = Number(maxValue);
    if (isNaN(min) || isNaN(max) || min === 0 || max === 0) {
      setError('Values must be numeric and not equal to 0.');
      return;
    }

    const channelRangeObj: ChannelRangeObj = { min, max };
    chrome.storage.local.set({ [STORAGE_KEY]: channelRangeObj }, () => {
      onClose();
    });
  };

  const isValidYoutubePlaylist = (link: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?youtube\.com\/(playlist\?list=|watch\?v=[^&]+&list=)[\w-]+(&.*)?$/;
    return regex.test(link);
  };

  const handleAddClick = () => {
    if (!isValidYoutubePlaylist(playlistInput)) {
      setError('Invalid YouTube playlist link.');
      return;
    }
    if (existingPlaylists.some((p) => p.link === playlistInput)) {
      setError('Playlist link already exists.');
      return;
    }
    if (existingPlaylists.some((p) => p.name === nameInput)) {
      setError('Playlist name already exists.');
      return;
    }
    onAddPlaylist?.(playlistInput, nameInput);
    onClose();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContainerStyle, position: 'relative' }}>
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>

        {mode === 'filter-error' && (
          <>
            <h3 style={modalTitleStyle}>Validation Error</h3>
            <p style={modalMessageStyle}>{message}</p>
            <Button
              btnId="dismiss"
              customStyle={modalButtonStyle}
              onClick={onClose}
            >
              Dismiss
            </Button>
          </>
        )}

        {mode === 'channel-range' && (
          <>
            <h2 style={modalTitleStyle}>Video Range</h2>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                style={{ ...filterInputStyle, marginRight: '10px' }}
              />
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                style={filterInputStyle}
              />
            </div>
            <Button
              btnId="apply-range"
              customStyle={modalButtonStyle}
              onClick={handleApply}
            >
              Apply
            </Button>
            {error && (
              <UnifiedModal
                mode="filter-error"
                message={error}
                onClose={() => setError('')}
              />
            )}
          </>
        )}

        {mode === 'playlist-add' && (
          <>
            <h2 style={modalTitleStyle}>Add Playlist</h2>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Playlist
              </label>
              <input
                type="text"
                value={playlistInput}
                onChange={(e) => setPlaylistInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <Button
              btnId="add-playlist"
              customStyle={modalButtonStyle}
              onClick={handleAddClick}
            >
              Add Playlist
            </Button>
            {error && (
              <UnifiedModal
                mode="filter-error"
                message={error}
                onClose={() => setError('')}
              />
            )}
          </>
        )}

        {mode === 'playlist-dropdown' && (
          <>
            <h2 style={modalTitleStyle}>Operation</h2>
            <Button
              btnId="process"
              customStyle={{
                ...modalButtonStyle,
                marginBottom: '8px',
                width: '100%',
              }}
              onClick={onProcess}
            >
              Process
            </Button>
            <Button
              btnId="cancel"
              customStyle={{
                ...modalButtonStyle,
                marginBottom: '8px',
                width: '100%',
              }}
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              btnId="delete"
              customStyle={{ width: '100%' }}
              onClick={onDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedModal;
