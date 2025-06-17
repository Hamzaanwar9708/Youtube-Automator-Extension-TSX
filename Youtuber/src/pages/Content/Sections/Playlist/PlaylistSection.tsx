import React, { useState, useEffect } from 'react';
import {
  initialStyle,
  multipleSectionAddButtonStyle,
  multipleSectionInputStyle,
  multipleSectionActionButtonStyle,
} from '../../styles';
import Button, { btnClicked } from '../../button';
import LinkList, { LinkItem } from '../List/ListSection';
import UnifiedModal, { PlaylistOption } from '../../Modals/FinalModal';
import { generateRandomId } from '../Multiple/MultipleSection';

interface ProcessedLink {
  id: number;
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
}

const STORAGE_KEY = 'playlistArray';
const RANGE_KEY = 'playlistRangeLinks';
const PROCESSED_KEY = 'playlistProcessedLinks';
const MEMORY_KEY = 'processedLinks';

interface PlaylistSectionProps {
  onSectionChange: (section: number) => void;
}

const PlayListSection: React.FC<PlaylistSectionProps> = ({
  onSectionChange,
}) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [playlistOptions, setPlaylistOptions] = useState<PlaylistOption[]>([]);
  const [playlistProcessedLinks, setPlaylistProcessedLinks] = useState<
    ProcessedLink[]
  >([]);
  const [modalMode, setModalMode] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<PlaylistOption | null>(
    null
  );

  const mergeFlags = (raw: LinkItem[], processed: ProcessedLink[]) =>
    raw.map((l) => {
      const mem = processed.find((p) => p.link === l.link);
      return {
        ...l,
        subscribed: mem?.subscribed ?? l.subscribed,
        liked: mem?.liked ?? l.liked,
        commented: mem?.commented ?? l.commented,
      };
    });

  function getPlaylistId(href: string): string | null {
    try {
      const u = new URL(href.trim(), window.location.href);
      const list = u.searchParams.get('list');
      if (list && list.length > 0) return list;
      return null;
    } catch {
      return null;
    }
  }

  function makePlaylistUrl(listId: string): string {
    return `https://www.youtube.com/playlist?list=${listId}`;
  }

  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEY, PROCESSED_KEY, RANGE_KEY, MEMORY_KEY],
      (result) => {
        setPlaylistOptions(result[STORAGE_KEY] ?? []);

        const playlistArr: ProcessedLink[] = result[PROCESSED_KEY] ?? [];
        const memArr: ProcessedLink[] = result[MEMORY_KEY] ?? [];

        const merged = playlistArr.map((item) => {
          const mem = memArr.find((p) => p.link === item.link);
          return {
            ...item,
            subscribed: mem?.subscribed ?? item.subscribed,
            liked: mem?.liked ?? item.liked,
            commented: mem?.commented ?? item.commented,
          };
        });

        setPlaylistProcessedLinks(merged);
        setLinks(merged);
        chrome.storage.local.set({ [PROCESSED_KEY]: merged });
      }
    );

    const onMemoryChange = (
      changes: { [k: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'local' && changes[MEMORY_KEY]) {
        const memArr: ProcessedLink[] = changes[MEMORY_KEY].newValue || [];

        setPlaylistProcessedLinks((prev) =>
          prev.map((item) => {
            const mem = memArr.find((p) => p.link === item.link);
            return {
              ...item,
              subscribed: mem?.subscribed ?? item.subscribed,
              liked: mem?.liked ?? item.liked,
              commented: mem?.commented ?? item.commented,
            };
          })
        );
        setLinks((prev) => mergeFlags(prev, memArr));
      }
    };

    chrome.storage.onChanged.addListener(onMemoryChange);
    return () => chrome.storage.onChanged.removeListener(onMemoryChange);
  }, []);

  useEffect(() => {
    const onRangeChange = (
      changes: { [k: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'local' && changes[RANGE_KEY]) {
        const raw: LinkItem[] = changes[RANGE_KEY].newValue || [];
        chrome.storage.local.get(PROCESSED_KEY, (res) => {
          const processed: ProcessedLink[] = res[PROCESSED_KEY] || [];
          setLinks(mergeFlags(raw, processed));
        });
      }
    };

    chrome.storage.onChanged.addListener(onRangeChange);
    return () => chrome.storage.onChanged.removeListener(onRangeChange);
  }, []);

  const handleRemove = (id: number) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    chrome.storage.local.set({ [RANGE_KEY]: updated });
  };

  const openAddModal = () => {
    btnClicked('AddPlaylist');
    setModalMode('playlist-add');
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const link = e.target.value;
    if (!link) return;
    const opt = playlistOptions.find((p) => p.link === link) || null;
    setSelectedOption(opt);
    setModalMode('playlist-dropdown');
  };

  const fetchPlaylistVideos = async (playlistLink: string) => {
    try {
      const resp = await fetch(playlistLink);
      const html = await resp.text();
      const ids: string[] = [];
      const re = /"videoId":"(.*?)"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html))) if (!ids.includes(m[1])) ids.push(m[1]);
      if (!ids.length) return alert('No video IDs found.');

      const newProcessed: ProcessedLink[] = Array.from(new Set(ids)).map(
        (id) => ({
          id: generateRandomId(),
          link: `https://www.youtube.com/watch?v=${id}`,
          subscribed: false,
          liked: false,
          commented: false,
        })
      );

      setPlaylistProcessedLinks(newProcessed);
      setLinks(newProcessed);
      chrome.storage.local.set({
        [PROCESSED_KEY]: newProcessed,
        [RANGE_KEY]: newProcessed,
      });
      setModalMode(null);
    } catch (err) {
      alert('Error fetching playlist: ' + err);
    }
  };

  const handleAddPlaylist = async (rawUrl: string, name: string) => {
    const listId = getPlaylistId(rawUrl);
    if (!listId) {
      alert(
        'Please enter a valid YouTube playlist link (either /playlist?list=... or a watch?v=...&list=... URL).'
      );
      return;
    }

    const normalizedLink = makePlaylistUrl(listId);

    if (playlistOptions.some((opt) => getPlaylistId(opt.link) === listId)) {
      alert('This playlist is already in your list.');
      return;
    }

    try {
      const resp = await fetch(normalizedLink);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();

      const hasVideos = /"videoId":"[\w-]{11}"/.test(html);
      if (!hasVideos) {
        alert('Playlist not found or contains no public videos.');
        return;
      }
    } catch (err: any) {
      alert('Could not verify playlist existence: ' + err.message);
      return;
    }

    const id = Date.now();
    const newOption: PlaylistOption = {
      id,
      name,
      link: normalizedLink,
    };

    const updatedOptions = [...playlistOptions, newOption];
    setPlaylistOptions(updatedOptions);
    chrome.storage.local.set({ [STORAGE_KEY]: updatedOptions });
    setModalMode(null);
  };

  const handleDelete = () => {
    if (selectedOption) {
      const updated = playlistOptions.filter((p) => p.id !== selectedOption.id);
      setPlaylistOptions(updated);
      chrome.storage.local.set({ [STORAGE_KEY]: updated });
      setPlaylistProcessedLinks([]);
      setLinks([]);
      chrome.storage.local.remove(PROCESSED_KEY);
    }
    setModalMode(null);
  };

  return (
    <div className="multiple-section">
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <div style={{ width: '120px' }}>
          <Button
            btnId="add-btn2"
            customStyle={multipleSectionAddButtonStyle}
            onClick={openAddModal}
          >
            ADD
          </Button>
        </div>
        <div style={{ width: '420px' }}>
          <select
            id="playlist-dropdown"
            style={multipleSectionInputStyle}
            value=""
            onChange={handleSelect}
          >
            <option value="">Select Playlist</option>
            {playlistOptions.map((opt) => (
              <option key={opt.id} value={opt.link}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          ...initialStyle(),
          maxWidth: '95%',
          marginTop: '2.5px',
          justifyContent: 'space-evenly',
        }}
      >
        <Button
          btnId="mainlist-btn2"
          customStyle={multipleSectionActionButtonStyle}
          onClick={() => {
            chrome.storage.local.get(PROCESSED_KEY, (r) => {
              const processed: ProcessedLink[] = r[PROCESSED_KEY] || [];
              setLinks(mergeFlags(processed, processed));
            });
          }}
        >
          Main List
        </Button>

        <Button
          btnId="start-btn2"
          customStyle={multipleSectionActionButtonStyle}
          onClick={() => btnClicked('StartAutomationPlaylist')}
        >
          Start
        </Button>
        <Button
          btnId="back-btn"
          onClick={() => onSectionChange(0)}
          customStyle={multipleSectionActionButtonStyle}
        >
          Back
        </Button>
        <Button
          btnId="rangelist-btn2"
          customStyle={multipleSectionActionButtonStyle}
          onClick={() => {
            chrome.storage.local.get([RANGE_KEY, PROCESSED_KEY], (res) => {
              const raw: LinkItem[] = res[RANGE_KEY] || [];
              const processed: ProcessedLink[] = res[PROCESSED_KEY] || [];
              setLinks(mergeFlags(raw, processed));
            });
          }}
        >
          Range List
        </Button>
      </div>

      <LinkList links={links} onRemove={handleRemove} />

      {modalMode && (
        <UnifiedModal
          mode={modalMode as any}
          existingPlaylists={playlistOptions}
          onClose={() => setModalMode(null)}
          onAddPlaylist={handleAddPlaylist}
          onProcess={() =>
            selectedOption && fetchPlaylistVideos(selectedOption.link)
          }
          onCancel={() => setModalMode(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PlayListSection;