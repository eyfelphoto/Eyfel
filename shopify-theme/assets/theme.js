/**
 * Eyfel Mezar Plakaları - Shopify OS 2.0 Theme JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initPetShapeSwitcher();
  initSelsilGlueAddon();
  initVariantSelectors();
});

// 1. CART DRAWER
function initCartDrawer() {
  const drawer = document.getElementById('CartDrawer');
  if (!drawer) return;

  const openTriggers = document.querySelectorAll('.cart-drawer-trigger');
  const closeTriggers = document.querySelectorAll('.cart-drawer-close, .cart-drawer-overlay');

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
    });
  });

  closeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === drawer || e.target.closest('.cart-drawer-close')) {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

// 2. PET SHAPE SWITCHER (Shows clean pet plaque photos with NO screws)
function initPetShapeSwitcher() {
  const shapeBtns = document.querySelectorAll('#PetShapeOptions .shape-btn');
  const mainImg = document.getElementById('ProductMainImage');
  const shapeInput = document.getElementById('SelectedPetShapeInput');

  if (!shapeBtns.length) return;

  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => {
        b.classList.remove('active', 'border-amber-600', 'bg-amber-50', 'text-stone-900');
        b.classList.add('border-stone-200', 'bg-stone-50', 'text-stone-800');
      });

      btn.classList.add('active', 'border-amber-600', 'bg-amber-50', 'text-stone-900');
      btn.classList.remove('border-stone-200');

      const shape = btn.getAttribute('data-shape');
      const previewImg = btn.getAttribute('data-preview-image');

      if (shapeInput) {
        shapeInput.value = shape.charAt(0).toUpperCase() + shape.slice(1);
      }

      if (mainImg && previewImg) {
        mainImg.src = previewImg;
      }
    });
  });
}

// 3. SELSIL ULTRA TACK 50ML (+299 TL) ADDON HANDLER
function initSelsilGlueAddon() {
  const addonContainers = document.querySelectorAll('[data-selsil-addon]');
  addonContainers.forEach(container => {
    const checkbox = container.querySelector('.selsil-glue-checkbox');
    const labelText = container.querySelector('.checkbox-label-text');
    if (!checkbox || !labelText) return;

    checkbox.addEventListener('change', () => {
      const price = checkbox.getAttribute('data-addon-price') || '299';
      if (checkbox.checked) {
        labelText.textContent = `✓ Sepete Eklendi (+${price} ₺)`;
        container.classList.add('border-amber-500', 'bg-amber-50/70', 'ring-2', 'ring-amber-400/20');
        container.classList.remove('border-stone-200');
      } else {
        labelText.textContent = `+ Sepete Ekle (+${price} ₺)`;
        container.classList.remove('border-amber-500', 'bg-amber-50/70', 'ring-2', 'ring-amber-400/20');
        container.classList.add('border-stone-200');
      }
    });
  });
}

// 4. VARIANT RADIO SELECTOR
function initVariantSelectors() {
  const variantRadios = document.querySelectorAll('.variant-radio');
  const variantHiddenInput = document.getElementById('ProductVariantId');

  variantRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (variantHiddenInput) {
        variantHiddenInput.value = radio.value;
      }

      // Update styling
      document.querySelectorAll('.variant-option-label').forEach(lbl => {
        lbl.classList.remove('border-amber-600', 'bg-amber-50/50');
        lbl.classList.add('border-stone-200', 'bg-stone-50');
      });

      const parentLabel = radio.closest('.variant-option-label');
      if (parentLabel) {
        parentLabel.classList.add('border-amber-600', 'bg-amber-50/50');
        parentLabel.classList.remove('border-stone-200', 'bg-stone-50');
      }
    });
  });
}
