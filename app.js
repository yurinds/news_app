//! Functions

// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    }
  };
}

function loadNews() {
  renderPreloader();

  if (!search.value) {
    const categoryValue = category.value;
    const countryValue = country.value;

    newsServise.topHeadlines(countryValue, categoryValue, onGetResponse);
  } else {
    const searchValue = search.value;
    newsServise.everything(searchValue, onGetResponse);
  }
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");

  clearNewsContainer(newsContainer);
  removeEmptyNewsListCard();

  if (!news.length) {
    renderEmptyNewsList();
    return;
  }

  renderNewsList(newsContainer, news);
}

function newsTemplate({ urlToImage, title, description, url }) {
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage || ""}">
        <span class="card-title">${title || ""}</span>
      </div>
      <div class="card-content">
        <p>${description || ""}</p>
      </div>
      <div class="card-action">
        <a href="${url || ""}">Read more</a>
      </div>
    </div>
  </div>
  `;
}

// Function on get response from server
function onGetResponse(error, response) {
  removePreloader();

  if (error) {
    M.toast({ html: error });
    return;
  }

  renderNews(response.articles);
}

function clearNewsContainer(newsContainer) {
  while (newsContainer.lastElementChild) {
    newsContainer.removeChild(newsContainer.lastElementChild);
  }
}

function renderEmptyNewsList(newsContainer) {
  const container = document.querySelector(".news-container .container");

  htmlText = `
    <div class="col s12 empty-news-list">
      <div class="card-panel teal">
        <span class="white-text">
          News list is empty!
        </span>
      </div>
    </div>`;

  container.insertAdjacentHTML("afterbegin", htmlText);
}

function removeEmptyNewsListCard() {
  const card = document.querySelector(
    ".news-container .container .empty-news-list"
  );

  if (card) card.remove();
}

function renderNewsList(newsContainer, news) {
  let fragment = "";
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);

    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function renderPreloader() {
  const body = document.body;

  htmlText = `
  <div class="progress">
    <div class="indeterminate"></div>
  </div>`;

  body.insertAdjacentHTML("afterbegin", htmlText);
}

function removePreloader() {
  const preloader = document.querySelector(".progress");

  if (preloader) preloader.remove();
}

//! Constants

// Form
const searchForm = document.forms.newsControls;
const category = searchForm.category;
const country = searchForm.country;
const search = searchForm.search;
const submit = searchForm.action;

// Init http module
const http = customHttp();

const newsServise = (function() {
  const apiKey = "589141923b674581b6c1fa0746059635";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", category = "business", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  };
})();

//! Event listeners

document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

submit.addEventListener("click", function(event) {
  event.preventDefault();

  loadNews();
});
