const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-nav");
menuButton?.addEventListener("click",()=>{const open=menu.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));});
menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("is-open")));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const navItems=[...document.querySelectorAll(".category-nav__item")];
const panels=[...document.querySelectorAll(".category-panel")];

function activateCategory(category,{scroll=true}={}){
  const button=navItems.find(item=>item.dataset.category===category);
  const panel=document.querySelector(`[data-panel="${category}"]`);
  if(!button||!panel)return;
  navItems.forEach(item=>item.classList.remove("is-active"));
  panels.forEach(item=>item.classList.remove("is-active"));
  button.classList.add("is-active");
  panel.classList.add("is-active");
  if(scroll){
    document.getElementById("catalog")?.scrollIntoView({behavior:"smooth",block:"start"});
  }
}

navItems.forEach(button=>button.addEventListener("click",()=>{
  activateCategory(button.dataset.category,{scroll:window.innerWidth<900});
}));

document.querySelectorAll("[data-go-category]").forEach(link=>link.addEventListener("click",event=>{
  event.preventDefault();
  activateCategory(link.dataset.goCategory,{scroll:true});
}));

function initCategorySlider(){
  const slider=document.querySelector("[data-category-slider]");
  if(!slider)return;
  const slides=[...slider.querySelectorAll(".category-slider__slide")];
  const dotsHost=slider.querySelector(".category-slider__dots");
  const prev=slider.querySelector(".category-slider__arrow--prev");
  const next=slider.querySelector(".category-slider__arrow--next");
  const currentLabel=slider.querySelector("[data-slider-current]");
  const autoplayDelay=Number(slider.dataset.autoplay)||6500;
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current=0;
  let timer=null;
  let touchStartX=0;
  let touchDeltaX=0;

  slider.tabIndex=0;
  const dots=slides.map((slide,index)=>{
    const dot=document.createElement("button");
    dot.type="button";
    dot.className="category-slider__dot";
    dot.setAttribute("role","tab");
    dot.setAttribute("aria-label",`Слайд ${index+1} з ${slides.length}`);
    dot.setAttribute("aria-selected",String(index===0));
    dot.addEventListener("click",()=>show(index,true));
    dotsHost?.append(dot);
    return dot;
  });

  function show(index,userAction=false){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      const active=i===current;
      slide.classList.toggle("is-active",active);
      slide.setAttribute("aria-hidden",String(!active));
    });
    dots.forEach((dot,i)=>{
      const active=i===current;
      dot.classList.toggle("is-active",active);
      dot.setAttribute("aria-selected",String(active));
    });
    if(currentLabel)currentLabel.textContent=String(current+1).padStart(2,"0");
    if(userAction)restart();
  }

  function stop(){if(timer){window.clearInterval(timer);timer=null;}}
  function start(){
    if(reduceMotion||slides.length<2)return;
    stop();
    timer=window.setInterval(()=>show(current+1),autoplayDelay);
  }
  function restart(){stop();start();}

  prev?.addEventListener("click",()=>show(current-1,true));
  next?.addEventListener("click",()=>show(current+1,true));
  slider.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"){event.preventDefault();show(current-1,true);}
    if(event.key==="ArrowRight"){event.preventDefault();show(current+1,true);}
  });
  slider.addEventListener("mouseenter",stop);
  slider.addEventListener("mouseleave",start);
  slider.addEventListener("focusin",stop);
  slider.addEventListener("focusout",event=>{if(!slider.contains(event.relatedTarget))start();});
  slider.addEventListener("touchstart",event=>{touchStartX=event.changedTouches[0].clientX;touchDeltaX=0;stop();},{passive:true});
  slider.addEventListener("touchmove",event=>{touchDeltaX=event.changedTouches[0].clientX-touchStartX;},{passive:true});
  slider.addEventListener("touchend",()=>{
    if(Math.abs(touchDeltaX)>45)show(current+(touchDeltaX<0?1:-1),true);
    else start();
  },{passive:true});
  document.addEventListener("visibilitychange",()=>document.hidden?stop():start());

  show(0);
  start();
}
initCategorySlider();

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
