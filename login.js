document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the icon
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Form validation
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.querySelector('#email');
            const passwordInput = document.querySelector('#password');
            let isValid = true;
            
            // Simple email validation
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Password validation (at least 6 characters)
            if (passwordInput.value.length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                removeError(passwordInput);
            }
            
            if (isValid) {
                // Simulate login - in a real app, this would be an API call
                simulateLogin();
            }
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!formGroup.querySelector('.error-message')) {
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }
    
    // Remove error message
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error');
    }
    
    // Simulate login process
    function simulateLogin() {
        const loginBtn = document.querySelector('.login-form .btn-primary');
        const originalText = loginBtn.textContent;
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Simulate API call delay
        setTimeout(function() {
            // Success - in a real app, this would redirect to dashboard
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        }, 2000);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would trigger OAuth flow
            alert(`${this.getAttribute('data-provider')} login would be triggered here`);
        });
    });
    
    // Add some CSS for error styling
    const style = document.createElement('style');
    style.textContent = `
        .input-with-icon input.error {
            border-color: #ff3860;
        }
        
        .error-message {
            color: #ff3860;
            font-size: 0.85rem;
            margin-top: 5px;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.6s;
        }
    `;
    document.head.appendChild(style);
}); 