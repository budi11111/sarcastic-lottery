class MyJackpotNumbers {
    constructor() {
        this.currentLottery = 'powerball';
        this.isGenerating = false;
        this.reviewsCarousel = null;
        this.storiesCarousel = null;
        this.blogCarousel = null;
        this.initializeEventListeners();
        this.initializeDynamicContent();
        this.initializeCarousels();
        this.initializeBlogCarousel();
    }

    initializeEventListeners() {
        // Lottery type selection
        document.querySelectorAll('.lottery-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLottery(e.currentTarget);
            });
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateNumbers();
        });

        // Custom lottery configuration
        document.getElementById('hasExtra').addEventListener('change', (e) => {
            this.toggleExtraConfig(e.target.checked);
        });

        // Input validation
        document.querySelectorAll('.custom-input').forEach(input => {
            input.addEventListener('input', () => {
                this.validateCustomInputs();
            });
        });
    }

    initializeDynamicContent() {
        this.randomizeContent();

        // Rotate wisdom quotes every 10 seconds
        setInterval(() => {
            this.rotateWisdomQuote();
        }, 10000);

        // Rotate loading messages
        setInterval(() => {
            this.rotateLoadingMessage();
        }, 2000);
    }

    randomizeContent() {
        const titles = [
            "Choose Your Method of Financial Destruction",
            "Select Your Path to Economic Disappointment",
            "Pick Your Preferred Route to Broke",
            "Choose Your Adventure in Poor Decision Making",
            "Select Your Financial Destruction Technique",
            "Pick Your Dream-Crushing Experience",
            "Choose Your Wallet-Emptying Adventure"
        ];

        const subtitles = [
            "All paths lead to the same destination: disappointment",
            "Every option guarantees identical results: nothing",
            "Statistical certainty: your wallet will be lighter",
            "Spoiler alert: the house always wins",
            "Different numbers, same inevitable outcome",
            "Multiple ways to achieve the same financial result",
            "Various methods, universal disappointment guaranteed"
        ];

        const optionHints = [
            "Pro tip: More combinations = more creative ways to lose!",
            "Fun fact: Buying more tickets increases your disappointment proportionally!",
            "Remember: Each additional combination is another way to not win!",
            "Mathematics suggests: More attempts = more opportunities for failure!",
            "Advanced strategy: Multiple combinations for comprehensive losing!",
            "Expert advice: Diversify your portfolio of disappointment!",
            "Optimization tip: Scale your statistical impossibility!"
        ];

        const generateHints = [
            "Click to convert hope into statistical reality",
            "Press to transform optimism into mathematical truth",
            "Click to discover new ways to not become rich",
            "Press to experience probability in action",
            "Click to support your state's education fund",
            "Press to contribute to infrastructure development",
            "Click to participate in voluntary taxation"
        ];

        const footerTexts = [
            "Remember: The house always wins, but at least you'll lose with style.",
            "Play responsibly: Your financial advisor is watching and crying.",
            "Fun fact: The lottery is entertainment, not an investment strategy.",
            "Remember: Hope is free, but lottery tickets aren't.",
            "Statistical reminder: You're more likely to find a four-leaf clover made of gold.",
            "Reality check: Your odds haven't improved since yesterday.",
            "Friendly reminder: Mathematics doesn't care about your feelings."
        ];

        // Apply random content
        document.getElementById('selectorTitle').textContent = this.randomChoice(titles);
        document.getElementById('selectorSubtitle').textContent = this.randomChoice(subtitles);
        document.getElementById('optionHint').textContent = this.randomChoice(optionHints);
        document.getElementById('generateHint').textContent = this.randomChoice(generateHints);
        document.getElementById('footerText').textContent = this.randomChoice(footerTexts);
    }

    rotateWisdomQuote() {
        const wisdomQuotes = [
            "The lottery: a tax on people who are bad at math, but excellent at hope.",
            "Playing the lottery is like believing in unicorns, but with worse odds and higher costs.",
            "Lottery tickets: the most expensive way to daydream about not being financially responsible.",
            "The lottery: where dreams go to die, but at least there are colorful balls involved.",
            "Statistically speaking, you're more likely to be elected president while being struck by lightning.",
            "The lottery: turning optimists into realists since someone invented probability.",
            "Your odds of winning are roughly the same as finding an honest politician riding a unicorn.",
            "Lottery: because setting money on fire isn't entertaining enough for modern society.",
            "The lottery: where mathematics goes to make people sad, but infrastructure gets funded.",
            "Playing the lottery is like dating - lots of hope, minimal chance of success, expensive disappointment."
        ];

        const wisdomElement = document.getElementById('wisdomText');
        const newQuote = this.randomChoice(wisdomQuotes);

        // Fade out
        wisdomElement.style.opacity = '0';

        setTimeout(() => {
            wisdomElement.textContent = newQuote;
            wisdomElement.style.opacity = '1';
        }, 300);
    }

    rotateLoadingMessage() {
        if (!document.getElementById('loading').classList.contains('hidden')) {
            const loadingMessages = [
                "Calculating your inevitable disappointment...",
                "Consulting the mathematics of misery...",
                "Processing your voluntary donation...",
                "Computing statistical impossibility...",
                "Generating certified bad luck...",
                "Calibrating disappointment algorithms...",
                "Optimizing your financial destruction...",
                "Loading premium quality false hope..."
            ];

            const loadingElement = document.getElementById('loadingText');
            if (loadingElement) {
                loadingElement.textContent = this.randomChoice(loadingMessages);
            }
        }
    }

    initializeCarousels() {
        this.initializeReviewsCarousel();
        this.initializeStoriesCarousel();
    }

    initializeBlogCarousel() {
        const blogTrack = document.getElementById('blogTrack');
        const blogPrev = document.getElementById('blogPrev');
        const blogNext = document.getElementById('blogNext');

        if (blogTrack && blogPrev && blogNext) {
            let currentSlide = 0;
            const slides = blogTrack.children.length;

            function updateCarousel() {
                const offset = -currentSlide * 100;
                blogTrack.style.transform = `translateX(${offset}%)`;
            }

            blogNext.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides;
                updateCarousel();
            });

            blogPrev.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides) % slides;
                updateCarousel();
            });

            // Auto-rotate every 4 seconds
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides;
                updateCarousel();
            }, 4000);
        }
    }

    initializeReviewsCarousel() {
        const reviews = [
            "Finally lost my life savings with personality! The sarcasm really helps the pain. - Sarah K.",
            "My therapist loves this site - guaranteed job security! - Mike R.",
            "Better financial advice than my actual financial advisor. - Anonymous Millionaire",
            "If you enjoy disappointment with a side of humor, this is paradise. - Happy Loser",
            "The most entertaining way to burn money legally. - Jared S.",
            "Just incinerated my paycheck but laughed while doing it! - Lily T.",
            "I tell people I'm investing in 'alternative hope assets.' - Grace W.",
            "These numbers brought me closer to accepting mathematical reality. - Tom M.",
            "Statistically challenged but emotionally entertained. - Pam L.",
            "Lost my money but gained existential clarity! - Max B.",
            "The only lottery site that understands my psychological needs. - Sophie D.",
            "Who needs financial stability when you have premium disappointment? - Will N.",
            "I've achieved mastery in the art of strategic wealth destruction. - Nina F.",
            "Guaranteed to keep you humble and financially grounded. - Julian P.",
            "A website that truly gets the lottery experience. - Ella C.",
            "The only place where losing feels like winning at losing. - Omar K.",
            "I may not win money, but I win at having realistic expectations. - Mia H.",
            "My numbers never win, but my sense of humor does. - Leo F.",
            "Saving money is overrated anyway, said my empty wallet. - Kate T.",
            "Professional disappointment in just a few clicks - highly efficient! - Zack G.",
            "This site has helped me accept my destiny as a non-millionaire. - Rachel S.",
            "Finally, a lottery generator that doesn't lie about my chances. - Derek M.",
            "My family thinks I'm playing smart... if only they knew. - Ashley R.",
            "Better entertainment value than most streaming services. - Carlos B.",
            "The sarcasm makes losing feel like a lifestyle choice. - Morgan T."
        ];

        this.reviewsCarousel = new ReviewsCarousel('reviewsCarousel', reviews);
    }

    initializeStoriesCarousel() {
        const stories = [
            "Used these exact numbers and won... a free pen from the convenience store! - Jennifer M.",
            "My numbers were incredibly close! Only missed by all 6 numbers. - David L.",
            "Almost won big, but my cat walked across the keyboard during generation. - Alex J.",
            "Received a consolation prize of increased self-awareness about probability. - Stephanie P.",
            "My ticket earned me more sympathy from friends than actual cash. - Robert B.",
            "Close enough to inspire me to buy another ticket immediately. - Clara S.",
            "Told everyone I won, then had to explain what 'moral victory' means. - Jordan W.",
            "These numbers work great for my fantasy football lineup though! - Tina H.",
            "I'm definitely winning in my parallel universe dreams. - Daniel V.",
            "Got a motivational speech from the store clerk about persistence. - Emily F.",
            "Almost broke the news as 'local person defeats mathematics.' - Kevin M.",
            "My dog has better intuition about numbers than this generator. - Rachel G.",
            "My family still believes I have a 'system' - I'm too embarrassed to correct them. - Patrick N.",
            "The phrase 'better luck next time' has lost all meaning. - Allison T.",
            "Every loss is a step closer to... well, more losses, but funnier ones. - Hannah B.",
            "Enjoyed the number generation process more than the actual lottery. - Greg C.",
            "My new favorite method of converting optimism into realism. - Nicole A.",
            "Didn't win money, but won a deeper understanding of statistics. - Victor S.",
            "This site has made my gambling addiction intellectually sophisticated. - Sonia K.",
            "Thanks to these numbers, my jokes about probability are professionally accurate. - Luke P.",
            "Used custom settings and created a whole new category of disappointment. - Marcus H.",
            "These numbers helped me realize I'm better at losing than I thought. - Diana W.",
            "My lottery strategy is now so advanced it transcends actual winning. - Tyler K.",
            "Won the lottery... in an alternate dimension where I understood math better. - Samantha L."
        ];

        this.storiesCarousel = new StoriesCarousel('storiesCarousel', stories);
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectLottery(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.lottery-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Update current lottery type
        this.currentLottery = button.dataset.type;

        // Show/hide custom configuration
        const customConfig = document.getElementById('customConfig');
        if (this.currentLottery === 'custom') {
            customConfig.classList.remove('hidden');
            document.getElementById('generateBtn').innerHTML = `
                <span>Generate Custom Numbers</span>
            `;
        } else {
            customConfig.classList.add('hidden');
            const lotteryName = button.querySelector('.lottery-name').textContent;
            document.getElementById('generateBtn').innerHTML = `
                <span>Generate ${lotteryName} Numbers</span>
            `;
        }
    }

    toggleExtraConfig(show) {
        const extraConfig = document.getElementById('extraConfig');
        if (show) {
            extraConfig.classList.remove('hidden');
        } else {
            extraConfig.classList.add('hidden');
        }
    }

    validateCustomInputs() {
        const mainCount = parseInt(document.getElementById('mainCount').value);
        const mainMax = parseInt(document.getElementById('mainMax').value);
        const extraCount = parseInt(document.getElementById('extraCount').value);
        const extraMax = parseInt(document.getElementById('extraMax').value);
        const hasExtra = document.getElementById('hasExtra').checked;

        let isValid = true;
        let errorMessage = '';

        if (mainCount <= 0 || mainMax <= 0) {
            isValid = false;
            errorMessage = 'Main numbers must be positive';
        } else if (mainCount > mainMax) {
            isValid = false;
            errorMessage = `Cannot pick ${mainCount} from only ${mainMax} numbers`;
        } else if (hasExtra && (extraCount <= 0 || extraMax <= 0)) {
            isValid = false;
            errorMessage = 'Extra numbers must be positive';
        } else if (hasExtra && extraCount > extraMax) {
            isValid = false;
            errorMessage = `Cannot pick ${extraCount} from only ${extraMax} extra numbers`;
        }

        // Update generate button state
        const generateBtn = document.getElementById('generateBtn');
        if (this.currentLottery === 'custom') {
            generateBtn.disabled = !isValid;
            if (!isValid) {
                generateBtn.innerHTML = `<span>${errorMessage}</span>`;
            } else {
                generateBtn.innerHTML = `<span>Generate Custom Numbers</span>`;
            }
        }

        return isValid;
    }

    async generateNumbers() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.showLoading();

        try {
            const combinations = document.getElementById('combinations').value;
            let response;

            if (this.currentLottery === 'custom') {
                if (!this.validateCustomInputs()) {
                    throw new Error('Invalid custom configuration');
                }

                const mainCount = document.getElementById('mainCount').value;
                const mainMax = document.getElementById('mainMax').value;
                const hasExtra = document.getElementById('hasExtra').checked;
                const extraCount = hasExtra ? document.getElementById('extraCount').value : 0;
                const extraMax = hasExtra ? document.getElementById('extraMax').value : 0;

                const params = new URLSearchParams({
                    main_count: mainCount,
                    main_max: mainMax,
                    extra_count: extraCount,
                    extra_max: extraMax,
                    count: combinations
                });

                response = await fetch(`/generate-custom?${params}`);
            } else {
                response = await fetch(`/generate?type=${this.currentLottery}&count=${combinations}`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Generation failed');
            }

            const data = await response.json();

            // Add realistic delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.displayResults(data);

            // Initialize stories carousel if results are shown
            if (this.storiesCarousel) {
                this.storiesCarousel.start();
            }
        } catch (error) {
            console.error('Error generating numbers:', error);
            this.showError(error.message);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        // FIXED: Target results section inside unified generator
        const resultsSection = document.querySelector('.unified-generator #results');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
        }
        document.getElementById('generateBtn').disabled = true;
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('generateBtn').disabled = false;
    }

    displayResults(data) {
        // FIXED: Target results section inside unified generator
        const resultsSection = document.querySelector('.unified-generator #results');
        const commentElement = resultsSection.querySelector('#comment');
        const numbersContainer = resultsSection.querySelector('#numbersContainer');

        // Display sarcastic comment
        commentElement.textContent = data.comment;

        // Clear previous results
        numbersContainer.innerHTML = '';

        // Display each combination
        data.results.forEach((result, index) => {
            const numberSet = this.createNumberSet(result, index + 1);
            numbersContainer.appendChild(numberSet);
        });

        // Show results with smooth animation - FIXED: scroll to correct container
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    createNumberSet(result, index) {
        const numberSet = document.createElement('div');
        numberSet.className = 'number-set';

        const lotteryName = document.createElement('div');
        lotteryName.className = 'lottery-name';
        lotteryName.textContent = `${result.lottery_name} - Combination ${index}`;

        const numbersDisplay = document.createElement('div');
        numbersDisplay.className = 'numbers-display';

        // Main numbers
        const mainNumbers = document.createElement('div');
        mainNumbers.className = 'main-numbers';

        result.main_numbers.forEach(num => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.textContent = num;
            mainNumbers.appendChild(numberElement);
        });

        numbersDisplay.appendChild(mainNumbers);

        // Bonus numbers (if any)
        if (result.bonus_numbers && result.bonus_numbers.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'separator';
            separator.textContent = '|';

            const bonusNumbers = document.createElement('div');
            bonusNumbers.className = 'bonus-numbers';

            result.bonus_numbers.forEach(num => {
                const bonusElement = document.createElement('div');
                bonusElement.className = 'bonus-number';
                bonusElement.textContent = num;
                bonusNumbers.appendChild(bonusElement);
            });

            numbersDisplay.appendChild(separator);
            numbersDisplay.appendChild(bonusNumbers);

            // Bonus label
            if (result.bonus_name) {
                const bonusLabel = document.createElement('div');
                bonusLabel.className = 'bonus-label';
                bonusLabel.textContent = result.bonus_name;
                numberSet.appendChild(bonusLabel);
            }
        }

        numberSet.appendChild(lotteryName);
        numberSet.appendChild(numbersDisplay);

        return numberSet;
    }

    showError(message) {
        // FIXED: Target results section inside unified generator
        const resultsSection = document.querySelector('.unified-generator #results');
        const commentElement = resultsSection.querySelector('#comment');
        const numbersContainer = resultsSection.querySelector('#numbersContainer');

        commentElement.textContent = message || "Something went wrong generating your numbers. Please try again!";
        numbersContainer.innerHTML = '<p style="text-align: center; color: var(--danger-color);">Unable to generate numbers. Please check your settings and try again.</p>';

        resultsSection.classList.remove('hidden');
    }
}

