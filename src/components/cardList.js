import { createReportCard } from './cardItem.js';

/**
 * Renders the dangerous numbers list
 */
export function renderReportsList(reports, onEdit, onDelete) {
    const contactsContainer = document.getElementById('contacts-list');
    contactsContainer.innerHTML = '';
    
    if (!reports.length) {
        return;
    }
    
    const title = document.createElement('h3');
    title.className = 'text-xl font-bold mb-4 text-gray-800';
    title.textContent = 'Recent Reports';
    contactsContainer.appendChild(title);
    
    const grid = document.createElement('div');
    grid.className = 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    
    // Sort reports by date (most recent first)
    const sortedReports = [...reports].sort((a, b) => 
        new Date(b.reportDate) - new Date(a.reportDate)
    );
    
    sortedReports.forEach(report => {
        const card = createReportCard(report, onEdit, onDelete);
        grid.appendChild(card);
    });
    
    contactsContainer.appendChild(grid);
}