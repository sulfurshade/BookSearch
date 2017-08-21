const QUIZ_MODAL_POPUP = ".modal";
const QUIZ_MODAL_CLOSE = ".close-button";
const QUIZ_MODAL_TEXT = '.modal-text';
const QUIZ_MODAL_NAME = '.modal-name';
const GBOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'; //google books
const TD_BASE_URL = 'https://tastedive.com/api/similar'; //tastedive

let queryState = {
  maxResults: 5,
  projection: 'lite',
  key: "AIzaSyDXuFocA6d2wQyECKv1_VxkDPYnjxIE8Gk"
}

let recommendState = {
  type: "books",
  info: 1,
  limit: 3,
  k: "279300-BookSear-BLEYCEOF"
}

function getDataFromGBooksApi (query, callback) {
  $.getJSON(GBOOKS_BASE_URL, query, callback);
}
function getDataFromTDApi (query) {
  $.ajax({
    url: TD_BASE_URL,
    data: query,
    dataType: "jsonp",
    jsonpCallback: "displayTDSearchData"
  });
}

function displayGBooksSearchData(data) {
  const results = data.items.map((item, index) => displayResults(item, index));
  $('.js-search-results').html(results);
}

function displayTDSearchData(data) {
  const recommended = data.Similar.Results.map((item, index) => displayRecommend(item, index));
  $('.js-recommend-results').html(recommended);
}

function submitData() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchInput = $('#js-search-input');
    queryState.q = searchInput.val();
    searchInput.val("");
    $('#js-results-box').removeAttr('hidden');
    getDataFromGBooksApi(queryState, displayGBooksSearchData);
  });
  
  $('body').on('click', '.js-find-recommend', function(event) {
    var bookName = $(this).closest('.js-results-section').attr('data-book-name');
    recommendState.q = bookName;
    $('#js-recommend-box').removeAttr('hidden');
    getDataFromTDApi(recommendState, displayTDSearchData);
  });
  
  $(QUIZ_MODAL_CLOSE).click(function() {
    $(QUIZ_MODAL_POPUP).addClass('hidden');
    $("body").css("overflow", "visible");
  });
}

function displayResults(result, index) {
  var img = (result.volumeInfo.imageLinks) ? `<img src="${result.volumeInfo.imageLinks.thumbnail}" alt="" class="js-result-pic" />` : '';
  return `
    <div class="js-results-section" data-book-name="${result.volumeInfo.title}">
      <h2>
        <a class="js-result-name" href="${result.volumeInfo.infoLink}" target="_blank">
          ${result.volumeInfo.title}
        </a>
      </h2>
      <br />
      ${img}
      <span class="js-results-info"><span class="bold">Author: ${result.volumeInfo.authors}</span><br />
      Description: ${result.volumeInfo.description}</span>

      <div class="js-recommend">
        <button class="js-find-recommend" data-popup-open="popup-feedback">Find Recommendations</button>
      </div>

    </div>
  `;
}

function displayRecommend(recommend, index) {
  $(QUIZ_MODAL_POPUP).removeClass('hidden');
  $(QUIZ_MODAL_NAME).html(recommend.Name);
  $(QUIZ_MODAL_NAME).attr("href", recommend.wUrl);
  $(QUIZ_MODAL_TEXT).html('Description: ' + recommend.wTeaser);
  $("body").css("overflow", "hidden");
}

$(submitData);

var modal = document.getElementById('popup-modal');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}