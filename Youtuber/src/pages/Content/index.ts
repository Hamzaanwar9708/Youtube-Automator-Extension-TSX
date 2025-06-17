import { injectIcon } from './Popup/icon';
import { generateRandomId } from '../Content/Sections/Multiple/MultipleSection';

injectIcon();

export type ProcessedLink = {
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
};

async function getCheckLink(): Promise<string | null> {
  return new Promise((res) =>
    chrome.storage.local.get('check', (d) => res(d.check || null))
  );
}

function getVideoId(href: string): string | null {
  try {
    const u = new URL(href, window.location.href);
    const v = u.searchParams.get('v');
    if (v && v.length === 11) return v;
    if (u.hostname === 'youtu.be' && u.pathname.length === 12)
      return u.pathname.slice(1);
    return null;
  } catch {
    return null;
  }
}

let processedLinksMemory: ProcessedLink[] = [];
chrome.storage.local.get('processedLinks', (d) => {
  processedLinksMemory = d.processedLinks || [];
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function showCompletedModal(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    const container = document.createElement('div');
    container.classList.add('modal-container');

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.classList.add('modal-close-btn');

    const title = document.createElement('h2');
    title.innerText = '🎉 Task Completed!';
    title.classList.add('modal-title');

    const message = document.createElement('p');
    message.innerText = 'Your task was successfully completed.';
    message.classList.add('modal-message');

    const ok = document.createElement('button');
    ok.innerText = 'OK';
    ok.classList.add('modal-ok-btn');

    container.append(closeBtn, title, message, ok);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
      chrome.runtime.sendMessage({ action: 'completedModalClosed' });
      resolve();
    };

    closeBtn.addEventListener('click', cleanup);
    ok.addEventListener('click', cleanup);
  });
}

async function findProcessedLink(
  link: string,
  field: 'subscribed' | 'liked' | 'commented'
) {
  const vid = getVideoId(link);
  if (!vid) return;
  let obj = processedLinksMemory.find((i) => getVideoId(i.link) === vid);
  const { channellinkLists = [] } = await new Promise<{
    channellinkLists?: ProcessedLink[];
  }>((resolve) => chrome.storage.local.get('channellinkLists', resolve));
  const isFromChannel = channellinkLists.some((c) => c.link === link);
  if (!obj) {
    obj = {
      link: `https://www.youtube.com/watch?v=${vid}`,
      subscribed: isFromChannel,
      liked: false,
      commented: false,
    };
    processedLinksMemory.push(obj);
  }
  if (!obj[field]) {
    obj[field] = true;
    await new Promise<void>((res) =>
      chrome.storage.local.set({ processedLinks: processedLinksMemory }, res)
    );
  }
}

async function openFirstVideoAndThen(action: string) {
  const el = document.querySelector('ytd-rich-grid-media a');
  const h = el?.getAttribute('href');
  if (h)
    chrome.runtime.sendMessage({
      action: 'openSingleVideoTab',
      link: `https://www.youtube.com${h}`,
      nextAction: action,
    });
}

async function getTabId(): Promise<number | null> {
  return new Promise((res) =>
    chrome.storage.local.get('singleVideoTabId', (d) =>
      res(d.singleVideoTabId || null)
    )
  );
}

async function waitForElement(
  selector: string,
  timeout = 10000
): Promise<Element> {
  return new Promise((res, rej) => {
    const found = document.querySelector(selector);
    if (found) return res(found);
    const o = new MutationObserver(() => {
      const f = document.querySelector(selector);
      if (f) {
        o.disconnect();
        res(f);
      }
    });
    o.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      o.disconnect();
      rej();
    }, timeout);
  });
}

async function sub() {
  const link = await getCheckLink();
  if (!link) return;
  const vid = getVideoId(link);
  const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
  if (proc?.subscribed) {
    return;
  }

  await sleep(2000);
  window.scrollTo({ top: 150, behavior: 'smooth' });
  const btn = (await waitForElement(
    'ytd-subscribe-button-renderer button'
  )) as HTMLButtonElement;

  if (btn.textContent?.trim() === 'Subscribe') {
    btn.click();
    await findProcessedLink(link, 'subscribed');
  }
}

async function like() {
  const link = await getCheckLink();
  if (!link) return;
  const vid = getVideoId(link);
  const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
  if (proc?.liked) {
    return;
  }

  await sleep(2000);
  window.scrollTo({ top: 200, behavior: 'smooth' });
  const btn = (await waitForElement(
    'like-button-view-model button'
  )) as HTMLButtonElement;

  if (btn.title === 'I like this') {
    btn.click();
    await findProcessedLink(link, 'liked');
  }
}

async function comments() {
  const link = await getCheckLink();
  if (!link) return;
  const vid = getVideoId(link);
  const proc = processedLinksMemory.find((p) => getVideoId(p.link) === vid);
  if (proc?.commented) {
    chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
    return;
  }

  await sleep(2000);
  window.scrollTo({ top: 500, behavior: 'smooth' });
  const t = (
    await waitForElement('ytd-watch-metadata yt-formatted-string')
  ).textContent?.trim();
  if (t) {
    chrome.runtime.sendMessage({ action: 'generatecomment', videoTitle: t });
  }
}

