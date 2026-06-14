
let currentCharacter = "";
let charIntro = "";

/**
 * Performance optimization: Global hash map for O(1) character response lookup.
 * This avoids long if-else chains as the number of characters grows.
 */
const characterResponses = {
    "Mirabel": "I'm just doing my best to help the family! What do you think about our Casita?",
    "Bruno": "The future is unpredictable, but I hope it's bright for you!",
    "Moana": "The ocean is calling me! Do you like sailing too?",
    "Maui": "You're welcome! I mean... what was your question again? I'm awesome, right?",
    "Jinu": "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    "Rumi": "Our music is our strength. Let's keep the rhythm going!",
    "Chihiro": "I have to keep working hard to save my parents and get back home!",
    "Haku": "Remember your name, it's the key to your freedom. I'll help you however I can."
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

    // Performance optimization: Append only the new review instead of re-rendering everything.
    // This is O(1) instead of O(N).
    const list = document.getElementById('reviews-list');
    if (list) {
        list.appendChild(createReviewElement(text));
    }
}

/**
 * Renders reviews for a given title.
 * Optimization: Uses DocumentFragment and createReviewElement for efficient initial render.
 * @param {string} title - The title to display reviews for.
 * @param {Array} [manualReviews] - Optional pre-loaded reviews.
 */
function displayReviews(title, manualReviews) {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const reviews = manualReviews || (JSON.parse(localStorage.getItem('reviews'))[title] || []);

    // Clear list and use fragment for efficient initial DOM construction
    list.textContent = "";
    const fragment = document.createDocumentFragment();

    reviews.forEach(r => {
        fragment.appendChild(createReviewElement(r));
    });

    list.appendChild(fragment);
}

/**
 * Standardizes review DOM element creation.
 * Optimization: Uses textContent for performance and security.
 * @param {string} text - The review text.
 * @returns {HTMLElement} The review div element.
 */
function createReviewElement(text) {
    const div = document.createElement('div');
    div.style.borderBottom = "1px solid white";
    div.style.padding = "5px";
    div.textContent = text;
    return div;
}

/**
 * Helper to handle Enter key on chat input.
 * @param {Event} event - The key event.
 */
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

/**
 * Helper function to append a chat message to the history.
 * Optimization: Uses appendChild with textContent for O(1) performance and security.
 * @param {HTMLElement} history - The chat history container.
 * @param {string} sender - The name of the sender.
 * @param {string} message - The message text.
 */
function appendChatMessage(history, sender, message) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = sender + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(message));
    history.appendChild(p);
}

// Chat logic
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').innerText = "Chat with " + name;
    const history = document.getElementById('chat-history');

    // Optimization: Clear history and use appendChatMessage for consistent, efficient update
    history.textContent = "";
    appendChatMessage(history, name, intro);

    // Add event listener for Enter key if not already present
    const input = document.getElementById('chat-input');
    if (input && !input.dataset.listenerAdded) {
        input.addEventListener('keypress', handleKeyPress);
        input.dataset.listenerAdded = "true";
    }

    input.focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');

    // Performance optimization: Use appendChatMessage for O(1) DOM updates
    appendChatMessage(history, "You", msg);

    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Fake response
    setTimeout(() => {
        // Optimization: O(1) response lookup using characterResponses hash map
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";

        // Optimization: Use appendChatMessage for O(1) DOM updates
        appendChatMessage(history, currentCharacter, response);

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
