// -------------------- Base API URL --------------------
const apiBaseUrl = 'http://localhost:8080/api';

// -------------------- Auth Functions --------------------
async function registerUser(userData) {
  const response = await fetch(`${apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Registration failed');
  }
  return response.json();
}

async function loginUser(credentials) {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('loggedInUser', JSON.stringify(data.user));
  return data;
}

// -------------------- Token Helper --------------------
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------- User Profile Functions --------------------
async function getUserProfile(userId) {
  const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

async function updateUserProfile(userId, profileData) {
  const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
}

// -------------------- Report Item Function --------------------
async function reportItem(itemData, imageFile) {
  const formData = new FormData();
  formData.append('item', JSON.stringify(itemData));
  if (imageFile) formData.append('image', imageFile);

  const token = localStorage.getItem('token');
  const response = await fetch(`${apiBaseUrl}/items/report`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to report item');
  }
  return response.json();
}

// -------------------- Alert Helper --------------------
function showAlert(element, message, type) {
  if (!element) return;
  element.className = `alert alert-${type} mt-3`;
  element.textContent = message;
  element.classList.remove('d-none');
}

// -------------------- DOM Event Listeners --------------------
document.addEventListener('DOMContentLoaded', () => {
  // --- Register Form ---
  const registerForm = document.getElementById('registerForm');
  const registerAlert = document.getElementById('registerAlert');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (password !== confirmPassword) {
        showAlert(registerAlert, 'Passwords do not match!', 'danger');
        return;
      }

      try {
        await registerUser({ name, email, password, phone });
        showAlert(registerAlert, '✅ Registered successfully! Redirecting...', 'success');
        setTimeout(() => (window.location.href = 'login.html'), 1500);
      } catch (error) {
        showAlert(registerAlert, '❌ ' + error.message, 'danger');
      }
    });
  }

  // --- Login Form ---
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const data = await loginUser({ email, password });
        const userProfile = {
            name: data.name,
            email: data.email,
            contact: data.contact || "" // <-- make sure contact is included
          };
        // Save token + user info (assuming API sends user object)
        localStorage.setItem('loggedInUser', JSON.stringify(userProfile));

        showAlert(loginAlert, '✅ Login successful! Redirecting...', 'success');
        setTimeout(() => (window.location.href = 'index.html'), 1500);
      } catch (error) {
        showAlert(loginAlert, '❌ ' + error.message, 'danger');
      }

    });
  }
    // --- Navbar Login/Profile Switch ---
  const loginNav = document.getElementById("loginNav");
  if (loginNav) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      // loginNav.textContent = "Profile";
      loginNav.href = "profile.html";
    } else {
      // loginNav.textContent = "Login";
      loginNav.href = "login.html";
    }
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

