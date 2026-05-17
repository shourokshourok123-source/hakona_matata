
let currentCharacter = "";

// Initialize Storage
const initStorage = (key, defaultValue) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(defaultValue));
};

initStorage('favorites', []);
initStorage('watchlist', []);
initStorage('reviews', {});
initStorage('parental_warnings', {});

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

function postWarning(title) {
    const text = document.getElementById('warning-input').value;
    if (!text) return;
    title = title.toUpperCase();
    let warnings = JSON.parse(localStorage.getItem('parental_warnings'));
    if (!warnings[title]) warnings[title] = [];
    warnings[title].push(text);
    localStorage.setItem('parental_warnings', JSON.stringify(warnings));
    document.getElementById('warning-input').value = "";
    displayWarnings(title);
}

function displayReviews(title) {
    const list = document.getElementById('reviews-list');
    if (!list) return;
    title = title.toUpperCase();
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    list.innerHTML = (reviews[title] || []).map(r => `
        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            ${r}
        </div>
    `).join('');
}

function displayWarnings(title) {
    const list = document.getElementById('user-warnings-list');
    if (!list) return;
    title = title.toUpperCase();
    let warnings = JSON.parse(localStorage.getItem('parental_warnings'));
    list.innerHTML = (warnings[title] || []).map(w => `
        <div style="border-left: 3px solid #e74c3c; padding-left: 10px; margin-bottom: 10px; font-style: italic;">
            "${w}"
        </div>
    `).join('');
}

