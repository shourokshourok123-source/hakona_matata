
let currentCharacter = "";
let charIntro = "";

// Performance optimization: Global hash map for O(1) character response lookups
const characterResponses = {
    'Mirabel': "I'm just doing my best to help the family! What do you think about our Casita?",
    'Bruno': "The future is unpredictable, but I hope it's bright for you!",
    'Moana': "The ocean is calling me! Do you like sailing too?",
    'Maui': "You're welcome! I mean... what was your question again? I'm awesome, right?",
    'Jinu': "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    'Rumi': "Our music is our strength. Let's keep the rhythm going!",
    'Chihiro': "I have to save my parents! Can you help me?",
    'Haku': "Don't forget your name, Chihiro."
};

// Initialize Storage
if (!localStorage.getItem('favorites')) localStorage.setItem('favorites', JSON.stringify([]));
if (!localStorage.getItem('watchlist')) localStorage.setItem('watchlist', JSON.stringify([]));
if (!localStorage.getItem('reviews')) localStorage.setItem('reviews', JSON.stringify({}));

function toggleFavorite(title) {
    let favs = JSON.parse(localStorage.getItem('favorites'));
    title = title.toUpperCase();
    if (favs.includes(title)) {
        favs = favs.filter(t => t !== title);
        alert(title + " removed from Favorites ❤️");
    } else {
        favs.push(title);
        alert(title + " added to Favorites ❤️");
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function toggleWatchlist(title) {
    let wl = JSON.parse(localStorage.getItem('watchlist'));
    title = title.toUpperCase();
    if (wl.includes(title)) {
        wl = wl.filter(t => t !== title);
        alert(title + " removed from Watchlist 📺");
    } else {
        wl.push(title);
        alert(title + " added to Watchlist 📺");
    }
    localStorage.setItem('watchlist', JSON.stringify(wl));
}

function postReview(title) {
    const text = document.getElementById('review-text').value;
    if (!text) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    document.getElementById('review-text').value = "";

    // Performance optimization: Append only the new review in O(1) time instead of re-rendering everything
    const list = document.getElementById('reviews-list');
    if (list) {
        list.appendChild(createReviewElement(text));
    }
}

/**
 * Helper to create a review DOM element.
 * Performance optimization: Uses textContent to securely and efficiently create review elements.
 * @param {string} text - The review text.
 * @returns {HTMLElement} The created review element.
 */
function createReviewElement(text) {
    const div = document.createElement('div');
    div.style.borderBottom = "1px solid white";
    div.style.padding = "5px";
    div.textContent = text; // textContent is faster and safer than innerText/innerHTML
    return div;
}

/**
 * Renders reviews for a given title.
 * Optimization: Uses DocumentFragment and textContent to minimize layout thrashing and prevent XSS.
 * @param {string} title - The title to display reviews for.
 * @param {Array} [manualReviews] - Optional pre-loaded reviews.
 */
function displayReviews(title, manualReviews) {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const reviews = manualReviews || (JSON.parse(localStorage.getItem('reviews'))[title] || []);

    // Clear list and use fragment for efficient DOM updates
    list.textContent = "";
    const fragment = document.createDocumentFragment();

    reviews.forEach(r => {
        fragment.appendChild(createReviewElement(r));
    });

    list.appendChild(fragment);
}

// Chat logic
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').textContent = "Chat with " + name;
    const history = document.getElementById('chat-history');

    // Performance optimization: Use appendChild and textContent instead of innerHTML to avoid re-parsing
    history.textContent = ""; // Clear history
    const introMsg = document.createElement('p');
    const introStrong = document.createElement('strong');
    introStrong.textContent = name + ": ";
    introMsg.appendChild(introStrong);
    introMsg.appendChild(document.createTextNode(intro));
    history.appendChild(introMsg);

    document.getElementById('chat-input').focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');

    // Performance optimization: Use appendChild instead of innerHTML += to avoid re-parsing the entire chat history
    const userMsg = document.createElement('p');
    const userStrong = document.createElement('strong');
    userStrong.textContent = "You: ";
    userMsg.appendChild(userStrong);
    userMsg.appendChild(document.createTextNode(msg));
    history.appendChild(userMsg);

    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Fake response
    setTimeout(() => {
        // Performance optimization: O(1) lookup in characterResponses hash map
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";

        const botMsg = document.createElement('p');
        const botStrong = document.createElement('strong');
        botStrong.textContent = currentCharacter + ": ";
        botMsg.appendChild(botStrong);
        botMsg.appendChild(document.createTextNode(response));
        history.appendChild(botMsg);

        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Load reviews on DOMContentLoaded instead of window.load
// This improves perceived performance as we don't wait for images/iframes
window.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    if (filename) {
        // Special case for moana2 -> MOANA 2
        let page = filename.toUpperCase().replace(/_/g, " ");
        if (page === "MOANA2") page = "MOANA 2";
        displayReviews(page);
    }
});
