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

async function postUrl(url, body) {
  return fetch(url, {
    method: `POST`,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: body? body : {}
  })
}