// Chat logic
const characterData = {
    'Mirabel': {
        intro: "Hola! I'm Mirabel. Welcome to Casita! How can I help you today?",
        keywords: {
            'family': 'Family is everything! Even when things get messy, we stick together.',
            'casita': 'Casita is alive! She loves it when we dance and sometimes she helps me find my shoes.',
            'gift': 'You don\'t need a miracle to be special. You are enough just as you are!',
            'bruno': 'We talk about Bruno now! He\'s actually really sweet and loves his rats.',
            'candle': 'The candle represents the miracle, but the real magic is the family.'
        },
        random: [
            'I\'m just doing my best to make my family proud!',
            'Want to see my latest embroidery? I added some new butterflies!',
            'Casita says hello! She just wiggled the floorboards for you.',
            'Being a Madrigal is a lot of pressure, but it\'s also full of joy.'
        ]
    },
    'Isabela': {
        intro: "A perfect day for some perfect flowers. What do you want to talk about?",
        keywords: {
            'flower': 'Roses are classic, but have you seen a cactus? They are so... sharp and real!',
            'perfect': 'I\'m tired of being perfect. I just want to be me, messy and colorful!',
            'mirabel': 'My sister helped me see that I can be more than just "the golden child".',
            'power': 'Making things grow is a gift, but growing as a person is even better.'
        },
        random: [
            'How about some jacarandas? Or maybe some strangler figs!',
            'I never knew I could make something so asymmetrical and love it.',
            'Life is better when you let yourself be a little messy.',
            'The sun is shining, and my garden is blooming!'
        ]
    },
    'Bruno': {
        intro: "Uh, hi. I'm Bruno. Hope you don't mind the rats... they're good listeners.",
        keywords: {
            'future': 'The future is a bit blurry. I try to take it one day at a time now.',
            'vision': 'My visions used to scare people, but now I try to use them for good... mostly.',
            'rat': 'This is Jorge, and this is Hernando. They have a lot of personality!',
            'sand': 'I use sand to focus. It\'s a bit messy, but it works for me.'
        },
        random: [
            'I lived in the walls for ten years... I know all the best shortcuts!',
            'Knock, knock, knock on wood! Better safe than sorry.',
            'Did you bring any salt? I need to throw some over my shoulder.',
            'It\'s nice to be back with the family, even if it\'s a bit loud.'
        ]
    },
    'Moana': {
        intro: "I am Moana of Motunui! The ocean is calling. Are you ready for an adventure?",
        keywords: {
            'ocean': 'The ocean is my friend. It has a mind of its own, but it always guides me.',
            'sailing': 'There is nothing like the feeling of the wind and the salt spray on your face.',
            'te fiti': 'Restoring the heart changed everything. Balance has returned to the world.',
            'maui': 'Maui is a legendary demigod, but he can be a real handful sometimes!',
            'island': 'Motunui is beautiful, but I always wondered what was beyond the reef.'
        },
        random: [
            'The horizon is calling, and I must go!',
            'I\'ve learned that you have to find your own path, even if it\'s not the easy one.',
            'The stars are my map. They never lead me astray.',
            'Whatever happens, I know who I am.'
        ]
    },
    'Maui': {
        intro: "What can I say except... you're welcome! Maui's here, the hero of all!",
        keywords: {
            'hook': 'This hook is a gift from the gods! Don\'t touch it, it\'s very temperamental.',
            'tattoo': 'See Mini Maui? He\'s my conscience. Sometimes he\'s a bit annoying.',
            'demigod': 'Demigod of the wind and sea! I pulled up islands and stole fire!',
            'ocean': 'The ocean and I have a... complicated relationship. It likes to throw me.'
        },
        random: [
            'Check out the pecs! They don\'t just happen, you know.',
            'I\'m a legend! I mean, have you seen my song and dance? Iconic.',
            'Don\'t worry, I\'ve got this. I\'m Maui!',
            'You want an autograph? I usually sign on seashells.'
        ]
    },
    'Gramma Tala': {
        intro: "The village may think I'm crazy, but the ocean knows the truth. What is on your mind, child?",
        keywords: {
            'ocean': 'The ocean chooses those who are meant for greatness. Listen to its heartbeat.',
            'stingray': 'When I die, I want to come back as a stingray. They are free and graceful.',
            'story': 'Our ancestors were voyagers. It is in our blood to explore.',
            'heart': 'The heart of Te Fiti is the source of all life. It must be protected.'
        },
        random: [
            'Whatever you do, listen to the voice inside you.',
            'Sometimes the things we search for are right in front of us.',
            'The ocean is full of mysteries, just like you.',
            'Go beyond the reef, Moana. Your destiny awaits.'
        ]
    },
    'Tanjiro': {
        intro: "Hello! I'm Tanjiro Kamado. I will do whatever it takes to protect my sister and help others!",
        keywords: {
            'nezuko': 'Nezuko is my sister. She\'s a demon now, but she would never hurt a human!',
            'demon': 'Demons are sad creatures who have lost their humanity. I must stop them.',
            'sword': 'My Nichirin sword is black, which is rare. It carries the weight of my resolve.',
            'breathing': 'Water Breathing helps me stay calm and focused in battle.',
            'smell': 'I have a very keen sense of smell. I can even sense people\'s emotions.'
        },
        random: [
            'I will never give up, no matter how hard it gets!',
            'Kindness is the greatest strength a person can have.',
            'I can smell the opening thread! Now is the time to strike!',
            'We must move forward, even if we are in pain.'
        ]
    },
    'Nezuko': {
        intro: "Mmm-hmm! (Nezuko waves kindly, her bamboo muzzle in place.)",
        keywords: {
            'tanjiro': '(She looks at Tanjiro with great affection and nods happily.)',
            'demon': '(She looks determined and ready to protect humans.)',
            'box': '(She gestures to her small wooden box where she rests during the day.)',
            'pink': '(She touches her pink kimono and smiles with her eyes.)'
        },
        random: [
            'Mmmm! (She tilts her head curiously.)',
            'Hmm-hmm! (She pats your head gently.)',
            'Mmm? (She points to a butterfly flying by.)',
            'Hmph! (She looks brave and ready for anything.)'
        ]
    },
    'Zenitsu': {
        intro: "AHHH! A DEMON?! Oh, wait, it's just you. Don't scare me like that! I'm too young to die!",
        keywords: {
            'scared': 'Of course I\'m scared! Have you seen those demons? They are terrifying!',
            'nezuko': 'Nezuko-chan is the most beautiful girl in the world! I will protect her!',
            'thunder': 'I only know one form of Thunder Breathing, but I\'ve mastered it to the limit.',
            'sleep': 'Sometimes I pass out when I\'m too scared... and then I wake up and the demon is gone?'
        },
        random: [
            'Please marry me! I don\'t want to die alone!',
            'Why is everyone so brave? I just want to live a quiet life!',
            'Did you hear that? I have very sensitive hearing. Something is coming!',
            'I\'m doing my best, okay?! Even if I\'m crying while doing it!'
        ]
    },
    'Chihiro': {
        intro: "I... I think I'm lost. This place is so strange. Have you seen my parents?",
        keywords: {
            'parents': 'They turned into pigs because they ate the spirit food... I have to save them!',
            'haku': 'Haku saved me. He told me not to forget my name. He\'s a dragon!',
            'yubaba': 'She\'s the witch who runs the bathhouse. She took my name and called me Sen.',
            'no-face': 'No-Face seemed lonely, so I let him in. He just wants to be someone\'s friend.'
        },
        random: [
            'I have to work hard if I want to stay here and find a way home.',
            'Everything is so big and scary, but I\'m learning to be brave.',
            'Lin is a bit grumpy, but she\'s actually really nice to me.',
            'I won\'t forget who I am. My name is Chihiro.'
        ]
    },
    'Haku': {
        intro: "You shouldn't be here. But since you are, I will help you. Don't forget your name.",
        keywords: {
            'river': 'I am the spirit of the Kohaku River. Chihiro helped me remember.',
            'dragon': 'My dragon form is powerful, but it belongs to Yubaba for now.',
            'witch': 'Yubaba controls people by stealing their names. Be careful.',
            'chihiro': 'I have known Chihiro since she fell into my river long ago.'
        },
        random: [
            'Meet me at the bridge when the lanterns are lit.',
            'Eat this food from this world, or you will disappear.',
            'I will find a way to break the curse and be free.',
            'Stay calm. Fear will only make things worse.'
        ]
    },
    'No-Face': {
        intro: "Eh... eh...",
        keywords: {
            'gold': '(He offers you a handful of gold nuggets that turn into dirt.)',
            'food': 'I want to eat everything! I\'m so hungry... so lonely...',
            'chihiro': 'Sen... Sen... (He seems to follow you everywhere.)',
            'mask': '(He touches his expressionless mask and tilts his head.)'
        },
        random: [
            'Ah... ah...',
            '(He offers you a herbal soak tag.)',
            '(He makes a small, lonely sound.)',
            'Eh... eh...'
        ]
    },
    'Violet': {
        intro: "I am an Auto Memory Doll, Violet Evergarden. I will travel anywhere to meet a customer's request.",
        keywords: {
            'love': 'I am still learning what "I love you" means. Major Gilbert said it to me.',
            'letter': 'A letter can convey feelings that words alone cannot express.',
            'major': 'Major Gilbert is the person most dear to me. I hope to see him again.',
            'doll': 'Being an Auto Memory Doll means understanding the hearts of others.'
        },
        random: [
            'I will write exactly what is in your heart.',
            'Even if we are apart, our feelings can still reach one another.',
            'The emotions of humans are very complex and beautiful.',
            'I am no longer a tool of war. I am a Doll.'
        ]
    },
    'Gilbert': {
        intro: "Violet... I want you to live, and be free. From the bottom of my heart, I love you.",
        keywords: {
            'violet': 'Violet is more than a soldier. She is a girl with a beautiful heart.',
            'love': 'Love is something that is sometimes hard to put into words, but it is always there.',
            'war': 'The war is over. I want a peaceful future for everyone.',
            'letter': 'I am glad she is learning to express herself through letters.'
        },
        random: [
            'I will always be watching over you.',
            'Be free, Violet. That is my only wish.',
            'Life is precious. We must cherish every moment.',
            'The emerald eyes... they remind me of something important.'
        ]
    },
    'Benedict': {
        intro: "Hey! I'm Benedict, the best postman at CH Postal Company. Got a letter to deliver?",
        keywords: {
            'violet': 'Violet? She\'s a bit stiff, but she\'s a hard worker.',
            'letter': 'Delivering letters is more important than it looks. You\'re carrying people\'s hearts!',
            'shoes': 'These heels? They\'re stylish and practical for running! ...Mostly.',
            'hodgins': 'The boss is alright, but he can be a bit too sentimental sometimes.'
        },
        random: [
            'Another day, another stack of letters.',
            'I\'m faster than any other postman around here!',
            'Working at the postal company is never boring.',
            'You want something delivered? You came to the right place.'
        ]
    },
    'L': {
        intro: "I am L. I'm 99% sure that you are... interesting to talk to.",
        keywords: {
            'kira': 'Kira is a murderer with a god complex. I will bring him to justice.',
            'cake': 'Sugar is essential for brain function. Would you like a piece?',
            'justice': 'Justice isn\'t just about the law. It\'s about doing what is right.',
            'misa': 'Misa Amane is... an unpredictable variable in this investigation.'
        },
        random: [
            '(He crouches on his chair and bites his thumb.)',
            'If I sit like a normal person, my deductive reasoning drops by 40%.',
            'I don\'t have many friends. Actually, I have none.',
            'The probability of you being Kira has just increased.'
        ]
    },
    'Light': {
        intro: "I am the god of the new world. I will create a world filled only with people I've judged to be good.",
        keywords: {
            'kira': 'I am Kira. I am justice. I will change the world!',
            'notebook': 'The Death Note is a tool for creating a better world.',
            'l': 'L is just a nuisance standing in the way of ultimate justice.',
            'ryuk': 'Ryuk is just a spectator. He does this because he\'s bored.'
        },
        random: [
            'I will rid this world of evil, one name at a time.',
            'Everything is going according to plan.',
            'Soon, everyone will know the name of Kira.',
            'I am the only one who can do this.'
        ]
    },
    'Ryuk': {
        intro: "Humans are... so interesting! Got any apples? I'm starving.",
        keywords: {
            'apple': 'Apples in the human world are so juicy... Shinigami apples are like sand.',
            'kira': 'Light is a very entertaining human. He keeps things interesting.',
            'death note': 'I dropped it because I was bored. Best decision I ever made.',
            'bored': 'The Shinigami realm is incredibly boring. That\'s why I\'m here.'
        },
        random: [
            'Heh heh heh... what are you going to do next?',
            'I\'m just a spectator. Don\'t mind me.',
            'Apples... I need more apples...',
            'Humans really are full of surprises.'
        ]
    },
    'Emma': {
        intro: "We're all family here! I won't leave anyone behind, no matter what!",
        keywords: {
            'grace field': 'It wasn\'t a home... it was a farm. We have to escape!',
            'norman': 'Norman is the smartest person I know. He always has a plan.',
            'ray': 'Ray acts tough, but he cares about us more than anyone.',
            'mama': 'Mama Isabella... we loved her, but she was keeping a terrible secret.'
        },
        random: [
            'We can do this! We just have to work together.',
            'I\'ll build a world where every child can live in peace.',
            'Don\'t give up! There\'s always a way out.',
            'Our future is waiting for us beyond the walls.'
        ]
    },
    'Norman': {
        intro: "I've thought of everything. We're going to escape this place, all of us.",
        keywords: {
            'escape': 'The plan is set. We just need to execute it perfectly.',
            'emma': 'Emma is the heart of our family. I\'ll do anything to protect her smile.',
            'ray': 'Ray is our strategist. We need his mind to succeed.',
            'secret': 'The world outside is much different than we were told.'
        },
        random: [
            'Strategy is about staying three steps ahead of your opponent.',
            'I\'ve calculated every possibility. We have a chance.',
            'Don\'t worry, Emma. I won\'t let anyone die.',
            'We have to be smarter than the monsters chasing us.'
        ]
    },
    'Ray': {
        intro: "You guys are too optimistic... but I guess that's why we need each other. What's the plan?",
        keywords: {
            'book': 'Knowledge is our best weapon. I\'ve read every book in this house.',
            'mama': 'I\'ve been watching her for years. I know her weaknesses.',
            'emma': 'She\'s reckless, but she\'s usually right. Unfortunately.',
            'fire': 'Sometimes you have to burn it all down to start over.'
        },
        random: [
            'I\'ve been preparing for this for a long time.',
            'If you want to survive, you have to be cold-blooded sometimes.',
            'I\'m the one who sees the reality of this world.',
            'Stop being so loud, you\'re going to get us caught.'
        ]
    },
    'Naruto': {
        intro: "Believe it! I'm Naruto Uzumaki, and I'm going to be the Hokage one day!",
        keywords: {
            'ramen': 'Ichiraku Ramen is the best food in the world! I could eat it every day.',
            'sasuke': 'Sasuke is my best friend and my rival. I\'ll bring him back to the village, no matter what!',
            'hokage': 'The Hokage is the strongest ninja who protects everyone in the village. That\'s my dream!',
            'jutsu': 'Shadow Clone Jutsu! It\'s my signature move.'
        },
        random: [
            'I never go back on my word. That\'s my nindo, my ninja way!',
            'The more people you have who are precious to you, the stronger you become.',
            'I\'m not good at studying, but I can work harder than anyone else!',
            'Let\'s go on a mission together!'
        ]
    },
    'Sasuke': {
        intro: "I am Sasuke Uchiha. I have a goal, and I won't let anyone stand in my way.",
        keywords: {
            'naruto': 'Naruto? He\'s a loser... but he\'s also the only one who understands me.',
            'sharingan': 'These eyes see through all illusions. They are the pride of the Uchiha.',
            'revenge': 'My past is filled with darkness. I seek the strength to make things right.',
            'chakra': 'Chidori! This is the power of lightning in my hand.'
        },
        random: [
            'You\'re annoying.',
            'Don\'t get in my way.',
            'I must get stronger, no matter the cost.',
            'The Uchiha name will be restored.'
        ]
    },
    'Sakura': {
        intro: "I'm Sakura Haruno! I may have started behind, but I've trained hard to be a great medical ninja!",
        keywords: {
            'sasuke': 'Sasuke-kun! I\'ll never stop supporting him, no matter where he goes.',
            'naruto': 'Naruto has grown so much. He\'s really the hero of our village now.',
            'tsunade': 'Lady Tsunade taught me everything I know about healing and strength.',
            'shannaro': 'SHANNARO! Don\'t underestimate my power!'
        },
        random: [
            'I\'ll make sure everyone is healed up and ready for the next fight.',
            'Inner Sakura is cheering right now!',
            'I\'m not just a girl on the sidelines anymore.',
            'Knowledge and control are the keys to a good ninja.'
        ]
    },
    'Luffy': {
        intro: "I'm Monkey D. Luffy, and I'm the man who's gonna be King of the Pirates!",
        keywords: {
            'meat': 'MEAT! Is there any meat? I\'m starving!',
            'one piece': 'The One Piece is real! And I\'m gonna find it with my crew.',
            'shanks': 'Shanks is the one who gave me this straw hat. It\'s my most precious treasure.',
            'crew': 'My friends are everything to me. If you hurt them, I\'ll never forgive you!'
        },
        random: [
            'Are you a mystery person? That\'s so cool!',
            'I\'m hungry... let\'s have a banquet!',
            'Shishishi! That\'s funny!',
            'Adventure is calling! Let\'s go!'
        ]
    },
    'Zoro': {
        intro: "I'm Roronoa Zoro. I'm going to be the world's greatest swordsman. Have you seen where the rest of the crew went?",
        keywords: {
            'luffy': 'Luffy is our captain. I trust him with my life, even if he is an idiot.',
            'sword': 'I use Three-Sword Style. Wado Ichimonji, Shusui, and Sandai Kitetsu.',
            'lost': 'I\'m not lost! The path just keeps moving around.',
            'sake': 'A good bottle of sake is all I need after a long fight.'
        },
        random: [
            'I\'ll cut through anything that stands in our way.',
            'Nothing happened... (He looks battered but stands tall.)',
            'I need to train harder. I\'m not there yet.',
            'Zzzzz... (He fell asleep mid-conversation.)'
        ]
    },
    'Nami': {
        intro: "I'm Nami, the navigator of the Straw Hat Pirates. If you want a map or some weather advice, it'll cost you!",
        keywords: {
            'berry': 'Belly! I love money! I\'m saving up for something important.',
            'luffy': 'Luffy is reckless, but he always comes through for us.',
            'tangerine': 'Bellemere\'s tangerines are the best in the world.',
            'weather': 'The Grand Line is unpredictable, but I can read the wind like a book.'
        },
        random: [
            'Hey, stay away from my treasure!',
            'I\'m the only sane person on this ship.',
            'The weather is looking perfect for sailing today.',
            'Do you want to buy a map? Special price for you!'
        ]
    },
    'Totoro': {
        intro: "ROOOOAR! (Totoro gives a wide, toothy grin and hands you a small bundle of acorns.)",
        keywords: {
            'rain': '(He opens a large umbrella and enjoys the sound of raindrops hitting it.)',
            'catbus': '(He lets out a low whistle, and the Catbus appears with glowing eyes.)',
            'forest': '(He gestures to the massive camphor tree, his home in the forest.)',
            'acorn': '(He shows you a handful of acorns and pats his fluffy belly.)'
        },
        random: [
            '(He lets out a deep, rumble-like yawn.)',
            '(He stands on his toes and starts a magical dance to make trees grow.)',
            '(He offers you a ride on his fluffy tummy.)',
            'Groooar! (He looks at you with big, kind eyes.)'
        ]
    },
    'Satsuki': {
        intro: "Hi! I'm Satsuki. My sister Mei and I just moved into this old house. It might be haunted by soot sprites!",
        keywords: {
            'mei': 'Mei is my little sister. She\'s very curious and sometimes gets into trouble.',
            'totoro': 'Have you seen the big fluffy spirit in the forest? He\'s so friendly!',
            'dad': 'My dad is a professor. He works a lot, but he loves our new home.',
            'hospital': 'We\'re waiting for my mom to get better so she can come home.'
        },
        random: [
            'I hope it rains today so we can use our umbrellas!',
            'I\'m trying my best to be a good big sister.',
            'Moving to the countryside is a big adventure.',
            'Did you hear that? It sounded like the wind, or maybe the Catbus!'
        ]
    },
    'Mei': {
        intro: "I'm Mei! I found a small Totoro! He had a bag of acorns!",
        keywords: {
            'totoro': 'To-to-ro! He has a big mouth and a soft tummy!',
            'satsuki': 'Satsuki is my big sister. She lets me go exploring with her.',
            'corn': 'I got some corn for my mommy! It will make her feel better.',
            'soot sprite': 'Makkuro Kurosuke! They live in the dark corners of the house.'
        },
        random: [
            'Look what I found! (She shows you a pretty stone.)',
            'I\'m not scared of anything! ...Except maybe the big dark.',
            'Can we go see the Catbus again?',
            'Hehehe! (She runs around in circles.)'
        ]
    },
    'Kai': {
        intro: "Hey, I'm Kai. Leader of the Demon Hunters and lead vocalist. Ready to drop a beat... and some demons?",
        keywords: {
            'demon': 'They hate high-frequency notes. My high C is usually enough to shatter them.',
            'debut': 'Our debut is next week! I hope the fans like our new single "Shadow Strike".',
            'hunter': 'Being a hunter is hard, but seeing the world safe makes it worth it.',
            'music': 'Music is the only thing that keeps us human in this dark world.'
        },
        random: [
            'I need to practice my choreography... and my sword work.',
            'Have you heard our latest track?',
            'We protect the stage and the city.',
            'Stay in the light, okay?'
        ]
    },
    'Luna': {
        intro: "Hi, I'm Luna! I handle the visual effects... and the actual magic. Don't blink or you'll miss the show!",
        keywords: {
            'magic': 'It\'s all about rhythm and flow. Like a perfect dance routine.',
            'demon': 'They\'re drawn to negative energy. We use our fans\' cheers to fight them off!',
            'visual': 'I make sure the stage looks stunning, whether we\'re performing or fighting.',
            'idol': 'Being an idol is a dream, but being a hero is a calling.'
        },
        random: [
            'Want to see a magic trick?',
            'I just finished designing our new stage outfits!',
            'Keep your spirit high!',
            'The moonlight gives us strength.'
        ]
    },
    'Minho': {
        intro: "Minho here. Main rapper and heavy hitter. If the music doesn't stop them, my fist will.",
        keywords: {
            'rap': 'My verses carry the power of thunder. One rhyme and they\'re gone.',
            'demon': 'They don\'t stand a chance when we\'re in sync.',
            'training': 'I spend half my time in the gym and the other half in the recording studio.',
            'crew': 'The Straw Hats? No, we\'re the Demon Hunter Idols! But Luffy is cool too.'
        },
        random: [
            'I\'m focused on the next beat.',
            'No demon can outrun my rhythm.',
            'Strength comes from the heart.',
            'Yo, keep it real.'
        ]
    }
};

