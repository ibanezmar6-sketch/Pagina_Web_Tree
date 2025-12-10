/* INVENTARIO ADAPTADO A TUS IMÁGENES LOCALES */  
const products = [                                  // Lista principal de productos
  {id:1,title:'Conjunto Mujer',price:200.50,cat:'women',img:'imagen1.jpg',desc:'Talle S - M - L'}, // Producto 1
  {id:2,title:'Musculosa UA',price:150.00,cat:'men',img:'imagen2.jpg',desc:'Talle L - XL'},       // Producto 2
  {id:3,title:'Guantes Nike',price:90.00,cat:'accessories',img:'imagen3.jpg',desc:'Talle S - M - XL'}, // Producto 3
  {id:4,title:'Medias Nike',price:100.00,cat:'accessories',img:'imagen4.jpg',desc:'Talle 38 - 40 -46'}, // Producto 4
  {id:5,title:'Buso UA',price:230.00,cat:'men',img:'imagen5.jpg',desc:'Talle M - L - XL'},         // Producto 5
  {id:6,title:'Musculosa Nike',price:180.00,cat:'men',img:'imagen6.jpg',desc:'Talle XS - S - M - L'}, // Producto 6
  {id:7,title:'Canguro Adidas',price:220.00,cat:'men',img:'imagen7.jpg',desc:'Talle XL - XXL'},    // Producto 7
  {id:8,title:'Short Reebok',price:100.00,cat:'women',img:'imagen8.jpg',desc:'Talle XS - S - M'},  // Producto 8
  {id:9,title:'Musculosa Adidas',price:100.00,cat:'women',img:'imagen9.jpg',desc:'Talle M - L'},   // Producto 9
  {id:10,title:'Musculosa Adidas',price:140.00,cat:'men',img:'imagen10.jpg',desc:'Talle L - XL'},  // Producto 10
  {id:11,title:'Remera sin mangas',price:200.00,cat:'men',img:'imagen11.jpg',desc:'Talle L - XL - XXL'}, // Producto 11
  {id:12,title:'Musculosa Nike',price:210.00,cat:'men',img:'imagen12.jpg',desc:'Talle M - L'},     // Producto 12
  {id:13,title:'Short Adidas',price:150.00,cat:'women',img:'imagen13.jpg',desc:'Talle S - M - L'}, // Producto 13
  {id:14,title:'Short Reebok',price:110.00,cat:'women',img:'imagen14.jpg',desc:'Talle XS'},        // Producto 14
  {id:15,title:'Short Adidas',price:120.00,cat:'women',img:'imagen16.jpg',desc:'Talle XS - M - XL'} // Producto 15
];

/* carrito persistente */                                   
let cart = JSON.parse(localStorage.getItem('tree_cart') || '[]'); // Carga el carrito guardado en localStorage
function formatMoney(v){ return 'Bs. ' + v.toFixed(2); }          // Da formato a los precios

/* CATALOGO (búsqueda, filtros, paginación, modal) */             // Sección catálogo
let workingList = [...products];                                  // Lista filtrada/ordenada temporal
let currentPage = 1;                                               // Página actual del catálogo
const ITEMS_PER_PAGE = 6;                                          // Cantidad de productos por página

function renderProductsPage(page = 1){                             // Renderiza productos por página
  const container = document.getElementById('products');           // Contenedor del catálogo
  if(!container) return;                                           // Si no existe, no hace nada
  const start = (page - 1) * ITEMS_PER_PAGE;                       // Inicio de la página
  const pageItems = workingList.slice(start, start + ITEMS_PER_PAGE); // Productos de la página
  container.innerHTML = '';                                        // Limpia contenido previo
  pageItems.forEach(p => {                                         // Recorre productos de la página
    const card = document.createElement('div'); card.className = 'product'; // Crea tarjeta de producto
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
    container.appendChild(card);                                   // Agrega tarjeta al catálogo
  });
  renderPagination();                                               // Renderiza paginación
}

function renderPagination(){                                        // Muestra botones de páginas
  const pag = document.getElementById('pagination');               // Contenedor paginación
  if(!pag) return;
  const total = Math.max(1, Math.ceil(workingList.length / ITEMS_PER_PAGE)); // Total páginas
  pag.innerHTML = '';                                              // Limpia paginación
  for(let i=1;i<=total;i++){                                       // Crea botones de páginas
    const b = document.createElement('button');                    // Botón página
    b.innerText = i;                                               // Número de página
    b.disabled = (i===currentPage);                                // Desactiva página actual
    b.onclick = () => { currentPage = i; renderProductsPage(i); }; // Cambiar página
    pag.appendChild(b);                                            // Agrega el botón
  }
}

