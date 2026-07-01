
let currentCharacter = "";
let charIntro = "";

/**
 * DOM element cache to minimize document lookups and improve performance.
 */
const domCache = {};
function getEl(id) {
    if (!domCache[id]) domCache[id] = document.getElementById(id);
    return domCache[id];
}

/**
 * Toggles a movie in the favorites list.
 * Optimization: Lazy initialization of localStorage.
 */
function toggleFavorite(title) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
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

/**
 * Toggles a movie in the watchlist.
 * Optimization: Lazy initialization of localStorage.
 */
function toggleWatchlist(title) {
    let wl = JSON.parse(localStorage.getItem('watchlist')) || [];
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

/**
 * Posts a new review for a title.
 * Optimization: O(1) DOM update by surgically appending the new review.
 */
function postReview(title) {
    const textEl = getEl('review-text');
    const text = textEl.value;
    if (!text) return;

    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    textEl.value = "";

    // Performance optimization: Append only the new review instead of re-rendering the list
    const list = getEl('reviews-list');
    if (list) {
        appendReviewItem(list, text);
    }
}

/**
 * Helper to create and append a review item to a container.
 * @param {HTMLElement|DocumentFragment} container - The element to append to.
 * @param {string} text - The review text.
 */
function appendReviewItem(container, text) {
    const div = document.createElement('div');
    div.style.borderBottom = "1px solid white";
    div.style.padding = "5px";
    div.textContent = text; // Secure and faster than innerHTML
    container.appendChild(div);
}

/**
 * Renders reviews for a given title.
 * Optimization: Uses DocumentFragment and textContent to minimize layout thrashing.
 */
function displayReviews(title, manualReviews) {
    const list = getEl('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const allReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    const reviews = manualReviews || (allReviews[title] || []);

    // Clear list efficiently
    list.textContent = "";
    const fragment = document.createDocumentFragment();

    reviews.forEach(r => {
        appendReviewItem(fragment, r);
    });

    list.appendChild(fragment);
}

// Chat logic
const characterResponses = {
    'Mirabel': "I'm just doing my best to help the family! What do you think about our Casita?",
    'Bruno': "The future is unpredictable, but I hope it's bright for you!",
    'Moana': "The ocean is calling me! Do you like sailing too?",
    'Maui': "You're welcome! I mean... what was your question again? I'm awesome, right?",
    'Jinu': "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    'Rumi': "Our music is our strength. Let's keep the rhythm going!",
    'Chihiro': "I must remember my name and save my parents. Will you help me?",
    'Haku': "Don't forget your name. I will help you find your way back."
};

/**
 * Appends a message to the chat history.
 * Optimization: Uses textContent for O(1) DOM updates.
 */
function appendChatMessage(container, sender, message) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = sender + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(message));
    container.appendChild(p);
}

function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    getEl('chat-display').style.display = "block";
    getEl('chat-char-name').textContent = "Chat with " + name;
    const history = getEl('chat-history');
    history.textContent = "";
    appendChatMessage(history, name, intro);
    getEl('chat-input').focus();
}

function sendMessage() {
    const input = getEl('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = getEl('chat-history');

    // Performance optimization: Use O(1) DOM updates
    appendChatMessage(history, "You", msg);

    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Fake response with O(1) lookup
    setTimeout(() => {
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";
        appendChatMessage(history, currentCharacter, response);
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Mapping for special page-to-title cases
const pageTitleMap = {
    'moana2': 'MOANA 2'
};

/**
 * Initial logic on DOMContentLoaded.
 * Optimization: Early exit if #reviews-list is missing, preventing unnecessary URL parsing.
 */
window.addEventListener('DOMContentLoaded', function() {
    if (!getEl('reviews-list')) return;

    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    if (filename) {
        let page = pageTitleMap[filename] || filename.toUpperCase().replace(/_/g, " ");
        displayReviews(page);
    }
});
