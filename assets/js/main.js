document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-current-year]').forEach(year=>{year.textContent=new Date().getFullYear()});
  const quickSizeForm=document.querySelector('[data-quick-size-form]'),quickSizeTitle=document.querySelector('[data-quick-size-title]'),quickSizeCopy=document.querySelector('[data-quick-size-copy]'),quickSizeLink=document.querySelector('[data-quick-size-link]');
  const quickSizeRecommendations={'0-12':{title:'0–12 Months',copy:'Begin with the baby measurements, then compare height, chest and waist before choosing.'},'1-3':{title:'1–3 Years',copy:'Start with toddler measurements and allow comfortable room for active movement and layering.'},'4-7':{title:'4–7 Years',copy:'Review the little-kids measurements, paying particular attention to height and chest.'},'8-12':{title:'8–12 Years',copy:'Use the big-kids measurements as a starting range, then compare each body measurement carefully.'}};
  quickSizeForm?.addEventListener('change',event=>{const input=event.target.closest('input[name="quick-age"]');if(!input)return;const recommendation=quickSizeRecommendations[input.value];if(quickSizeTitle)quickSizeTitle.textContent=recommendation.title;if(quickSizeCopy)quickSizeCopy.textContent=recommendation.copy;if(quickSizeLink)quickSizeLink.href=`#${input.dataset.sizeTarget}`});
  const sizeUnitSwitches=[...document.querySelectorAll('[data-size-unit-switch]')],sizeMeasurements=[...document.querySelectorAll('[data-measurement][data-source]')];
  const formatRange=(source,factor)=>source.split('-').map(value=>{const converted=Number(value)*factor;return Number.isInteger(converted)?String(converted):converted.toFixed(1)}).join('–');
  const setSizeUnit=unitName=>{const imperial=unitName==='in';sizeUnitSwitches.forEach(unitSwitch=>unitSwitch.querySelectorAll('button[data-unit]').forEach(option=>{const active=option.dataset.unit===unitName;option.classList.toggle('is-active',active);option.setAttribute('aria-pressed',String(active))}));sizeMeasurements.forEach(cell=>{const factor=cell.dataset.measurement==='weight'?(imperial?2.20462:1):(imperial?1/2.54:1);cell.textContent=formatRange(cell.dataset.source,factor)});document.querySelectorAll('[data-length-unit]').forEach(unit=>{unit.textContent=imperial?'in':'cm'});document.querySelectorAll('[data-weight-unit]').forEach(unit=>{unit.textContent=imperial?'lb':'kg'})};
  sizeUnitSwitches.forEach(unitSwitch=>unitSwitch.addEventListener('click',event=>{const button=event.target.closest('button[data-unit]');if(button)setSizeUnit(button.dataset.unit)}));