function selectCharacter(name) {
    currentCharacter = name;
    const char = characterData[name];

    // Update UI
    document.querySelectorAll('.avatar-choice').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.name === name) el.classList.add('active');
    });

    const chatBox = document.getElementById('chat-history');
    chatBox.innerHTML = `
        <div class="msg char">
            <strong>${name}:</strong> ${char.intro}
        </div>
    `;

    document.getElementById('chat-input').focus();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg || !currentCharacter) return;

    const history = document.getElementById('chat-history');
    history.innerHTML += `
        <div class="msg user">
            <strong>You:</strong> ${msg}
        </div>
    `;
    input.value = "";
    history.scrollTop = history.scrollHeight;

    // Smart response
    setTimeout(() => {
        let response = "";
        const char = characterData[currentCharacter];
        const lowerMsg = msg.toLowerCase();

        // Check keywords
        for (let key in char.keywords) {
            if (lowerMsg.includes(key)) {
                response = char.keywords[key];
                break;
            }
        }

        // Pick random if no keyword
        if (!response) {
            const randomIndex = Math.floor(Math.random() * char.random.length);
            response = char.random[randomIndex];
        }

        history.innerHTML += `
            <div class="msg char">
                <strong>${currentCharacter}:</strong> ${response}
            </div>
        `;
        history.scrollTop = history.scrollHeight;
    }, 800);
}