async function postComment(c: string) {
  window.scrollTo({ top: 500, behavior: 'smooth' });
  const box = await waitForElement(
    'ytd-comments div#simple-box yt-formatted-string'
  );
  if (!box) {
    chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
  } else {
    (box as HTMLElement).click();
    document.execCommand('insertText', false, c);
    await sleep(2000);
    document
      .querySelector<HTMLButtonElement>('div#footer #buttons #submit-button')
      ?.click();
    await findProcessedLink(window.location.href, 'commented');
  }
}

async function findChannel() {
  const ytdInput = document.querySelector<HTMLInputElement>(
    '#center yt-searchbox div form input'
  );
  if (!ytdInput) {
    const msg = 'YouTube search input not found.';
    throw new Error(msg);
  }
  ytdInput.click();

  const stored = await new Promise<string>((res, rej) =>
    chrome.storage.local.get('ytdChannel', (result) => {
      if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
      else res(result.ytdChannel || '');
    })
  );

  ytdInput.focus();
  ytdInput.value = stored;
  ytdInput.dispatchEvent(new Event('input', { bubbles: true }));

  await sleep(3000);

  const searchBtn = document.querySelector<HTMLButtonElement>(
    'ytd-masthead #center button.ytSearchboxComponentSearchButton'
  );
  if (!searchBtn) throw new Error('YouTube search button not found.');

  searchBtn.click();

  await sleep(5000);
  const contentSection = document.getElementById('content-section');
  if (!contentSection) {
    const msg = 'YouTube channel not found.';
    throw new Error(msg);
  }
  const channelAnchors =
    document.querySelector<HTMLAnchorElement>('#avatar-section a');
  await sleep(5000);
  if (channelAnchors) {
    channelAnchors.click();
  } else {
    console.error('No channels found in the search results.');
  }

  await sleep(5000);
  const parent = document.querySelector(
    '#tabsContent yt-tab-group-shape .yt-tab-group-shape-wiz__tabs'
  );
  const videoTab =
    parent?.querySelectorAll<HTMLDivElement>('.yt-tab-shape-wiz')[1];
  if (videoTab) {
    await sleep(3000);
    videoTab.click();

    await sleep(3000);
    const btn = (await waitForElement(
      'ytd-subscribe-button-renderer button'
    )) as HTMLButtonElement;
    if (btn.textContent?.trim() === 'Subscribe') {
      await sleep(3000);
      btn.click();
    }
    await sleep(3000);
    const rootSelector =
      'ytd-two-column-browse-results-renderer[page-subtype="channels"] ytd-rich-grid-renderer #contents';
    const firstVideo: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        `${rootSelector} ytd-rich-item-renderer ytd-rich-grid-media a#thumbnail`
      )
    );
    if (firstVideo) {
      const channellinkLists: {
        id: number;
        link: string;
        subscribed: true;
        liked: false;
        commented: false;
      }[] = [];

      chrome.storage.local.get(['channelRangeObj'], (result) => {
        const start = result?.channelRangeObj?.min ?? 0;
        const end = result?.channelRangeObj?.max ?? 10;

        for (let i = start - 1; i < end && i < firstVideo.length; i++) {
          const el = firstVideo[i * 2];
          if (!el || !el.href) {
            console.warn(`Skipping undefined or invalid video at index ${i}`);
            continue;
          }

          const videoLink = el.href;
          channellinkLists.push({
            id: generateRandomId(),
            link: videoLink,
            subscribed: true,
            liked: false,
            commented: false,
          });
        }

        chrome.storage.local.set({ channellinkLists });
        console.log(channellinkLists);
        chrome.runtime.sendMessage({
          action: 'PlayChannelVideos',
          links: channellinkLists,
        });
      });
    } else {
      throw new Error('Video tab not found');
    }
  }
}

chrome.runtime.onMessage.addListener(async (msg) => {
  switch (msg.action) {
    case 'OpenFirstVideo&Subscribe':
      openFirstVideoAndThen('Subscribe');
      break;
    case 'OpenFirstVideo&Like':
      openFirstVideoAndThen('Like');
      break;
    case 'OpenFirstVideo&Comment':
      openFirstVideoAndThen('Comment');
      break;
    case 'OpenFirstVideo&SLC':
      openFirstVideoAndThen('SLC');
      break;
    case 'Subscribe':
      await sleep(2000);
      await sub();
      await sleep(8000);
      chrome.runtime.sendMessage({ action: 'actionDone', type: 'sub' });
      break;
    case 'Like':
      await sleep(2000);
      await like();
      await sleep(8000);
      chrome.runtime.sendMessage({ action: 'actionDone', type: 'like' });
      break;
    case 'Comment':
      await sleep(2000);
      await comments();
      break;
    case 'SLC':
      await sleep(2000);
      await sub();
      await sleep(3000);
      await like();
      await sleep(3000);
      await comments();
      break;
    case 'postGeneratedComment':
      if (msg.comment) {
        await postComment(msg.comment);
        await sleep(8000);
        chrome.runtime.sendMessage({ action: 'actionDone', type: 'comment' });
      }
      break;
    case 'FindChannel':
      await sleep(2000);
      await findChannel();
      break;
    case 'showCompletedModal':
      await showCompletedModal();
      break;
    case 'Notify':
      chrome.runtime.sendMessage({ action: 'actionDone' });
      break;
  }
});
