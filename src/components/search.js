export function renderSearchBar(onSearch) {
    const container = document.getElementById('search-container');

    container.innerHTML = `
        <div class="max-w-lg mx-auto">
            <div class="text-center mb-4">
                <h2 class="text-xl font-bold">Check if a number has been reported</h2>
                <p class="text-sm text-gray-500">Enter a phone number to see if it has been flagged as dangerous</p>
            </div>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-phone text-red-400"></i>
                </div>
                <input 
                    type="tel" 
                    id="search-input" 
                    class="text-xs lg:text-lg pl-10 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all shadow-sm" 
                    placeholder="Search for phone number..."
                >
                <button 
                    id="search-button"
                    class="absolute inset-y-0 right-0 flex items-center bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg"
                >
                    <i class="fas fa-search mr-1"></i> Check
                </button>
            </div>
            <div class="text-xs text-gray-500 mt-2 text-center">
                Help others by reporting dangerous numbers you encounter
            </div>
        </div>
    `;

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Search when button is clicked
    searchButton.addEventListener('click', () => {
        const value = searchInput.value.trim();
        if (value) {
            onSearch(value);
        }
    });

    // Also search when Enter key is pressed
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = e.target.value.trim();
            if (value) {
                onSearch(value);
            }
        }
    });

    return searchInput;
}

// Render search results
export function renderSearchResults(results, phone) {
    const resultsContainer = document.getElementById('search-results');

    if (!phone) {
        resultsContainer.innerHTML = `
            <div class="text-center p-10 text-gray-500">
                <i class="fas fa-search text-5xl mb-4"></i>
                <p>Enter a phone number above to check if it has been reported</p>
            </div>
        `;
        return;
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center p-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <i class="fas fa-check text-green-500 text-2xl"></i>
                </div>
                <h3 class="text-xl font-medium mb-2">Good News!</h3>
                <p class="text-gray-600">${phone} has not been reported as dangerous in our database</p>
                <p class="text-sm text-gray-500 mt-4">Remember to stay vigilant. New scams appear daily.</p>
            </div>
        `;
        return;
    }

    // Sort results by date (newest first)
    const sortedResults = [...results].sort((a, b) =>
        new Date(b.reportDate) - new Date(a.reportDate)
    );

    // Get the most recent report
    const latestReport = sortedResults[0];

    // Calculate how many reports exist
    const reportCount = results.length;

    // Get category labels and colors
    const categoryLabels = {
        'scam': 'Scam/Fraud',
        'spam': 'Telemarketing/Spam',
        'robocall': 'Robocall',
        'phishing': 'Phishing',
        'harassment': 'Harassment',
        'other': 'Other'
    };

    const categoryColors = {
        'scam': 'bg-red-100 text-red-800',
        'spam': 'bg-orange-100 text-orange-800',
        'robocall': 'bg-blue-100 text-blue-800',
        'phishing': 'bg-purple-100 text-purple-800',
        'harassment': 'bg-pink-100 text-pink-800',
        'other': 'bg-gray-100 text-gray-800'
    };

    resultsContainer.innerHTML = `
    <div class="p-6 border border-red-200 rounded-lg bg-red-50">
        <!-- Consistent layout for both mobile and desktop -->
        <div class="flex flex-col items-center">
            <!-- Warning icon -->
            <div class="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center pulse mb-4">
                <i class="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            
            <!-- Header -->
            <h3 class="text-xl font-semibold text-red-900 text-center mb-1">Warning: Dangerous Number Detected!</h3>
            <p class="text-red-700 mb-4 text-center">${phone} has been reported ${reportCount} time${reportCount > 1 ? 's' : ''}</p>
            
            <!-- Category tags -->
            <div class="flex flex-wrap justify-center gap-2 mb-4">
                ${sortedResults.slice(0, 3).map(r => `
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[r.category] || 'bg-gray-100 text-gray-800'}">
                        ${categoryLabels[r.category] || 'Unknown'}
                    </span>
                `).join('')}
                ${results.length > 3 ? `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">+${results.length - 3} more</span>` : ''}
            </div>
            
            <!-- Latest report -->
            <div class="p-4 bg-white rounded border border-red-100 mb-4 w-full max-w-xl">
                <div class="font-medium text-sm mb-2">Latest Report:</div>
                <div class="text-gray-700">${latestReport.description || 'No description provided'}</div>
                <div class="text-xs text-gray-500 mt-2">Reported on ${new Date(latestReport.reportDate).toLocaleDateString()}</div>
            </div>
            
            <!-- Warning message -->
            <div class="bg-red-100 border-t-4 border-red-500 p-4 w-full">
                <div class="text-center mb-2">
                    <i class="fas fa-shield-alt text-red-700 text-xl"></i>
                </div>
                <p class="text-sm text-red-700 text-center">
                    We recommend extreme caution when dealing with this number. Never share personal information or make payments to unknown callers.
                </p>
            </div>
        </div>
    </div>
`;
}