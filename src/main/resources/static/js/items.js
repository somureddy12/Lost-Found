// items.js - Lost & Found Portal (Row-wise layout, 2 columns per row)

const apiBaseUrl = '/api';

// -------------------- Auth Helper --------------------
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------- Fetch All Items --------------------
async function fetchAllItems() {
  const response = await fetch(`${apiBaseUrl}/items/getAllItems`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
}

// -------------------- Search Items --------------------
async function searchItems({ status, category, location, keyword }) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (keyword) params.append('keyword', keyword);

  const response = await fetch(`${apiBaseUrl}/items/search?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to search items');
  return response.json();
}

// -------------------- Render Items Row-wise --------------------
function renderItems(items, containerId = 'items-list') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // clear existing items

  if (items.length === 0) {
    container.innerHTML = '<p class="text-center mt-3">No items found.</p>';
    return;
  }

  let row;
  items.forEach((item, index) => {
    // Start a new row for every 2 items
    if (index % 2 === 0) {
      row = document.createElement('div');
      row.className = 'row mb-4';
      container.appendChild(row);
    }

    const col = document.createElement('div');
    col.className = 'col-md-6 d-flex align-items-center';

    const badgeClass = item.status === 'lost' ? 'bg-danger' : 'bg-success';
    const badgeText = item.status === 'lost' ? '🔍 Lost' : '✅ Found';

    const imageSrc = item.imageBase64
      ? `data:image/jpeg;base64,${item.imageBase64}`
      : 'https://via.placeholder.com/200x200?text=No+Image';

    col.innerHTML = `
      <div class="card mb-3 flex-row w-100 shadow-sm">
        <div class="col-5 p-0">
          <img src="${imageSrc}" class="img-fluid rounded-start" alt="${item.name}" style="height:200px; object-fit:cover; width:100%;">
          <span class="badge ${badgeClass} position-absolute top-0 start-0 m-2">${badgeText}</span>
        </div>
        <div class="col-7 p-3 d-flex flex-column justify-content-between">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description || ''}</p>
          <p class="mb-1"><strong>Category:</strong> ${item.category}</p>
          <p class="mb-1"><strong>Location:</strong> ${item.location}</p>
          <p class="mb-1"><strong>Date Reported:</strong> ${item.dateReported}</p>
          <p class="mb-1"><strong>Contact:</strong> ${item.contactInfo}</p>
          
        </div>
      </div>
    `;

    row.appendChild(col);
  });
}

// -------------------- DOM Event Listeners --------------------
document.addEventListener('DOMContentLoaded', async () => {
  const searchForm = document.getElementById('searchForm');

  // Fetch and render all items on page load
  try {
    const items = await fetchAllItems();
    renderItems(items, 'items-list');
  } catch (error) {
    console.error(error);
  }

  // Search/filter form submit
  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('typeFilter').value;
      const category = document.getElementById('categoryFilter').value;
      const location = document.getElementById('locationFilter').value;
      const keyword = ''; // optional

      try {
        const items = await searchItems({ status, category, location, keyword });
        renderItems(items, 'items-list');
      } catch (error) {
        console.error(error);
      }
    });
  }

  // Update navbar login/profile link
  const loginNav = document.getElementById('loginNav');
  if (loginNav) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    loginNav.href = user ? 'profile.html' : 'login.html';
  }
});
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
// -------------------- Restrict Pages Before Login (Animated Popup) --------------------
document.addEventListener("DOMContentLoaded", () => {
  const restrictedPages = ["/items.html"];
  const currentPage = window.location.pathname;

  if (restrictedPages.includes(currentPage)) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
      // Create popup overlay
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "0";
      popup.style.left = "0";
      popup.style.width = "100%";
      popup.style.height = "100%";
      popup.style.backgroundColor = "rgba(0,0,0,0.5)";
      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.justifyContent = "center";
      popup.style.zIndex = "10000";
      popup.style.opacity = "0";
      popup.style.transition = "opacity 0.3s ease";

      // Popup content box
      const box = document.createElement("div");
      box.style.background = "#fff";
      box.style.padding = "2rem";
      box.style.borderRadius = "8px";
      box.style.textAlign = "center";
      box.style.maxWidth = "400px";
      box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      box.style.transform = "scale(0.8)";
      box.style.transition = "transform 0.3s ease";
      box.innerHTML = `
        <h4 style="margin-bottom:1rem;">⚠️ Login Required</h4>
        <p style="margin-bottom:1.5rem;">You need to be logged in to access this page.</p>
        <button id="popupOkBtn" class="btn btn-primary">OK</button>
      `;

      popup.appendChild(box);
      document.body.appendChild(popup);

      // Prevent scrolling behind popup
      document.body.style.overflow = "hidden";

      // Animate fade-in
      requestAnimationFrame(() => {
        popup.style.opacity = "1";
        box.style.transform = "scale(1)";
      });

      // OK button click handler
      document.getElementById("popupOkBtn").addEventListener("click", () => {
        // Animate fade-out
        popup.style.opacity = "0";
        box.style.transform = "scale(0.8)";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 300); // match transition duration
      });
    }
  }
});
