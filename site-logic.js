
let currentCharacter = "";
let charIntro = "";

/**
 * Global hash map for O(1) character response retrieval.
 * Includes all characters: Mirabel, Bruno, Moana, Maui, Jinu, Rumi, Chihiro, Haku.
 */
const characterResponses = {
    'Mirabel': "I'm just doing my best to help the family! What do you think about our Casita?",
    'Bruno': "The future is unpredictable, but I hope it's bright for you!",
    'Moana': "The ocean is calling me! Do you like sailing too?",
    'Maui': "You're welcome! I mean... what was your question again? I'm awesome, right?",
    'Jinu': "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    'Rumi': "Our music is our strength. Let's keep the rhythm going!",
    'Chihiro': "I have to stay brave to save my parents. Have you ever been to a bathhouse?",
    'Haku': "Remember your name, it's the key to your freedom. I'll help you as much as I can."
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

/**
 * Helper function for secure and consistent review element creation.
 * @param {string} text - The review text.
 * @returns {HTMLElement} The created review div element.
 */
function createReviewElement(text) {
    const div = document.createElement('div');
    div.style.borderBottom = "1px solid white";
    div.style.padding = "5px";
    div.textContent = text; // textContent is faster and safer than innerText/innerHTML
    return div;
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

    // Performance optimization: append directly to DOM (O(1)) instead of re-rendering everything (O(N))
    const list = document.getElementById('reviews-list');
    if (list) {
        list.appendChild(createReviewElement(text));
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
        fragment.appendChild(createReviewElement(r));
    });

    list.appendChild(fragment);
}

/**
 * Helper function for secure and efficient O(1) chat message appending.
 * @param {HTMLElement} historyElement - The chat history container.
 * @param {string} sender - The sender name (e.g., 'You' or character name).
 * @param {string} message - The message content.
 */
function appendChatMessage(historyElement, sender, message) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = sender + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(message));
    historyElement.appendChild(p);
    historyElement.scrollTop = historyElement.scrollHeight;
}

// Chat logic
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').innerText = "Chat with " + name;
    const history = document.getElementById('chat-history');

    // Performance: Clear history and use helper for O(1) initial message
    history.textContent = "";
    appendChatMessage(history, name, intro);

    document.getElementById('chat-input').focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');

    // Performance: O(1) DOM update via helper
    appendChatMessage(history, "You", msg);
    input.value = "";

    // Fake response using O(1) lookup hash map
    setTimeout(() => {
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";
        appendChatMessage(history, currentCharacter, response);
    }, 1000);
}

/**
 * Handles Enter key press in the chat input.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
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

    // Attach Enter key listener to chat input if it exists
    const chatInput = document.getElementById('chat-input');
    if (chatInput && !chatInput.dataset.listenerAdded) {
        chatInput.addEventListener('keydown', handleKeyPress);
        chatInput.dataset.listenerAdded = 'true';
    }
});
