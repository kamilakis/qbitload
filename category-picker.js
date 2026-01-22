const categorySelect = document.getElementById('categorySelect');
const newCategoryForm = document.getElementById('newCategoryForm');
const newCategoryInput = document.getElementById('newCategoryInput');
const newCategorySavePath = document.getElementById('newCategorySavePath');
const cancelButton = document.getElementById('cancelButton');
const sendButton = document.getElementById('sendButton');

async function getDarkMode() {
  const result = await browser.storage.local.get('darkMode');
  return result.darkMode || false;
}

function enableDarkMode() {
  document.body.classList.add("dark-mode-body");
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.classList.add("dark-mode-others"));
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.classList.add("dark-mode-others"));
  const selects = document.querySelectorAll('select');
  selects.forEach(select => select.classList.add("dark-mode-others"));
}

async function initializeDarkMode() {
  const darkMode = await getDarkMode();
  if (darkMode) {
    enableDarkMode();
  }
}

async function loadCategories() {
  try {
    const categories = await browser.runtime.sendMessage({ action: "getCategories" });
    const categoryNames = Object.keys(categories || {}).sort();

    categorySelect.innerHTML = '<option value="">No category</option>';

    categoryNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      categorySelect.appendChild(option);
    });

    const newOption = document.createElement('option');
    newOption.value = '__new__';
    newOption.textContent = '+ Create new category...';
    categorySelect.appendChild(newOption);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === '__new__') {
    newCategoryForm.classList.add('visible');
    newCategoryInput.focus();
  } else {
    newCategoryForm.classList.remove('visible');
  }
});

cancelButton.addEventListener('click', () => {
  browser.storage.local.remove('pendingTorrentUrl');
  window.close();
});

sendButton.addEventListener('click', async () => {
  const { pendingTorrentUrl } = await browser.storage.local.get('pendingTorrentUrl');

  if (!pendingTorrentUrl) {
    window.close();
    return;
  }

  let category = categorySelect.value;

  if (category === '__new__') {
    const newCategoryName = newCategoryInput.value.trim();
    if (!newCategoryName) {
      newCategoryInput.focus();
      return;
    }

    const savePath = newCategorySavePath.value.trim();

    const success = await browser.runtime.sendMessage({
      action: "createCategory",
      categoryName: newCategoryName,
      savePath: savePath
    });

    if (success) {
      category = newCategoryName;
    } else {
      alert('Failed to create category');
      return;
    }
  }

  await browser.runtime.sendMessage({
    action: "addTorrentWithCategory",
    url: pendingTorrentUrl,
    category: category || null
  });

  await browser.storage.local.remove('pendingTorrentUrl');
  window.close();
});

initializeDarkMode();
loadCategories();
