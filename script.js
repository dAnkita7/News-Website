    const apikey = "d94d5d2125694a9d823322881f7c3fcd";

    // Selecting containers for different sections on the page
    const breakingNewsContainer = document.querySelector("#breaking-news-container");
    const trendingNewsContainer = document.querySelector("#trending-news-container");
    const topWeeklyNewsContainer = document.querySelector(".top-weekly-news");
    const normalNewsContainer = document.querySelector(".normal-news");

    // Document ready event listener
    document.addEventListener('DOMContentLoaded', function() {
        // Set the category based on the current page
        const category = getCategoryFromUrl(); // Function to get category from URL
        loadBreakingNews(category);
        loadTrendingNews(category);
        loadTopWeeklyNews(category);
        loadNormalNews(category);

        // Night Mode Toggle
        const nightModeToggle = document.getElementById('night-mode-toggle');
        nightModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('night-mode');
            nightModeToggle.textContent = document.body.classList.contains('night-mode') ? 'Day Mode' : 'Night Mode';
        });

        // Dictionary Search
        const dictionarySearchBtn = document.getElementById('dictionary-search-btn');
        const dictionaryInput = document.getElementById('dictionary-input');
        dictionarySearchBtn.addEventListener('click', async () => {
            const word = dictionaryInput.value.trim();
            if (word) {
                const result = await fetchDictionaryDefinition(word);
                displayDictionaryResult(result, word); // Pass 'word' to displayDictionaryResult function
            }
        });
    });

    const fetchDictionaryDefinition = async (word) => {
        const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(dictionaryApiUrl);
        const data = await response.json();
        return data;
    };

    const displayDictionaryResult = (result, word) => { // Include 'word' parameter
        const dictionaryResultContainer = document.getElementById('dictionary-result');
        if (result.title === "No Definitions Found") {
            dictionaryResultContainer.innerHTML = `<p>No definitions found for "${word}".</p>`;
        } else {
            const meanings = result[0].meanings.map(meaning => {
                return `<div>
                    <h5>${meaning.partOfSpeech}</h5>
                    <p>${meaning.definitions[0].definition}</p>
                    <p><em>${meaning.definitions[0].example || ''}</em></p>
                </div>`;
            }).join('');
            dictionaryResultContainer.innerHTML = meanings;
        }
        $('#dictionaryModal').modal('show');
    };

    // Get category from URL
    function getCategoryFromUrl() {
        const path = window.location.pathname.split('/').pop().split('.').shift();
        return path === 'index' ? 'in' : path;
    }

    // Load news functions
    async function loadBreakingNews(category) {
        // Fetch breaking news based on category
        const breakingNewsUrl = `https://newsapi.org/v2/top-headlines?country=${category}&apikey=${apikey}`;
        const response = await fetch(breakingNewsUrl);
        const data = await response.json();
        displayBreakingNews(data.articles);
    }

    async function loadTrendingNews(category) {
        // Fetch trending news based on category
        const trendingNewsUrl = `https://newsapi.org/v2/top-headlines?country=${category}&sortBy=popularity&apikey=${apikey}`;
        const response = await fetch(trendingNewsUrl);
        const data = await response.json();
        displayTrendingNews(data.articles);
    }

    async function loadTopWeeklyNews(category) {
        // Fetch top weekly news based on category
        const topWeeklyNewsUrl = `https://newsapi.org/v2/everything?q=${category}&from=${getOneWeekAgoDate()}&sortBy=popularity&apikey=${apikey}`;
        const response = await fetch(topWeeklyNewsUrl);
        const data = await response.json();
        displayTopWeeklyNews(data.articles);
    }

    async function loadNormalNews(category) {
        // Fetch normal news based on category
        const normalNewsUrl = `https://newsapi.org/v2/everything?q=${category}&apikey=${apikey}`;
        const response = await fetch(normalNewsUrl);
        const data = await response.json();
        displayNormalNews(data.articles);
    }

    // Display news functions
    function displayBreakingNews(articles) {
        const carouselInner = document.getElementById('breaking-news-items');
        carouselInner.innerHTML = articles.slice(0, 2).map((article, index) => {
            return `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${article.urlToImage}" class="d-block w-100" alt="${article.title}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${article.title}</h5>
                        <p>${article.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    function displayCategoryBreakingNews(articles, category) {
        const categoryNewsContainer = document.getElementById(`${category}-news-container`);
        categoryNewsContainer.innerHTML = articles.map(article => {
            return `
                <div class="col-md-6">
                    <div class="card mb-3">
                        <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function displayTrendingNews(articles) {
        const trendingNewsList = document.getElementById('trending-news-list');
        trendingNewsList.innerHTML = articles.slice(0, 5).map(article => {
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="mb-1">${article.title}</h5>
                        <p class="mb-1">${article.description}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
                        <small>${new Date(article.publishedAt).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    function displayTopWeeklyNews(articles) {
        const topWeeklyNewsContainer = document.getElementById('top-weekly-news-container');
        topWeeklyNewsContainer.innerHTML = articles.slice(0, 4).map(article => {
            return `
                <div class="col-md-3">
                    <div class="card">
                        <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.url}" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function displayNormalNews(articles) {
        const normalNewsContainer = document.getElementById('normal-news-container');
        normalNewsContainer.innerHTML = articles.slice(0, 6).map(article => {
            return `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.url}" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Utility function to get the date one week ago
    function getOneWeekAgoDate() {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    }

