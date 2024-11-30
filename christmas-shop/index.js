//Hamburger
        burgerHandler();
        linkHandler();

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

