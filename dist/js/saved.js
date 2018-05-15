let oldItems, tempItems

oldItems = JSON.parse(localStorage.getItem('itemsArray')) || []
tempItems = unique(oldItems, e => e.title)

tempItems.map((item, i) => {
  let type, element

  type = i % 5 === 0 ? 'span-half' : 'span-quarter'
  element = createCard(item, type, i, true)
  $('[data-saved]').append(element)
})

$('.js-remove-saved').on('click touchstart', function(e) {
  $current = $(e.currentTarget)
  title = $current
    .closest('li')
    .find('.js-card__text')
    .find('h2')
    .text()

  removeLocalStorage(title)

  $(this)
    .closest('li')
    .remove()

  checkIfAnySavedArticles()
})

function checkIfAnySavedArticles() {
  let articleCheck = $('[data-saved]').find('li')[0] ? true : false
  let template = `<p class="uppercase text-center js-span-all">No articles found</p>
  <p class="text-center js-span-all">Save an article and come back here to read later.</p>`
  if (!articleCheck) {
    $('[data-saved]').append(template)
  }
}

checkIfAnySavedArticles()

// $(, renderSaved())
