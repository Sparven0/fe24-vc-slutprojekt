
// Sets up and handles message searching functionality

export function setupMessageSearch() {

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'messageSearch';
  searchInput.placeholder = 'Search messages...';
  searchInput.className = 'search-input';
  
  const searchIcon = document.createElement('span');
  searchIcon.innerHTML = '🔍';
  searchIcon.className = 'search-icon';
  
  searchContainer.appendChild(searchIcon);
  searchContainer.appendChild(searchInput);
 
  const leftBar = document.querySelector('.leftBar');
  const formDiv = document.querySelector('.formDiv');
  leftBar.insertBefore(searchContainer, formDiv);

  searchInput.addEventListener('input', filterMessages);
}


// Filters messages based on search input

function filterMessages() {
  const searchTerm = document.getElementById('messageSearch').value.toLowerCase();
  const messages = document.querySelectorAll('.message');
  
  // Reset filter if search is empty
  if (!searchTerm.trim()) {
    messages.forEach(message => {
      message.style.display = '';
    });
    updateSearchStatus(0, '');
    return;
  }
  
  let matchCount = 0;
  
  messages.forEach(message => {
    const username = message.querySelector('h4').textContent.toLowerCase();
    const text = message.querySelector('p').textContent.toLowerCase();
    
    if (username.includes(searchTerm) || text.includes(searchTerm)) {
      message.style.display = '';
      matchCount++;
    } else {
      message.style.display = 'none';
    }
  });
  
  updateSearchStatus(matchCount, searchTerm);
}

function updateSearchStatus(count, searchTerm) {
  let statusElement = document.getElementById('search-status');
  
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.id = 'search-status';
    statusElement.className = 'search-status';
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.parentNode.insertBefore(statusElement, searchContainer.nextSibling);
  }
  
  if (searchTerm.trim()) {
    statusElement.textContent = count > 0 ? 
      `Found ${count} message${count !== 1 ? 's' : ''}` : 
      'No messages found';
    statusElement.style.display = 'block';
  } else {
    statusElement.style.display = 'none';
  }
}