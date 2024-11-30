
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
            document.querySelector('.hamburger__line_line1').classList.add('closeButton__line1');
            document.querySelector('.hamburger__line_line2').classList.add('closeButton__line2');
            document.querySelector('.hamburger').classList.add('hamburger__cross');
            document.querySelector('.hamburger__menu').style.right=0;
            document.body.style.overflow = 'hidden';

        }

        function closeBurgerMenu(){
            console.log('close');
            document.querySelector('.hamburger__line_line1').classList.remove('closeButton__line1');
            document.querySelector('.hamburger__line_line2').classList.remove('closeButton__line2');
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