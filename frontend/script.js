let applications = JSON.parse(localStorage.getItem('applications')) || [];
let currentView = localStorage.getItem('currentView') || 'cards';
let darkMode = localStorage.getItem('darkMode') === 'true';

const applicationsContainer = document.getElementById('applications');
const addButton = document.getElementById('add-application');
const toggleViewButton = document.getElementById('toggle-view');
const filterSelect = document.getElementById('filter-status');
const sortSelect = document.getElementById('sort-by');
const modal = document.getElementById('application-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.querySelector('.modal-close');
const applicationForm = document.getElementById('application-form');
const notification = document.getElementById('notification');
const themeToggle = document.getElementById('theme-toggle');

if (darkMode) {
  document.body.classList.add('dark-mode');
  themeToggle.checked = true;
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('darkMode', darkMode);
}

function checkUpcomingFollowups() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingFollowups = applications.filter(app => {
    if (!app.followup) return false;
    const followupDate = new Date(app.followup);
    return followupDate >= today && followupDate <= tomorrow;
  });

  if (upcomingFollowups.length > 0) {
    showNotification(`You have ${upcomingFollowups.length} application(s) with follow-ups due soon!`);
  }
}

function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

function init() {
  renderApplications();
  checkUpcomingFollowups();

  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

function renderApplications() {
  const statusFilter = filterSelect.value;
  const sortBy = sortSelect.value;

  let filteredApps = applications;
  if (statusFilter !== 'all') {
    filteredApps = applications.filter(app => app.status === statusFilter);
  }

  filteredApps.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'company':
        return a.company.localeCompare(b.company);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  if (filteredApps.length === 0) {
    applicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>${applications.length === 0 ? 
          'No applications yet. Click "New Application" to get started!' : 
          'No applications match your current filters.'}
        </p>
      </div>
    `;
    return;
  }

  if (currentView === 'cards') {
    renderCardsView(filteredApps);
  } else {
    renderTableView(filteredApps);
  }
}

function renderCardsView(apps) {
  applicationsContainer.innerHTML = '';
  applicationsContainer.className = 'applications';

  apps.forEach(app => {
    const formattedDate = new Date(app.date).toLocaleDateString();
    const followupDate = app.followup ? new Date(app.followup).toLocaleDateString() : 'None';

    const card = document.createElement('div');
    card.className = 'application-card';

    const statusText = {
      'applied': 'Applied',
      'waiting': 'Waiting',
      'interview': 'Interview',
      'accepted': 'Accepted',
      'rejected': 'Rejected'
    }[app.status];

    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${app.position}</div>
          <div class="card-company">${app.company}</div>
        </div>
        <span class="status-badge status-${app.status}">${statusText}</span>
      </div>
      <div class="card-date">Applied: ${formattedDate}</div>
      ${app.followup ? `<div class="card-date">Follow-up: ${followupDate}</div>` : ''}
      ${app.notes ? `<div class="card-notes">${app.notes}</div>` : ''}
      <div class="card-actions">
        <button class="edit-btn" data-id="${app.id}">Edit</button>
        <button class="delete-btn" data-id="${app.id}">Delete</button>
      </div>
    `;

    applicationsContainer.appendChild(card);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editApplication(btn.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteApplication(btn.dataset.id));
  });
}

function renderTableView(apps) {
  applicationsContainer.innerHTML = '';
  applicationsContainer.className = 'applications-table';

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Position</th>
        <th>Company</th>
        <th>Date</th>
        <th>Status</th>
        <th>Follow-up</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${apps.map(app => {
        const formattedDate = new Date(app.date).toLocaleDateString();
        const followupDate = app.followup ? new Date(app.followup).toLocaleDateString() : 'None';

        const statusText = {
          'applied': 'Applied',
          'waiting': 'Waiting',
          'interview': 'Interview',
          'accepted': 'Accepted',
          'rejected': 'Rejected'
        }[app.status];

        return `
          <tr>
            <td>${app.position}</td>
            <td>${app.company}</td>
            <td>${formattedDate}</td>
            <td><span class="status-badge status-${app.status}">${statusText}</span></td>
            <td>${followupDate}</td>
            <td>
              <button class="edit-btn" data-id="${app.id}">Edit</button>
              <button class="delete-btn" data-id="${app.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .applications-table {
      overflow-x: auto;
      margin-top: 20px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--card-color);
      box-shadow: var(--shadow);
      border-radius: 8px;
      overflow: hidden;
      transition: background-color 0.3s ease;
    }
    
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    th {
      background-color: var(--primary-color);
      color: white;
      font-weight: 600;
    }
    
    tr:hover {
      background-color: rgba(128, 128, 128, 0.1);
    }
    
    td .status-badge {
      display: inline-block;
    }
  `;

  document.head.appendChild(style);
  applicationsContainer.appendChild(table);

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editApplication(btn.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteApplication(btn.dataset.id));
  });
}

function toggleView() {
  currentView = currentView === 'cards' ? 'table' : 'cards';
  localStorage.setItem('currentView', currentView);
  renderApplications();
}

function showAddModal() {
  modalTitle.textContent = 'Add Application';
  applicationForm.reset();
  document.getElementById('form-id').value = '';
  modal.style.display = 'flex';
}

function editApplication(id) {
  const app = applications.find(a => a.id === id);
  if (!app) return;

  modalTitle.textContent = 'Edit Application';
  document.getElementById('form-id').value = app.id;
  document.getElementById('position').value = app.position;
  document.getElementById('company').value = app.company;
  document.getElementById('date').value = app.date;
  document.getElementById('status').value = app.status;
  document.getElementById('followup').value = app.followup || '';
  document.getElementById('notes').value = app.notes || '';

  modal.style.display = 'flex';
}

function deleteApplication(id) {
  if (confirm('Are you sure you want to delete this application?')) {
    applications = applications.filter(app => app.id !== id);
    saveApplications();
    renderApplications();
    showNotification('Application deleted successfully!');
  }
}

function saveApplications() {
  localStorage.setItem('applications', JSON.stringify(applications));
}

addButton.addEventListener('click', showAddModal);
toggleViewButton.addEventListener('click', toggleView);
themeToggle.addEventListener('change', toggleDarkMode);
filterSelect.addEventListener('change', renderApplications);
sortSelect.addEventListener('change', renderApplications);
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
applicationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('form-id').value || Date.now().toString();
  const position = document.getElementById('position').value;
  const company = document.getElementById('company').value;
  const date = document.getElementById('date').value;
  const status = document.getElementById('status').value;
  const followup = document.getElementById('followup').value;
  const notes = document.getElementById('notes').value;

  const application = {
    id,
    position,
    company,
    date,
    status,
    followup,
    notes
  };

  const existingIndex = applications.findIndex(app => app.id === id);
  if (existingIndex >= 0) {
    applications[existingIndex] = application;
    showNotification('Application updated successfully!');
  } else {
    applications.push(application);
    showNotification('Application added successfully!');
  }

  saveApplications();
  renderApplications();
  modal.style.display = 'none';
});

setInterval(checkUpcomingFollowups, 3600000);
init();
