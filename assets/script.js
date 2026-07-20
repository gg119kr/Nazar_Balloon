const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-nav");
menuButton?.addEventListener("click",()=>{const open=menu.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));});
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("is-open")));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const navItems=document.querySelectorAll(".category-nav__item");
const panels=document.querySelectorAll(".category-panel");
navItems.forEach(button=>button.addEventListener("click",()=>{
  navItems.forEach(x=>x.classList.remove("is-active"));
  panels.forEach(x=>x.classList.remove("is-active"));
  button.classList.add("is-active");
  const panel=document.querySelector(`[data-panel="${button.dataset.category}"]`);
  panel?.classList.add("is-active");
  if(window.innerWidth<900) panel?.scrollIntoView({behavior:"smooth",block:"start"});
}));

const modal=document.getElementById("catalog-modal");
document.querySelectorAll("[data-open-product]").forEach(button=>button.addEventListener("click",()=>{
  const product=window.NAZAR_CATALOG?.[button.dataset.openProduct];
  if(!product||!modal)return;
  document.getElementById("modal-image").src=product.image;
  document.getElementById("modal-image").alt=product.title;
  document.getElementById("modal-category").textContent=product.category;
  document.getElementById("modal-title").textContent=product.title;
  document.getElementById("modal-price").textContent=product.price;
  const list=document.getElementById("modal-composition");
  list.innerHTML=product.composition.map(x=>`<li>${x}</li>`).join("");
  const note=document.getElementById("modal-placeholder-note");
  note.textContent=product.placeholder?"Це заготовка: замініть фото, опис і ціну перед публікацією.":"";
  note.hidden=!product.placeholder;
  modal.showModal();
  document.body.classList.add("modal-open");
}));
function closeModal(){modal?.close();document.body.classList.remove("modal-open");}
document.querySelector(".modal-close")?.addEventListener("click",closeModal);
modal?.addEventListener("click",e=>{if(e.target===modal)closeModal();});

document.querySelectorAll(".accordion__item button").forEach(button=>button.addEventListener("click",()=>{
  const item=button.closest(".accordion__item"),open=item.classList.contains("is-open");
  document.querySelectorAll(".accordion__item").forEach(x=>{x.classList.remove("is-open");x.querySelector("button").setAttribute("aria-expanded","false");x.querySelector("i").textContent="+";});
  if(!open){item.classList.add("is-open");button.setAttribute("aria-expanded","true");button.querySelector("i").textContent="−";}
}));
document.getElementById("year").textContent=new Date().getFullYear();
