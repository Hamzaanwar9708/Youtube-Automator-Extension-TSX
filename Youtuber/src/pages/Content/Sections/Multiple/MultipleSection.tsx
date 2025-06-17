import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import LinkList, { LinkItem } from '../List/ListSection';

type ProcessedLink = {
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
};

let _lastTs = 0;
let _counter = 0;
export const generateRandomId = (): number => {
  const now = Date.now();
  if (now === _lastTs) _counter++;
  else {
    _lastTs = now;
    _counter = 0;
  }
  return now * 1000 + _counter;
};

function getVideoId(href: string): string | null {
  try {
    const u = new URL(href, window.location.href);
    const v = u.searchParams.get('v');
    if (v && /^[\w-]{11}$/.test(v)) return v;
    if (u.hostname === 'youtu.be' && /^[\w-]{11}$/.test(u.pathname.slice(1)))
      return u.pathname.slice(1);
    return null;
  } catch {
    return null;
  }
}

async function checkVideoExists(videoUrl: string): Promise<boolean> {
  try {
    const oembedUrl =
      'https://www.youtube.com/oembed?format=json&url=' +
      encodeURIComponent(videoUrl);
    const res = await fetch(oembedUrl);
    return res.ok;
  } catch {
    return false;
  }
}

const STORAGE_KEYS = {
  MAIN: 'mainMultipleLinks',
  RANGE: 'rangeMultipleLinks',
  PROCESSED: 'processedLinks',
};

interface MultipleSectionProps {
  onSectionChange: (section: number) => void;
}

