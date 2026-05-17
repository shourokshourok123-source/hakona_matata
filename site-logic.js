
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

function postReview(title) {
    const text = document.getElementById('review-text').value;
    if (!text) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    if (!reviews[title]) reviews[title] = [];
    reviews[title].push(text);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    document.getElementById('review-text').value = "";
    displayReviews(title);
}

function displayReviews(title) {
    const list = document.getElementById('reviews-list');
    if (!list) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    list.innerHTML = "";
    (reviews[title] || []).forEach(r => {
        const div = document.createElement('div');
        div.style.borderBottom = "1px solid white";
        div.style.padding = "5px";
        div.innerText = r;
        list.appendChild(div);
    });
}

// Chat logic
function startChat(name, intro) {
    currentCharacter = name;
    charIntro = intro;
    document.getElementById('chat-display').style.display = "block";
    document.getElementById('chat-char-name').innerText = "Chat with " + name;
    const history = document.getElementById('chat-history');
    history.innerHTML = `<p><strong>${name}:</strong> ${intro}</p>`;
    document.getElementById('chat-input').focus();
}

const characterData = {
    'Mirabel': {
        keywords: {
            'family': 'Family is everything! We all have our part to play in the Madrigal family.',
            'casita': 'Casita is alive and full of surprises! She loves it when we dance.',
            'gift': 'Not everyone has a magical gift, but we are all special in our own way!',
            'bruno': 'We don\'t talk about... oh, wait, he\'s actually great once you get to know him!',
            'candle': 'The miracle is what brings us together and keeps our home bright.'
        },
        random: [
            'I\'m just doing my best to help everyone!',
            'Do you want to see my embroidery? I\'m working on something new!',
            'Sometimes the best way to help is just by being there.',
            'Casita says hi! She just moved the tiles for you.'
        ]
    },
    'Bruno': {
        keywords: {
            'future': 'The future is... complicated. I try not to look too often these days.',
            'vision': 'My visions can be a bit scary, but they don\'t always mean something bad!',
            'rat': 'They\'re my best friends! They have great stories if you listen closely.',
            'sand': 'It helps me focus. Plus, it\'s everywhere in my room!'
        },
        random: [
            'I\'ve been living in the walls for a while... it\'s actually quite cozy.',
            'Did you bring any snacks? The rats are getting hungry.',
            'I hope your future is full of happiness!',
            'Knock, knock, knock on wood!'
        ]
    },
    'Moana': {
        keywords: {
            'ocean': 'The ocean is a friend of mine. It chose me for a reason!',
            'sailing': 'There\'s nothing like the wind in your sails and the open sea ahead.',
            'te fiti': 'Restoring the heart was the greatest adventure of my life.',
            'maui': 'He\'s... a lot. But he\'s a good demigod deep down.',
            'island': 'Motunui is my home, and I\'ll do anything to protect it.'
        },
        random: [
            'I am Moana of Motunui! And I\'m ready for anything.',
            'Have you ever wondered what\'s beyond the reef?',
            'The stars are my guide. Where should we go next?',
            'The horizon is calling!'
        ]
    },
    'Maui': {
        keywords: {
            'demigod': 'Demigod of the wind and sea, hero of all! You\'re welcome!',
            'hook': 'It\'s a magical fishhook from the gods! Don\'t touch it, it\'s heavy.',
            'tattoo': 'They tell the story of my life. See Mini Maui? He\'s my biggest fan.',
            'ocean': 'Yeah, the ocean is okay. It gets a bit pushy sometimes though.',
            'thanks': 'What can I say except... you\'re welcome!'
        },
        random: [
            'Check out these muscles! Pretty impressive, right?',
            'I pulled up the islands! I stole the fire! I\'m Maui!',
            'Do you want an autograph? I usually sign with my hook.',
            'Life is better when you\'re a legend.'
        ]
    },
    'Jinu': {
        keywords: {
            'demon': 'They hide in the shadows, but our music brings them to light.',
            'weapon': 'My weapon is an extension of my soul. I never leave home without it.',
            'kpop': 'Being an idol is hard work, but fighting demons is even harder.',
            'music': 'The beat is what keeps us moving in the heat of battle.'
        },
        random: [
            'Stay alert. The enemy could be anyone.',
            'I need to get back to dance practice, but I can talk for a bit.',
            'The stage is our battlefield.',
            'Justice has a rhythm.'
        ]
    },
    'Rumi': {
        keywords: {
            'sing': 'Singing is how I express my true self. And it scares demons too!',
            'dance': 'The choreography must be perfect if we want to win.',
            'show': 'Our next performance is going to be legendary! Are you coming?',
            'power': 'Our power comes from our unity and our fans.'
        },
        random: [
            'Let\'s keep the energy high!',
            'I love meeting our fans. You guys are the best!',
            'The music never stops.',
            'We fight for a world where everyone can sing freely.'
        ]
    },
    'Chihiro': {
        keywords: {
            'parents': 'I have to find a way to turn them back! They\'re pigs right now...',
            'haku': 'He helped me when I was lost. He\'s a dragon, did you know that?',
            'name': 'Yubaba took my name! I\'m Sen now, but I won\'t forget who I am.',
            'bathhouse': 'It\'s a strange place, full of spirits and hard work.'
        },
        random: [
            'Everything is so different here... I just want to go home.',
            'Lin is being really helpful, even if she acts tough.',
            'I met a No-Face. He seemed lonely.',
            'I can do this. I have to be brave.'
        ]
    },
    'Haku': {
        keywords: {
            'river': 'I am the spirit of the Kohaku River. I remember now!',
            'dragon': 'My dragon form is how I serve Yubaba... but I want to be free.',
            'chihiro': 'I\'ve known her since she was very small. I will protect her.',
            'yubaba': 'She is a powerful witch. Be careful not to cross her.'
        },
        random: [
            'Don\'t forget your name. If you do, you can never go home.',
            'I will find a way to help you escape.',
            'The spell is strong, but our bond is stronger.',
            'Wait by the bridge at sunset.'
        ]
    }
};

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg) return;

    const history = document.getElementById('chat-history');
    history.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Smart response
    setTimeout(() => {
        let response = "";
        const char = characterData[currentCharacter];
        const lowerMsg = msg.toLowerCase();

        if (char) {
            // Check keywords
            for (let key in char.keywords) {
                if (lowerMsg.includes(key)) {
                    response = char.keywords[key];
                    break;
                }
            }

            // If no keyword, pick random
            if (!response) {
                const randomIndex = Math.floor(Math.random() * char.random.length);
                response = char.random[randomIndex];
            }
        } else {
            response = "That's very interesting! Tell me more.";
        }

        history.innerHTML += `<p><strong>${currentCharacter}:</strong> ${response}</p>`;
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Load reviews on page load
window.addEventListener('load', function() {
    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    if (filename) {
        // Special case for moana2 -> MOANA 2
        let page = filename.toUpperCase().replace(/_/g, " ");
        if (page === "MOANA2") page = "MOANA 2";
        displayReviews(page);
    }
});
