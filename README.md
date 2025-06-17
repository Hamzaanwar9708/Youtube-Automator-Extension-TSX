# Youtube-Automator-Extension-TSX

A Chrome extension built with React and TypeScript that automates YouTube interactions directly from the YouTube interface. It injects an icon into the YouTube top bar, opens a customizable popup with multiple sections, and performs actions like subscribing, liking, and commenting on videos (including AI-generated comments).

Icon Injection: Detects when YouTube’s header finishes loading and adds your custom extension icon next to the notification bell—so the tool is always just one click away.
Single-Video Mode: Opens the very first video on the page in a new tab and then, depending on your choice, subscribes, likes, comments, or does all three in sequence, without any further input.
Multiple-Videos Mode: Lets you paste in a list of video URLs, then automatically opens each one and performs the same set of actions on all of them. You can also pick a sub-range of that list if you only want to process part of it.
Playlist Mode: Saves YouTube playlists you use frequently, fetches every video in a selected playlist, and runs your chosen actions on all or just a slice of those videos.
Channel Mode: Searches for a channel by name, subscribes to it, then grabs its latest videos within a range you define and performs your desired actions on each.
Filter (Range) Configuration: Lets you specify exactly which items in a list (main list, subscribe-list, like-list, comment-list) to act on. Built-in checks prevent invalid ranges and guide you if something’s out of bounds.
Background Orchestration: Runs behind the scenes to queue up videos, open new tabs, send commands to the content script, track progress, and clean up when everything’s done.
Content-Script Automation: Lives on the YouTube page itself, listens for those background commands, interacts with YouTube’s buttons and comment fields, and shows you a completion dialog when it’s finished.
AI-Generated Comments: When you ask it to comment, it crafts a short, positive remark based on the video’s title by talking to an AI chat API—then posts it for you.
Persistent Memory: Remembers which videos you’ve already subscribed to, liked, or commented on so it never repeats work. It also keeps track of your last-used settings, playlists, and active popup section.
Unified Modal System: Displays important alerts and input forms (errors, range inputs, playlist add/delete dialogs) in a consistent, centered popup with clear messaging and easy dismissal.
Clean, Responsive Styling: Uses modern gradients, smooth scale-on-hover buttons, and well-spaced layouts so your popup feels polished and intuitive.
A Chrome extension built with React and TypeScript that automates YouTube interactions directly from the YouTube interface. It injects an icon into the YouTube top bar, opens a customizable popup with multiple sections, and performs actions like subscribing, liking, and commenting on videos (including AI-generated comments).
Icon Injection: Detects when YouTube’s header finishes loading and adds your custom extension icon next to the notification bell—so the tool is always just one click away.
Single-Video Mode: Opens the very first video on the page in a new tab and then, depending on your choice, subscribes, likes, comments, or does all three in sequence, without any further input.
Multiple-Videos Mode: Lets you paste in a list of video URLs, then automatically opens each one and performs the same set of actions on all of them. You can also pick a sub-range of that list if you only want to process part of it.
Playlist Mode: Saves YouTube playlists you use frequently, fetches every video in a selected playlist, and runs your chosen actions on all or just a slice of those videos.
Channel Mode: Searches for a channel by name, subscribes to it, then grabs its latest videos within a range you define and performs your desired actions on each.
Filter (Range) Configuration: Lets you specify exactly which items in a list (main list, subscribe-list, like-list, comment-list) to act on. Built-in checks prevent invalid ranges and guide you if something’s out of bounds.
Background Orchestration: Runs behind the scenes to queue up videos, open new tabs, send commands to the content script, track progress, and clean up when everything’s done.
Content-Script Automation: Lives on the YouTube page itself, listens for those background commands, interacts with YouTube’s buttons and comment fields, and shows you a completion dialog when it’s finished.
AI-Generated Comments: When you ask it to comment, it crafts a short, positive remark based on the video’s title by talking to an AI chat API—then posts it for you.
Persistent Memory: Remembers which videos you’ve already subscribed to, liked, or commented on so it never repeats work. It also keeps track of your last-used settings, playlists, and active popup section.
Unified Modal System: Displays important alerts and input forms (errors, range inputs, playlist add/delete dialogs) in a consistent, centered popup with clear messaging and easy dismissal.
Clean, Responsive Styling: Uses modern gradients, smooth scale-on-hover buttons, and well-spaced layouts so your popup feels polished and intuitive.