class MyJackpotNumbers {
    constructor() {
        this.currentLottery = 'powerball';
        this.isGenerating = false;
        this.reviewsCarousel = null;
        this.storiesCarousel = null;
        this.initializeEventListeners();
        this.initializeDynamicContent();
        this.initializeCarousels();
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
    }

    initializeDynamicContent() {
        // Randomize static content on page load
        this.randomizeContent();
    }

    randomizeContent() {
        const titles = [
            "Choose Your Method of Financial Destruction",
            "Select Your Path to Economic Disappointment",
            "Pick Your Preferred Route to Broke",
            "Choose Your Adventure in Poor Decision Making",
            "Select Your Financial Destruction Technique"
        ];

        const subtitles = [
            "All paths lead to the same destination: disappointment",
            "Every option guarantees identical results: nothing",
            "Statistical certainty: your wallet will be lighter",
            "Spoiler alert: the house always wins",
            "Different numbers, same inevitable outcome"
        ];

        const wisdomQuotes = [
            "The lottery: a tax on people who are bad at math, but excellent at hope.",
            "Playing the lottery is like believing in unicorns, but with worse odds.",
            "Lottery tickets: the most expensive way to daydream about not being broke.",
            "The lottery: where dreams go to die, but with colorful balls.",
            "Statistically speaking, you're more likely to be struck by lightning while being elected president.",
            "The lottery: turning optimists into realists since 1964.",
            "Your odds of winning are about the same as finding honest politicians.",
            "Lottery: because throwing money in a fire isn't entertaining enough."
        ];

        const optionHints = [
            "Pro tip: More combinations = more creative ways to lose!",
            "Fun fact: Buying more tickets increases your disappointment proportionally!",
            "Remember: Each additional combination is just another way to not win!",
            "Mathematics suggests: More attempts = more opportunities for failure!",
            "Advanced strategy: Multiple combinations for comprehensive losing!"
        ];

        const generateHints = [
            "Click to convert hope into statistical reality",
            "Press to transform optimism into mathematical truth",
            "Click to discover new ways to not become rich",
            "Press to experience probability in action",
            "Click to support your state's education fund"
        ];

        const footerTexts = [
            "Remember: The house always wins, but at least you'll lose with style.",
            "Play responsibly: Your financial advisor is watching and crying.",
            "Fun fact: The lottery is entertainment, not an investment strategy.",
            "Remember: Hope is free, but lottery tickets aren't.",
            "Statistical reminder: You're more likely to find a four-leaf clover made of gold."
        ];

        // Apply random content
        document.getElementById('selectorTitle').textContent = this.randomChoice(titles);
        document.getElementById('selectorSubtitle').textContent = this.randomChoice(subtitles);
        document.getElementById('wisdomText').textContent = this.randomChoice(wisdomQuotes);
        document.getElementById('optionHint').textContent = this.randomChoice(optionHints);
        document.getElementById('generateHint').textContent = this.randomChoice(generateHints);
        document.getElementById('footerText').textContent = this.randomChoice(footerTexts);
    }

    initializeCarousels() {
        this.initializeReviewsCarousel();
        this.initializeStoriesCarousel();
    }

    initializeReviewsCarousel() {
        const reviews = [
            "Finally lost my life savings in style! - Sarah K.",
            "My therapist loves this site - job security! - Mike R.",
            "Better than my financial advisor's advice. - Anonymous",
            "If you enjoy disappointment, this is your playground. - Happy User",
            "The luckiest unlucky player you'll ever meet. - Jared S.",
            "Just burned my paycheck but had fun doing it! - Lily T.",
            "I tell everyone I'm investing in hope. - Grace W.",
            "These numbers brought me closer to reality. - Tom M.",
            "Statistically challenged but emotionally hopeful. - Pam L.",
            "Lost my money but gained great stories! - Max B.",
            "The best way to waste money and laugh at yourself. - Sophie D.",
            "Who needs financial stability anyway? - Will N.",
            "I've mastered the art of strategic losing. - Nina F.",
            "Guaranteed to keep you humble and laughing. - Julian P.",
            "A website that understands my pain. - Ella C.",
            "The only lottery site where losing feels empowering. - Omar K.",
            "I may not win, but at least I have entertainment. - Mia H.",
            "My numbers never win, but my hopes do. - Leo F.",
            "Saving money is overrated anyway. - Kate T.",
            "Professional disappointment in just a few clicks! - Zack G."
        ];

        this.reviewsCarousel = new ReviewsCarousel('reviewsCarousel', reviews);
    }

