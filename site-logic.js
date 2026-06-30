
let currentCharacter = "";
let charIntro = "";

// Removed redundant top-level localStorage initialization to save cycles on every page load.
// Functions now use robust default values (|| [] or || {}) when reading from localStorage.

function toggleFavorite(title) {
    title = title.toUpperCase();
    const favsJson = localStorage.getItem('favorites');
    let favs = favsJson ? JSON.parse(favsJson) : [];

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
    title = title.toUpperCase();
    const wlJson = localStorage.getItem('watchlist');
    let wl = wlJson ? JSON.parse(wlJson) : [];

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
    const input = document.getElementById('review-text');
    const text = input.value;
    if (!text) return;

    title = title.toUpperCase();
    const reviewsJson = localStorage.getItem('reviews');
    let reviews = reviewsJson ? JSON.parse(reviewsJson) : {};

    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    input.value = "";

    // Performance optimization: O(1) surgical DOM update instead of full list re-render
    const list = document.getElementById('reviews-list');
    if (list) {
        appendReviewItem(list, text);
    }
}

/**
 * Appends a single review item to the container.
 * Optimization: Encapsulates O(1) DOM update logic.
 * @param {HTMLElement} container - The reviews list element.
 * @param {string} text - The review text.
 */
function appendReviewItem(container, text) {
    const div = document.createElement('div');
    div.style.borderBottom = "1px solid white";
    div.style.padding = "5px";
    div.textContent = text; // textContent is faster and safer than innerText/innerHTML
    container.appendChild(div);
}

/**
 * Renders reviews for a given title.
 * Optimization: Uses DocumentFragment and appendReviewItem for efficient batch rendering.
 * @param {string} title - The title to display reviews for.
 * @param {Array} [manualReviews] - Optional pre-loaded reviews.
 * @param {HTMLElement} [listElement] - Optional pre-queried list element.
 */
function displayReviews(title, manualReviews, listElement) {
    const list = listElement || document.getElementById('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const reviewsJson = localStorage.getItem('reviews');
    const reviews = manualReviews || (reviewsJson ? (JSON.parse(reviewsJson)[title] || []) : []);

    // Clear list and use fragment for efficient DOM updates
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
 * Optimization: Uses createElement and textContent for O(1) DOM updates.
 * @param {HTMLElement} container - The chat history element.
 * @param {string} sender - The sender's name.
 * @param {string} message - The message content.
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
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').textContent = "Chat with " + name;
    const history = document.getElementById('chat-history');
    history.textContent = ""; // Optimization: Clearing with textContent is faster than innerHTML
    appendChatMessage(history, name, intro);
    document.getElementById('chat-input').focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');

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

// Load reviews on DOMContentLoaded instead of window.load
// This improves perceived performance as we don't wait for images/iframes
window.addEventListener('DOMContentLoaded', function() {
    // Optimization: Skip expensive operations if reviews-list is not on page
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    if (filename) {
        // Special case for moana2 -> MOANA 2
        let page = filename.toUpperCase().replace(/_/g, " ");
        if (page === "MOANA2") page = "MOANA 2";
        displayReviews(page, null, reviewsList);
    }
});
