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
  newsServise.topHeadlines("ru", onGetResponse);
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");

  let fragment = "";
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);

    fragment += el;
  });

  console.log(fragment);

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
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
  renderNews(response.articles);
}

//! Constants

// Init http module
const http = customHttp();

const newsServise = (function() {
  const apiKey = "589141923b674581b6c1fa0746059635";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,
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