    initializeStoriesCarousel() {
        const stories = [
            "I used these exact numbers and won... a free coffee with my gas purchase! - Jennifer M.",
            "My numbers were so close! Only off by 6 numbers. - David L.",
            "Almost won, but my cat walked over the keyboard. - Alex J.",
            "Got a consolation prize of some expired coupons. - Stephanie P.",
            "My ticket earned me more sympathy than cash. - Robert B.",
            "Close enough to buy a lottery ticket again. - Clara S.",
            "I told my friends I won, then they laughed. - Jordan W.",
            "These numbers are great for fantasy league, though! - Tina H.",
            "I'm a winner in my dreams, thanks to this site. - Daniel V.",
            "Got a free lottery sticker for participating! - Emily F.",
            "Almost made it to the news for closest miss. - Kevin M.",
            "My dog seems luckier than I am. - Rachel G.",
            "My family thinks I'm playing smart... they're wrong. - Patrick N.",
            "Better luck next time, they say. I'm still trying! - Allison T.",
            "Every loss is a step closer to... more losses. - Hannah B.",
            "I enjoyed these numbers more than the game itself. - Greg C.",
            "Definitely my new favorite way to lose money. - Nicole A.",
            "I didn't win, but I had zero regrets. - Victor S.",
            "Lottery addiction: now made fun with style. - Sonia K.",
            "Thanks to this site, my jokes are always fresh. - Luke P."
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

        // Update generate button text
        const lotteryName = button.querySelector('.lottery-name').textContent;
        document.getElementById('generateBtn').innerHTML = `
            <span>Generate ${lotteryName} Numbers</span>
        `;
    }

    async generateNumbers() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.showLoading();

        try {
            const combinations = document.getElementById('combinations').value;
            const response = await fetch(`/generate?type=${this.currentLottery}&count=${combinations}`);
            const data = await response.json();

            // Add realistic delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1200));

            this.displayResults(data);

            // Initialize stories carousel if results are shown
            if (this.storiesCarousel) {
                this.storiesCarousel.start();
            }
        } catch (error) {
            console.error('Error generating numbers:', error);
            this.showError();
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('generateBtn').disabled = true;
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('generateBtn').disabled = false;
    }

    displayResults(data) {
        const resultsSection = document.getElementById('results');
        const commentElement = document.getElementById('comment');
        const numbersContainer = document.getElementById('numbersContainer');

        // Display sarcastic comment
        commentElement.textContent = data.comment;

        // Clear previous results
        numbersContainer.innerHTML = '';

        // Display each combination
        data.results.forEach((result, index) => {
            const numberSet = this.createNumberSet(result, index + 1);
            numbersContainer.appendChild(numberSet);
        });

        // Show results with smooth animation
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

        // Separator
        const separator = document.createElement('div');
        separator.className = 'separator';
        separator.textContent = '|';

        // Bonus numbers
        const bonusNumbers = document.createElement('div');
        bonusNumbers.className = 'bonus-numbers';

        result.bonus_numbers.forEach(num => {
            const bonusElement = document.createElement('div');
            bonusElement.className = 'bonus-number';
            bonusElement.textContent = num;
            bonusNumbers.appendChild(bonusElement);
        });

        // Bonus label
        const bonusLabel = document.createElement('div');
        bonusLabel.className = 'bonus-label';
        bonusLabel.textContent = result.bonus_name;

        // Assemble the display
        numbersDisplay.appendChild(mainNumbers);
        numbersDisplay.appendChild(separator);
        numbersDisplay.appendChild(bonusNumbers);

        numberSet.appendChild(lotteryName);
        numberSet.appendChild(numbersDisplay);
        numberSet.appendChild(bonusLabel);

        return numberSet;
    }

    showError() {
        const resultsSection = document.getElementById('results');
        const commentElement = document.getElementById('comment');
        const numbersContainer = document.getElementById('numbersContainer');

        commentElement.textContent = "Something went wrong generating your numbers. Please try again!";
        numbersContainer.innerHTML = '<p style="text-align: center; color: var(--danger-color);">Unable to generate numbers. Please refresh and try again.</p>';

        resultsSection.classList.remove('hidden');
    }
}

// Reviews Carousel Class
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
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Stories Carousel Class
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
        }, 5000);
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
