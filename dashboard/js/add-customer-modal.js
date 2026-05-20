(function () {
  const backdrop = document.createElement('div');
  backdrop.id = 'add-customer-backdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">Add New Customer</h2>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-field">
          <label class="form-label" for="modal-name">Full Name</label>
          <input class="form-input" id="modal-name" type="text" placeholder="e.g. Jane Smith">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-phone">Phone</label>
          <input class="form-input" id="modal-phone" type="tel" placeholder="(269) 555-0000">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-email">Email</label>
          <input class="form-input" id="modal-email" type="email" placeholder="jane@email.com">
        </div>
        <div class="form-field">
          <label class="form-label" for="modal-address">Address</label>
          <input class="form-input" id="modal-address" type="text" placeholder="123 Main St, Kalamazoo MI">
        </div>
        <div class="form-field">
          <label class="form-label">Vehicle</label>
          <div class="form-row">
            <input class="form-input" id="modal-year"  type="text" placeholder="Year">
            <input class="form-input" id="modal-make"  type="text" placeholder="Make">
            <input class="form-input" id="modal-model" type="text" placeholder="Model">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-cancel" id="modal-cancel-btn">Cancel</button>
        <button class="btn-modal-save"   id="modal-save-btn">Save Customer</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  function openAddCustomerModal() {
    backdrop.classList.add('open');
    document.getElementById('modal-name').focus();
  }

  function closeAddCustomerModal() {
    backdrop.classList.remove('open');
    ['modal-name','modal-phone','modal-email','modal-address','modal-year','modal-make','modal-model']
      .forEach(id => { document.getElementById(id).value = ''; });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'open-add-customer') openAddCustomerModal();
  });

  document.getElementById('modal-close-btn').addEventListener('click', closeAddCustomerModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeAddCustomerModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeAddCustomerModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeAddCustomerModal();
  });

  document.getElementById('modal-save-btn').addEventListener('click', function () {
    const name = document.getElementById('modal-name').value.trim();
    if (!name) {
      document.getElementById('modal-name').focus();
      return;
    }
    closeAddCustomerModal();
    showToast('✓ Customer added: ' + name);
  });

  window.openAddCustomerModal = openAddCustomerModal;
})();
