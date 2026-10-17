# Arsenal Arcade

An unofficial, fan-made Arsenal-themed football game collection. Runs entirely as a static website on GitHub Pages.

## Games
- **38-0-0**: choose 11 players and simulate a 38-match home-and-away season, aiming for 114 points.
- **Guess the Gunner**: identify six players from progressive clues.
- **Arsenal Trivia**: ten historical multiple-choice questions.
- **Higher or Lower**: compare explicitly fictional in-game goal scores (not real statistics).

## Run
Open `index.html` in a browser. No install, build step, API key, or backend needed.

## Publish
Create a public GitHub repository named `arsenal-arcade`, upload `index.html` and `README.md` to its root, then choose **Settings → Pages → Deploy from a branch → main → /(root)**. GitHub Pages should serve `https://YOUR_USERNAME.github.io/arsenal-arcade/` after deployment.

## Notes
- This is a **first playable prototype**, not a full football management simulator. Match results are probability-based, not animated 2D matches. The season uses a fixed illustrative 19-team opponent list and does not claim to reflect the current Premier League.
- Player pool spans multiple historical Arsenal eras and is not a current roster. Player ratings are fictional.
- The Higher or Lower values are fictional game scores, not official player goal statistics.
- Progress for 38-0-0 is saved in browser localStorage. Other games restart when you reopen them.
- No official Arsenal branding or copyrighted player photography is included. Independent fan project, not endorsed by Arsenal FC.