function filterCategory(cat){                                      // Filtrar por categoría
  if(cat === 'all') workingList = [...products];                   // Reset a todos
  else workingList = products.filter(p => p.cat === cat);          // Filtra por categoría
  currentPage = 1;                                                 // Vuelve a página 1
  renderProductsPage(currentPage);                                 // Muestra resultados
}

function applySort(mode){                                          // Ordenamiento
  if(mode === 'price-asc') workingList.sort((a,b)=>a.price-b.price);      // Precio ascendente
  else if(mode === 'price-desc') workingList.sort((a,b)=>b.price-a.price); // Descendente
  else if(mode === 'new') workingList = workingList.slice().reverse();     // Más nuevos (invertir)
  currentPage = 1;                                                 // Reset página
  renderProductsPage(currentPage);                                 // Renderiza
}

document.addEventListener('input', (e) => {                         // Búsqueda en tiempo real
  if(e.target && e.target.id === 'search'){                         // Si escribe en búsqueda
    const q = e.target.value.trim().toLowerCase();                  // Texto buscado
    workingList = products.filter(p =>                              // Filtra productos
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
    currentPage = 1;                                               // Página 1
    renderProductsPage(currentPage);                                // Renderiza filtrado
  }
});

/* MODAL producto */                                                // Sección modal
function openProductModal(id){                                      // Abre modal de producto
  const p = products.find(x=>x.id===id);                            // Busca producto
  if(!p) return;
  const modal = document.getElementById('productModal');            // Contenedor modal
  const content = document.getElementById('modalContent');          // Contenido del modal
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
  modal.style.display = 'flex';                                     // Muestra modal
  modal.setAttribute('aria-hidden','false');                        // Accesibilidad
}

function closeModal(){                                              // Cierra modal
  const modal = document.getElementById('productModal');
  if(modal){
    modal.style.display = 'none';                                   // Oculta
    modal.setAttribute('aria-hidden','true');                       // Accesibilidad
  }
}

document.addEventListener('click', function(e){                     // Cierra modal al hacer clic afuera
  const modal = document.getElementById('productModal');
  if(!modal || modal.style.display !== 'flex') return;
  const inner = modal.querySelector('.modal-inner');
  if(inner && !inner.contains(e.target) && !e.target.matches('.product button')) {
    closeModal();
  }
});

document.addEventListener('keydown', function(e){                   // Cierra modal con ESC
  if(e.key === 'Escape') closeModal();
});

/* CARRITO */                                                       // Carrito de compras
function saveCart(){ localStorage.setItem('tree_cart', JSON.stringify(cart)); renderCart(); } // Guarda y actualiza

function addToCart(id){                                             // Agregar producto al carrito
  const p = products.find(x => x.id === id);                        // Busca producto
  if(!p) return;
  const existing = cart.find(i => i.id === id);                     // Si ya está en carrito
  if(existing) existing.qty++;                                      // Suma cantidad
  else cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 }); // Agrega nuevo
  saveCart(); breatheCartBtn();                                     // Guarda y anima botón
}

function breatheCartBtn(){                                          // Animación boton carrito
  const btn = document.querySelector('.cart-btn'); if(!btn) return;
  btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:300});
}

