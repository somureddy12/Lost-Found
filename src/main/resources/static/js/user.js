// user.js for Lost & Found Portal - User Dashboard logic

// On page load, fetch and display user's items
// (Requires authentication/session management)

document.addEventListener('DOMContentLoaded', async function () {
  const userItemsSection = document.getElementById('userItems');
  const dashboardAlert = document.getElementById('dashboardAlert');

  // TODO: Get user ID/token from session/auth
  const userId = localStorage.getItem('userId'); // Example only
  if (!userId) {
    dashboardAlert.className = 'alert alert-warning mt-4';
    dashboardAlert.textContent = 'Please log in to view your dashboard.';
    dashboardAlert.classList.remove('d-none');
    userItemsSection.innerHTML = '';
    return;
  }

  try {
    // Fetch user's items from backend
    const response = await fetch(`http://localhost:8080/api/auth/${userId}/items`);
    if (!response.ok) throw new Error('Failed to fetch your items');
    const items = await response.json();
    userItemsSection.innerHTML = '';
    if (items.length === 0) {
      userItemsSection.innerHTML = '<div class="col-12 text-center text-muted">You have not reported any items yet.</div>';
    } else {
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        // Use item.imageUrl or a placeholder image
        const imgUrl = item.imageUrl ? item.imageUrl : 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';
        card.innerHTML = `
          <div class="card h-100 border-${item.status === 'found' ? 'success' : 'danger'}">
            <img src="${imgUrl}" class="card-img-top" alt="Item Image">
            <div class="card-body">
              <span class="badge bg-${item.status === 'found' ? 'success' : 'danger'} mb-2">${item.status === 'found' ? '✅ Found' : '🔍 Lost'}</span>
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="mb-1"><strong>Location:</strong> ${item.location}</p>
              <p class="mb-1"><strong>Date:</strong> ${item.date_reported || ''}</p>
              <a href="item-details.html?id=${item.id}" class="btn btn-outline-primary btn-sm">View Details</a>
              <button class="btn btn-outline-secondary btn-sm me-2" onclick="editItem(${item.id})">Edit</button>
              <button class="btn btn-outline-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
            </div>
          </div>
        `;
        userItemsSection.appendChild(card);
      });
    }
  } catch (err) {
    userItemsSection.innerHTML = '<div class="col-12 text-center text-danger">Could not load your items.</div>';
  }
});

// Placeholder functions for edit/delete
function editItem(itemId) {
  // TODO: Implement edit item logic (e.g., open edit form or redirect)
  alert('Edit functionality coming soon! Item ID: ' + itemId);
}

function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  // TODO: Implement delete item logic (API call, then refresh list)
  alert('Delete functionality coming soon! Item ID: ' + itemId);
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // TODO: Clear session/auth info
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
  });
} 

// -------------------- Navbar Search --------------------
document.addEventListener('DOMContentLoaded', () => {
  const navbarSearchForm = document.getElementById('navbarSearchForm');
  const navbarSearchInput = document.getElementById('navbarSearchInput');

  if (navbarSearchForm && navbarSearchInput) {
    navbarSearchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const keyword = navbarSearchInput.value.trim();
      if (!keyword) return;

      try {
        // Perform search with keyword (other filters can be empty)
        const items = await searchItems({ status: '', category: '', location: '', keyword });
        renderItems(items, 'items-list');
      } catch (err) {
        console.error('Navbar search failed:', err);
      }
    });
  }
});
