import React, { useState, useEffect } from 'react';
import {
  filterSectionStyle,
  filterGroupStyle,
  filterLabelStyle,
  filterInputStyle,
  filterButtonContainerStyle,
} from '../../styles';
import Button from '../../button';
import UnifiedModal from '../../Modals/FinalModal';

interface FilterSectionProps {
  onSectionChange: (section: number, rememberPrevious?: boolean) => void;
  goBack: () => void;
  rememberPrevious: number;
}

interface LinkItem {
  id: number;
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
}

const MULTIPLE_KEYS = {
  MAIN: 'mainMultipleLinks',
  RANGE: 'rangeMultipleLinks',
  ACTION: 'multipleActionLinks',
};

const PLAYLIST_KEYS = {
  PROCESSED: 'playlistProcessedLinks',
  RANGE: 'playlistRangeLinks',
  ACTION: 'playlistActionLinks',
};

const FilterSection: React.FC<FilterSectionProps> = ({
  onSectionChange,
  goBack,
  rememberPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentErrorKey, setCurrentErrorKey] = useState<string | null>(null);
  const [availableLinks, setAvailableLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    if (rememberPrevious === 2) {
      chrome.storage.local.get([MULTIPLE_KEYS.MAIN], (result) => {
        setAvailableLinks(result[MULTIPLE_KEYS.MAIN] ?? []);
      });
    } else if (rememberPrevious === 3) {
      chrome.storage.local.get([PLAYLIST_KEYS.PROCESSED], (result) => {
        setAvailableLinks(result[PLAYLIST_KEYS.PROCESSED] ?? []);
      });
    }
  }, [rememberPrevious]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const mainMin =
      Number(
        (document.getElementById('main-min') as HTMLInputElement)?.value
      ) || 0;
    const mainMax =
      Number(
        (document.getElementById('main-max') as HTMLInputElement)?.value
      ) || 0;
    const ranges = ['subscribe', 'like', 'comment'];

    const minAllowed = availableLinks.length > 0 ? 1 : 0;
    const maxAllowed = availableLinks.length;

    if (mainMin > mainMax) {
      newErrors['main'] = 'Minimum value cannot exceed maximum value.';
    } else if (mainMin < minAllowed) {
      newErrors['main'] = `Minimum value cannot be less than ${minAllowed}.`;
    } else if (mainMax > maxAllowed) {
      newErrors['main'] = `Maximum value cannot exceed ${maxAllowed}.`;
    }

    ranges.forEach((range) => {
      const rawMin = (
        document.getElementById(`${range}-min`) as HTMLInputElement
      )?.value.trim();
      const rawMax = (
        document.getElementById(`${range}-max`) as HTMLInputElement
      )?.value.trim();

      const min = rawMin !== '' ? Number(rawMin) : null;
      const max = rawMax !== '' ? Number(rawMax) : null;

      if (min !== null && max !== null && min > max) {
        newErrors[range] = 'Minimum value cannot exceed maximum value.';
      } else if (min !== null && min < mainMin) {
        newErrors[range] = 'Minimum must be at least the main range minimum.';
      } else if (min !== null && min > mainMax) {
        newErrors[range] = 'Minimum cannot exceed the main range maximum.';
      } else if (max !== null && max < mainMin) {
        newErrors[range] = 'Maximum must be at least the main range minimum.';
      } else if (max !== null && max > mainMax) {
        newErrors[range] = 'Maximum cannot exceed the main range maximum.';
      }
    });

    setErrors(newErrors);
    const firstKey = Object.keys(newErrors)[0] || null;
    if (firstKey) {
      setCurrentErrorKey(firstKey);
      return false;
    }

    return true;
  };

  const getInputStyle = (key: string) => ({
    ...filterInputStyle,
    border: errors[key] ? '2px solid red' : undefined,
  });

  const handleSubmit = async () => {
    if (!validate()) return;

    const mainMin = Number(
      (document.getElementById('main-min') as HTMLInputElement)?.value
    );
    const mainMax = Number(
      (document.getElementById('main-max') as HTMLInputElement)?.value
    );
    const subscribeMin = Number(
      (document.getElementById('subscribe-min') as HTMLInputElement)?.value
    );
    const subscribeMax = Number(
      (document.getElementById('subscribe-max') as HTMLInputElement)?.value
    );
    const likeMin = Number(
      (document.getElementById('like-min') as HTMLInputElement)?.value
    );
    const likeMax = Number(
      (document.getElementById('like-max') as HTMLInputElement)?.value
    );
    const commentMin = Number(
      (document.getElementById('comment-min') as HTMLInputElement)?.value
    );
    const commentMax = Number(
      (document.getElementById('comment-max') as HTMLInputElement)?.value
    );

    const adjustedMainMin = mainMin - 1;
    const adjustedMainMax = mainMax;

    const rangeLinks = availableLinks.slice(adjustedMainMin, adjustedMainMax);
    const subscribeLinks = availableLinks.slice(subscribeMin - 1, subscribeMax);
    const likeLinks = availableLinks.slice(likeMin - 1, likeMax);
    const commentLinks = availableLinks.slice(commentMin - 1, commentMax);

    const actionLinks = {
      subscribe: subscribeLinks,
      like: likeLinks,
      comment: commentLinks,
    };

    const storageItems: Record<string, any> = {};
    if (rememberPrevious === 2) {
      storageItems[MULTIPLE_KEYS.RANGE] = rangeLinks;
      storageItems[MULTIPLE_KEYS.ACTION] = actionLinks;
    } else if (rememberPrevious === 3) {
      storageItems[PLAYLIST_KEYS.RANGE] = rangeLinks;
      storageItems[PLAYLIST_KEYS.ACTION] = actionLinks;
    }

    await chrome.storage.local.set(storageItems);
    goBack();
  };

  return (
    <div className="filter-section" style={filterSectionStyle}>
      <div id="link-count">
        <p>
          Links Count:{' '}
          {availableLinks.length > 0
            ? `1 to ${availableLinks.length}`
            : `0 to ${availableLinks.length}`}
        </p>
      </div>

      <div id="main-range" style={filterGroupStyle}>
        <p style={filterLabelStyle}>Main</p>
        <input type="number" id="main-min" style={getInputStyle('main')} />
        <input type="number" id="main-max" style={getInputStyle('main')} />
      </div>

      {['subscribe', 'like', 'comment'].map((range) => (
        <div key={range} id={`${range}-range`} style={filterGroupStyle}>
          <p style={filterLabelStyle}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </p>
          <input
            type="number"
            id={`${range}-min`}
            style={getInputStyle(range)}
          />
          <input
            type="number"
            id={`${range}-max`}
            style={getInputStyle(range)}
          />
        </div>
      ))}

      <div id="range-btn" style={filterButtonContainerStyle}>
        <Button
          btnId="submit-btn"
          onClick={handleSubmit}
          customStyle={{
            width: '140px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Submit
        </Button>
        <Button
          btnId="back-btn"
          onClick={goBack}
          customStyle={{
            width: '140px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Back
        </Button>
      </div>

      {currentErrorKey && (
        <UnifiedModal
          mode="filter-error"
          message={errors[currentErrorKey]!}
          onClose={() => setCurrentErrorKey(null)}
        />
      )}
    </div>
  );
};

export default FilterSection;
