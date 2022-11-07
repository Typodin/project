'use strict';
window.addEventListener('DOMContentLoaded', () => {

    // fix view
    document.querySelectorAll('.fix-opacity').forEach((el) => {
        setTimeout(function () {
            el.classList.remove('fix-opacity');
        }, 0);
    });


});