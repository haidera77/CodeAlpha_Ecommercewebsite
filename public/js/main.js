// Alert auto-close
// 🔍 Live Search Suggestions
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('searchSuggestions');
  let debounceTimer;

  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (query.length < 2) {
        suggestionsBox.classList.remove('show');
        suggestionsBox.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`/products/api/search?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(products => {
            suggestionsBox.innerHTML = '';
            if (products.length === 0) {
              suggestionsBox.innerHTML = '<div class="suggestion-empty">No products found</div>';
            } else {
              products.forEach(product => {
                const item = document.createElement('a');
                item.href = `/products/${product._id}`;
                item.className = 'suggestion-item';
                item.innerHTML = `
                  <img src="${product.image}" alt="${product.name}">
                  <div class="suggestion-info">
                    <h4>${product.name}</h4>
                    <span>$${product.price.toFixed(2)}</span>
                  </div>
                `;
                suggestionsBox.appendChild(item);
              });
            }
            suggestionsBox.classList.add('show');
          })
          .catch(err => console.error('Search error:', err));
      }, 300); // 300ms debounce
    });

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-wrapper')) {
        suggestionsBox.classList.remove('show');
      }
    });

    // Keyboard navigation (Enter to search, Escape to close)
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        suggestionsBox.classList.remove('show');
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 4000);
  });

  // Close button
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.remove();
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Add to cart animation
  document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function () {
      const btn = this.querySelector('button');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      btn.style.background = 'var(--success-color)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 1500);
    });
  });

  // Image lazy loading effect
  const images = document.querySelectorAll('.product-image img');
  images.forEach(img => {
    img.addEventListener('load', function () {
      this.style.opacity = '1';
    });
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s';
    }
  });

  // Search bar focus effect
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('focus', function () {
      this.parentElement.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    });
    searchInput.addEventListener('blur', function () {
      this.parentElement.style.boxShadow = '';
    });
  }

  // Quantity input validation
  document.querySelectorAll('.cart-item-quantity input').forEach(input => {
    input.addEventListener('change', function () {
      if (this.value < 1) this.value = 1;
      if (this.value > this.max) this.value = this.max;
    });
  });

  // Confirm delete
  document.querySelectorAll('form[action*="delete"]').forEach(form => {
    form.addEventListener('submit', function (e) {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });
});

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '9999';
  toast.style.minWidth = '300px';
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}