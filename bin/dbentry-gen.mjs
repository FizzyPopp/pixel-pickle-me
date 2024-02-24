import * as readline from 'node:readline/promises'
import { readFile } from 'node:fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { stdin as input, stdout as output } from 'node:process';

const platformsRaw = await readFile(`${__dirname}/../data/platforms.json`)
const platformsDb = JSON.parse(platformsRaw)
const platformEnum = platformsDb.PlatformEnum

console.dir(platformEnum)

const gameObj = {
  title: "",
  inGameSettingsAvailable: [],
  platforms: [],
  performanceRecordList:[]
}

const rl = readline.createInterface({ input, output });

gameObj.title = await read('Enter game title: ')

let gfxModeList = await readList('List of graphics modes: ')

for(let i in gfxModeList){
  let optionsList = await readList(`List of options for ${gfxModeList[i]}: `)

  console.dir(optionsList)
  gameObj.inGameSettingsAvailable.push({
    name: gfxModeList[i],
    options: optionsList
  })
}


for (let i = 0; i < platformEnum.length; i++) {
  let confirmation = await rl.question(`is ${gameObj.title} available for ${platformEnum[i]}? [Y/n]: `)
  switch (confirmation) {
    case 'Y':
    case 'y':
    case '':
      gameObj.platforms.push(i)
  }
  console.dir(gameObj.platforms)
}

for (let i of gameObj.platforms) {
  if (i <= 1) { continue }
  console.log(`${i} => ${platformEnum[i]}`)
  const record = {
    context:{
      platform: i,
      rt: false,
      inGameSettingsSet:[]
    }
  }
  while (true) {
    let confirmation = await rl.question(`Enter new performance record? [Y/n]: `)
    if (confirmation === 'n') { break; }
    for (let setting of gameObj.inGameSettingsAvailable) {
    }
  }
}

console.dir(gameObj.inGameSettingsAvailable)

rl.close();

async function readList(query) {
  return read(query, (input) => {
    return input.split(',').map((item) => item.trim()).filter((item) => item !== '')
  })
}

async function read(query, processCb = (m) => m.trim()) {
  let inputRaw = ''
  let input = ''
  let cont = true
  while (cont) {
    inputRaw = await rl.question(query);

    input = processCb(inputRaw)

    console.dir(input)
    let confirmation = await rl.question('look good? [Y/n]: ')

    switch (confirmation) {
      case 'Y':
      case 'y':
      case '':
        cont = false
    }
  }
  return input
}
