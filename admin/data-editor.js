const baseUrl = '/data/game/'
let targetGame = {
  name: '',
  url: ''
}
let platformData = {}



fetch('/data/platforms', {
  method: `GET`,
}).then(async (response) => {
  platformData = await response.json()
  console.log(platformData)
})

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

async function updateGfxOptionsPreviewName(inputEl){
  document.getElementById('gfxOptions-preview-name').innerText = inputEl.value
}

async function updateGfxOptionsPreviewEntries(inputEl){
  const childList = inputEl.value.split(',').map((entry) => {
    const child = document.createElement('li')
    console.log(entry)
    child.innerText = entry.trim()
    return child
  })
  const previewEl = document.getElementById('gfxOptions-preview-entries')
  removeChildren(previewEl)
  for (const c of childList) {
    console.log(c)
    previewEl.appendChild(c)
  }
}

async function removeGfxOption(t){
  console.log(t)
}

async function postUrl(url, body) {
  return fetch(url, {
    method: `POST`,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: body? body : {}
  })
}

function removeChildren(el){
  while (el.firstChild) { el.removeChild(el.lastChild) }
  return el
}
