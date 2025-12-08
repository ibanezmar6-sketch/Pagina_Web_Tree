/* INVENTARIO ADAPTADO A TUS IMÁGENES LOCALES */
const products = [
  {id:1,title:'Prenda 1',price:28.50,cat:'women',img:'imagen1.jpg',desc:'Prenda importada de alta calidad.'},
  {id:2,title:'Prenda 2',price:35.00,cat:'men',img:'imagen2.jpg',desc:'Prenda importada de alta calidad.'},
  {id:3,title:'Prenda 3',price:42.00,cat:'women',img:'imagen3.jpg',desc:'Prenda importada de alta calidad.'},
  {id:4,title:'Prenda 4',price:12.00,cat:'accessories',img:'imagen4.jpg',desc:'Prenda importada de alta calidad.'},
  {id:5,title:'Prenda 5',price:58.00,cat:'men',img:'imagen5.jpg',desc:'Prenda importada de alta calidad.'},
  {id:6,title:'Prenda 6',price:18.75,cat:'accessories',img:'imagen6.jpg',desc:'Prenda importada de alta calidad.'},
  {id:7,title:'Prenda 7',price:16.00,cat:'women',img:'imagen7.jpg',desc:'Prenda importada de alta calidad.'},
  {id:8,title:'Prenda 8',price:39.00,cat:'men',img:'imagen8.jpg',desc:'Prenda importada de alta calidad.'},
  {id:9,title:'Prenda 9',price:27.00,cat:'women',img:'imagen9.jpg',desc:'Prenda importada de alta calidad.'},
  {id:10,title:'Prenda 10',price:24.00,cat:'women',img:'imagen10.jpg',desc:'Prenda importada de alta calidad.'},
  {id:11,title:'Prenda 11',price:33.00,cat:'women',img:'imagen11.jpg',desc:'Prenda importada de alta calidad.'},
  {id:12,title:'Prenda 12',price:29.00,cat:'men',img:'imagen12.jpg',desc:'Prenda importada de alta calidad.'},
  {id:13,title:'Prenda 13',price:31.00,cat:'women',img:'imagen13.jpg',desc:'Prenda importada de alta calidad.'},
  {id:14,title:'Prenda 14',price:26.00,cat:'women',img:'imagen14.jpg',desc:'Prenda importada de alta calidad.'},
  {id:15,title:'Prenda 15',price:34.00,cat:'women',img:'imagen16.jpg',desc:'Prenda importada de alta calidad.'}
];

/* carrito persistente */
let cart = JSON.parse(localStorage.getItem('tree_cart') || '[]');
function formatMoney(v){ return 'Bs. ' + v.toFixed(2); }

/* CATALOGO (búsqueda, filtros, paginación, modal) */
let workingList = [...products];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

function renderProductsPage(page = 1){
  const container = document.getElementById('products');
  if(!container) return;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = workingList.slice(start, start + ITEMS_PER_PAGE);
  container.innerHTML = '';
  pageItems.forEach(p => {
    const card = document.createElement('div'); card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta">
        <h4>${p.title}</h4>
        <div class="small">${p.desc}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="price">${formatMoney(p.price)}</div>
          <div>
            <button class="btn" onclick="openProductModal(${p.id})">Detalles</button>
            <button class="btn add" onclick="addToCart(${p.id})">Añadir</button>
          </div>
        </div>
      </div>`;
    container.appendChild(card);
  });
  renderPagination();
}

function renderPagination(){
  const pag = document.getElementById('pagination');
  if(!pag) return;
  const total = Math.max(1, Math.ceil(workingList.length / ITEMS_PER_PAGE));
  pag.innerHTML = '';
  for(let i=1;i<=total;i++){
    const b = document.createElement('button');
    b.innerText = i;
    b.disabled = (i===currentPage);
    b.onclick = () => { currentPage = i; renderProductsPage(i); };
    pag.appendChild(b);
  }
}

function filterCategory(cat){
  if(cat === 'all') workingList = [...products];
  else workingList = products.filter(p => p.cat === cat);
  currentPage = 1;
  renderProductsPage(currentPage);
}

function applySort(mode){
  if(mode === 'price-asc') workingList.sort((a,b)=>a.price-b.price);
  else if(mode === 'price-desc') workingList.sort((a,b)=>b.price-a.price);
  else if(mode === 'new') workingList = workingList.slice().reverse();
  currentPage = 1;
  renderProductsPage(currentPage);
}

document.addEventListener('input', (e) => {
  if(e.target && e.target.id === 'search'){
    const q = e.target.value.trim().toLowerCase();
    workingList = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
    currentPage = 1;
    renderProductsPage(currentPage);
  }
});

/* MODAL producto */
function openProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('productModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div style="flex:1;min-width:240px">
        <img src="${p.img}" style="width:100%;border-radius:10px"/>
      </div>
      <div style="flex:1.1">
        <h3>${p.title}</h3>
        <div class="small">${p.desc}</div>
        <div style="margin-top:12px;font-weight:800">${formatMoney(p.price)}</div>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn add" onclick="addToCart(${p.id}); closeModal();">Añadir al carrito</button>
          <button class="btn" onclick="closeModal()">Cerrar</button>
        </div>
        <div style="margin-top:14px">
          <h4>Materiales y cuidado</h4>
          <p class="small">Lavar en ciclo suave, secar a la sombra.</p>
        </div>
      </div>
    </div>`;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  const modal = document.getElementById('productModal');
  if(modal){
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  }
}

document.addEventListener('click', function(e){
  const modal = document.getElementById('productModal');
  if(!modal || modal.style.display !== 'flex') return;
  const inner = modal.querySelector('.modal-inner');
  if(inner && !inner.contains(e.target) && !e.target.matches('.product button')) {
    closeModal();
  }
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeModal();
});

/* CARRITO */
function saveCart(){ localStorage.setItem('tree_cart', JSON.stringify(cart)); renderCart(); }

function addToCart(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
  saveCart(); breatheCartBtn();
}

function breatheCartBtn(){
  const btn = document.querySelector('.cart-btn'); if(!btn) return;
  btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:300});
}

