
Date.prototype.yyyymmdd = function() {
  // getMonth is zero based,
  // so we increment by 1
  let mm = this.getMonth() + 1;
  let dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].join('-');
};

const dates = {
  startDate: function() {
     const startDate = new Date();
     startDate.setDate(startDate.getDate() - 7);
     return startDate.yyyymmdd();
   },
   endDate: function() {
     const endDate = new Date();
     return endDate.yyyymmdd();
   }
 };



(function() {
  const app = {
    apiURL: `https://api.github.com/search/repositories?q=created:%22${dates.startDate()}+..+${dates.endDate()}%22%20language:javascript&sort=stars&order=desc`
  };

  app.getTrends = function() {
   let networkReturned = false;
    if ('caches' in window) {
      caches.match(app.apiURL).then((response) => {
        if (response) {
          response.json().then((trends) => {
            console.log('From cache...')
            if(!networkReturned) {
              app.updateTrends(trends);
            }
          });
        }
      });
    }

    fetch(app.apiURL)
    .then(response => response.json())
    .then((trends) => {
      console.log('From server...')
      app.updateTrends(trends.items)
      console.log('after update trends');
      networkReturned = true;
    }).catch((err) => {
      console.log(err);
      console.log('Error from server...');
    });
  }

  app.updateTrends = function(trends) {
    console.log('in updateTrends');
    const trendsRow = document.querySelector('.trends');
    console.log('got trendsRow');
    for (let i = 0; i < trends.length; i++) {
      const trend = trends[i];
      trendsRow.appendChild(app.createCard(trend));
    }
  }

  app.createCard = function(trend) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card__inner">
        <div class="card__title"></div>
        <div class="card__body">
          <div class="body__language"></div>
          <div class="body__stars"></div>
          <div class="body__forks"></div>
          <div class="body__link"></div>
        </div>
      </div>
    `;

    card.querySelector('.card__title').textContent = trend.full_name
    card.querySelector('.body__language').textContent = trend.language
    card.querySelector('.body__stars').textContent = trend.stargazers_count
    card.querySelector('.body__forks').textContent = trend.forks
    card.querySelector('.body__link').setAttribute('href', trend.html_url)
    card.querySelector('.body__link').setAttribute('target', '_blank')

    return card;
  }

  document.addEventListener('DOMContentLoaded', function() {
    app.getTrends();

    const refreshButton = document.querySelector('.refresh');
    refreshButton.addEventListener('click', app.getTrends);
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() {
        console.log('Service Worker Registered');
      });
  }
})();
