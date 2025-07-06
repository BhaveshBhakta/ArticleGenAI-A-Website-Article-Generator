const articleForm = document.getElementById('articleForm');
const generateBtn = document.getElementById('generateBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const errorState = document.getElementById('errorState');
const articleContent = document.getElementById('articleContent');
const sourceUrl = document.getElementById('sourceUrl');
const generatedTime = document.getElementById('generatedTime');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const retryBtn = document.getElementById('retryBtn');
const errorMessage = document.getElementById('errorMessage');
const websiteUrlInput = document.getElementById('websiteUrl');

// State management
let currentArticle = '';
let currentUrl = '';
let progressInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupAnimations();
});

// Event Listeners
function setupEventListeners() {
    // Form submission
    if (articleForm) {
        articleForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Action buttons
    if (copyBtn) {
        copyBtn.addEventListener('click', copyArticle);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadArticle);
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', retryGeneration);
    }
    
    // Input validation
    if (websiteUrlInput) {
        websiteUrlInput.addEventListener('input', debounce(validateUrl, 300));
        websiteUrlInput.addEventListener('paste', handlePaste);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Setup animations
function setupAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Apply initial animations
    const header = document.querySelector('.header-content');
    const inputSection = document.querySelector('.input-section');
    
    if (header) {
        header.style.animation = 'fadeInUp 1s ease-out';
    }
    
    if (inputSection) {
        inputSection.style.animation = 'fadeInUp 1s ease-out 0.2s both';
    }
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const url = formData.get('url');
    
    if (!url || !url.trim()) {
        showError('Please enter a valid URL');
        return;
    }
    
    const trimmedUrl = url.trim();
    
    if (!isValidUrl(trimmedUrl)) {
        showError('Please enter a valid URL format');
        return;
    }
    
    currentUrl = trimmedUrl;
    await generateArticle(trimmedUrl);
}

// Generate article function
async function generateArticle(url) {
    try {
        showLoading();
        
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate article');
        }
        
        if (data.success) {
            currentArticle = data.article;
            showResults(data.article, data.source_url);
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Error generating article:', error);
        showError(error.message || 'Failed to generate article. Please try again.');
    }
}

// Show loading state
function showLoading() {
    hideAllStates();
    
    if (loadingState) {
        loadingState.classList.remove('hidden');
    }
    
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }
    
    // Animate progress steps
    animateProgressSteps();
}

// Animate progress steps
function animateProgressSteps() {
    const steps = document.querySelectorAll('.step');
    if (steps.length === 0) return;
    
    let currentStep = 0;
    
    // Clear any existing interval
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
            }
            currentStep++;
        } else {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }, 2000);
}

// Show results
function showResults(article, sourceUrlValue) {
    hideAllStates();
    
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
    }
    
    // Set content
    if (articleContent) {
        articleContent.innerHTML = formatArticleContent(article);
    }
    
    if (sourceUrl) {
        sourceUrl.href = sourceUrlValue;
        sourceUrl.textContent = sourceUrlValue;
    }
    
    if (generatedTime) {
        generatedTime.textContent = new Date().toLocaleString();
    }
    
    // Reset button
    resetGenerateButton();
    
    // Smooth scroll to results
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show error state
function showError(message) {
    hideAllStates();
    
    if (errorState) {
        errorState.classList.remove('hidden');
    }
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    resetGenerateButton();
}

// Hide all states
function hideAllStates() {
    // Clear progress interval
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    
    // Reset progress steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Hide states
    if (loadingState) {
        loadingState.classList.add('hidden');
    }
    
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
    
    if (errorState) {
        errorState.classList.add('hidden');
    }
}

// Reset generate button
function resetGenerateButton() {
    if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Article';
    }
}

// Format article content
function formatArticleContent(content) {
    if (!content) return '';
    
    // Basic formatting for better readability
    return content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.*)$/, '<p>$1</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Copy article to clipboard
async function copyArticle() {
    if (!currentArticle) {
        showToast('No article to copy', 'error');
        return;
    }
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(currentArticle);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentArticle;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        showToast('Article copied to clipboard!', 'success');
        
        // Update button temporarily
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Failed to copy:', error);
        showToast('Failed to copy article', 'error');
    }
}

// Download article
function downloadArticle() {
    if (!currentArticle) {
        showToast('No article to download', 'error');
        return;
    }
    
    try {
        const blob = new Blob([currentArticle], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `article-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Article downloaded!', 'success');
    } catch (error) {
        console.error('Failed to download:', error);
        showToast('Failed to download article', 'error');
    }
}

// Retry generation
function retryGeneration() {
    if (currentUrl) {
        generateArticle(currentUrl);
    } else {
        hideAllStates();
        if (websiteUrlInput) {
            websiteUrlInput.focus();
        }
    }
}

// URL validation
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

// Validate URL input
function validateUrl() {
    if (!websiteUrlInput) return;
    
    const url = websiteUrlInput.value.trim();
    
    if (url && !isValidUrl(url)) {
        websiteUrlInput.style.borderColor = 'var(--error-color)';
        websiteUrlInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
        websiteUrlInput.style.borderColor = '';
        websiteUrlInput.style.boxShadow = '';
    }
}

// Handle paste event
function handlePaste(event) {
    setTimeout(() => {
        validateUrl();
    }, 100);
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to generate
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (generateBtn && !generateBtn.disabled) {
            const submitEvent = new Event('submit');
            articleForm.dispatchEvent(submitEvent);
        }
    }
    
    // Ctrl/Cmd + C to copy (when results are visible)
    if ((event.ctrlKey || event.metaKey) && event.key === 'c' && resultsSection && !resultsSection.classList.contains('hidden')) {
        event.preventDefault();
        copyArticle();
    }
    
    // Escape to close error state
    if (event.key === 'Escape' && errorState && !errorState.classList.contains('hidden')) {
        hideAllStates();
    }
}

// Show toast notification
function showToast(message, type) {
    type = type || 'info';
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getToastColor(type),
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    document.body.appendChild(toast);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Get toast icon
function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Get toast color
function getToastColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };
    return colors[type] || colors.info;
}

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Network status handling
window.addEventListener('online', function() {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showToast('No internet connection', 'warning');
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setupEventListeners();
        setupAnimations();
    });
} else {
    setupEventListeners();
    setupAnimations();
}