// Enhanced Reviews Carousel Class
class ReviewsCarousel {
    constructor(containerId, reviews) {
        this.container = document.getElementById(containerId);
        this.track = document.getElementById('reviewsTrack');
        this.indicatorsContainer = document.getElementById('reviewsIndicators');
        this.reviews = reviews;
        this.currentSlide = 0;
        this.totalSlides = Math.ceil(reviews.length / 3);
        this.autoPlayInterval = null;

        this.init();
        this.startAutoPlay();
    }

    init() {
        // Create slides (3 reviews per slide)
        for (let i = 0; i < this.totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.style.minWidth = '100%';
            slide.style.display = 'flex';
            slide.style.gap = 'var(--spacing-md)';

            // Add 3 reviews per slide
            for (let j = 0; j < 3; j++) {
                const reviewIndex = i * 3 + j;
                if (reviewIndex < this.reviews.length) {
                    const reviewDiv = this.createReviewElement(this.reviews[reviewIndex]);
                    slide.appendChild(reviewDiv);
                }
            }

            this.track.appendChild(slide);
        }

        // Create indicators
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    createReviewElement(review) {
        const parts = review.split(' - ');
        const text = parts[0];
        const author = parts[1];

        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-slide';
        reviewDiv.innerHTML = `
            <p>"${text}" <span>- ${author}</span></p>
        `;
        return reviewDiv;
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.track.style.transform = `translateX(-${index * 100}%)`;

        // Update indicators
        document.querySelectorAll('.indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(this.currentSlide);
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Enhanced Stories Carousel Class
class StoriesCarousel {
    constructor(containerId, stories) {
        this.container = document.getElementById(containerId);
        this.track = document.getElementById('storiesTrack');
        this.prevBtn = document.getElementById('storiesPrev');
        this.nextBtn = document.getElementById('storiesNext');
        this.stories = stories;
        this.currentStory = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        // Create story slides
        this.stories.forEach(story => {
            const slide = this.createStoryElement(story);
            this.track.appendChild(slide);
        });

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.previousStory());
        this.nextBtn.addEventListener('click', () => this.nextStory());

        this.showStory(0);
    }

    createStoryElement(story) {
        const parts = story.split(' - ');
        const text = parts[0];
        const author = parts[1];

        const storyDiv = document.createElement('div');
        storyDiv.className = 'story-slide';
        storyDiv.innerHTML = `
            <p>"${text}" <span>- ${author}</span></p>
        `;
        return storyDiv;
    }

    showStory(index) {
        this.track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextStory() {
        this.currentStory = (this.currentStory + 1) % this.stories.length;
        this.showStory(this.currentStory);
    }

    previousStory() {
        this.currentStory = (this.currentStory - 1 + this.stories.length) % this.stories.length;
        this.showStory(this.currentStory);
    }

    start() {
        // Start auto-play for stories
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            this.nextStory();
        }, 6000);
    }

    stop() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MyJackpotNumbers();
});
