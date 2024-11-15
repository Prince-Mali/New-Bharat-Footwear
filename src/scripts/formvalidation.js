(() => {
  'use strict';

  // Function to add validation behavior to forms
  function applyValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  // Apply validation to existing forms
  applyValidation();

  // Observe changes in the DOM to catch dynamically loaded forms
  const observer = new MutationObserver(applyValidation);
  observer.observe(document.body, { childList: true, subtree: true });
})();
