'use strict';

window.addEventListener('DOMContentLoaded', function () {
  // fix view
  document.querySelectorAll('.fix-opacity').forEach(function (el) {
    setTimeout(function () {
      el.classList.remove('fix-opacity');
    }, 0);
  });
});