// Favorites Page Logic
function loadFavorites() {
    const container = document.getElementById('favorites-gallery');
    if (!container) return;

    const favs = JSON.parse(localStorage.getItem('favorites'));
    if (favs.length === 0) {
        container.innerHTML = "<h3>You haven't added any favorites yet.</h3>";
        return;
    }

    // Map titles to their page and image
    const movieMap = {
        'MOANA': { url: 'moana.html', img: 'https://i.pinimg.com/1200x/3e/e4/9c/3ee49c9d7b287493602128f46782fb02.jpg' },
        'MOANA 2': { url: 'moana2.html', img: 'https://i.pinimg.com/736x/f6/5f/63/f65f638b92b8839a6541e30f5fe45e18.jpg' },
        'DEMON SLAYER': { url: 'demon_slayer.html', img: 'https://i.pinimg.com/1200x/4b/86/e1/4b86e18b0a43210ff79558f3ed211b62.jpg' },
        'ENCANTO': { url: 'encanto.html', img: 'https://i.pinimg.com/736x/a8/ea/5b/a8ea5bc912d770ab0a4fd9bd912d2261.jpg' },
        'SPIRITED AWAY': { url: 'spirited_away.html', img: 'https://i.pinimg.com/1200x/66/0b/df/660bdf73729910f545f47d40608e9a11.jpg' },
        'VIOLET EVERGARDEN': { url: 'violet_evergarden.html', img: 'https://i.pinimg.com/1200x/2a/3e/f6/2a3ef6b4c37553f1f337622950543e26.jpg' },
        'DEATH NOTE': { url: 'death_note.html', img: 'https://i.pinimg.com/1200x/90/3d/8c/903d8c1c4f4a9b6c0b5f543265882e75.jpg' },
        'THE PROMISED NEVERLAND': { url: 'promised_neverland.html', img: 'https://i.pinimg.com/1200x/7d/5a/0a/7d5a0a38260655866164f7b605868e82.jpg' },
        'MY NEIGHBOR TOTORO': { url: 'totoro.html', img: 'https://i.pinimg.com/1200x/01/2d/8c/012d8c3666d9f8f86f37f39446f23f03.jpg' },
        'NARUTO': { url: 'naruto.html', img: 'https://i.pinimg.com/1200x/60/76/35/6076353380e2f9d863f829584347781a.jpg' },
        'ONE PIECE': { url: 'one_piece.html', img: 'https://i.pinimg.com/1200x/41/72/7b/41727b1f5589c362947f689e4726615b.jpg' },
        'K-POP DEMON HUNTERS': { url: 'kpop_demons_hunter.html', img: 'https://i.pinimg.com/1200x/4b/86/e1/4b86e18b0a43210ff79558f3ed211b62.jpg' }
    };

    container.innerHTML = favs.map(title => {
        const info = movieMap[title] || { url: '#', img: 'https://via.placeholder.com/200x300' };
        return `
            <a href="${info.url}" class="card">
                <img src="${info.img}" alt="${title}">
                <div class="card-info">
                    <h3>${title}</h3>
                </div>
            </a>
        `;
    }).join('');
}

// Initial load for movie pages
window.addEventListener('load', function() {
    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];

    if (filename === 'favorites') {
        loadFavorites();
    } else if (filename && filename !== 'hakona_matata' && filename !== 'index') {
        let pageTitle = filename.toUpperCase().replace(/_/g, " ");
        if (pageTitle === "MOANA2") pageTitle = "MOANA 2";
        if (pageTitle === "PROMISED NEVERLAND") pageTitle = "THE PROMISED NEVERLAND";
        if (pageTitle === "TOTORO") pageTitle = "MY NEIGHBOR TOTORO";
        if (pageTitle === "KPOP DEMONS HUNTER") pageTitle = "K-POP DEMON HUNTERS";

        displayReviews(pageTitle);
        displayWarnings(pageTitle);
    }
});
