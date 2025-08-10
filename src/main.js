import { spamService } from './services/services.js';
import { renderSearchBar, renderSearchResults } from './components/search.js';
import { renderReportsList } from './components/cardList.js';
import { initializeForm } from './components/form.js';

// App state
let currentSearchQuery = '';
let searchResults = [];

// UI Display functions
function showListView() {
    document.getElementById('view-list').classList.remove('hidden');
    document.getElementById('view-form').classList.add('hidden');
}

function showFormView() {
    document.getElementById('view-form').classList.remove('hidden');
    document.getElementById('view-list').classList.add('hidden');
}

// Event handlers
function handleEdit(id) {
    const report = spamService.getReportById(id);
    if (report) {
        reportForm.populate(report);
        showFormView();
    }
}

function handleDelete(id) {
    const report = spamService.getReportById(id);
    if (!report) return;
    
    if (confirm(`Are you sure you want to delete this report for ${report.phone}?`)) {
        spamService.deleteReport(id);
        refreshData();
    }
}

function handleSearch(query) {
    currentSearchQuery = query;
    searchResults = spamService.searchNumbers(query);
    
    renderSearchResults(searchResults, query);
    refreshReportsList();
    updateStatsDisplay();
}

function handleFormSubmit(reportData) {
    if (reportData.id) {
        spamService.updateReport(reportData);
    } else {
        spamService.addReport(reportData);
    }
    
    showListView();
    refreshData();
}

function handleCancel() {
    showListView();
}

// Helper functions
function refreshReportsList() {
    // If we're showing search results, only show the matching reports
    // If there's no search, show recent reports (up to 10)
    let reportsToShow = [];
    
    if (currentSearchQuery && searchResults.length > 0) {
        reportsToShow = searchResults;
    } else if (!currentSearchQuery) {
        const allReports = spamService.getReportedNumbers();
        reportsToShow = allReports
            .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
            .slice(0, 10);
    }
    
    renderReportsList(reportsToShow, handleEdit, handleDelete);
}

function updateStatsDisplay() {
    const stats = spamService.getStats();
    document.getElementById('stats-reported').textContent = stats.totalReported;
    document.getElementById('stats-scams').textContent = stats.scamCount;
    document.getElementById('stats-searches').textContent = stats.searchCount;
}

function refreshData() {
    refreshReportsList();
    updateStatsDisplay();
}

// Initialize the application
function initApp() {
    // Setup search
    renderSearchBar(handleSearch);
    
    // Setup navigation
    document.getElementById('nav-list').addEventListener('click', () => {
        currentSearchQuery = '';
        searchResults = [];
        renderSearchResults([], '');
        showListView();
        refreshReportsList();
    });
    
    document.getElementById('nav-add').addEventListener('click', () => {
        reportForm.reset();
        showFormView();
    });
    
    // Initial render
    showListView();
    refreshData();
}

// Setup report form
const reportForm = initializeForm(handleFormSubmit, handleCancel);

// Start the app
document.addEventListener('DOMContentLoaded', initApp);