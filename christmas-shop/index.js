//Hamburger
        burgerHandler();
        linkHandler();
        categoryHandler();
        function burgerHandler(){

         document.querySelector('.hamburger').addEventListener('click', () => {
            console.log(document.querySelector('.hamburger').classList.contains('hamburger__cross'));

            if (!document.querySelector('.hamburger').classList.contains('hamburger__cross')){
            openBurgerMenu();

        }
            else if(document.querySelector('.hamburger').classList.contains('hamburger__cross'))
            {
            closeBurgerMenu();

        }
    });
        }

        function openBurgerMenu(){
            console.log('open');
           /* document.querySelector('.hamburger__line_line1').classList.add('closeButton__line1');
            document.querySelector('.hamburger__line_line2').classList.add('closeButton__line2');*/
            document.querySelector('.hamburger').classList.add('hamburger__cross');
            document.querySelector('.hamburger__menu').style.right=0;
            document.body.style.overflow = 'hidden';

        }

        function closeBurgerMenu(){
            console.log('close');
            /*document.querySelector('.hamburger__line_line1').classList.remove('closeButton__line1');
            document.querySelector('.hamburger__line_line2').classList.remove('closeButton__line2');*/
            document.querySelector('.hamburger').classList.remove('hamburger__cross');
            document.querySelector('.hamburger__menu').style.right='-100%';
            document.body.style.overflow = 'visible';
        }

function linkHandler() {
    document.querySelector('.hamburger__menu').addEventListener('click', (event) => {
        console.log(event.target);
        if(event.target.classList.contains('hamburger__menu__link')){
           closeBurgerMenu();

        }
    });
}

//Slider
sliderHandler();


function defineMaxWidth(){
    if (window.matchMedia("(max-width: 768px)").matches){
        return 6;
    }
    else {
        return 3;
    }
}

function resetSliderOnScreenResize(){
    document.querySelector('.carousel-cards').style.marginLeft = 0;
    enableArrowButton('.next');
    disableArrowButton('.prev');
}


function sliderHandler(){
    let sliderWidth = '2150px';
    let visibleArea = '100%';
    let visibleAreaNumber = 0;
    let maxCount;
    document.querySelector('.slider__arrows').addEventListener('click', (event) => {
        //handle screen change
            window.addEventListener('resize', () =>{
            visibleAreaNumber = 0;
            resetSliderOnScreenResize();
            });

            //calculate max count of clicks
            maxCount = defineMaxWidth();

            //next button
        if(event.target.closest('.next')){
            console.log('right');
            if (visibleAreaNumber < maxCount) {
                visibleAreaNumber += 1;
                enableArrowButton('.prev');
                document.querySelector('.carousel-cards').style.marginLeft = `calc((${sliderWidth} - ${visibleArea})/(-${maxCount})*${visibleAreaNumber})`;
                if (visibleAreaNumber === maxCount) {
                disableArrowButton('.next');
                }
            }

         }

         //prev button
         if (event.target.closest('.prev')){
            console.log('left');
            if (visibleAreaNumber > 0){
                if (visibleAreaNumber === maxCount){
                    enableArrowButton('.next');
                }
                visibleAreaNumber -= 1;
                document.querySelector('.carousel-cards').style.marginLeft = `calc((${sliderWidth} - ${visibleArea})/(-${maxCount})*${visibleAreaNumber})`;
                if (visibleAreaNumber === 0){
                    disableArrowButton('.prev');
                }

            }
         }


    });
}


function enableArrowButton(selector){
    document.querySelector(selector).classList.remove('arrow-button_inactive');
}

function disableArrowButton(selector){
    document.querySelector(selector).classList.add('arrow-button_inactive');
}


//Timer
updateTimer();


console.log(showTimeBeforeNewYear().daysDiff);
function showTimeBeforeNewYear(){

    const newYear = new Date('December 31, 2024 23:59:00');
    const currentDate = new Date();
    let daysDiff, hours, minutes, seconds, diff;
    diff = newYear - currentDate;


    daysDiff = Math.floor((diff)/1000/60/60/24);



    diff = ((diff)/1000/60/60/24 - daysDiff)*24*60*60;//seconds


    hours = Math.floor((diff)/60/60);


    diff = ((diff)/60/60 - hours)*60*60;//seconds


    minutes = Math.floor((diff)/60);


    diff = ((diff)/60 - minutes)*60;//seconds


    seconds = Math.round((diff));

    return {
        daysDiff: daysDiff,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };

}

function setTimer(){
    document.querySelector('.days').textContent = showTimeBeforeNewYear().daysDiff;
    document.querySelector('.hours').textContent = showTimeBeforeNewYear().hours;
    document.querySelector('.minutes').textContent = showTimeBeforeNewYear().minutes;
    document.querySelector('.seconds').textContent = showTimeBeforeNewYear().seconds;

}

function updateTimer(){
    setInterval(setTimer, 1000);
}

//Category switch

function categoryHandler() {
    document.querySelector('.gifts-tags').addEventListener('click', (event) => {

        if(event.target.classList.contains('gift-tag')){
            console.log('tag clicked');
            let tag = event.target.innerText;
            showCardsBySelectedTag(tag);
            highlightSelectedTag(event.target);
        }
    });
}

function showCardsBySelectedTag(tag){
    let listOfCards = document.querySelectorAll('.gift-card');
    listOfCards.forEach(card => {
        if (tag !== 'ALL'){
        card.hidden = false;
        console.log(card.getElementsByTagName('h4')[1]);
        if(card.getElementsByTagName('h4')[0].innerText !== tag){
            card.hidden = true;
        }
    }
    else card.hidden = false;

    })
}

function highlightSelectedTag(tag){
    let listOfTags = document.querySelectorAll('.gift-tag');
    listOfTags.forEach(element => {
        element.classList.remove('gift-tag_current');
    })
    tag.classList.add('gift-tag_current');
}

