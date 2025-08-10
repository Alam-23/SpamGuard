/**
 * Form handlers for reporting dangerous numbers
 */
export function initializeForm(onSubmit, onCancel) {
    const form = document.getElementById('contact-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const phoneInput = document.getElementById('phone');
    const categorySelect = document.getElementById('category');
    const descriptionInput = document.getElementById('description');
    
    // Set up form title change based on edit vs add
    const formTitle = document.getElementById('form-title');
    const contactIdField = document.getElementById('contact-id');
    
    // Create error message elements
    const phoneErrorDiv = document.createElement('div');
    phoneErrorDiv.className = 'text-red-500 text-sm mt-1 hidden';
    phoneInput.parentNode.after(phoneErrorDiv);
    
    // Phone validation - only allow numbers and basic formatting
    phoneInput.addEventListener('input', validatePhone);
    
    function validatePhone() {
        const value = phoneInput.value.trim();
        const phonePattern = /^[0-9\s\-\+\(\)\.]+$/;
        
        if (value && !phonePattern.test(value)) {
            phoneErrorDiv.textContent = 'Phone number can only contain digits, spaces, and characters: + - ( ) .';
            phoneErrorDiv.classList.remove('hidden');
            phoneInput.classList.add('border-red-500');
            phoneInput.classList.add('bg-red-50');
            return false;
        } else {
            phoneErrorDiv.classList.add('hidden');
            phoneInput.classList.remove('border-red-500');
            phoneInput.classList.remove('bg-red-50');
            return true;
        }
    }
    
    // Form reset with validation cleanup
    const resetForm = () => {
        form.reset();
        contactIdField.value = '';
        formTitle.textContent = 'Report Dangerous Number';
        
        // Reset validation states
        phoneErrorDiv.classList.add('hidden');
        phoneInput.classList.remove('border-red-500');
        phoneInput.classList.remove('bg-red-50');
    };
    
    const populateForm = (report) => {
        if (report) {
            formTitle.textContent = 'Edit Report';
            contactIdField.value = report.id;
            phoneInput.value = report.phone;
            categorySelect.value = report.category || '';
            descriptionInput.value = report.description || '';
        } else {
            resetForm();
        }
    };
    
    // Set up form submission with validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phoneValid = validatePhone();
        
        // Stop if validation fails
        if (!phoneValid) {
            return;
        }
        
        const id = contactIdField.value;
        const phone = phoneInput.value.trim();
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();
        
        onSubmit({ id, phone, category, description });
        resetForm();
    });
    
    // Set up cancel button
    cancelBtn.addEventListener('click', () => {
        resetForm();
        onCancel();
    });
    
    return {
        reset: resetForm,
        populate: populateForm
    };
}