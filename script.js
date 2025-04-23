// DOM Elements
const form = document.getElementById('criminalForm');
const searchInput = document.getElementById('search');
const tableBody = document.getElementById('criminalTableBody');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');

// API URL - Make sure this matches your server configuration
const API_URL = '/api/criminals';

// Current editing ID
let currentEditingId = null;

// Load criminals on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, attempting to fetch criminals...');
  // Test API connection
  fetch(API_URL)
    .then(response => {
      console.log('API Response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      displayCriminals(data);
    })
    .catch(error => {
      console.error('Error:', error);
      const errorMessage = document.createElement('div');
      errorMessage.style.cssText = `
        background-color: #ff4444;
        color: white;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        text-align: center;
      `;
      errorMessage.textContent = `Failed to load data: ${error.message}. Make sure the server is running on port 30600.`;
      document.body.insertBefore(errorMessage, document.body.firstChild);
    });
});

// Show error message on the page
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ff4444;
    color: white;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  // Remove the error message after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Form submission handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const criminalData = {
    case_id: formData.get('case-id'),
    criminal_no: formData.get('criminal-no'),
    criminal_name: formData.get('criminal-name'),
    nickname: formData.get('nickname'),
    father_name: formData.get('father-name'),
    crime_type: formData.get('crime-type'),
    arrest_date: formData.get('arrest-date'),
    crime_date: formData.get('crime-date'),
    gender: formData.get('gender'),
    address: formData.get('address'),
    age: parseInt(formData.get('age')),
    most_wanted: formData.get('wanted') === 'Yes',
    occupation: formData.get('occupation'),
    birth_mark: formData.get('birth-mark')
  };

  try {
    console.log('Sending data:', criminalData);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(criminalData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create criminal record');
    }

    const result = await response.json();
    console.log('Success:', result);
    form.reset();
    loadCriminals();
    alert('Criminal record created successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating criminal record: ' + error.message);
  }
});

// Edit criminal
async function editCriminal(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch criminal data');
    }

    const criminal = await response.json();
    
    // Fill form with criminal data
    document.getElementById('case-id').value = criminal.case_id;
    document.getElementById('criminal-no').value = criminal.criminal_no;
    document.getElementById('criminal-name').value = criminal.criminal_name;
    document.getElementById('nickname').value = criminal.nickname;
    document.getElementById('father-name').value = criminal.father_name;
    document.getElementById('crime-type').value = criminal.crime_type;
    document.getElementById('arrest-date').value = criminal.arrest_date;
    document.getElementById('crime-date').value = criminal.crime_date;
    document.querySelector(`input[name="gender"][value="${criminal.gender}"]`).checked = true;
    document.getElementById('address').value = criminal.address;
    document.getElementById('age').value = criminal.age;
    document.querySelector(`input[name="wanted"][value="${criminal.most_wanted ? 'Yes' : 'No'}"]`).checked = true;
    document.getElementById('occupation').value = criminal.occupation;
    document.getElementById('birth-mark').value = criminal.birth_mark;

    // Update form state
    currentEditingId = id;
    submitBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
  } catch (error) {
    console.error('Error:', error);
    alert('Error loading criminal data: ' + error.message);
  }
}

// Delete criminal
async function deleteCriminal(id) {
  if (!confirm('Are you sure you want to delete this criminal record?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete criminal record');
    }

    loadCriminals();
    alert('Criminal record deleted successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Error deleting criminal record: ' + error.message);
  }
}

// Cancel edit
cancelBtn.addEventListener('click', () => {
  form.reset();
  resetFormState();
});

// Reset form state
function resetFormState() {
  currentEditingId = null;
  submitBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
}

// Search functionality
function searchTable() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName('tr');

  for (let row of rows) {
    const cells = row.getElementsByTagName('td');
    let found = false;

    for (let cell of cells) {
      if (cell.textContent.toLowerCase().includes(searchTerm)) {
        found = true;
        break;
      }
    }

    row.style.display = found ? '' : 'none';
  }
}

// Load criminals from API
async function loadCriminals() {
  try {
    console.log('Fetching criminals...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const criminals = await response.json();
    console.log('Criminals loaded:', criminals);
    displayCriminals(criminals);
  } catch (error) {
    console.error('Error loading criminals:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: red;">
          Error loading data: ${error.message}
        </td>
      </tr>
    `;
  }
}

// Display criminals in the table
function displayCriminals(criminals) {
  console.log('Displaying criminals:', criminals);
  tableBody.innerHTML = '';
  
  if (!Array.isArray(criminals) || criminals.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center;">
          No criminal records found
        </td>
      </tr>
    `;
    return;
  }
  
  criminals.forEach(criminal => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${criminal.case_id}</td>
      <td>${criminal.criminal_no}</td>
      <td>${criminal.criminal_name}</td>
      <td>${criminal.crime_type}</td>
      <td>${criminal.arrest_date}</td>
      <td>${criminal.most_wanted ? 'Yes' : 'No'}</td>
      <td>
        <button onclick="editCriminal(${criminal.id})" class="edit-btn">Edit</button>
        <button onclick="deleteCriminal(${criminal.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
