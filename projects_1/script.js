document.addEventListener("DOMContentLoaded", (e) => {
    let header = document.querySelector('.header'),
        header_h = header.clientHeight,
        header_lang_item = document.querySelectorAll('.header__lang-item');

    window.addEventListener("scroll", (event) => {
        if(window.pageYOffset >= header_h) {
            header.classList.add('scroll');
        } else {
            header.classList.remove('scroll');
        }
    });
    
    header_lang_item.forEach(item => {

        item.addEventListener('click', (e) => {

            header_lang_item.forEach(item => {
                item.classList.remove('header__lang-item_active');
            });

            item.classList.add('header__lang-item_active');
        });
    });
});
