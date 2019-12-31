# Quote Bot

This is a simple quote bot built for one of my servers. Yes I know there's many Discord quote bots out there (such as [this one](https://top.gg/bot/379985883522138112)) but I wanted some extra features and the fun of building it myself.

## Features

This bot is a little different from standard quote bots in that it's built around the idea of `Quote Sets`. These sets are designed to group quotes by topic or origin. The Set Names are then used to pull quotes from those specified sets. The important part is that these sets can be triggered in normal messages without a command if you just say a matching set name (first one in a message only).
Sending quotes in response to normal messages can be turned off with the command `!requirecommand yes` which will make quotes only send when you use the command `!quote [?set name]`.
