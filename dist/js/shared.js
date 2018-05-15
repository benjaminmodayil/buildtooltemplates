function editLocalStorage(newItem) {
  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
  let tempItems = oldItems
  oldItems = []

  oldItems.push(newItem)
  let allTheNew = oldItems.concat(tempItems)

  localStorage.setItem('itemsArray', JSON.stringify(allTheNew))
}

function removeLocalStorage(title) {
  var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
  let newItems = oldItems.filter(item => item.title !== title)

  localStorage.setItem('itemsArray', JSON.stringify(newItems))
}

function setDate() {
  var date = new Date()
  var weekday = new Array(7)
  weekday[0] = 'Sunday'
  weekday[1] = 'Monday'
  weekday[2] = 'Tuesday'
  weekday[3] = 'Wednesday'
  weekday[4] = 'Thursday'
  weekday[5] = 'Friday'
  weekday[6] = 'Saturday'
  let currentDay = weekday[date.getDay()]
  return currentDay
}

function unique(arr, f) {
  const vArr = arr.map(f)
  return arr.filter((_, i) => vArr.indexOf(vArr[i]) === i)
}

function createCard(item, type, i = 0, iconIsRemove = false) {
  let element,
    descriptionCheck,
    imageCheck,
    title,
    authorTemplate,
    authorCheck,
    imageTemplate,
    correctIcon,
    correctClass

  descriptionCheck =
    type === 'span-half' && item.description !== null && item.description !== undefined
      ? `
        <p class="js-card__description">${item.description.substr(0, 85)}...</p>`
      : ''

  if (
    item.urlToImage === undefined ||
    item.urlToImage === null ||
    item.urlToImage.length === 0
  ) {
    imageCheck = true
    type = 'span-small'
  } else {
    imageCheck = false
  }

  title = item.title === null ? (element = '') : item.title
  authorTemplate = `<p class="js-card__author">${item.author}</p>`

  authorCheck = item.author === null ? true : false

  imageTemplate = `<a class="js-card__img-container" href=${item.url}>
      <div class="js-card__img" style="background-image:url(${
        item.urlToImage
      })" role="img" alt="">
      </div>
    </a>
  `
  correctIcon = iconIsRemove
    ? `<img class="icon-file-delete" src="./images/icon-delete.svg">`
    : `<img class="icon-file-add" src="./images/file-add.svg">`

  correctClass = iconIsRemove ? `js-remove-saved` : `js-add-to-saved`

  element = `
  <li class="js-card js-fadeInDown js-${type}" style="animation-delay: ${i * 5 / 50}s">
  ${imageCheck === false ? imageTemplate : ''}
       <div class="js-card__container ${imageCheck === true ? 'js-stretch' : ''}">
        <div class="js-card__text">
          <a href=${item.url}>
            <h2>${item.title}</h2>
            ${authorCheck ? '' : authorTemplate}
            ${descriptionCheck}
          </a>
        </div>
        <div class="js-card__button-container">
          <button class="js-card__button ${correctClass}" type="button" title="save article"><span class="screenreader-only">save article</span>${correctIcon}</button>
        </div>
       </div>
       </li>
      `
  return element
}
