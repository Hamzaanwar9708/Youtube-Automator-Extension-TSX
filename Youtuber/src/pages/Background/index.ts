let openedTabId: number | null = null;
let SingleFlag = false;
let MultipleFlag = false;
let PlaylistFlag = false;
let ChannelFlag = false;
const OPENAI_API_KEY = '';

const STORAGE_KEYS = {
  MAIN: 'mainMultipleLinks',
  RANGE: 'rangeMultipleLinks',
  ACTION: 'multipleActionLinks',
  PROCESSED: 'processedLinks',
  PLAYLIST_PROCESSED: 'playlistProcessedLinks',
  PLAYLIST_RANGE: 'playlistRangeLinks',
  PLAYLIST_ACTIONS: 'playlistActionLinks',
  CHANNEL: 'channellinkLists',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface LinkItem {
  id: number;
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
}

interface ActionLists {
  subscribe: LinkItem[];
  like: LinkItem[];
  comment: LinkItem[];
}

let multipleQueue: LinkItem[] = [];
let multipleActions: ActionLists = { subscribe: [], like: [], comment: [] };
let multipleIsRange = false;

let playlistQueue: LinkItem[] = [];
let playlistActions: ActionLists = { subscribe: [], like: [], comment: [] };
let playlistIsRange = false;

let channelQueue: LinkItem[] = [];

async function openTab(url: string): Promise<number> {
  console.log(url);
  const check = url;
  await chrome.storage.local.set({ check });
  const tab = await new Promise<chrome.tabs.Tab>((res) =>
    chrome.tabs.create({ url, active: true }, res)
  );
  openedTabId = tab.id!;
  await chrome.storage.local.set({ singleVideoTabId: openedTabId });
  await delay(2000);
  return openedTabId!;
}

function sendToTab(action: string) {
  if (openedTabId != null) {
    chrome.tabs.sendMessage(openedTabId, { action });
  }
}

async function initMultipleProcessing() {
  if (!MultipleFlag || multipleQueue.length === 0) {
    MultipleFlag = false;
    return;
  }
  const current = multipleQueue[0];
  let acts: string[] = [];
  if (multipleIsRange) {
    const { subscribe, like, comment } = multipleActions;
    if (subscribe.find((i) => i.id === current.id)) acts.push('Subscribe');
    if (like.find((i) => i.id === current.id)) acts.push('Like');
    if (comment.find((i) => i.id === current.id)) acts.push('Comment');
    if (acts.length === 0) acts = ['Notify'];
  } else {
    acts = ['SLC'];
  }
  await openTab(current.link);
  for (const a of acts) {
    if (a === 'Notify') sendToTab('Notify');
    else sendToTab(a);
  }
}

async function initPlaylistProcessing() {
  if (!PlaylistFlag || playlistQueue.length === 0) {
    PlaylistFlag = false;
    return;
  }
  const current = playlistQueue[0];
  let acts: string[] = [];
  if (playlistIsRange) {
    const { subscribe, like, comment } = playlistActions;
    if (subscribe.find((i) => i.id === current.id)) acts.push('Subscribe');
    if (like.find((i) => i.id === current.id)) acts.push('Like');
    if (comment.find((i) => i.id === current.id)) acts.push('Comment');
    if (acts.length === 0) acts = ['Notify'];
  } else {
    acts = ['SLC'];
  }
  await openTab(current.link);
  for (const a of acts) {
    if (a === 'Notify') sendToTab('Notify');
    else sendToTab(a);
  }
}

async function initChannelProcessing() {
  if (!ChannelFlag || channelQueue.length === 0) {
    ChannelFlag = false;
    return;
  }
  const current = channelQueue[0];
  await openTab(current.link);
  sendToTab('SLC');
}

async function generateAIComment(videoTitle: string): Promise<string | null> {
  try {
    const resp = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content:
                'You are an AI assistant that generates engaging YouTube comments as thoughtful and positive a critic on my behalf.',
            },
            {
              role: 'user',
              content: `Generate a thoughtful, relevant, and respectful 5 to 10-word comment for a YouTube video based on its title: "${videoTitle}". Comments should be positive, engaging, and appropriate for the video's context. Do not include user or yourself in the comment.`,
            },
          ],
          max_tokens: 50,
        }),
      }
    );
    const data = (await resp.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0]?.message.content.trim() || null;
  } catch {
    return null;
  }
}