const MultipleSection: React.FC<MultipleSectionProps> = ({
  onSectionChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mainMultipleLinks, setMainMultipleLinks] = useState<LinkItem[]>([]);
  const [rangeMultipleLinks, setRangeMultipleLinks] = useState<LinkItem[]>([]);
  const [processedLinks, setProcessedLinks] = useState<ProcessedLink[]>([]);
  const [activeList, setActiveList] = useState<'main' | 'range'>('main');

  const currentLinks = useMemo(
    () => (activeList === 'main' ? mainMultipleLinks : rangeMultipleLinks),
    [activeList, mainMultipleLinks, rangeMultipleLinks]
  );

  useEffect(() => {
    chrome.storage.local.get(
      [STORAGE_KEYS.MAIN, STORAGE_KEYS.RANGE, STORAGE_KEYS.PROCESSED],
      (result) => {
        const pm: ProcessedLink[] = result[STORAGE_KEYS.PROCESSED] ?? [];
        setProcessedLinks(pm);

        const main: LinkItem[] = (result[STORAGE_KEYS.MAIN] ?? []).map(
          (item: LinkItem) => {
            const mem = pm.find(
              (p) => getVideoId(p.link) === getVideoId(item.link)
            );
            return {
              ...item,
              subscribed: mem?.subscribed || false,
              liked: mem?.liked || false,
              commented: mem?.commented || false,
            };
          }
        );
        const range: LinkItem[] = (result[STORAGE_KEYS.RANGE] ?? []).map(
          (item: LinkItem) => {
            const mem = pm.find(
              (p) => getVideoId(p.link) === getVideoId(item.link)
            );
            return {
              ...item,
              subscribed: mem?.subscribed || false,
              liked: mem?.liked || false,
              commented: mem?.commented || false,
            };
          }
        );
        setMainMultipleLinks(main);
        setRangeMultipleLinks(range);
      }
    );

    const onProcessedChange = (
      changes: { [k: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'local' && changes[STORAGE_KEYS.PROCESSED]) {
        const pm: ProcessedLink[] =
          changes[STORAGE_KEYS.PROCESSED].newValue ?? [];
        setProcessedLinks(pm);

        setMainMultipleLinks((prev) =>
          prev.map((item) => {
            const mem = pm.find(
              (p) => getVideoId(p.link) === getVideoId(item.link)
            );
            return {
              ...item,
              subscribed: mem?.subscribed || false,
              liked: mem?.liked || false,
              commented: mem?.commented || false,
            };
          })
        );
        setRangeMultipleLinks((prev) =>
          prev.map((item) => {
            const mem = pm.find(
              (p) => getVideoId(p.link) === getVideoId(item.link)
            );
            return {
              ...item,
              subscribed: mem?.subscribed || false,
              liked: mem?.liked || false,
              commented: mem?.commented || false,
            };
          })
        );
      }
    };

    chrome.storage.onChanged.addListener(onProcessedChange);
    return () => chrome.storage.onChanged.removeListener(onProcessedChange);
  }, []);

  useEffect(() => {
    const onRangeChange = (
      changes: { [k: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === 'local' && changes[STORAGE_KEYS.RANGE]) {
        const updatedRange = (changes[STORAGE_KEYS.RANGE].newValue ||
          []) as LinkItem[];
        setRangeMultipleLinks(updatedRange);
      }
    };
    chrome.storage.onChanged.addListener(onRangeChange);
    return () => chrome.storage.onChanged.removeListener(onRangeChange);
  }, []);

  const handleAdd = async () => {
    const url = inputRef.current?.value.trim() || '';
    if (!url) {
      alert('Please enter a link.');
      return;
    }

    const videoId = getVideoId(url);

    if (!videoId || videoId.length !== 11) {
      alert(
        'Please enter a valid YouTube video link that points to an actual video.'
      );
      inputRef.current!.value = '';
      return;
    }

    const exists = await checkVideoExists(url);
    if (!exists) {
      alert('That video doesn’t exist or is not embeddable/public.');
      inputRef.current!.value = '';
      return;
    }

    if (mainMultipleLinks.some((item) => getVideoId(item.link) === videoId)) {
      alert('This link already exists in the main list.');
      inputRef.current!.value = '';
      return;
    }
    const mem = processedLinks.find(
      (p) => getVideoId(p.link) === getVideoId(url)
    );
    const newLink: LinkItem = {
      id: generateRandomId(),
      link: url,
      subscribed: mem?.subscribed || false,
      liked: mem?.liked || false,
      commented: mem?.commented || false,
    };
    const updatedMain = [...mainMultipleLinks, newLink];
    setMainMultipleLinks(updatedMain);
    chrome.storage.local.set({ [STORAGE_KEYS.MAIN]: updatedMain });
    inputRef.current!.value = '';
  };

  const handleRemove = (id: number) => {
    if (activeList === 'main') {
      const updated = mainMultipleLinks.filter((i) => i.id !== id);
      setMainMultipleLinks(updated);
      chrome.storage.local.set({ [STORAGE_KEYS.MAIN]: updated });
    } else {
      const updated = rangeMultipleLinks.filter((i) => i.id !== id);
      setRangeMultipleLinks(updated);
      chrome.storage.local.set({ [STORAGE_KEYS.RANGE]: updated });
    }
  };

  return (
    <div className="multiple-section">
      <div style={{ ...initialStyle(), marginTop: '5px' }}>
        <div style={multipleSectionInputWrapperStyle}>
          <input
            ref={inputRef}
            id="multiple-input"
            type="text"
            style={multipleSectionInputStyle}
            placeholder="Enter Link Here"
          />
        </div>
        <div style={multipleSectionAddButtonWrapperStyle}>
          <Button
            btnId="add-btn1"
            onClick={handleAdd}
            customStyle={multipleSectionAddButtonStyle}
          >
            ADD
          </Button>
        </div>
      </div>

      <div style={{ ...initialStyle(), ...multipleSectionButtonRowStyle }}>
        <Button
          btnId="mainlist-btn1"
          onClick={() => setActiveList('main')}
          customStyle={multipleSectionActionButtonStyle}
        >
          Main List
        </Button>
        <Button
          btnId="start-btn1"
          onClick={() => btnClicked('StartAutomationMultiple')}
          customStyle={multipleSectionActionButtonStyle}
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
          btnId="rangelist-btn1"
          onClick={() => setActiveList('range')}
          customStyle={multipleSectionActionButtonStyle}
        >
          Range List
        </Button>
      </div>

      <LinkList links={currentLinks} onRemove={handleRemove} />
    </div>
  );
};

export default MultipleSection;