function renderCart(){                                              // Renderiza carrito
  const panel = document.getElementById('cartPanel');               // Panel carrito
  if(!panel) return;
  panel.innerHTML = '<h4>Tu carrito</h4>';                          // Título
  if(cart.length === 0){
    panel.innerHTML += '<div class="small">Carrito vacío</div>';    // Mensaje vacío
  } else {
    cart.forEach(item => {                                          // Recorre productos
      const n = document.createElement('div');                      // Contenedor item
      n.className = 'cart-item';                                    // Estilo
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
  const counter = document.getElementById('cart-count');            // Contador carrito
  if(counter) counter.innerText = cart.reduce((s,i)=>s+i.qty,0);
}

function changeQty(id,delta){                                       // Cambiar cantidad
  const it = cart.find(i => i.id === id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart = cart.filter(i => i.id !== id);             // Elimina si es 0
  saveCart();
}

function toggleCart(){                                              // Mostrar/ocultar carrito
  const p = document.getElementById('cartPanel');
  if(!p) return;
  p.style.display = (p.style.display === 'block') ? 'none' : 'block';
  renderCart();
}

function clearCart(){                                               // Vaciar carrito
  if(!confirm('Vaciar carrito?')) return;
  cart = [];
  saveCart();
}

/* CHECKOUT por WhatsApp (sin prompts) */
function checkoutWhatsApp(){                                        // Enviar compra a WhatsApp
  if(cart.length === 0){
    alert('Tu carrito está vacío');
    return;
  }
  let msg = `Nuevo pedido desde WEB\n\nDetalle del pedido:\n`;      // Mensaje inicial
  cart.forEach(item => {
    msg += `• ${item.title} x${item.qty} - ${formatMoney(item.price)}\n`; // Línea por producto
  });
  msg += `\nTotal: ${formatMoney(cart.reduce((s,i)=>s + i.price * i.qty, 0))}\n\nGracias por su compra!`;
  const waUrl = `https://wa.me/59178539749?text=${encodeURIComponent(msg)}`; // URL WhatsApp
  window.open(waUrl, '_blank');                                     // Abre WhatsApp
}

/* asegura que featured SIEMPRE se cargue*/
window.addEventListener("load", () => {                             // Ejecutar al cargar
  renderFeatured();                                                 // Carga destacados
});

/* NAV TOGGLE (móvil) y otras inicializaciones */
document.addEventListener('DOMContentLoaded', () => {               // Cuando cargó HTML

  if(document.getElementById('products')){                          // Si existe catálogo
    workingList = [...products];                                    // Inicializa lista
    currentPage = 1;                                                // Página inicial
    renderProductsPage(currentPage);                                // Renderiza
  }

  renderCart();                                                     // Muestra carrito almacenado

  const nf = document.getElementById('newsletterForm');             // Form newsletter
  if(nf) nf.addEventListener('submit', (e) => {                     // Evento submit
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value?.trim(); // Email ingresado
    const msg = document.getElementById('newsletterMsg');           // Mensaje resultado
    if(!email){
      msg.innerText = 'Ingresa un email válido.';                   // Validación
      return;
    }
    const list = JSON.parse(localStorage.getItem('tree_news')||'[]'); // Lista guardada
    if(list.includes(email)){
      msg.innerText = 'Ya estás suscrito.';                         // Ya existe
      return;
    }
    list.push(email);                                               // Agrega nueva suscripción
    localStorage.setItem('tree_news', JSON.stringify(list));        // Guarda
    msg.innerText = '¡Gracias! Revisa tu correo.';                  // Confirmación
    document.getElementById('newsletterEmail').value = '';          // Limpia campo
  });

  const cf = document.getElementById('contactForm');                // Formulario de contacto
  if(cf) cf.addEventListener('submit', (e) => {
    e.preventDefault();                                             // Evita recarga
    const name = document.getElementById('name')?.value?.trim();    // Nombre
    const phone = document.getElementById('phone')?.value?.trim();  // Teléfono
    const message = document.getElementById('message')?.value?.trim(); // Mensaje
    if(!name || !phone){
      alert('Completa nombre y teléfono');                          // Validación
      return;
    }
    const waUrl = `https://wa.me/59178539749?text=${encodeURIComponent(`Hola, soy ${name} (${phone})\n\n${message}`)}`; // URL WhatsApp
    window.open(waUrl, '_blank');                                   // Abrir WhatsApp
  });

  const navToggle = document.getElementById('navToggle');           // Botón menú móvil
  const mainNav = document.getElementById('mainNav');               // Menú principal
  if(navToggle && mainNav){
    navToggle.addEventListener('click', () => {                     // Alterna visibilidad
      mainNav.style.display = (mainNav.style.display === 'flex') ? 'none' : 'flex';
    });
  }

});

/* RENDER featured en inicio */
function renderFeatured(){                                           // Renderiza productos destacados
  const el = document.getElementById('featured');                    // Contenedor de destacados
  if(!el) return;
  const featured = products.slice(0,4);                              // Toma 4 primeros
  el.innerHTML = '';                                                 // Limpia
  featured.forEach(p => {                                            // Crea cada tarjeta
    const card = document.createElement('div'); card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">                         
      <div class="meta">
        <h4>${p.title}</h4>                                         
        <div class="small">${p.desc}</div>                          
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="price">${formatMoney(p.price)}</div>           
            <button class="btn" onclick="openProductModal(${p.id})">Detalles</button> 
            <button class="btn add" onclick="addToCart(${p.id})">Añadir</button>    
          </div>
        </div>
      </div>`;
    el.appendChild(card);                                            // Agrega tarjeta
  });
}