chrome.runtime.onMessage.addListener(async (message) => {
  const { action, link, nextAction, videoTitle } = message;

  switch (action) {
    case 'Subscribe':
    case 'Like':
    case 'Comment':
    case 'SLC':
      SingleFlag = true;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const t = tabs[0]?.id;
        if (t != null)
          chrome.tabs.sendMessage(t, {
            action:
              action === 'SLC'
                ? 'OpenFirstVideo&SLC'
                : `OpenFirstVideo&${action}`,
          });
      });
      break;

    case 'StartAutomationMultiple':
      MultipleFlag = true;
      if (openedTabId) chrome.tabs.remove(openedTabId);
      {
        const stored = await chrome.storage.local.get([
          STORAGE_KEYS.MAIN,
          STORAGE_KEYS.RANGE,
          STORAGE_KEYS.ACTION,
        ]);
        const mainQ: LinkItem[] = stored[STORAGE_KEYS.MAIN] || [];
        const rangeQ: LinkItem[] = stored[STORAGE_KEYS.RANGE] || [];
        const acts: ActionLists = stored[STORAGE_KEYS.ACTION] || {
          subscribe: [],
          like: [],
          comment: [],
        };
        multipleIsRange = rangeQ.length > 0;
        multipleQueue = multipleIsRange ? rangeQ : mainQ;
        multipleActions = acts;
      }
      initMultipleProcessing();
      break;

    case 'StartAutomationPlaylist':
      PlaylistFlag = true;
      if (openedTabId) chrome.tabs.remove(openedTabId);
      {
        const stored = await chrome.storage.local.get([
          STORAGE_KEYS.PLAYLIST_PROCESSED,
          STORAGE_KEYS.PLAYLIST_RANGE,
          STORAGE_KEYS.PLAYLIST_ACTIONS,
        ]);
        const procQ: LinkItem[] = stored[STORAGE_KEYS.PLAYLIST_PROCESSED] || [];
        const rangeQ: LinkItem[] = stored[STORAGE_KEYS.PLAYLIST_RANGE] || [];
        const acts: ActionLists = stored[STORAGE_KEYS.PLAYLIST_ACTIONS] || {
          subscribe: [],
          like: [],
          comment: [],
        };
        playlistIsRange = rangeQ.length > 0;
        playlistQueue = playlistIsRange ? rangeQ : procQ;
        playlistActions = acts;
      }
      initPlaylistProcessing();
      break;

    case 'PlayChannelVideos':
      ChannelFlag = true;
      if (openedTabId) chrome.tabs.remove(openedTabId);
      const stored = await chrome.storage.local.get([STORAGE_KEYS.CHANNEL]);
      channelQueue = stored[STORAGE_KEYS.CHANNEL] || [];
      initChannelProcessing();
      break;

    case 'SearchChannel':
      ChannelFlag = true;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const t = tabs[0]?.id;
        if (t != null) chrome.tabs.sendMessage(t, { action: 'FindChannel' });
      });
      break;

    case 'openSingleVideoTab':
      if (link && nextAction) {
        const check = link;
        await chrome.storage.local.set({ check });
        const tab = await new Promise<chrome.tabs.Tab>((res) =>
          chrome.tabs.create({ url: link, active: true }, res)
        );
        openedTabId = tab.id!;
        chrome.storage.local.set({ singleVideoTabId: openedTabId });
        chrome.tabs.onUpdated.addListener(function listener(id, info) {
          if (id === openedTabId && info.status === 'complete') {
            sendToTab(nextAction);
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      }
      break;

    case 'actionDone':
      if (SingleFlag) {
        sendToTab('showCompletedModal');
      } else if (MultipleFlag) {
        const isLast = multipleQueue.length === 1;
        const current = multipleQueue.shift();
        if (current) {
          const mem = await chrome.storage.local.get(STORAGE_KEYS.PROCESSED);
          const proc: LinkItem[] = mem[STORAGE_KEYS.PROCESSED] || [];
          const idx = proc.findIndex((i) => i.id === current.id);
          if (idx >= 0) proc[idx] = { ...current };
          else proc.push({ ...current });
          await chrome.storage.local.set({ [STORAGE_KEYS.PROCESSED]: proc });
          const key = multipleIsRange ? STORAGE_KEYS.RANGE : STORAGE_KEYS.MAIN;
          await chrome.storage.local.set({ [key]: multipleQueue });
        }
        if (isLast) {
          sendToTab('showCompletedModal');
        } else {
          chrome.tabs.remove(openedTabId!);
          initMultipleProcessing();
        }
      } else if (PlaylistFlag) {
        const isLast = playlistQueue.length === 1;
        const current = playlistQueue.shift();
        if (current) {
          const mem = await chrome.storage.local.get(
            STORAGE_KEYS.PLAYLIST_PROCESSED
          );
          const proc: LinkItem[] = mem[STORAGE_KEYS.PLAYLIST_PROCESSED] || [];
          const idx = proc.findIndex((i) => i.id === current.id);
          if (idx >= 0) proc[idx] = { ...current };
          else proc.push({ ...current });
          await chrome.storage.local.set({
            [STORAGE_KEYS.PLAYLIST_PROCESSED]: proc,
          });
          const key = playlistIsRange
            ? STORAGE_KEYS.PLAYLIST_RANGE
            : STORAGE_KEYS.PLAYLIST_PROCESSED;
          await chrome.storage.local.set({ [key]: playlistQueue });
        }
        if (isLast) {
          sendToTab('showCompletedModal');
        } else {
          chrome.tabs.remove(openedTabId!);
          initPlaylistProcessing();
        }
      } else if (ChannelFlag) {
        const isLast = channelQueue.length === 1;
        const current = channelQueue.shift();
        if (current) {
          const mem = await chrome.storage.local.get(STORAGE_KEYS.PROCESSED);
          const proc: LinkItem[] = mem[STORAGE_KEYS.PROCESSED] || [];
          const idx = proc.findIndex((i) => i.id === current.id);
          if (idx >= 0) proc[idx] = { ...current };
          else proc.push({ ...current });
          await chrome.storage.local.set({ [STORAGE_KEYS.PROCESSED]: proc });
          await chrome.storage.local.set({
            [STORAGE_KEYS.CHANNEL]: channelQueue,
          });
        }
        if (isLast) {
          sendToTab('showCompletedModal');
        } else {
          chrome.tabs.remove(openedTabId!);
          initChannelProcessing();
        }
      }
      break;

    case 'completedModalClosed':
      if (openedTabId) chrome.tabs.remove(openedTabId);
      openedTabId = null;
      SingleFlag = false;
      MultipleFlag = false;
      PlaylistFlag = false;
      ChannelFlag = false;
      break;

    case 'generatecomment':
      if (videoTitle) {
        const comment = await generateAIComment(videoTitle);
        if (comment) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const t = tabs[0]?.id;
            if (t != null)
              chrome.tabs.sendMessage(t, {
                action: 'postGeneratedComment',
                comment,
              });
          });
        }
      }
      break;
  }
});
