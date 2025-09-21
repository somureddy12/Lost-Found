// main.js for Lost & Found Portal

// --- Fetch and display recent items on Home Page ---
document.addEventListener('DOMContentLoaded', async function () {
  const recentReportsSection = document.querySelector('.container .row.g-4');
  if (recentReportsSection && window.location.pathname.endsWith('index.html')) {
    try {
      // Fetch 3 most recent items from backend
      const response = await fetch('http://localhost:8080/api/items?limit=3&sort=recent');
      if (!response.ok) throw new Error('Failed to fetch recent items');
      const items = await response.json();
      // Clear sample cards
      recentReportsSection.innerHTML = '';
      if (items.length === 0) {
        recentReportsSection.innerHTML = '<div class="col-12 text-center text-muted">No recent reports yet.</div>';
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
                <a href="mailto:${item.contact_info}" class="btn btn-outline-success btn-sm">Contact</a>
              </div>
            </div>
          `;
          recentReportsSection.appendChild(card);
        });
      }
    } catch (err) {
      // Do not display any error message if fetch fails
      recentReportsSection.innerHTML = '';
    }
  }
});

// --- Quick Search Handler ---
const quickSearchForm = document.getElementById('quickSearchForm');
if (quickSearchForm) {
  quickSearchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const query = document.getElementById('quickSearchInput').value.trim();
    if (!query) return;
    const recentReportsSection = document.querySelector('.container .row.g-4');
    if (!recentReportsSection) return;
    recentReportsSection.innerHTML = '<div class="col-12 text-center text-muted">Searching...</div>';
    try {
      const response = await fetch(`http://localhost:8080/api/items/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const items = await response.json();
      recentReportsSection.innerHTML = '';
      if (items.length === 0) {
        recentReportsSection.innerHTML = '<div class="col-12 text-center text-muted">No items found for your search.</div>';
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
                <a href="mailto:${item.contact_info}" class="btn btn-outline-success btn-sm">Contact</a>
              </div>
            </div>
          `;
          recentReportsSection.appendChild(card);
        });
      }
    } catch (err) {
      recentReportsSection.innerHTML = '<div class="col-12 text-center text-danger">Search failed. Please try again.</div>';
    }
  });
} 
document.addEventListener("DOMContentLoaded", function () {
  const loginNav = document.getElementById("loginNav");

  if (!loginNav) return;

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    // If logged in, change login button to Profile
    // loginNav.textContent = "Profile";
    loginNav.href = "profile.html";
  } else {
    // If not logged in, keep it as Login
    // loginNav.textContent = "Login";
    loginNav.href = "login.html";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("itemsContainer");

  if (!container) return;

  try {
    // Fetch all items from backend
    const response = await fetch("http://localhost:8080/api/items/getAllItems");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const items = await response.json();

    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No items reported yet.</p>`;
      return;
    }

    items.forEach(item => {
      // Badge logic
      const badgeClass = item.status === "lost" ? "bg-danger" : "bg-success";
      const badgeText = item.status === "lost" ? "🔍 Lost" : "✅ Found";

      // Image logic
      const imgSrc = item.imageBase64
        ? `data:image/jpeg;base64,${item.imageBase64}`
        : "https://via.placeholder.com/400x220?text=No+Image";

      // Build card HTML
      const cardHTML = `
        <div class="col-12 col-md-6 col-lg-3 d-flex align-items-stretch">
          <div class="card h-100 w-100 text-center position-relative">
            <img src="${imgSrc}" class="card-img-top" alt="${item.name || 'Item'}" style="height:220px; object-fit:cover; width:100%;">
            <span class="badge ${badgeClass} position-absolute top-0 start-0 m-2">${badgeText}</span>
            <div class="card-body text-start d-flex flex-column justify-content-between w-100">
              <h5 class="card-title">${item.name || 'Unnamed Item'}</h5>
              <p class="card-text">${item.description || ''}</p>
              <p class="mb-1"><strong>Location:</strong> ${item.location || 'N/A'}</p>
              <p class="mb-1"><strong>Date:</strong> ${item.dateReported || 'N/A'}</p>
              <div class="d-flex justify-content-between gap-2 mt-3 w-100">
                <a href="items.html" class="btn btn-outline-primary btn-sm" style="width:48%">View Details</a>
                <a href="items.html" class="btn btn-outline-success btn-sm" style="width:48%">Contact</a>
              </div>
            </div>
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", cardHTML);
    });

  } catch (error) {
    console.error("Failed to fetch items:", error);
    container.innerHTML = `<p class="text-center text-danger">⚠️ Failed to load items. Please try again later.</p>`;
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
