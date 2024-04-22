# Pixel Pickle Me

Comparing game performance across consoles, helping you choose which console to play on.

## Developing site

Clone repo and install dependencies:

```bash
npm install
```

Run gatsby preview server:

```bash
npm run develop
```

Visit `localhost:8000` to see the preview in action.

From here, you can start editing the codebase and gatsby will handle the live-reloading.

### Folder structure

```
pixel-pickle-me/
  ├── admin/  --- admin tool root
  ├── data/   --- json file database
  └── src/    --- site code
      ├── components/
      ├── images/
      ├── pages/
      │   └── game/
      └── styles/
```


## Adding new database entries

> **Warning**
Do not manually edit any json in `data/` unless you know what you are doing.

```bash
npm run admin
```

Visit `localhost:6969` to add entries to the database.
