const form = document.querySelector('#user-form');
const nameInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const submitButton = document.querySelector('#submit-button');
const formMessage = document.querySelector('#form-message');
const userList = document.querySelector('#user-list');
const recordCount = document.querySelector('#record-count');

function showMessage(message = '', isSuccess = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('success', isSuccess);
}

function renderUsers(users) {
  recordCount.textContent = `${users.length} ${users.length === 1 ? 'total' : 'totales'}`;
  userList.replaceChildren();

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Todavía no hay registros. Agrega uno para verlo aquí.';
    userList.append(empty);
    return;
  }

  for (const user of users) {
    const card = document.createElement('article');
    card.className = 'user-card';
    const name = document.createElement('span');
    name.className = 'user-name';
    name.textContent = user.nombre;
    const email = document.createElement('span');
    email.className = 'user-email';
    email.textContent = user.email;
    card.append(name, email);
    userList.append(card);
  }
}

async function loadUsers() {
  userList.innerHTML = '<p class="empty-state">Cargando registros…</p>';
  try {
    const response = await fetch('/api/usuarios');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los registros.');
    renderUsers(data);
  } catch (error) {
    userList.innerHTML = '<p class="empty-state">No se pudieron cargar los registros. Intenta recargar la página.</p>';
    showMessage(error.message);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.textContent = 'Guardando…';
  showMessage();

  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nameInput.value, email: emailInput.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo guardar el registro.');
    form.reset();
    showMessage('Usuario guardado correctamente.', true);
    await loadUsers();
  } catch (error) {
    showMessage(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Guardar registro';
  }
});

loadUsers();
