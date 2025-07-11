document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('subjectDropdown');
    const dropdownOptions = document.getElementById('subjectOptions');
    const selectedSubject = document.getElementById('selectedSubject');
    const subjectOptions = document.querySelectorAll('.subject-option');
    dropdownButton.addEventListener('click', function () {
        dropdownOptions.classList.toggle('hidden');
    });
    subjectOptions.forEach(option => {
        option.addEventListener('click', function () {
            selectedSubject.textContent = this.textContent;
            dropdownOptions.classList.add('hidden');
        });
    });
    document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownOptions.contains(event.target)) {
            dropdownOptions.classList.add('hidden');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        // Simulate form submission
        setTimeout(() => {
            contactForm.style.display = 'none';
            successMessage.classList.remove('hidden');
            // Reset form after showing success message
            setTimeout(() => {
                contactForm.reset();
                selectedSubject.textContent = 'Select a subject';
                contactForm.style.display = 'block';
                successMessage.classList.add('hidden');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    });
});

tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#0066CC',
                secondary: '#3399FF'
            },
            borderRadius: {
                'none': '0px',
                'sm': '4px',
                DEFAULT: '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '20px',
                '2xl': '24px',
                '3xl': '32px',
                'full': '9999px',
                'button': '8px'
            }
        }
    }
}

 const toggleBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });