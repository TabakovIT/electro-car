$(document).ready(function () {


    console.log('Все ок ');

    let burger = document.querySelector('.icon_menu');
    let addActive =  document.querySelector('body');

    burger.addEventListener("click", function(e){
        e.preventDefault();
        this.classList.toggle('_active');
        addActive.classList.toggle('_active');
    });


});


const hero = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
        clickable: true,
    },


    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});



