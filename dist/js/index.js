let newsAPIKey = 'ed14c7ddee15497fb440c9369baf1371'

// double check form

// make saved.js into class structure

const el = document.querySelector('data-index')
class ArticlePage {
  constructor(el) {
    this.el = el
    this.setupDOM()
  }

  setupDOM() {
    this.categories = [
      'general',
      'business',
      'entertainment',
      'health',
      'science',
      'sports',
      'technology'
    ]

    this.indexPage = document.querySelector('[data-index]')
    this.container = this.indexPage.querySelector('.container')

    $(this.container).append(`<div class="js-button-container"></div>
    <h1 class="h2 js-headline-and-search-results"><span class="js-headline-and-search-results__pre-text">Headlines for</span> <span class="js-result-title">${setDate()}</span></h1>
    <ul class="m-center"></ul>`)

    this.categories.forEach(item =>
      $('.js-button-container').append(`
    <button class="js-category" data-category="${item}">${item}</button>
    `)
    )

    this.data = []
    this.currentArticles = []

    $('.home-page').on(
      'click touchstart',
      '[data-category]',
      this.categoryFetch.bind(this)
    )
    $('form').on('submit touchstart', this.handleForm.bind(this))
  }

  fetchQuery(query) {
    // I used ES6's Fetch for this project, but commented below is another way with jquery:
    // $.ajax({ dataType: 'json', url: query }).then(data => {
    //   console.log(data.articles)
    // })

    let myHeaders = new Headers()
    let myInit = { method: 'GET', headers: myHeaders, mode: 'cors', cache: 'default' }

    let currentDay = new Date()
    currentDay = currentDay.toISOString().substring(0, 10)
    console.log(query)
    fetch(
      query
        ? query
        : `https://newsapi.org/v2/top-headlines?country=us&apiKey=ed14c7ddee15497fb440c9369baf1371`,
      myInit
    )
      .then(function(response) {
        return response.json()
      })
      .then(response => {
        this.data = response.articles
        this.data = unique(this.data, e => e.title)
        this.currentArticles = this.data
        return this.data
      })
      .then(data => {
        this.renderArticles(data)
      })
  }

  categoryFetch(e) {
    let category = e.currentTarget.dataset.category
    $('.js-category--highlight').removeClass('js-category--highlight')
    $(e.currentTarget).addClass('js-category--highlight')
    $('.js-headline-and-search-results__pre-text').text('News related to')
    $('.js-result-title').text(category)
    category = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${newsAPIKey}`
    articlePage.fetchQuery(category)
    document
      .querySelector('.js-headline-and-search-results')
      .scrollIntoView({ behavior: 'smooth' })
  }

  renderArticles(data) {
    $('ul').addClass('js-list')
    $('ul').html('')
    data.map((item, i) => {
      let type, element

      type = i % 5 === 0 ? 'span-half' : 'span-quarter'
      element = createCard(item, type, i)
      listContainer.insertAdjacentHTML('beforeend', element)
    })

    $('.js-card__button').on('click touchstart', function(e) {
      let $current, title, description, author, url, urlToImage

      $current = $(e.currentTarget)
      title =
        null ||
        $current
          .closest('li')
          .find('.js-card__text')
          .find('h2')
          .text()

      description =
        null ||
        $current
          .closest('li')
          .find('.js-card__text')
          .find('.js-card__description')
          .text()

      author =
        null ||
        $current
          .closest('li')
          .find('.js-card__text')
          .find('.js-card__author')
          .text()

      url = null || $current.closest('li').find('a')[0].href

      urlToImage =
        $current
          .closest('li')
          .find('a')
          .first('a')
          .find('.js-card__img')[0] !== undefined
          ? $current
              .closest('li')
              .find('a')
              .first('a')
              .find('.js-card__img')[0]
              .style.backgroundImage.slice(4, -1)
              .replace(/"/g, '')
          : ''

      if ($(this).hasClass('js-add-to-saved')) {
        let template = `<a href="/saved.html" class="js-card__button__view-saved">View Saved</a>`
        $(this)
          .closest('.js-card__button-container')
          .prepend(template)
        let iconDelete = document.createElement('img')
        let iconSave = document.createElement('img')

        $(this).attr('title', 'remove')

        $(iconDelete)
          .attr('src', './images/icon-delete.svg')
          .addClass('js-icon-delete')

        $(iconSave)
          .attr('src', './images/icon-save.svg')
          .addClass('js-icon-save')

        $(this).append(iconDelete)

        $(this).append(iconSave)

        $(this).addClass('js-remove-saved')

        $(this).removeClass('js-add-to-saved')

        editLocalStorage({ title, description, author, url, urlToImage })
      } else if ($(this).hasClass('js-remove-saved')) {
        removeLocalStorage(title)
        $(this)
          .closest('.js-card__button-container')
          .find('.js-card__button__view-saved')
          .remove()
        $(this)
          .find($('.js-icon-delete'))
          .remove()
        $(this)
          .find($('.js-icon-save'))
          .remove()
        $(this).removeClass('js-remove-saved')
        $(this).addClass('js-add-to-saved')
      }
    })
  }

  handleForm(e) {
    e.preventDefault()
    let $queryValue, $date1Value, $date2Value, $selectValue, $URL
    $('.js-category--highlight').removeClass('js-category--highlight')
    $queryValue = $('input[name="query"]').val() || ''
    $date1Value = $('input[name="date-1"]').val()
      ? `&from=${$('input[name="date-1"]').val()}`
      : ''
    $date2Value = $('input[name="date-2"]').val()
      ? `&to=${$('input[name="date-2"]').val()}`
      : ''
    $selectValue = `&category=${$('select').val()}` || ''
    $URL = `https://newsapi.org/v2/everything?q=${$queryValue}${$date1Value}${$date2Value}&sortBy=popularity&apiKey=${newsAPIKey}`
    if ($queryValue.trim() === '') {
      return
    } else {
      $('.js-headline-and-search-results__pre-text').text('News related to')
      $('.js-result-title').text($queryValue)

      this.fetchQuery($URL)
      document
        .querySelector('.js-headline-and-search-results')
        .scrollIntoView({ behavior: 'smooth' })

      $('input').val('')
    }
  }
}

let articlePage = new ArticlePage()

let listContainer = document.querySelector('ul')
listContainer.classList.add('js-news-list')

function formFocus() {
  $('input:text:visible:first').focus()
}

$('.home-header__more').on('click touchstart', showFields)

function showFields() {
  let $form = $('.hidden-fields')
  let $searchButton = $('.search-button')

  if ($form.attr('data-isopen') === 'false') {
    $('.home-header__more__text').text('hide filter')
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', true)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
      $form.addClass('js-transition')
    }, 50)
    $searchButton.removeClass('js-search--width')
    $searchButton.find('.screenreader-only').removeClass('screenreader-only')
    $('input#query').addClass('js-input--width')
    $searchButton.find('img').addClass('js-img--size')
    $form.append($searchButton)
  } else if ($form.attr('data-isopen') === 'true') {
    $('.home-header__more__text').text('filter')
    $form.removeClass('js-transition')
    $form.toggleClass('screenreader-only--with-space')
    $form.attr('data-isopen', false)
    setTimeout(() => {
      $form.toggleClass('js-initialize-form')
    }, 50)
    $searchButton.addClass('js-search--width')
    $searchButton.find('span').addClass('screenreader-only')
    $searchButton.find('img').removeClass('js-img--size')
    $('input#query').removeClass('js-input--width')
    $('input#query').after($searchButton)
  }
}

$(setDate(), formFocus(), articlePage.fetchQuery())
