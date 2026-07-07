let currentCharacter = "";
let charIntro = "";
let chatHistoryElement = null;
let chatInputElement = null;

/**
 * Toggles a title in Favorites.
 * Optimization: Uses lazy initialization for localStorage to avoid redundant writes on page load.
 */
function toggleFavorite(title) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
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
 * Toggles a title in Watchlist.
 * Optimization: Uses lazy initialization for localStorage to avoid redundant writes on page load.
 */
function toggleWatchlist(title) {
    let wl = JSON.parse(localStorage.getItem('watchlist') || '[]');
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
 * Posts a review for a given title.
 * Optimization: Lazy loads storage and passes it directly to displayReviews to avoid redundant I/O.
 */
function postReview(title) {
    const input = document.getElementById('review-text');
    const text = input.value;
    if (!text) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    input.value = "";
    displayReviews(title, reviews[title]);
}

/**
 * Renders reviews for a given title.
 * Optimization: Uses DocumentFragment, textContent, and cssText to minimize layout thrashing.
 * @param {string} title - The title to display reviews for.
 * @param {Array} [manualReviews] - Optional pre-loaded reviews.
 */
function displayReviews(title, manualReviews) {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const reviews = manualReviews || (JSON.parse(localStorage.getItem('reviews') || '{}')[title] || []);

    // Clear list and use fragment for efficient DOM updates
    list.textContent = "";
    const fragment = document.createDocumentFragment();

    reviews.forEach(r => {
        const div = document.createElement('div');
        // cssText is more efficient than individual style assignments
        div.style.cssText = "border-bottom: 1px solid white; padding: 5px;";
        div.textContent = r;
        fragment.appendChild(div);
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
 */
function appendChatMessage(container, sender, message) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = sender + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(message));
    container.appendChild(p);
}

/**
 * Starts a character chat.
 * Optimization: Caches DOM elements to avoid repeated getElementById lookups during chat.
 */
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').textContent = "Chat with " + name;

    // Cache chat elements for performance
    chatHistoryElement = document.getElementById('chat-history');
    chatInputElement = document.getElementById('chat-input');

    chatHistoryElement.textContent = "";
    appendChatMessage(chatHistoryElement, name, intro);
    chatInputElement.focus();
}

/**
 * Sends a user message and triggers a character response.
 * Optimization: Uses cached DOM elements for O(1) retrieval.
 */
function sendMessage() {
    const msg = chatInputElement.value;
    if (!msg) return;

    // Performance optimization: Use O(1) DOM updates with cached elements
    appendChatMessage(chatHistoryElement, "You", msg);

    chatInputElement.value = "";
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;

    // Response with O(1) lookup
    setTimeout(() => {
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";
        appendChatMessage(chatHistoryElement, currentCharacter, response);
        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }, 1000);
}

/**
 * Initialization on DOMContentLoaded.
 * Optimization: Early exit if #reviews-list is missing to avoid unnecessary processing.
 */
window.addEventListener('DOMContentLoaded', function() {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    if (filename) {
        let page = filename.toUpperCase().replace(/_/g, " ");
        // Special mapping for Moana 2
        if (page === "MOANA2") page = "MOANA 2";
        displayReviews(page);
    }
});
