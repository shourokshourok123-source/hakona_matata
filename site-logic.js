
let currentCharacter = "";
let charIntro = "";

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

/**
 * Posts a new review and updates the DOM efficiently.
 * Optimization: Appends only the new review to the DOM (O(1)) instead of re-rendering the entire list (O(N)).
 * @param {string} title - The title being reviewed.
 */
function postReview(title) {
    const text = document.getElementById('review-text').value;
    if (!text) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    document.getElementById('review-text').value = "";

    const list = document.getElementById('reviews-list');
    if (list) {
        const div = document.createElement('div');
        div.style.borderBottom = "1px solid white";
        div.style.padding = "5px";
        div.textContent = text;
        list.appendChild(div);
    }
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
        const div = document.createElement('div');
        div.style.borderBottom = "1px solid white";
        div.style.padding = "5px";
        div.textContent = r; // textContent is faster and safer than innerText/innerHTML
        fragment.appendChild(div);
    });

    list.appendChild(fragment);
}

// Chat logic
const CHARACTER_RESPONSES = {
    'Mirabel': "I'm just doing my best to help the family! What do you think about our Casita?",
    'Bruno': "The future is unpredictable, but I hope it's bright for you!",
    'Moana': "The ocean is calling me! Do you like sailing too?",
    'Maui': "You're welcome! I mean... what was your question again? I'm awesome, right?",
    'Jinu': "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    'Rumi': "Our music is our strength. Let's keep the rhythm going!"
};

/**
 * Initializes a chat session with a character.
 * Optimization: Uses textContent and DOM methods instead of innerHTML/innerText for better performance.
 */
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;

    const display = document.getElementById('chat-display');
    const charName = document.getElementById('chat-char-name');
    const history = document.getElementById('chat-history');
    const input = document.getElementById('chat-input');

    if (!display || !charName || !history || !input) return;

    display.style.display = "block";
    charName.textContent = "Chat with " + name;

    // Clear history and add intro message efficiently
    history.textContent = "";
    const introMsg = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = name + ": ";
    introMsg.appendChild(strong);
    introMsg.appendChild(document.createTextNode(intro));
    history.appendChild(introMsg);

    input.focus();
}

/**
 * Sends a message and triggers a character response.
 * Optimization: Uses a lookup object for O(1) response retrieval and efficient DOM updates.
 */
function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');
    if (!history) return;

    // Performance optimization: Use appendChild instead of innerHTML += to avoid re-parsing the entire chat history
    const userMsg = document.createElement('p');
    const userStrong = document.createElement('strong');
    userStrong.textContent = "You: ";
    userMsg.appendChild(userStrong);
    userMsg.appendChild(document.createTextNode(msg));
    history.appendChild(userMsg);

    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Trigger character response
    setTimeout(() => {
        const response = CHARACTER_RESPONSES[currentCharacter] || "That's very interesting! Tell me more.";

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
