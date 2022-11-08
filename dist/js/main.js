'use strict';
window.addEventListener('DOMContentLoaded', () => {

    /** Adding a panel to the header when scrolling the page */
    (function () {
        const header = document.querySelector(".header");

        const addClassOnScroll = () => header.classList.add("bg-header");
        const removeClassOnScroll = () => header.classList.remove("bg-header");

        // Page reload check
        let scrollPosStatic = window.scrollY;
        let checkPosition = function (el) {
            el >= 1 ? addClassOnScroll() : removeClassOnScroll();
        }
        checkPosition(scrollPosStatic);

        // Page scroll check
        window.addEventListener('scroll', function() {
            let scrollPos = window.scrollY;
            checkPosition(scrollPos);
        })
    })();

    /** Toggle header */
    (function (){
        const btnTriggerOpen = document.querySelector('.js-open-header');
        const btnTriggerClose = document.querySelector('.js-close-header');
        const elHeader = document.querySelector('.header');

        btnTriggerOpen.addEventListener('click', function (e) {
            e.preventDefault();
            elHeader.classList.add('open');
        });
        btnTriggerClose.addEventListener('click', function (e) {
            e.preventDefault();
            elHeader.classList.remove('open');
        });
    }());

    /** Validation form */
    function validate(e) {
        let valid = true;

        // Cleaning up error messages
        const errors = document.querySelectorAll( '.validation-error');
        if (errors) {
            errors.forEach((el) => {
                el.remove();
            })
        }

        // Error messages
        const errorsMessages = {
            requiredField: '<span class="validation-error">This is a required field</span>',
            incorrectMail: '<span class="validation-error">Invalid email address</span>'
        }

        // Checking the name
        const authorField = document.querySelector( ".validate-name" );
        if (!authorField.value ) {
            document.querySelector( 'label.f-val-name' ).innerHTML += errorsMessages.requiredField;
            valid = false;
        }

        // Checking the email
        const emailField = document.querySelector( ".validate-email" );
        if (!emailField.value) {
            document.querySelector( 'label.f-val-email' ).innerHTML += errorsMessages.requiredField;
            valid = false;
        } else {
            const reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if(!reg.test(String(emailField.value).toLowerCase())) {
                document.querySelector( 'label.f-val-email' ).innerHTML += errorsMessages.incorrectMail;
                valid = false;
            }
        }

        // Checking validation
        if(valid === false) {
            e.preventDefault();
        }
        return valid;
    }

    (function () {
        const form = document.querySelector( '#contactForm' );
        if (form) {
            form.addEventListener( 'submit', validate );
        }
    })();

});