document.querySelectorAll('[data-size-faq]').forEach(accordion=>{
  accordion.querySelectorAll('.size-fit-answer').forEach(answer=>{
    answer.inert=answer.getAttribute('aria-hidden')==='true';
  });

  accordion.querySelectorAll('button[aria-controls]').forEach(button=>button.addEventListener('click',()=>{
    const answer=document.getElementById(button.getAttribute('aria-controls'));
    const open=button.getAttribute('aria-expanded')==='true';

    button.setAttribute('aria-expanded',String(!open));
    answer?.classList.toggle('is-open',!open);
    answer?.setAttribute('aria-hidden',String(open));
    if(answer) answer.inert=open;
  }));
});
  document.querySelectorAll('[data-gift-finder]').forEach(finder=>{
    const recommendation=finder.querySelector('[data-gift-recommendation]');
    finder.addEventListener('change',event=>{
      const recipient=event.target.closest('input[name="gift-recipient"]');
      if(recipient&&recommendation)recommendation.textContent=recipient.dataset.giftCopy;
    });
  });
  document.querySelectorAll('[data-build-gift]').forEach(builder=>{
    const formatPrice=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
    const syncGift=()=>{
      let total=0;
      ['base','extra','presentation'].forEach(name=>{
        const selected=builder.querySelector(`input[name="${name}"]:checked`);
        const output=builder.querySelector(`[data-gift-summary="${name}"]`);
        if(selected){if(output)output.textContent=selected.value;total+=Number(selected.dataset.price||0)}
      });
      const totalOutput=builder.querySelector('[data-gift-total]');
      if(totalOutput)totalOutput.textContent=formatPrice(total);
      const status=builder.querySelector('[data-gift-review-status]');
      if(status)status.textContent='Demo pricing only. Final availability and pricing may vary.';
    };
    builder.addEventListener('change',syncGift);
    builder.querySelector('[data-gift-review]')?.addEventListener('click',()=>{
      const status=builder.querySelector('[data-gift-review-status]');
      if(status)status.textContent='Your demo gift selection is ready to review. No items have been added to cart.';
    });
  });
  document.querySelectorAll('[data-sale-index]').forEach(index=>{
    const options=[...index.querySelectorAll('[data-sale-index-option]')];
    const status=document.querySelector('[data-sale-index-status]');
    options.forEach(option=>option.addEventListener('click',()=>{
      options.forEach(item=>item.setAttribute('aria-pressed',String(item===option)));
      if(status)status.textContent=`${option.dataset.saleIndexOption} selected`;
    }));
  });
  document.querySelectorAll('[data-newsletter-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('[data-newsletter-status]');if(status){status.textContent='Thank you. Your first Maison Miette note will arrive soon.';status.classList.add('is-success');status.setAttribute('role','status')}form.reset()}));
  const wishlistBase=0;
  let savedWishlist=[];
  try{savedWishlist=JSON.parse(localStorage.getItem('maison-wishlist-v2')||'[]')}catch{savedWishlist=[]}
  const wishlistItems=new Set(Array.isArray(savedWishlist)?savedWishlist:[]);
  const wishlistButtons=[...document.querySelectorAll('.product-wishlist')];
  const productId=button=>button.dataset.productName||button.closest('.product-card')?.querySelector('.product-info h3')?.textContent.trim()||button.getAttribute('aria-label');
  const syncWishlist=()=>{const total=wishlistBase+wishlistItems.size;document.querySelectorAll('[data-wishlist-count]').forEach(node=>{node.textContent=total});document.querySelector('[data-wishlist-link]')?.setAttribute('aria-label',`Wishlist, ${total} ${total===1?'item':'items'}`);wishlistButtons.forEach(button=>{const active=wishlistItems.has(productId(button));button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',`${active?'Remove':'Add'} ${productId(button)} ${active?'from':'to'} wishlist`)})};
  wishlistButtons.forEach(button=>button.addEventListener('click',()=>{const id=productId(button);wishlistItems.has(id)?wishlistItems.delete(id):wishlistItems.add(id);localStorage.setItem('maison-wishlist-v2',JSON.stringify([...wishlistItems]));syncWishlist()}));
  syncWishlist();
  let savedCart=[];
  try{savedCart=JSON.parse(localStorage.getItem('maison-cart-items-v1')||'[]')}catch{savedCart=[]}
  const cartItems=new Set(Array.isArray(savedCart)?savedCart:[]);
  const cartLinks=[...document.querySelectorAll('.cart-button')];
  const cartButtons=[...document.querySelectorAll('.product-quick')];
  const syncCart=()=>{const cartCount=cartItems.size;cartLinks.forEach(link=>{const count=link.querySelector('b');if(count)count.textContent=cartCount;link.setAttribute('aria-label',`Shopping cart, ${cartCount} ${cartCount===1?'item':'items'}`)});cartButtons.forEach(button=>{const added=cartItems.has(productId(button));button.textContent=added?'Added to cart':'Add to cart';button.classList.toggle('is-added',added);button.setAttribute('aria-pressed',String(added));button.setAttribute('aria-label',`${added?'Remove':'Add'} ${productId(button)} ${added?'from':'to'} cart`)})};
  cartButtons.forEach(button=>button.addEventListener('click',event=>{event.preventDefault();const id=productId(button);cartItems.has(id)?cartItems.delete(id):cartItems.add(id);localStorage.setItem('maison-cart-items-v1',JSON.stringify([...cartItems]));syncCart()}));

  document.querySelectorAll('[data-collection-filters]').forEach(filterBar=>{
    const buttons=[...filterBar.querySelectorAll('[data-collection-filter]')];
    const status=document.querySelector('[data-collection-status]');
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.collectionFilter;
      buttons.forEach(option=>{const active=option===button;option.classList.toggle('is-active',active);option.setAttribute('aria-pressed',String(active))});
      const products=[...document.querySelectorAll('[data-shop-product]')];
      let visible=0;
      products.forEach(product=>{const categories=(product.dataset.shopProduct||'').split(/\s+/);const show=filter==='all'||categories.includes(filter);product.hidden=!show;if(show)visible+=1});
      const label=button.textContent.trim();
      if(status)status.textContent=products.length?`${label} · ${visible} ${visible===1?'style':'styles'}`:`${label} collection`;
      filterBar.dispatchEvent(new CustomEvent('collectionfilterchange',{bubbles:true,detail:{filter}}));
    }));
  });
  const filterLayer=document.querySelector('[data-filter-layer]');
  const filterDrawer=document.querySelector('[data-filter-drawer]');
  const filterOpen=document.querySelector('[data-filter-open]');
  const filterForm=document.querySelector('[data-filter-form]');
  const filterClear=document.querySelector('[data-filter-clear]');
  const activeFilterCount=document.querySelector('[data-active-filter-count]');
  const drawerFilterCount=document.querySelector('[data-drawer-filter-count]');
  const catalogueCount=document.querySelector('[data-catalogue-count]');
  const catalogueEmpty=document.querySelector('[data-catalogue-empty]');
  const catalogueEnd=document.querySelector('[data-catalogue-end]');
  let filterReturnFocus=null;
  const catalogueProducts=()=>[...document.querySelectorAll('[data-shop-product]')];
  const openFilters=()=>{if(!filterLayer||!filterDrawer)return;filterReturnFocus=document.activeElement;filterLayer.hidden=false;requestAnimationFrame(()=>filterLayer.classList.add('is-open'));filterOpen?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';filterDrawer.focus()};
  const closeFilters=()=>{if(!filterLayer)return;filterLayer.classList.remove('is-open');filterOpen?.setAttribute('aria-expanded','false');document.body.style.overflow='';setTimeout(()=>{filterLayer.hidden=true;filterReturnFocus?.focus()},270)};
  filterOpen?.addEventListener('click',openFilters);
  filterLayer?.querySelectorAll('[data-filter-close]').forEach(button=>button.addEventListener('click',closeFilters));
  const selectedFilters=()=>filterForm?[...new FormData(filterForm).entries()].reduce((groups,[name,value])=>{(groups[name]??=[]).push(value);return groups},{}):{};
  const matchesPrice=(product,value)=>{const price=Number(product.dataset.price||0);return value==='under-2500'?price<2500:value==='2500-5000'?price>=2500&&price<=5000:value==='over-5000'?price>5000:true};
  const applyShopFilters=()=>{
    const groups=selectedFilters(),products=catalogueProducts();let visible=0;
    products.forEach(product=>{const show=Object.entries(groups).every(([name,values])=>name==='price'?values.some(value=>matchesPrice(product,value)):values.some(value=>(product.dataset[name]||'').split(/\s+/).includes(value)));product.hidden=!show;if(show)visible+=1});
    const total=Object.values(groups).reduce((sum,values)=>sum+values.length,0);
    if(activeFilterCount){activeFilterCount.textContent=total;activeFilterCount.hidden=!total}if(drawerFilterCount)drawerFilterCount.textContent=total;if(filterClear)filterClear.hidden=!total;
    if(catalogueCount&&products.length)catalogueCount.textContent=`${visible} ${visible===1?'style':'styles'}`;
    if(catalogueEmpty)catalogueEmpty.hidden=visible!==0;
    if(catalogueEnd)catalogueEnd.hidden=visible===0;
    document.querySelector('[data-catalogue-insert]')?.toggleAttribute('hidden',visible===0);
  };
  filterForm?.addEventListener('submit',event=>{event.preventDefault();applyShopFilters();closeFilters()});
  filterForm?.addEventListener('change',()=>{const total=[...new FormData(filterForm).entries()].length;if(drawerFilterCount)drawerFilterCount.textContent=total});
  filterForm?.addEventListener('reset',()=>requestAnimationFrame(applyShopFilters));
  filterClear?.addEventListener('click',()=>{filterForm?.reset();requestAnimationFrame(applyShopFilters)});
  document.querySelector('[data-empty-clear]')?.addEventListener('click',()=>{filterForm?.reset();requestAnimationFrame(()=>{applyShopFilters();filterOpen?.focus()})});
  document.querySelector('[data-empty-view-all]')?.addEventListener('click',()=>{filterForm?.reset();document.querySelectorAll('[data-collection-filter]').forEach(button=>{const active=button.dataset.collectionFilter==='all';button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});requestAnimationFrame(()=>{applyShopFilters();const status=document.querySelector('[data-collection-status]');if(status)status.textContent='All collection · 84 styles';document.querySelector('[data-product-catalogue]')?.scrollIntoView({behavior:'smooth',block:'start'})})});
  document.addEventListener('collectionfilterchange',()=>{const visible=catalogueProducts().filter(product=>!product.hidden).length;if(catalogueEmpty)catalogueEmpty.hidden=visible!==0;if(catalogueEnd)catalogueEnd.hidden=visible===0;document.querySelector('[data-catalogue-insert]')?.toggleAttribute('hidden',visible===0);if(catalogueCount)catalogueCount.textContent=`${visible} ${visible===1?'style':'styles'}`});
  const sortMenu=document.querySelector('[data-sort-menu]'),sortTrigger=sortMenu?.querySelector('[data-sort-trigger]'),sortOptions=sortMenu?.querySelector('[data-sort-options]'),sortLabel=sortMenu?.querySelector('[data-sort-label]'),sortChoices=[...(sortOptions?.querySelectorAll('[data-sort-value]')||[])];
  const sortCatalogue=mode=>{const catalogue=document.querySelector('[data-product-catalogue]');if(!catalogue)return;const products=catalogueProducts(),insert=catalogue.querySelector('[data-catalogue-insert]');products.sort((a,b)=>mode==='price-low'?Number(a.dataset.price)-Number(b.dataset.price):mode==='price-high'?Number(b.dataset.price)-Number(a.dataset.price):mode==='newest'?Number(b.dataset.newest)-Number(a.dataset.newest):Number(a.dataset.featured)-Number(b.dataset.featured));products.forEach((product,index)=>{catalogue.append(product);if(index===3&&insert)catalogue.append(insert)})};
  const closeSort=()=>{if(!sortOptions)return;sortOptions.hidden=true;sortTrigger?.setAttribute('aria-expanded','false');sortMenu?.classList.remove('is-open')};
  const openSort=()=>{if(!sortOptions)return;sortOptions.hidden=false;sortTrigger?.setAttribute('aria-expanded','true');sortMenu?.classList.add('is-open');(sortChoices.find(option=>option.classList.contains('is-selected'))||sortChoices[0])?.focus()};
  sortTrigger?.addEventListener('click',()=>sortOptions?.hidden?openSort():closeSort());
  sortChoices.forEach(option=>option.addEventListener('click',()=>{sortChoices.forEach(choice=>{const selected=choice===option;choice.classList.toggle('is-selected',selected);choice.setAttribute('aria-selected',String(selected))});if(sortLabel)sortLabel.textContent=option.textContent.trim();sortCatalogue(option.dataset.sortValue);closeSort();sortTrigger?.focus()}));
  sortMenu?.addEventListener('keydown',event=>{if(event.key==='Escape'){closeSort();sortTrigger?.focus();return}if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();if(sortOptions?.hidden){openSort();return}const current=Math.max(0,sortChoices.indexOf(document.activeElement));const next=event.key==='Home'?0:event.key==='End'?sortChoices.length-1:event.key==='ArrowDown'?(current+1)%sortChoices.length:(current-1+sortChoices.length)%sortChoices.length;sortChoices[next]?.focus()});
  document.addEventListener('click',event=>{if(sortMenu&&!sortMenu.contains(event.target))closeSort()});
  document.querySelectorAll('[data-grid-density]').forEach(button=>button.addEventListener('click',()=>{const density=button.dataset.gridDensity;document.querySelector('[data-product-catalogue]')?.setAttribute('data-grid-density',density);document.querySelectorAll('[data-grid-density]').forEach(option=>{const active=option===button;option.classList.toggle('is-active',active);option.setAttribute('aria-pressed',String(active))})}));
  filterDrawer?.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeFilters();return}if(event.key!=='Tab')return;const focusable=[...filterDrawer.querySelectorAll('button,input,select,[href],[tabindex]:not([tabindex="-1"])')].filter(node=>!node.disabled&&!node.hidden);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
  const quickLayer=document.querySelector('[data-quick-view-layer]'),quickDialog=document.querySelector('[data-quick-view-dialog]');
  const quickImage=document.querySelector('[data-quick-view-image]'),quickCategory=document.querySelector('[data-quick-view-category]'),quickName=document.querySelector('[data-quick-view-name]'),quickPrice=document.querySelector('[data-quick-view-price]'),quickDescription=document.querySelector('[data-quick-view-description]'),quickSizes=document.querySelector('[data-quick-view-sizes]'),quickColours=document.querySelector('[data-quick-view-colours]'),quickAvailability=document.querySelector('[data-quick-view-availability]'),quickQuantity=document.querySelector('[data-quick-view-quantity]'),quickAdd=document.querySelector('[data-quick-view-add]'),quickWishlist=document.querySelector('[data-quick-view-wishlist]'),quickFull=document.querySelector('[data-quick-view-full]');
  const productDescriptions={
    'cloud-cotton-romper':'A breathable cotton romper with gentle fastenings and room for every little stretch.',
    'everyday-jersey-tee':'An exceptionally soft everyday tee with an easy shape made for layering and play.',
    'soft-pleat-trouser':'A polished pleated trouser balanced with a comfortable, movement-friendly fit.',
    'heritage-knit-set':'A softly knitted pairing designed for warmth, comfort and beautifully simple dressing.',
    'classic-school-polo':'A breathable school-day polo finished with durable seams and restrained contrast piping.',
    'easy-pull-on-shorts':'Soft twill shorts with an easy elastic waist and practical pockets for busy days.',
    'weekend-layer-cardigan':'A tactile cotton-knit cardigan made to add warmth without restricting movement.',
    'mini-occasion-set':'A quietly refined two-piece set that keeps special-day dressing comfortable.'
  };
  let quickProduct=null,quickReturnFocus=null,quickQty=1;
  const recentlySection=document.querySelector('[data-recently-considered]'),recentlyList=document.querySelector('[data-recently-list]');
  const recentlyViewed=[];
  const renderRecentlyViewed=()=>{if(!recentlySection||!recentlyList)return;recentlyList.replaceChildren();recentlyViewed.forEach(product=>{const name=product.querySelector('h3')?.textContent.trim()||'Product',image=product.querySelector('.catalogue-product-media img'),price=product.querySelector('.catalogue-price')||product.querySelector('.catalogue-product-info>strong');const item=document.createElement('li');item.className='recently-considered-item';const media=document.createElement('a');media.className='recently-considered-media';media.href=`#${product.id}`;media.setAttribute('aria-label',`View ${name}`);const img=document.createElement('img');img.src=image?.src||'';img.alt=image?.alt||name;img.width=240;img.height=320;img.loading='lazy';media.append(img);const details=document.createElement('div');details.className='recently-considered-details';const title=document.createElement('h3'),titleLink=document.createElement('a');titleLink.href=`#${product.id}`;titleLink.textContent=name;title.append(titleLink);const priceLine=document.createElement('p');priceLine.innerHTML=price?.innerHTML||price?.outerHTML||'';const view=document.createElement('a');view.className='recently-considered-view';view.href=`#${product.id}`;view.innerHTML='View <span aria-hidden="true">→</span>';details.append(title,priceLine,view);item.append(media,details);recentlyList.append(item)});recentlySection.hidden=recentlyViewed.length===0};
  const rememberRecentlyViewed=product=>{const existing=recentlyViewed.indexOf(product);if(existing!==-1)recentlyViewed.splice(existing,1);recentlyViewed.unshift(product);recentlyViewed.splice(4);renderRecentlyViewed()};
  const setQuickActionStates=()=>{if(!quickProduct)return;const name=quickProduct.querySelector('h3')?.textContent.trim();const inCart=cartItems.has(name),saved=wishlistItems.has(name);if(quickAdd){quickAdd.textContent=inCart?'Added to Cart':'Add to Cart';quickAdd.classList.toggle('is-added',inCart);quickAdd.setAttribute('aria-pressed',String(inCart));quickAdd.setAttribute('aria-label',inCart?`${name} is in your cart`:`Add ${name} to cart`)}if(quickWishlist){quickWishlist.setAttribute('aria-pressed',String(saved));quickWishlist.setAttribute('aria-label',saved?`Remove ${name} from wishlist`:`Add ${name} to wishlist`);const label=quickWishlist.querySelector('span');if(label)label.textContent=saved?'Saved to wishlist':'Add to wishlist'}};
  const closeQuickView=()=>{if(!quickLayer)return;quickLayer.hidden=true;document.body.style.overflow='';quickReturnFocus?.focus();quickProduct=null};
  const openQuickView=(product,trigger)=>{if(!quickLayer||!quickDialog)return;quickProduct=product;quickReturnFocus=trigger;quickQty=1;if(quickQuantity)quickQuantity.textContent='1';const image=product.querySelector('.catalogue-product-media img'),category=product.querySelector('.catalogue-product-info>div:first-child>span'),name=product.querySelector('h3')?.textContent.trim(),price=product.querySelector('.catalogue-price')||product.querySelector('.catalogue-product-info>strong');if(quickImage&&image){quickImage.src=image.src;quickImage.alt=image.alt}if(quickCategory)quickCategory.textContent=category?.textContent||'';if(quickName)quickName.textContent=name||'';if(quickPrice)quickPrice.innerHTML=price?.outerHTML||'';if(quickDescription)quickDescription.textContent=productDescriptions[product.id]||'';if(quickAvailability)quickAvailability.textContent=(product.dataset.availability||'').includes('in-stock')?'In stock · Ready to dispatch':'Currently unavailable';if(quickFull)quickFull.href=`#${product.id}`;
    if(quickSizes){quickSizes.replaceChildren();(product.dataset.size||'').split(/\s+/).filter(Boolean).forEach((size,index)=>{const button=document.createElement('button');button.type='button';button.textContent=size.toUpperCase().replaceAll('-', '–');button.classList.toggle('is-selected',index===0);button.setAttribute('aria-pressed',String(index===0));button.addEventListener('click',()=>[...quickSizes.children].forEach(option=>{const selected=option===button;option.classList.toggle('is-selected',selected);option.setAttribute('aria-pressed',String(selected))}));quickSizes.append(button)})}
    if(quickColours){quickColours.replaceChildren();const colourLabel=product.querySelector('.catalogue-colours')?.getAttribute('aria-label')||'Available colour';product.querySelectorAll('.catalogue-colours i').forEach((dot,index)=>{const button=document.createElement('button');button.type='button';button.style.backgroundColor=getComputedStyle(dot).backgroundColor;button.setAttribute('aria-label',`${colourLabel}, option ${index+1}`);button.classList.toggle('is-selected',index===0);button.setAttribute('aria-pressed',String(index===0));button.addEventListener('click',()=>[...quickColours.children].forEach(option=>{const selected=option===button;option.classList.toggle('is-selected',selected);option.setAttribute('aria-pressed',String(selected))}));quickColours.append(button)})}
    rememberRecentlyViewed(product);setQuickActionStates();quickLayer.hidden=false;document.body.style.overflow='hidden';quickDialog.focus()};
  document.querySelectorAll('.catalogue-product').forEach(product=>{const media=product.querySelector('.catalogue-product-media');if(!media)return;const trigger=document.createElement('button');trigger.type='button';trigger.className='catalogue-quick-trigger';trigger.setAttribute('aria-label',`Quick view ${product.querySelector('h3')?.textContent.trim()}`);trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>';trigger.addEventListener('click',()=>openQuickView(product,trigger));media.append(trigger)});
  quickLayer?.querySelectorAll('[data-quick-view-close]').forEach(button=>button.addEventListener('click',closeQuickView));
  document.querySelector('[data-quantity-minus]')?.addEventListener('click',()=>{quickQty=Math.max(1,quickQty-1);if(quickQuantity)quickQuantity.textContent=String(quickQty)});document.querySelector('[data-quantity-plus]')?.addEventListener('click',()=>{quickQty=Math.min(10,quickQty+1);if(quickQuantity)quickQuantity.textContent=String(quickQty)});
  quickAdd?.addEventListener('click',()=>{if(!quickProduct)return;const name=quickProduct.querySelector('h3')?.textContent.trim();let quantities={};try{quantities=JSON.parse(localStorage.getItem('maison-cart-quantities-v1')||'{}')||{}}catch{}cartItems.add(name);quantities[name]=quickQty;localStorage.setItem('maison-cart-items-v1',JSON.stringify([...cartItems]));localStorage.setItem('maison-cart-quantities-v1',JSON.stringify(quantities));syncCart();setQuickActionStates()});
  quickWishlist?.addEventListener('click',()=>{if(!quickProduct)return;const name=quickProduct.querySelector('h3')?.textContent.trim();wishlistItems.has(name)?wishlistItems.delete(name):wishlistItems.add(name);localStorage.setItem('maison-wishlist-v2',JSON.stringify([...wishlistItems]));syncWishlist();setQuickActionStates()});
  const lookAddButton=document.querySelector('[data-look-add-cart]'),lookCartStatus=document.querySelector('[data-look-cart-status]');
  lookAddButton?.addEventListener('click',()=>{const lookItems=['Everyday Jersey Tee','Soft Pleat Trouser','Weekend Layer Cardigan'];lookItems.forEach(item=>cartItems.add(item));localStorage.setItem('maison-cart-items-v1',JSON.stringify([...cartItems]));syncCart();lookAddButton.textContent='Available Items Added';lookAddButton.setAttribute('aria-pressed','true');if(lookCartStatus)lookCartStatus.textContent='Three available pieces have been added to your cart.'});
  quickFull?.addEventListener('click',closeQuickView);
  quickDialog?.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeQuickView();return}if(event.key!=='Tab')return;const focusable=[...quickDialog.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')].filter(node=>!node.disabled&&!node.hidden);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
  const signatureImage=document.querySelector('[data-signature-image]');
  const signatureColours=[...document.querySelectorAll('[data-signature-colour]')];
  signatureColours.forEach(button=>button.addEventListener('click',()=>{
    const colour=button.dataset.signatureColour;
    if(signatureImage){signatureImage.src=button.dataset.signatureSrc;signatureImage.alt=`Heritage Knit Set in ${colour==='forest'?'forest green':colour}`;}
    signatureColours.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
  }));
  const contactForm=document.querySelector('[data-contact-form]');
  if(contactForm){
    const selectRoot=contactForm.querySelector('[data-contact-select]'),selectTrigger=contactForm.querySelector('[data-contact-select-trigger]'),selectMenu=contactForm.querySelector('[data-contact-select-options]'),selectValue=contactForm.querySelector('[data-contact-select-value]'),selectInput=contactForm.querySelector('[name="enquiry_type"]'),selectOptions=[...contactForm.querySelectorAll('[data-contact-option]')],success=contactForm.querySelector('[data-contact-success]');
    const closeContactSelect=(restore=false)=>{if(!selectMenu)return;selectMenu.hidden=true;selectRoot?.classList.remove('is-open');selectTrigger?.setAttribute('aria-expanded','false');if(restore)selectTrigger?.focus()};
    const openContactSelect=()=>{if(!selectMenu)return;selectMenu.hidden=false;selectRoot?.classList.add('is-open');selectTrigger?.setAttribute('aria-expanded','true');(selectOptions.find(option=>option.getAttribute('aria-selected')==='true')||selectOptions[0])?.focus()};
    const chooseContactOption=option=>{if(!option||!selectInput||!selectValue)return;selectInput.value=option.dataset.contactOption||'';selectValue.textContent=option.textContent.trim();selectOptions.forEach(item=>item.setAttribute('aria-selected',String(item===option)));selectTrigger?.classList.add('has-value');clearContactError('enquiry_type');closeContactSelect(true)};
    selectTrigger?.addEventListener('click',()=>selectMenu?.hidden?openContactSelect():closeContactSelect());
    selectOptions.forEach(option=>option.addEventListener('click',()=>chooseContactOption(option)));
    document.querySelectorAll('[data-contact-route]').forEach(route=>route.addEventListener('click',event=>{const option=selectOptions.find(item=>item.dataset.contactOption===route.dataset.contactRoute);if(!option)return;event.preventDefault();chooseContactOption(option);contactForm.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>selectTrigger?.focus(),450)}));
    selectRoot?.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeContactSelect(true);return}if(!['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key))return;if(document.activeElement===selectTrigger){event.preventDefault();openContactSelect();return}const index=Math.max(0,selectOptions.indexOf(document.activeElement));if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseContactOption(selectOptions[index]);return}event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?selectOptions.length-1:event.key==='ArrowDown'?(index+1)%selectOptions.length:(index-1+selectOptions.length)%selectOptions.length;selectOptions[next]?.focus()});
    document.addEventListener('click',event=>{if(selectRoot&&!selectRoot.contains(event.target))closeContactSelect()});
    function contactControl(name){return name==='enquiry_type'?selectTrigger:name==='consent'?contactForm.querySelector('.contact-form-consent'):contactForm.elements[name]}
    function showContactError(name,message){const control=contactControl(name),error=contactForm.querySelector(`[data-error-for="${name}"]`);control?.setAttribute('aria-invalid','true');if(error){error.textContent=message;error.hidden=false}}
    function clearContactError(name){const control=contactControl(name),error=contactForm.querySelector(`[data-error-for="${name}"]`);control?.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true}}
    const validateContactField=name=>{const field=contactForm.elements[name],value=field?.value?.trim()||'';clearContactError(name);if(name==='name'&&!value){showContactError(name,'Please enter your full name.');return false}if(name==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){showContactError(name,'Enter a valid email address.');return false}if(name==='phone'&&value&&!/^\+?[\d\s().-]{7,20}$/.test(value)){showContactError(name,'Enter a valid phone number using digits and common separators.');return false}if(name==='enquiry_type'&&!value){showContactError(name,'Choose an enquiry type.');return false}if(name==='message'&&value.length<20){showContactError(name,'Please write at least 20 characters so we can understand your enquiry.');return false}if(name==='consent'&&!field?.checked){showContactError(name,'Please confirm consent so we can respond to your enquiry.');return false}return true};
    ['name','email','phone','message'].forEach(name=>{const field=contactForm.elements[name];field?.addEventListener('blur',()=>validateContactField(name));field?.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validateContactField(name);if(success)success.hidden=true})});
    contactForm.elements.consent?.addEventListener('change',()=>{validateContactField('consent');if(success)success.hidden=true});
    contactForm.addEventListener('submit',event=>{event.preventDefault();const names=['name','email','phone','enquiry_type','message','consent'],valid=names.map(validateContactField).every(Boolean);if(!valid){const first=names.map(contactControl).find(control=>control?.getAttribute('aria-invalid')==='true');(first?.querySelector?.('input')||first)?.focus();return}closeContactSelect();contactForm.reset();selectInput.value='';selectValue.textContent='Choose an enquiry type';selectTrigger.classList.remove('has-value');selectOptions.forEach(option=>option.setAttribute('aria-selected','false'));names.forEach(clearContactError);if(success){success.hidden=false;success.scrollIntoView({behavior:'smooth',block:'nearest'})}});
  }
  const schoolForm=document.querySelector('[data-school-form]');
  if(schoolForm){
    const schoolSuccess=schoolForm.querySelector('[data-school-success]'),schoolNames=['school_contact_name','organization_name','school_email','school_phone','required_items','size_range','estimated_quantity','school_message'];
    const schoolControl=name=>name==='required_items'||name==='estimated_quantity'?schoolForm.querySelector(`[data-school-control="${name}"]`):schoolForm.elements[name];
    const clearSchoolError=name=>{const control=schoolControl(name),error=schoolForm.querySelector(`[data-school-error="${name}"]`);control?.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true}};
    const showSchoolError=(name,message)=>{const control=schoolControl(name),error=schoolForm.querySelector(`[data-school-error="${name}"]`);control?.setAttribute('aria-invalid','true');if(error){error.textContent=message;error.hidden=false}};
    const validateSchoolField=name=>{const field=schoolForm.elements[name],value=field?.value?.trim()||'';clearSchoolError(name);if(name==='required_items'&&![...schoolForm.querySelectorAll('[name="required_items"]')].some(input=>input.checked)){showSchoolError(name,'Select at least one required item.');return false}if(name==='estimated_quantity'&&!schoolForm.querySelector('[name="estimated_quantity"]:checked')){showSchoolError(name,'Choose an estimated quantity range.');return false}if(name==='school_contact_name'&&!value){showSchoolError(name,'Enter the contact name.');return false}if(name==='organization_name'&&!value){showSchoolError(name,'Enter the school or organization name.');return false}if(name==='school_email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){showSchoolError(name,'Enter a valid email address.');return false}if(name==='school_phone'&&!/^\+?[\d\s().-]{7,20}$/.test(value)){showSchoolError(name,'Enter a valid phone number.');return false}if(name==='size_range'&&!value){showSchoolError(name,'Add the relevant age or size range.');return false}if(name==='school_message'&&value.length<20){showSchoolError(name,'Please provide at least 20 characters of additional detail.');return false}return true};
    ['school_contact_name','organization_name','school_email','school_phone','size_range','school_message'].forEach(name=>{const field=schoolForm.elements[name];field?.addEventListener('blur',()=>validateSchoolField(name));field?.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validateSchoolField(name);if(schoolSuccess)schoolSuccess.hidden=true})});
    schoolForm.querySelectorAll('[name="required_items"],[name="estimated_quantity"]').forEach(input=>input.addEventListener('change',()=>{validateSchoolField(input.name);if(schoolSuccess)schoolSuccess.hidden=true}));
    schoolForm.addEventListener('submit',event=>{event.preventDefault();const valid=schoolNames.map(validateSchoolField).every(Boolean);if(!valid){const first=schoolNames.map(schoolControl).find(control=>control?.getAttribute('aria-invalid')==='true');(first?.querySelector?.('input')||first)?.focus();return}schoolForm.reset();schoolNames.forEach(clearSchoolError);if(schoolSuccess){schoolSuccess.hidden=false;schoolSuccess.scrollIntoView({behavior:'smooth',block:'nearest'})}});
  }
  document.querySelectorAll('[data-location-map]').forEach(map=>{
    const cityButtons=[...map.querySelectorAll('[data-map-city]')];
    const cityFrames=[...map.querySelectorAll('[data-map-frame]')];
    cityButtons.forEach(button=>button.addEventListener('click',()=>{
      const selectedCity=button.dataset.mapCity;
      cityButtons.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
      cityFrames.forEach(frame=>{frame.hidden=frame.dataset.mapFrame!==selectedCity});
    }));
  });
  const loginForm=document.querySelector('[data-login-form]');
  if(loginForm){
    const loginStatus=loginForm.querySelector('[data-login-status]'),password=loginForm.elements.password,passwordToggle=loginForm.querySelector('[data-password-toggle]');
    const clearLoginError=name=>{const field=loginForm.elements[name],error=loginForm.querySelector(`[data-login-error="${name}"]`);field?.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true}};
    const showLoginError=(name,message)=>{const field=loginForm.elements[name],error=loginForm.querySelector(`[data-login-error="${name}"]`);field?.setAttribute('aria-invalid','true');if(error){error.textContent=message;error.hidden=false}};
    const validateLoginField=name=>{const value=loginForm.elements[name]?.value.trim()||'';clearLoginError(name);if(name==='email'&&!value){showLoginError(name,'Please enter your email address.');return false}if(name==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){showLoginError(name,'Enter a valid email address.');return false}if(name==='password'&&!value){showLoginError(name,'Please enter your password.');return false}return true};
    ['email','password'].forEach(name=>{const field=loginForm.elements[name];field?.addEventListener('blur',()=>validateLoginField(name));field?.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validateLoginField(name);if(loginStatus)loginStatus.hidden=true})});
    passwordToggle?.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';passwordToggle.setAttribute('aria-label',show?'Hide password':'Show password')});
    loginForm.querySelectorAll('[data-social-login]').forEach(button=>button.addEventListener('click',()=>{if(loginStatus){loginStatus.textContent=`${button.dataset.socialLogin} sign-in is ready for integration but is not connected in this static template.`;loginStatus.hidden=false;loginStatus.scrollIntoView({behavior:'smooth',block:'nearest'})}}));
    loginForm.addEventListener('submit',event=>{event.preventDefault();const fields=['email','password'],valid=fields.map(validateLoginField).every(Boolean);if(!valid){fields.map(name=>loginForm.elements[name]).find(field=>field?.getAttribute('aria-invalid')==='true')?.focus();return}if(loginStatus){loginStatus.textContent='Your details are valid. Connect this demo form to the store’s authentication service to complete sign-in.';loginStatus.hidden=false;loginStatus.scrollIntoView({behavior:'smooth',block:'nearest'})}});
  }
  const registerForm=document.querySelector('[data-register-form]');
  if(registerForm){
    const registerStatus=registerForm.querySelector('[data-register-status]'),registerNames=['first_name','last_name','email','password','confirm_password','terms'];
    const registerControl=name=>name==='terms'?registerForm.querySelector('[data-register-check="terms"]'):registerForm.elements[name];
    const clearRegisterError=name=>{const control=registerControl(name),error=registerForm.querySelector(`[data-register-error="${name}"]`);control?.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true}};
    const showRegisterError=(name,message)=>{const control=registerControl(name),error=registerForm.querySelector(`[data-register-error="${name}"]`);control?.setAttribute('aria-invalid','true');if(error){error.textContent=message;error.hidden=false}};
    const validateRegisterField=name=>{const field=registerForm.elements[name],value=field?.value.trim()||'';clearRegisterError(name);if(name==='first_name'&&!value){showRegisterError(name,'Enter your first name.');return false}if(name==='last_name'&&!value){showRegisterError(name,'Enter your last name.');return false}if(name==='email'&&!value){showRegisterError(name,'Enter your email address.');return false}if(name==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){showRegisterError(name,'Enter a valid email address.');return false}if(name==='password'&&value.length<8){showRegisterError(name,'Password must be at least 8 characters.');return false}if(name==='confirm_password'&&!value){showRegisterError(name,'Confirm your password.');return false}if(name==='confirm_password'&&value!==registerForm.elements.password.value){showRegisterError(name,'Passwords do not match.');return false}if(name==='terms'&&!field?.checked){showRegisterError(name,'Please accept the Terms & Conditions.');return false}return true};
    registerNames.filter(name=>name!=='terms').forEach(name=>{const field=registerForm.elements[name];field?.addEventListener('blur',()=>validateRegisterField(name));field?.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validateRegisterField(name);if(name==='password'&&registerForm.elements.confirm_password.value)validateRegisterField('confirm_password');if(registerStatus)registerStatus.hidden=true})});
    registerForm.elements.terms?.addEventListener('change',()=>{validateRegisterField('terms');if(registerStatus)registerStatus.hidden=true});
    registerForm.querySelectorAll('[data-register-password-toggle]').forEach(button=>button.addEventListener('click',()=>{const field=button.closest('.login-password-control')?.querySelector('input');if(!field)return;const show=field.type==='password';field.type=show?'text':'password';button.setAttribute('aria-label',show?'Hide password':'Show password')}));
    registerForm.querySelectorAll('[data-register-social]').forEach(button=>button.addEventListener('click',()=>{if(registerStatus){registerStatus.textContent=`${button.dataset.registerSocial} account creation is ready for integration but is not connected in this static template.`;registerStatus.hidden=false;registerStatus.scrollIntoView({behavior:'smooth',block:'nearest'})}}));
    registerForm.addEventListener('submit',event=>{event.preventDefault();const valid=registerNames.map(validateRegisterField).every(Boolean);if(!valid){const first=registerNames.map(registerControl).find(control=>control?.getAttribute('aria-invalid')==='true');(first?.querySelector?.('input')||first)?.focus();return}if(registerStatus){registerStatus.textContent='Your details are valid. Connect this form to the store’s account service to create the account; no data has been stored or sent.';registerStatus.hidden=false;registerStatus.scrollIntoView({behavior:'smooth',block:'nearest'})}});
  }
  document.querySelector('[data-safe-back]')?.addEventListener('click',()=>{let sameSiteReferrer=false;try{sameSiteReferrer=Boolean(document.referrer)&&new URL(document.referrer).origin===location.origin}catch{}sameSiteReferrer?history.back():location.assign('Homepage1.html')});
  const comingCountdown=document.querySelector('[data-coming-countdown]');
  if(comingCountdown){
    // Demo launch date. Replace this ISO 8601 value with the client's approved production date before launch.
    const launchDate='2026-09-08T10:00:00+05:30';
    const launchTime=Date.parse(launchDate),countdownState=document.querySelector('[data-countdown-state]'),countdownParts={days:comingCountdown.querySelector('[data-countdown-days]'),hours:comingCountdown.querySelector('[data-countdown-hours]'),minutes:comingCountdown.querySelector('[data-countdown-minutes]'),seconds:comingCountdown.querySelector('[data-countdown-seconds]')};
    let countdownTimer;
    const setCountdown=(days,hours,minutes,seconds)=>{countdownParts.days.textContent=String(days).padStart(2,'0');countdownParts.hours.textContent=String(hours).padStart(2,'0');countdownParts.minutes.textContent=String(minutes).padStart(2,'0');countdownParts.seconds.textContent=String(seconds).padStart(2,'0')};
    const updateCountdown=()=>{const remaining=Math.max(0,launchTime-Date.now());if(remaining===0){setCountdown(0,0,0,0);if(countdownState)countdownState.textContent='We’re live—the new collection is ready to explore.';clearInterval(countdownTimer);return}const totalSeconds=Math.floor(remaining/1000),days=Math.floor(totalSeconds/86400),hours=Math.floor(totalSeconds%86400/3600),minutes=Math.floor(totalSeconds%3600/60),seconds=totalSeconds%60;setCountdown(days,hours,minutes,seconds);if(countdownState)countdownState.textContent='Counting down to the collection reveal.'};
    if(Number.isFinite(launchTime)){updateCountdown();if(launchTime>Date.now())countdownTimer=setInterval(updateCountdown,1000)}
  }
  const comingNotify=document.querySelector('[data-coming-notify]');
  if(comingNotify){
    const email=comingNotify.elements.email,error=comingNotify.querySelector('[data-coming-email-error]'),status=comingNotify.querySelector('[data-coming-form-status]');
    const validateComingEmail=()=>{const value=email.value.trim();email.removeAttribute('aria-invalid');if(error){error.textContent='';error.hidden=true}let message='';if(!value)message='Enter your email address.';else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))message='Enter a valid email address.';if(message){email.setAttribute('aria-invalid','true');if(error){error.textContent=message;error.hidden=false}return false}return true};
    email.addEventListener('blur',validateComingEmail);email.addEventListener('input',()=>{if(email.getAttribute('aria-invalid')==='true')validateComingEmail();if(status)status.hidden=true});
    comingNotify.addEventListener('submit',event=>{event.preventDefault();if(!validateComingEmail()){email.focus();return}if(status){status.textContent='Your email is valid. Connect this form to the approved newsletter service to enable launch notifications; nothing has been submitted yet.';status.hidden=false}});
  }
  syncCart();
  const root=document.documentElement,header=document.querySelector('[data-header]'),themes=document.querySelectorAll('[data-theme-toggle]'),directions=document.querySelectorAll('[data-direction-toggle]');
  root.dataset.theme=localStorage.getItem('site-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  root.dir=localStorage.getItem('site-direction')||root.dir||'ltr';
  const sync=()=>{const dark=root.dataset.theme==='dark',rtl=root.dir==='rtl';themes.forEach(button=>{button.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);const label=button.querySelector('span');if(label)label.textContent=button.classList.contains('login-direction-toggle')?label.textContent:(dark?'Light mode':'Dark mode')});directions.forEach(button=>{button.setAttribute('aria-label',`Switch to ${rtl?'left-to-right':'right-to-left'} layout`);if(button.classList.contains('direction-button'))button.textContent=rtl?'LTR':'RTL';const label=button.querySelector('span');if(label)label.textContent=button.classList.contains('login-direction-toggle')?(rtl?'LTR':'RTL'):(rtl?'LTR layout':'RTL layout')})};
  themes.forEach(button=>button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('site-theme',root.dataset.theme);sync()}));
  directions.forEach(button=>button.addEventListener('click',()=>{root.dir=root.dir==='rtl'?'ltr':'rtl';localStorage.setItem('site-direction',root.dir);sync()}));
  if(!header){sync();return}
  const menu=header.querySelector('[data-menu-toggle]'),drop=header.querySelector('[data-dropdown]'),dropButton=drop?.querySelector('.dropdown-trigger');
  const currentPage=location.pathname.split('/').pop()||'Homepage1.html';
  const homePages=['Homepage1.html','Homepage2.html','index.html','index-2.html'];
  header.querySelectorAll('.nav-link,.dropdown-link').forEach(link=>{link.classList.remove('is-active','is-current');link.removeAttribute('aria-current')});
  if(homePages.includes(currentPage)){
    dropButton?.classList.add('is-active');
    const currentHome=drop?.querySelector(`.dropdown-link[href="${currentPage}"]`)||drop?.querySelector('.dropdown-link[href="Homepage1.html"]');
    currentHome?.classList.add('is-current');currentHome?.setAttribute('aria-current','page');
  }else{
    const currentLink=header.querySelector(`.nav-inner > .nav-link[href="${currentPage}"]`);
    currentLink?.classList.add('is-active');currentLink?.setAttribute('aria-current','page');
  }
  let dropdownPinned=false;
  const closeDrop=()=>{dropdownPinned=false;drop?.classList.remove('is-open','suppress-hover');dropButton?.setAttribute('aria-expanded','false')};
  const closeMenu=()=>{header.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');document.body.style.overflow=''};
  menu?.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',`${open?'Close':'Open'} navigation`);document.body.style.overflow=open?'hidden':''});
  dropButton?.addEventListener('click',()=>{dropdownPinned=!dropdownPinned;drop.classList.toggle('is-open',dropdownPinned);drop.classList.toggle('suppress-hover',!dropdownPinned);dropButton.setAttribute('aria-expanded',String(dropdownPinned))});
  drop?.addEventListener('mouseenter',()=>{if(innerWidth>=1024&&!drop.classList.contains('suppress-hover')){drop.classList.add('is-open');dropButton?.setAttribute('aria-expanded','true')}});
  drop?.addEventListener('mouseleave',()=>{drop.classList.remove('suppress-hover');if(innerWidth>=1024&&!dropdownPinned){drop.classList.remove('is-open');dropButton?.setAttribute('aria-expanded','false')}});
  document.addEventListener('click',event=>{if(drop&&!drop.contains(event.target))closeDrop()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeDrop();closeMenu();dropButton?.focus()}});
  addEventListener('scroll',()=>header.classList.toggle('is-scrolled',scrollY>8),{passive:true});addEventListener('resize',()=>{if(innerWidth>=1024)closeMenu()});sync();
});
