
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
 * Creates a review element.
 * Optimization: Uses textContent to securely and efficiently create the review DOM element.
 * @param {string} text - The review text.
 * @returns {HTMLElement} The review element.
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

    // Performance optimization: Append the new review directly to the DOM (O(1))
    // instead of re-rendering the entire list from localStorage (O(N)).
    const list = document.getElementById('reviews-list');
    if (list) {
        list.appendChild(createReviewElement(text));
    }
}

/**
 * Renders all reviews for a given title.
 * Optimization: Uses DocumentFragment and createReviewElement to minimize layout thrashing and prevent XSS.
 * @param {string} title - The title to display reviews for.
 * @param {Array} [manualReviews] - Optional pre-loaded reviews.
 */
function displayReviews(title, manualReviews) {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    title = title.toUpperCase();
    const reviews = manualReviews || (JSON.parse(localStorage.getItem('reviews'))[title] || []);

    // Clear list and use fragment for efficient batch DOM updates
    list.textContent = "";
    const fragment = document.createDocumentFragment();

    reviews.forEach(r => {
        fragment.appendChild(createReviewElement(r));
    });

    list.appendChild(fragment);
}

// Chat logic
// Performance optimization: Using a hash map for O(1) response retrieval instead of O(N) if-else chain
const characterResponses = {
    'Mirabel': "I'm just doing my best to help the family! What do you think about our Casita?",
    'Bruno': "The future is unpredictable, but I hope it's bright for you!",
    'Moana': "The ocean is calling me! Do you like sailing too?",
    'Maui': "You're welcome! I mean... what was your question again? I'm awesome, right?",
    'Jinu': "Stay alert, the demons could be anywhere. Do you have your weapon ready?",
    'Rumi': "Our music is our strength. Let's keep the rhythm going!",
    'Chihiro': "Everything is so strange here, but I must stay brave to save my parents.",
    'Haku': "Remember your name, and don't eat the food of this world if you want to return."
};

/**
 * Appends a message to the chat history.
 * Optimization: Uses appendChild and textContent for O(1) DOM updates, avoiding expensive innerHTML re-parsing.
 * @param {string} sender - The name of the sender.
 * @param {string} message - The message content.
 */
function appendChatMessage(sender, message) {
    const history = document.getElementById('chat-history');
    if (!history) return;

    const msgElement = document.createElement('p');
    const strongElement = document.createElement('strong');
    strongElement.textContent = sender + ": ";

    msgElement.appendChild(strongElement);
    msgElement.appendChild(document.createTextNode(message));
    history.appendChild(msgElement);

    history.scrollTop = history.scrollHeight;
}

function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').textContent = "Chat with " + name;

    const history = document.getElementById('chat-history');
    if (history) {
        history.textContent = ""; // Clear history efficiently
        appendChatMessage(name, intro);
    }

    document.getElementById('chat-input').focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    appendChatMessage("You", msg);
    input.value = "";

    // Fake response
    setTimeout(() => {
        // O(1) lookup instead of O(N) if-else chain
        const response = characterResponses[currentCharacter] || "That's very interesting! Tell me more.";
        appendChatMessage(currentCharacter, response);
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
