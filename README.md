# NBA-Boxscore (VSCode Extension)

![](src/img/demo-1.png)

This repository is my first practice to implement a simple NBA boxscore extension on Visual Studio Code (VSCode) using TypeScript. For now, we enable users to see the live score and further detail of daily matches.

> HINT: If you have any questions, please feel free to ask me.

---
## Features

### Show NBA Games Today (nba-boxscore.activate)

1. Open the command palette (`Ctrl+Shift+P`) and type `Show games today`.
2. Then, you will see the score of the games in the status bar (left-bottom side).
  ![](src/img/demo-2.png)
3. Click the item in the status bar and you will see the menu of all games today.
  ![](src/img/demo-4.png)
4. To see the detail of the game, you can click the game in the menu.

### Search History Games (nba-boxscore.searchHistory)

1. Open the command palette (`Ctrl+Shift+P`) and type `Search games in the past`.
2. Enter the date that you want to search (Format: `YYYY-MM-DD`)
  ![](src/img/demo-3.png)
3. A few second later, you will see the games in the status bar (ledt-bottom side).
4. Click the item in the status bar and you will see the menu of all games.
  ![](src/img/demo-4.png)
5. To see the detail of the game, you can click the game in the menu.

---
## Requirements

Search "nba-boxscore" in Marketplace and install our extensions.

---
## Extension Settings

This extension contributes the following settings:

* `nba-boxscore.activate`: Activate this extension
* `nba-boxscore.showMenu`: Show all games today
* `nba-boxscore.searchHistory`: Search the NBA games in the past
* `nba-boxscore.exit`: Exit this extension

---
## Contributor

> NOTICE: You can follow the contributing process [CONTRIBUTING.md](CONTRIBUTING.md) to join me. I am very welcome for any issue!

- [David Lu](https://github.com/yungshenglu)

---
## License

[GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)
