        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const introScreen = document.getElementById('intro-screen');
            const nameInput = document.getElementById('name-input');
            const startJourneyBtn = document.getElementById('start-journey');
            const nextSectionBtn = document.getElementById('next-section-btn');
            const wishContinueBtn = document.getElementById('wish-continue-btn');
            const wishStar = document.querySelector('.wish-star');
            const wishMessage = document.getElementById('wish-message');
            const progressDots = document.querySelectorAll('.progress-dot');
            const storyCardsContainer = document.querySelector('.story-cards') || document.querySelector('.confession-timeline');

            // State
            let userName = '';
            let currentSection = 'intro';
            let revealedCards = 0;
            let currentWishIndex = 0;
            let collectedStars = [];
            let isWishComplete = false;

            // Confession data
            const storyMoments = [
                {
                    title: 'The First Glimpse',
                    date: '🌟',
                    emoji: '🌟',
                    description: 'The moment I first saw you, something quietly changed in me.\n\nIt wasn\'t dramatic or overwhelming — just a soft spark, a gentle warmth I didn\'t expect.\n\nI didn\'t know you, and you didn\'t know me… but somehow, that single glimpse stayed with me longer than it should have.'
                },
                {
                    title: 'The Unsaid Words',
                    date: '💭',
                    emoji: '💭',
                    description: 'There\'s so much I\'ve wanted to say — simple things, small things, honest things.\n\nSometimes I rehearse them in my head, wondering if I\'ll ever get the chance.\n\nBut for now, they stay unspoken.\n\nMaybe it\'s fear, maybe it\'s timing… or maybe I just haven\'t been brave enough yet.'
                },
                {
                    title: 'Building the Courage',
                    date: '💗',
                    emoji: '💗',
                    description: 'Every day, a part of me wants to tell you the truth.\n\nAnother part hesitates — afraid of what might change, or what might not.\n\nBut little by little, my courage grew.\n\nAnd now I\'m here, taking a step I never thought I would.'
                },
                {
                    title: 'The Heart\'s Realization',
                    date: '✨',
                    emoji: '✨',
                    description: 'Somewhere along the way, a simple admiration turned into something deeper.\n\nIt wasn\'t sudden — more like a quiet understanding I slowly came to feel.\n\nI realized I like you… genuinely, sincerely, and more than I expected.'
                },
                {
                    title: 'Every Thought Since',
                    date: '🌙',
                    emoji: '🌙',
                    description: 'And ever since then, you\'ve been on my mind in small moments —\n\nin daydreams, in passing thoughts, in the soft corners of my heart.\n\nI don\'t know where this confession will lead, but I knew I had to tell you.\n\nBecause keeping it in… felt heavier than letting it out.'
                }
            ];

            // Wish messages
            const wishPrompts = [
                'If I could make a wish, it would be to spend more time with you, getting to know every little thing that makes you special.',
                'To make you smile every day, and be the reason your eyes light up with happiness.',
                'To share countless memories together, creating stories we\'ll cherish forever.',
                'To be the reason you\'re happy, and to support you through every challenge life brings.',
                'To build a beautiful future together, filled with love, laughter, and endless adventures.'
            ];

            // Letter content
            const letterContent = [
                "I've been trying to find the right words to say this, but I keep coming back to one simple truth: I've fallen for you.",
                "From the moment we met, you've had this incredible way of making every day brighter. Your smile, your laugh, the way your eyes light up when you talk about things you're passionate about - it all makes my heart race.",
                "What I feel for you is more than just attraction. It's the way I find myself thinking about you at random moments, saving things to share with you, and feeling like the luckiest person when you laugh at my jokes (even the bad ones).",
                "I know this might come as a surprise, and I understand if you need time to process this. But I couldn't keep these feelings to myself any longer. You deserve to know how special you are to me.",
                "No matter what happens, I value our connection deeply. But I had to take this chance to tell you how I really feel."
            ];

            // Initialize the application
            function init() {
                // Start with intro animation
                setTimeout(hideIntro, 2000);
                
                // Set up event listeners
                setupEventListeners();
                
                // Create story cards
                createStoryCards();
                
                // Initialize wish section
                initWishSection();
            }

            function setupEventListeners() {
                // Name input and start journey
                nameInput.addEventListener('input', (e) => {
                    userName = e.target.value.trim();
                    document.getElementById('user-name').textContent = userName || 'Beautiful';
                    document.getElementById('letter-name').textContent = userName || 'You';
                    document.getElementById('confession-name').textContent = userName || 'You';
                    document.getElementById('wish-name').textContent = userName || 'You';
                    const confessionNameFront = document.getElementById('confession-name-front');
                    if (confessionNameFront) {
                        confessionNameFront.textContent = userName || 'You';
                    }
                });

                startJourneyBtn.addEventListener('click', () => {
                    if (!userName) {
                        nameInput.style.borderColor = '#ff4d6d';
                        nameInput.placeholder = 'Please enter your name';
                        return;
                    }
                    
                    // Update the wish title with the user's name
                    const wishTitle = document.querySelector('#wish-section .wish-title');
                    if (wishTitle) {
                        wishTitle.innerHTML = `Make a Wish, <span id="wish-name">${userName}</span> ✨`;
                    }
                    // Update confession name before showing section
                    document.getElementById('confession-name').textContent = userName || 'You';
                    const confessionNameFront = document.getElementById('confession-name-front');
                    if (confessionNameFront) {
                        confessionNameFront.textContent = userName || 'You';
                    }
                    showSection('our-story');
                });

                // Next section button
                nextSectionBtn.addEventListener('click', () => {
                    if (currentSection === 'our-story') {
                        showSection('wish-section');
                    } else if (currentSection === 'wish-section') {
                        showSection('love-letter');
                        typeLetter();
                    } else if (currentSection === 'love-letter') {
                        showSection('final-question');
                    }
                });
                
                // Wish continue button
                wishContinueBtn.addEventListener('click', () => {
                    showSection('love-letter');
                    typeLetter();
                });

                // Wish star interaction
                wishStar.addEventListener('click', handleStarClick);
            }

            function hideIntro() {
                introScreen.style.opacity = '0';
                setTimeout(() => {
                    introScreen.style.display = 'none';
                    showSection('landing-page');
                }, 1000);
            }

            function showSection(sectionId) {
                // Hide all sections
                document.querySelectorAll('div[id$="-page"], div[id$="-section"], #love-letter, #final-question, #our-story')
                    .forEach(section => {
                        section.classList.add('hidden');
                        section.style.display = 'none';
                    });

                // Show the requested section
                const section = document.getElementById(sectionId);
                if (section) {
                    // Determine display type based on section
                    const displayType = section.classList.contains('full-page-section') ? 'flex' : 
                                      (sectionId === 'our-story' || sectionId === 'wish-section') ? 'flex' : 'flex';
                    
                    section.style.display = displayType;
                    setTimeout(() => {
                        section.classList.remove('hidden');
                        section.style.opacity = '1';
                    }, 50);
                    
                    currentSection = sectionId;
                    
                    // Update button text and visibility
                    updateButtonVisibility();
                }
            }

            function updateButtonVisibility() {
                if (currentSection === 'our-story') {
                    nextSectionBtn.innerHTML = 'Continue to Wishes <i class="fas fa-arrow-circle-right"></i>';
                    // Show button if all cards are revealed
                    if (revealedCards === storyMoments.length) {
                        nextSectionBtn.classList.remove('hidden');
                        nextSectionBtn.classList.add('fade-in');
                    } else {
                        nextSectionBtn.classList.add('hidden');
                    }
                } else if (currentSection === 'wish-section') {
                    nextSectionBtn.innerHTML = 'Continue to Love Letter <i class="fas fa-arrow-circle-right"></i>';
                    // Show button if all wishes are revealed
                    if (isWishComplete) {
                        wishContinueBtn.classList.remove('hidden');
                        wishContinueBtn.classList.add('visible');
                    } else {
                        wishContinueBtn.classList.add('hidden');
                    }
                } else if (currentSection === 'love-letter') {
                    nextSectionBtn.innerHTML = 'Continue to Final Question <i class="fas fa-arrow-circle-right"></i>';
                    nextSectionBtn.classList.remove('hidden');
                    nextSectionBtn.classList.add('fade-in');
                } else {
                    nextSectionBtn.classList.add('hidden');
                }
            }

            function createStoryCards() {
                const cardsGrid = document.querySelector('.confession-cards-grid');
                if (!cardsGrid) return;
                
                // Create individual flip card for each confession section
                storyMoments.forEach((moment, index) => {
                    // Format description with line breaks
                    const formattedDescription = moment.description.split('\n\n').map(paragraph => 
                        `<p>${paragraph}</p>`
                    ).join('');
                    
                    // Create flip card
                    const flipCard = document.createElement('div');
                    flipCard.className = 'confession-flip-card';
                    flipCard.dataset.index = index;
                    
                    flipCard.innerHTML = `
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <div class="card-emoji">${moment.emoji}</div>
                                <h2 class="card-title">${moment.title}</h2>
                                <div class="card-hint">
                                    <i class="fas fa-hand-pointer"></i>
                                    <span>Click to reveal</span>
                                </div>
                            </div>
                            <div class="flip-card-back">
                                <div class="back-emoji">${moment.emoji}</div>
                                <h3 class="back-title">${moment.title}</h3>
                                <div class="back-content">
                                    ${formattedDescription}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add click event to flip the card
                    flipCard.addEventListener('click', () => flipCardClick(flipCard, index));
                    
                    cardsGrid.appendChild(flipCard);
                    
                    // Add stagger animation delay
                    setTimeout(() => {
                        flipCard.style.opacity = '1';
                        flipCard.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
            
            function flipCardClick(flipCard, index) {
                // Don't flip if already flipped
                if (flipCard.classList.contains('flipped')) return;
                
                // Flip the card
                flipCard.classList.add('flipped');
                
                // Adjust card height to fit content without scrollbars
                setTimeout(() => {
                    const flipCardBack = flipCard.querySelector('.flip-card-back');
                    const flipCardInner = flipCard.querySelector('.flip-card-inner');
                    if (flipCardBack && flipCardInner) {
                        // Force a reflow to get accurate height
                        flipCardBack.style.height = 'auto';
                        const contentHeight = flipCardBack.scrollHeight;
                        const newHeight = Math.max(contentHeight, 400);
                        flipCard.style.minHeight = newHeight + 'px';
                        flipCardInner.style.minHeight = newHeight + 'px';
                        flipCardBack.style.minHeight = newHeight + 'px';
                    }
                }, 100);
                
                revealedCards++;
                
                // Show next section button when all cards are flipped
                if (revealedCards === storyMoments.length) {
                    setTimeout(() => {
                        updateButtonVisibility();
                    }, 1000);
                }
            }

            // Initialize wish section
            function initWishSection() {
                const wishCard = document.querySelector('.wish-card');
                const cardTitle = document.querySelector('.wish-card .wish-card-title');

                // Reset wish section state
                currentWishIndex = 0;
                collectedStars = [];
                isWishComplete = false;

                // Reset card styles
                if (wishCard) {
                    wishCard.style.opacity = '0';
                    wishCard.style.transform = 'translateY(20px)';

                    // Trigger reflow and animate in
                    void wishCard.offsetWidth;
                    wishCard.style.opacity = '1';
                    wishCard.style.transform = 'translateY(0)';
                }

                // Reset title
                if (cardTitle) {
                    cardTitle.textContent = 'Make a Wish';
                }

                // Clear previous messages and stars
                if (wishMessage) {
                    wishMessage.textContent = 'Click the star to reveal our wishes';
                }

                // Clear previous stars
                const collectedStarsContainer = document.querySelector('.collected-stars');
                if (collectedStarsContainer) {
                    collectedStarsContainer.innerHTML = '';
                }

                // Reset continue button
                if (wishContinueBtn) {
                    wishContinueBtn.classList.remove('visible');
                }
            }

            function handleStarClick() {
                if (isWishComplete) return;

                const wishCard = document.querySelector('.wish-card');
                const cardTitle = document.querySelector('.wish-card .wish-card-title');
                const collectedStarsContainer = document.querySelector('.collected-stars');
                const wishMessage = document.getElementById('wish-message');

                // Update the wish message on the front of the card
                if (wishMessage && currentWishIndex < wishPrompts.length) {
                    // Add fade out effect
                    wishMessage.style.opacity = '0';
                    
                    // After fade out, update the message and fade it back in
                    setTimeout(() => {
                        wishMessage.textContent = wishPrompts[currentWishIndex];
                        wishMessage.style.opacity = '1';
                    }, 200);
                    
                    // Update the title to show which wish it is
                    if (cardTitle) {
                        const wishNumber = currentWishIndex + 1;
                        cardTitle.textContent = `Wish #${wishNumber}`;
                    }
                }

                // Add star to collected stars if not already added
                if (!collectedStars.includes(currentWishIndex)) {
                    collectedStars.push(currentWishIndex);

                    // Create star element
                    const starElement = document.createElement('i');
                    starElement.className = 'fas fa-star';
                    starElement.style.animationDelay = `${collectedStars.length * 0.1}s`;

                    // Ensure the container exists and is cleared if this is the first star
                    if (collectedStarsContainer) {
                        if (currentWishIndex === 0) {
                            collectedStarsContainer.innerHTML = '';
                        }
                        collectedStarsContainer.appendChild(starElement);
                    }

                    // Trigger reflow to enable animation
                    void starElement.offsetWidth;
                    starElement.classList.add('visible');

                    // Add pulse animation to star and create sparkle effect
                    if (wishStar) {
                        wishStar.style.animation = 'none';
                        wishStar.offsetHeight; // Trigger reflow
                        wishStar.style.animation = 'pulse 0.5s';
                        createSparkle(wishStar);
                    }
                }

                // If this is the last wish, show continue button
                if (currentWishIndex === wishPrompts.length - 1) {
                    isWishComplete = true;
                    // Show continue button after a short delay
                    setTimeout(() => {
                        updateButtonVisibility();
                    }, 1000);
                }
                
                // Move to next wish for the next click
                if (currentWishIndex < wishPrompts.length - 1) {
                    currentWishIndex++;
                }
            }

            function createSparkle(starElement) {
                const sparkles = ['✨', '⭐', '🌟', '💫', '⚡'];

                for (let i = 0; i < 5; i++) {
                    const sparkle = document.createElement('span');
                    sparkle.className = 'sparkle';
                    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

                    // Position randomly around the star
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 30 + Math.random() * 20;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;

                    sparkle.style.left = `calc(50% + ${x}px)`;
                    sparkle.style.top = `calc(50% + ${y}px)`;
                    sparkle.style.animationDelay = `${i * 0.1}s`;

                    if (starElement) {
                        starElement.appendChild(sparkle);

                        // Remove sparkle after animation
                        setTimeout(() => {
                            if (sparkle.parentNode === starElement) {
                                starElement.removeChild(sparkle);
                            }
                        }, 1000);
                    }
                }
            }

            function typeLetter() {
                let currentLine = 0;
                const speed = 30; // ms per character
                
                function typeNextLine() {
                    if (currentLine < letterContent.length) {
                        const line = document.createElement('p');
                        letterText.appendChild(line);
                        
                        const text = letterContent[currentLine];
                        let charIndex = 0;
                        
                        const typeChar = () => {
                            if (charIndex < text.length) {
                                line.textContent += text.charAt(charIndex);
                                charIndex++;
                                setTimeout(typeChar, speed);
                            } else {
                                currentLine++;
                                setTimeout(typeNextLine, 500);
                            }
                        };
                        
                        typeChar();
                    } else {
                        // Show next section button when done typing
                        setTimeout(() => {
                            updateButtonVisibility();
                        }, 1000);
                    }
                }
                
                // Start typing after a short delay
                setTimeout(typeNextLine, 1000);
            }

            // Cursor trail effect
            document.addEventListener('mousemove', (e) => {
                const heart = document.createElement('span');
                heart.className = 'cursor-heart';

                // Position the element
                heart.style.left = e.pageX + 'px';
                heart.style.top = e.pageY + 'px';

                const symbols = ['💖', '✨', '⭐'];
                heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

                document.body.appendChild(heart);

                // Animate (fade and shrink) and remove the heart
                setTimeout(() => {
                    heart.style.opacity = '0';
                    heart.style.transform = 'translateY(-30px) scale(0.3)';
                    setTimeout(() => {
                        heart.remove();
                    }, 500);
                }, 10);
            });

            // Initialize the application
            initWishSection();
            init();
        });