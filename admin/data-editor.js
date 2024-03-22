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
}).then(async () => {
  const selEl = document.getElementById('game-select')
  targetGame.name = selEl.options[selEl.selectedIndex].value.split('.')[0]
  targetGame.url += baseUrl + targetGame.name
  console.log(targetGame)

  const response = await fetch(targetGame.url)
  if (response.status !== 200) { return }

  const body = await response.json()
  targetGame.data = body.data
  console.log(targetGame.data)
  // render.title(targetGame.data.title)
  // render.image(targetGame.data.image)
  // htmx.trigger('platforms-list', 'get-platforms')
  // render.platforms(targetGame.data.platforms)
  // render.gfxOptions(targetGame.data.gfxOptions)
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
    imgPreview.style.height = '100px'
  }
}

async function renderFields(target){
  // console.log(target)
  // render.image()
  render.gfxOptions(targetGame.data.gfxOptions)
}

// let gfxOptionsNameInputEl = document.querySelector('#gfxOptions-name-input')

// gfxOptionsNameInputEl.addEventListener('change', (event) => {
//   const optionName = gfxOptionsNameInputEl.value
//   console.log(optionName)
//   document.querySelector('#gfxOptions-options-legend').textContent = "" + optionName + " entries"
// })

const render = {
  gfxOptions: (gfxOpts) => {
    const gfxOptionsListEl = document.getElementById('poopybutthole')

    console.log(gfxOpts)
    // console.log(gfxOptionsListEl.children)

    deleteChildren(gfxOptionsListEl)

    for (const idx in gfxOpts) {
      const opt = gfxOpts[idx]

      const optEl = document.createElement('span')
      const optNameEl = document.createElement('h3')
      const optOptsEl = document.createElement('ul')
      const removeButtonEl = document.createElement('button')
      const id = `gfxOptions-${idx}`

      optNameEl.innerText = opt.name
      opt.options.forEach((str) => {
        const el = document.createElement('li')
        el.innerText = str
        optOptsEl.appendChild(el)
      })
      removeButtonEl.setAttribute('onclick', `removeGfxOption(${idx}, '${id}')`)
      removeButtonEl.innerText = "Remove Option"

      optEl.id = id
      optEl.appendChild(optNameEl)
      optEl.appendChild(optOptsEl)
      optEl.appendChild(removeButtonEl)

      gfxOptionsListEl.appendChild(optEl)
    }
  },
  image: (img) => {
    const imageEl = document.getElementById('images')
    const imgLegend = document.createElement('legend')
    imgLegend.id='images-legend'
    imgLegend.appendChild(h(2, "Game Images"))

    deleteChildren(imageEl)
    imageEl.appendChild(imgLegend)

    const imgTypes = ['Cover', 'Background']

    for (const type of imgTypes) {
      console.log(type)
      const typeLower = type.toLowerCase()
      const imgSpan = document.createElement('span')
      const imgImg = document.createElement('img')
      const imgSelect = document.createElement('input')
      const imgPreview = document.createElement('img')

      imgSelect.addEventListener("change", async (event) => {
        console.log(event.target)
        const elem = event.target
        if (elem.files.length == 1) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            imgPreview.src = reader.result
          })
          console.log("File selected: ", elem.files[0]);
          reader.readAsDataURL(elem.files[0])
          imgPreview.setAttribute('height', '100px')
        }
      })

      imgImg.src = targetGame.url + `/image/${typeLower}`
      imgImg.classList.add(`game-image`)

      imgPreview.src = ``
      imgPreview.classList.add(`game-image-preview`)

      imgSelect.type = `file`
      imgSelect.name = `input-file-${typeLower}-image`
      imgSelect.accept = `image/png, image/jpeg`
      imgSelect.id = `image-${typeLower}-input-file`

      imgSpan.appendChild(imgImg)
      imgSpan.appendChild(h(3, `${type}`))
      imgSpan.appendChild(imgSelect)
      imgSpan.appendChild(h(3, `Preview`))
      imgSpan.appendChild(imgPreview)


      imageEl.appendChild(imgSpan)
    }
  },
  performanceRecordList: (perfRecs) => {

  },
}

function removeGfxOption(idx, id) {
  console.log(`remove called on index: ${idx} | element id: ${id}`)
}

function p(text) {
  const e = document.createElement('p')
  e.innerText = text
  return e
}

function span(text) {
  const e = document.createElement('span')
  e.innerText = text
  return e
}

function checkbox(name, labelText) {
  const e = document.createElement('div')
  const inputEl = document.createElement('input')
  const labelEl = document.createElement('label')

  inputEl.type = 'checkbox'
  inputEl.name = name
  labelEl.for = name
  labelEl.innerText = labelText

  e.appendChild(inputEl)
  e.appendChild(labelEl)

  e.id = [
    'input',
    'checkbox',
    name.toLowerCase().replaceAll(' ', '-')
  ].join('-')

  return e
}

function h(num, text) {
  const e = document.createElement(`h${num}`)
  e.innerText = text
  return e
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

function deleteChildren(el) {
  if (el) {
    for (const c of el.children) { c.remove() }
  }
}
