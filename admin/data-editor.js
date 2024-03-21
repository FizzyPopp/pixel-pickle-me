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
  render.title(targetGame.data.title)
  render.image(targetGame.data.image)
  render.platforms(targetGame.data.platforms)
  render.gfxOptions(targetGame.data.gfxOptions)
})

let gfxOptionsNameInputEl = document.querySelector('#gfxOptions-name-input')

gfxOptionsNameInputEl.addEventListener('change', (event) => {
  const optionName = gfxOptionsNameInputEl.value
  console.log(optionName)
  document.querySelector('#gfxOptions-options-legend').textContent = "" + optionName + " entries"
})

const render = {
  title: (t) => {
    const titleEl = document.getElementById('title')
    titleEl.innerText = t
  },
  platforms: (p) => {
    const platListEl = document.getElementById('platforms-list')

    deleteChildren(platListEl)

    for (let platId = 0; platId < platformData.PlatformEnum.length; platId++) {
      const platName = platformData.PlatformEnum[platId].name
      const platformListItem = document.createElement('li')
      const featureList = document.createElement('ul')
      fetch(`${targetGame.url}/`)

      const platformCheckbox = checkbox(platName, platName)
      platformCheckbox.children[0].checked = targetGame.data.platforms.includes(platId)
      console.log(`check boxxx:`)
      console.log(targetGame.data.platforms.includes(platId))
      platformListItem.appendChild(platformCheckbox)
      platformCheckbox.children[0].onclick = (ev) => {
        const chkbx = ev.target
        console.log(chkbx)
        postUrl(`${targetGame.url}/platforms/${platId}`)
          .then((response) => {
          console.log(response)
          if (response.status !== 200) {
            chkbx.checked = !chkbx.checked
          }
          if (chkbx.checked === false) {
            for (const child of featureList.children) {
              child.children[0].checked = false
            }
          }
        })
      }

      for (const feature of platformData.PlatformFeatures[platId].featureList) {
        const featureBox = checkbox(
          feature.name,
          feature.name,
        )
        console.log(feature.name)
        featureBox.children[0].checked = targetGame.data.platformFeatures[platId].featuresActive.includes(feature.name)

        console.log(featureBox.children[0].checked)

        featureBox.onclick = (ev) => {
          const chkbx = ev.target
          console.log(chkbx)
          postUrl(`${targetGame.url}/platform-features/${platId}`, JSON.stringify(feature.name))
            .then((response) => {
              if (response.status !== 200) {
                chkbx.checked = !chkbx.checked
              }
          })
        }

        featureList.appendChild(featureBox)
      }
      platformListItem.appendChild(featureList)

      platListEl.appendChild(platformListItem)
    }

    console.log(platListEl)
  },
  gfxOptions: (gfxOpts) => {
    const gfxOptionsListEl = document.getElementById('gfxOptions-list')

    console.log(gfxOpts)
    console.log(gfxOptionsListEl.children)

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

    deleteChildren(imageEl)

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

function deleteChildren(el) { for (const c of el.children) { c.remove() } }
