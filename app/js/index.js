const moduleElements = document.querySelectorAll('[data-module]')

for (var i = 0; i < moduleElements.length; i++) {
  const el = moduleElements[i]
  const name = el.getAttribute('data-module')
  const Module = require(`./modules/${name}`).default
  new Module(el)
}

let heading = document.querySelector('h1')

let colorToblue = e => {
  e.currentTarget.style.color = '#BADA55'
}

heading.addEventListener('click', colorToblue)
