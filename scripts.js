document.addEventListener("DOMContentLoaded", function () {
  const categoriesList = document.getElementById("categories-list");
  const productGrid = document.getElementById("product-grid");
  const categoryHeader = document.getElementById("category-header");
  const paginationInfo = document.getElementById("pagination-info");

  // Function to fetch product categories from the API
  async function fetchProductCategories() {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching product categories:', error);
      return []; // Return an empty array in case of an error
    }
  }

  // Function to fetch all products from the API
  async function fetchAllProducts() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return an empty array in case of an error
    }
  }

  // Function to fetch products based on category from the API
  async function fetchProductsByCategory(category, page = 1) {
    if (category === "All") {
      return fetchAllProducts();
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/category/${category}?page=${page}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], total: 0, limit: 0 }; // Return empty data in case of an error
    }
  }

  // Function to display product cards in the right section
  function renderProducts(products) {
    productGrid.innerHTML = "";

    products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Rating: ${product.rating}</p>
        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      `;

      productGrid.appendChild(productCard);
    });
  }

  // Function to render pagination info for a category
  function renderPaginationInfo(total, limit) {
    paginationInfo.innerHTML = `
      <p>Total Products: ${total} | Products per page: ${limit} </p>
    `;
  }

  // Function to handle category click event
  async function handleCategoryClick(event) {
    const clickedCategory = event.target.dataset.category;
    const activeCategory = document.querySelector(".category.active");
    if (activeCategory) {
      activeCategory.classList.remove("active");
    }
    event.target.classList.add("active");

    const { products, total, limit } = await fetchProductsByCategory(clickedCategory);
    categoryHeader.textContent = `Products - ${clickedCategory}`;
    renderPaginationInfo(total, limit);
    renderProducts(products);
  }

  // Add event listeners to categories list items
  async function setupCategories() {
    const categories = await fetchProductCategories();
    categories.forEach(category => {
      const listItem = document.createElement("li");
      listItem.textContent = category;
      listItem.classList.add("category");
      listItem.dataset.category = category;
      listItem.addEventListener("click", handleCategoryClick);
      categoriesList.appendChild(listItem);
    });

    // Add event listener for the "All" category
    const allCategory = document.querySelector('.category[data-category="All"]');
    allCategory.addEventListener("click", handleCategoryClick);

    // Trigger click event on the "All" category by default
    allCategory.click();
  }

  // Initial setup: Fetch categories and display all products
  setupCategories();
});
