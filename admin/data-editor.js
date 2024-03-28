const baseUrl = '/data/game/'
let targetGame = {
  name: '',
  url: ''
}
let platformData = {}

let counter = 0
let gameLoaded = false

fetch('/data/platforms', {
  method: `GET`,
}).then(async (response) => {
  platformData = await response.json()
  console.log(platformData)
})

//--- event handlers
async function getGameData(event) {
  if (gameLoaded === false) {
    gameLoaded = true
    targetGame.name = event.detail.elt.getAttribute(`game-name`)
    try {
      const response = await fetch(`/data/game/` + targetGame.name, { method: `GET` })
      const json = await response.json()
      targetGame.data = json.data
      console.log(targetGame)
    } catch (e) {
      console.log('uhhh')
    }
  }
}

function handleChangeGameSelection(event) {
  gameLoaded = false
  console.log(event)
}

async function handleCheckboxChange(target){
  target.checked = !target.checked
  const url = target.getAttribute('endpoint')

  const response = await fetch(url, {
    method: target.checked ? 'DELETE' : 'POST',
    body: target.name
  })

  if (response.status === 200) {
    target.checked = !target.checked
  }
  return target.checked
}

async function loadImagePreview(event) {
  const elem = event.target
  if (elem.files.length == 1) {
    const imgPreviewId = elem.name.split('-').slice(0,3).join('-') + '-preview'
    const imgPreview = document.getElementById(imgPreviewId)
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imgPreview.src = reader.result
    })
    reader.readAsDataURL(elem.files[0])
    imgPreview.style.visibility = 'visible'
  }
}

async function removeRecordByIndex(index){
  console.log(`Removing record with index ${index}`)
}

async function updateGfxOptionsPreviewName(inputEl){
  document.getElementById('gfx-options-preview-name').innerText = inputEl.value
}

async function updateGfxOptionsPreviewEntries(inputEl){
  const childList = inputEl.value.split(',').map((entry) => {
    const child = document.createElement('li')
    console.log(entry)
    child.innerText = entry.trim()
    return child
  })
  const previewEl = document.getElementById('gfx-options-preview-entries')
  removeChildren(previewEl)
  for (const c of childList) {
    console.log(c)
    previewEl.appendChild(c)
  }
}

async function removeGfxOption(t, targetId){
  let newGfxOpts = JSON.parse(JSON.stringify(targetGame.data.gfxOptions))

  // console.dir(targetGame.data.gfxOptions)
  console.log(`Sending PATCH to remove #${targetId} - '${t.nextElementSibling.innerText}'`)

  const i = targetId.split('-').slice(-2)
  const gfxidx = i[0]
  const optidx = i[1]

  newGfxOpts[gfxidx].options = newGfxOpts[gfxidx].options.splice(optidx, 1)

  const response = await fetch(`/data/game/${targetGame.name}/gfx-options`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: newGfxOpts
    })

  console.log(response)
  if (response.status === 200) {
    targetGame.data.gfxOptions = newGfxOpts
    htmx.trigger('#gfx-options-list', 'update-gfx-options')
  }
}

//--- helper functions

async function postUrl(url, body) {
  return fetch(url, {
    method: `POST`,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: body? body : {}
  })
}