function renderCart(){
  const panel = document.getElementById('cartPanel');
  if(!panel) return;
  panel.innerHTML = '<h4>Tu carrito</h4>';
  if(cart.length === 0){
    panel.innerHTML += '<div class="small">Carrito vacío</div>';
  } else {
    cart.forEach(item => {
      const n = document.createElement('div');
      n.className = 'cart-item';
      n.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong>${item.title}</strong>
              <div class="small">${formatMoney(item.price)}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <button onclick="changeQty(${item.id}, -1)">-</button>
              <div style="min-width:22px;text-align:center">${item.qty}</div>
              <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
        </div>`;
      panel.appendChild(n);
    });

    panel.innerHTML += `
      <div class="total-row">
        <div>Total</div>
        <div><strong>${formatMoney(cart.reduce((s,i)=>s + i.price*i.qty,0))}</strong></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn" onclick="checkoutWhatsApp()" style="flex:1;background:var(--accent);color:white">Pedir por WhatsApp</button>
        <button class="btn" onclick="clearCart()" style="flex:1;border:1px solid #eee">Vaciar</button>
      </div>`;
  }
  const counter = document.getElementById('cart-count');
  if(counter) counter.innerText = cart.reduce((s,i)=>s+i.qty,0);
}

function changeQty(id,delta){
  const it = cart.find(i => i.id === id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}

function toggleCart(){
  const p = document.getElementById('cartPanel');
  if(!p) return;
  p.style.display = (p.style.display === 'block') ? 'none' : 'block';
  renderCart();
}

function clearCart(){
  if(!confirm('Vaciar carrito?')) return;
  cart = [];
  saveCart();
}

/* CHECKOUT por WhatsApp (sin prompts) */
function checkoutWhatsApp(){
  if(cart.length === 0){
    alert('Tu carrito está vacío');
    return;
  }
  let msg = `Nuevo pedido desde WEB\n\nDetalle del pedido:\n`;
  cart.forEach(item => {
    msg += `• ${item.title} x${item.qty} - ${formatMoney(item.price)}\n`;
  });
  msg += `\nTotal: ${formatMoney(cart.reduce((s,i)=>s + i.price * i.qty, 0))}\n\nGracias por su compra!`;
  const waUrl = `https://wa.me/59160592868?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

/* NAV TOGGLE (móvil) y otras inicializaciones */
document.addEventListener('DOMContentLoaded', () => {

  if(document.getElementById('products')){
    workingList = [...products];
    currentPage = 1;
    renderProductsPage(currentPage);
  }

  renderFeatured();
  renderCart();

  const nf = document.getElementById('newsletterForm');
  if(nf) nf.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value?.trim();
    const msg = document.getElementById('newsletterMsg');
    if(!email){
      msg.innerText = 'Ingresa un email válido.';
      return;
    }
    const list = JSON.parse(localStorage.getItem('tree_news')||'[]');
    if(list.includes(email)){
      msg.innerText = 'Ya estás suscrito.';
      return;
    }
    list.push(email);
    localStorage.setItem('tree_news', JSON.stringify(list));
    msg.innerText = '¡Gracias! Revisa tu correo.';
    document.getElementById('newsletterEmail').value = '';
  });

  const cf = document.getElementById('contactForm');
  if(cf) cf.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();
    if(!name || !phone){
      alert('Completa nombre y teléfono');
      return;
    }
    const waUrl = `https://wa.me/59160592868?text=${encodeURIComponent(`Hola, soy ${name} (${phone})\n\n${message}`)}`;
    window.open(waUrl, '_blank');
  });

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', () => {
      mainNav.style.display = (mainNav.style.display === 'flex') ? 'none' : 'flex';
    });
  }

});

/* RENDER featured en inicio */
function renderFeatured(){
  const el = document.getElementById('featured');
  if(!el) return;
  const featured = products.slice(0,4);
  el.innerHTML = '';
  featured.forEach(p => {
    const card = document.createElement('div'); card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta">
        <h4>${p.title}</h4>
        <div class="small">${p.desc}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="price">${formatMoney(p.price)}</div>
          <div>
            <button class="btn" onclick="openProductModal(${p.id})">Detalles</button>
            <button class="btn add" onclick="addToCart(${p.id})">Añadir</button>
          </div>
        </div>
      </div>`;
    el.appendChild(card);
  });
}
