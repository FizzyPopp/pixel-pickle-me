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

function formatGfxRequest(ev, inputId) {
  console.log(inputId, ev.detail.parameters)
  ev.detail.parameters.name = ev.detail.parameters[inputId];
  delete ev.detail.parameters[inputId];
}

//--- event handlers
async function update(requestEv, targetSelector, eventName, detail){
  if (requestEv.detail.successful){
    console.log(targetSelector, eventName, detail, requestEv.detail)
    htmx.trigger(targetSelector, eventName, detail)
  }
}

async function postPerformanceRecord(recordIdBase, endpoint){
  function q(elType,idFrag){
    return `${elType}[name="${recordIdBase}-${idFrag}"]`
  }

  const platform = document.querySelector(q('select', 'context-platform')).value
  const rt = document.querySelector(q('input', 'context-rt')).checked
  const gfxOptionsSet = targetGame.data.gfxOptions.map((opt) => {
    return {
      name: opt.name,
      setValue: document.querySelector(q('select', 'context-gfx-option-' + opt.name.toLowerCase().replace(/ /g, '-'))).value,
    }
  })

  const fpsTargVal = Number(document.querySelector(q('input', 'fps-target')).value)
  const resTargVal = Number(document.querySelector(q('input', 'resolution-target')).value)
  const resScalingVal = document.querySelector(q('input','resolution-scaling') + ":checked")?.value

  if (fpsTargVal === 0
    || resTargVal === 0
    || Number.isNaN(fpsTargVal)
    || Number.isNaN(resTargVal)
    || typeof resScalingVal === 'undefined') {
    alert('Please fill out all fields')
    return
  }
  const body = {
    gfxOptionsSet: gfxOptionsSet,
    fps: {
      target: fpsTargVal,
      unlocked: document.querySelector(q('input','fps-unlocked')).checked
    },
    resolution: {
      target: resTargVal,
      scaling: resScalingVal
    }
  }

  const url = endpoint + `/${platform}/${rt}`
  console.log(url)
  console.log(body)

  const response = await fetch(endpoint + `/${platform}/${rt}`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body)
  })

  if (response.status === 200) {
    try {
      await getSelectedGameData(targetGame.name)
      htmx.trigger('#performance-records-list', 'reload')
    } catch (e) { console.log(e) }
  }
}
async function deletePerformanceRecordByIndex(idx, endpoint){
  const index = Number(idx)
  const url = endpoint + `/${targetGame.data.performanceRecords[index].context.platform}/${targetGame.data.performanceRecords[index].context.rt}}`
  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({
      gfxOptionsSet: targetGame.data.performanceRecords[index].context.gfxOptionsSet
    })
  })
  if (response.status === 200) {
    htmx.trigger('#performance-records-list', 'reload')
  }
}

async function getSelectedGameData(name) {
  console.log('getgamedata',name)
  if (gameLoaded === false) {
    gameLoaded = true
    targetGame.name = name
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
}


async function changePlatformId(target){
  target.checked = !target.checked
  const url = target.getAttribute('endpoint')

  const response = await fetch(url, {
    method: target.checked ? 'DELETE' : 'POST',
    body: target.name
  })

  if (response.status === 200) {
    target.checked = !target.checked
    for (const c of target.parentNode.nextElementSibling.children) {
      console.log(c.firstElementChild)

      c.firstElementChild.disabled = (target.checked === false)
      if (target.checked === false) {
        c.firstElementChild.checked = false
      }
    }
  }
  return target.checked
}
async function changePlatformFeature(target){
  target.checked = !target.checked
  const url = target.getAttribute('endpoint')

  const bod = {
    value: target.name
  }

  console.log(bod)

  const response = await fetch(url, {
    method: target.checked ? 'DELETE' : 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(bod)
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

async function poop(e){
  console.log(e.detail)

}

async function updateGfxOptValue(t, targetId){
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
