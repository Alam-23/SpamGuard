/**
 * Service layer for handling dangerous numbers data
 */
const STORAGE_KEY = 'spamguard_numbers';
const STATS_KEY = 'spamguard_stats';

// Helper to generate stats for dashboard
function updateStats() {
  const numbers = getReportedNumbers();
  const stats = {
    totalReported: numbers.length,
    scamCount: numbers.filter(n => n.category === 'scam').length,
    searchCount: parseInt(localStorage.getItem('search_count') || '0')
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

function incrementSearchCount() {
  const count = parseInt(localStorage.getItem('search_count') || '0') + 1;
  localStorage.setItem('search_count', count.toString());
  updateStats();
}

function getReportedNumbers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveReportedNumbers(numbers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
  updateStats();
}

export const spamService = {
  /**
   * Get all reported numbers
   */
  getReportedNumbers() {
    return getReportedNumbers();
  },
  
  /**
   * Save reported numbers
   */
  saveReportedNumbers(numbers) {
    saveReportedNumbers(numbers);
  },
  
  /**
   * Get a single reported number by ID
   */
  getReportById(id) {
    const numbers = getReportedNumbers();
    return numbers.find(report => report.id === id);
  },
  
  /**
   * Check if a phone number is reported
   */
  checkPhoneNumber(phone) {
    const numbers = getReportedNumbers();
    return numbers.find(report => report.phone === phone.trim());
  },
  
  /**
   * Add a new report
   */
  addReport(report) {
    const numbers = getReportedNumbers();
    const newReport = {
      ...report,
      id: Date.now().toString(),
      reportDate: new Date().toISOString()
    };
    numbers.push(newReport);
    saveReportedNumbers(numbers);
    return newReport;
  },
  
  /**
   * Update an existing report
   */
  updateReport(report) {
    const numbers = getReportedNumbers();
    const updatedNumbers = numbers.map(r => 
      r.id === report.id ? { ...r, ...report, updatedDate: new Date().toISOString() } : r
    );
    saveReportedNumbers(updatedNumbers);
    return report;
  },
  
  /**
   * Delete a report
   */
  deleteReport(id) {
    const numbers = getReportedNumbers();
    const filteredNumbers = numbers.filter(r => r.id !== id);
    saveReportedNumbers(filteredNumbers);
  },
  
  /**
   * Search reported numbers
   */
  searchNumbers(query = '') {
    if (!query) return [];
    
    // Track search activity
    incrementSearchCount();
    
    const numbers = getReportedNumbers();
    const cleanQuery = query.trim().replace(/\D/g, '');
    
    return numbers.filter(report => 
      report.phone.replace(/\D/g, '').includes(cleanQuery)
    );
  },
  
  /**
   * Get stats for dashboard
   */
  getStats() {
    return JSON.parse(localStorage.getItem(STATS_KEY) || 
      JSON.stringify({
        totalReported: 0,
        scamCount: 0,
        searchCount: 0
      })
    );
  }
};