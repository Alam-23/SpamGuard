/**
 * Creates a dangerous number report card 
 */
export function createReportCard(report, onEdit, onDelete) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 border hover:shadow-md transition-all card-hover';
    
    // Define category labels and colors
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
    
    const reportDate = new Date(report.reportDate).toLocaleDateString();
    
    div.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="flex-1">
                <div class="font-semibold text-lg">${report.phone}</div>
                <div class="flex items-center gap-2 mt-1">
                    <span class="${categoryColors[report.category] || 'bg-gray-100 text-gray-800'} px-2.5 py-0.5 rounded-full text-xs font-medium">
                        ${categoryLabels[report.category] || 'Unknown'}
                    </span>
                    <span class="text-xs text-gray-500">
                        <i class="fas fa-calendar-alt mr-1"></i> ${reportDate}
                    </span>
                </div>
            </div>
        </div>
        <div class="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
            ${report.description || 'No description provided'}
        </div>
        <div class="flex gap-2 mt-3">
            <button class="edit-btn flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center">
                <i class="fas fa-edit mr-2"></i> Edit
            </button>
            <button class="delete-btn flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center">
                <i class="fas fa-trash mr-2"></i> Delete
            </button>
        </div>
    `;

    div.querySelector('.edit-btn').addEventListener('click', () => onEdit(report.id));
    div.querySelector('.delete-btn').addEventListener('click', () => onDelete(report.id));
    
    return div;
}