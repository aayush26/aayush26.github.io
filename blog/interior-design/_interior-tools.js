/* =========================
   Interior Tools JS — Clean Calculator
========================= */
window.InteriorTools = (function() {

  const categories = [
    { key: "projector", name: "Projector", options:[
      { id:"proj-budget", label:"Budget 1080p", cost:45000 },
      { id:"proj-entry", label:"Entry 4K", cost:90000 },
      { id:"proj-mid", label:"Mid-range 4K", cost:180000 },
      { id:"proj-prem", label:"Premium 4K / Laser", cost:400000 }
    ]},
    { key:"screen", name: "Screen", options:[
      { id:"screen-manual", label:"Manual Pull-down", cost:10000 },
      { id:"screen-motor", label:"Motorised", cost:25000 },
      { id:"screen-tension", label:"Tensioned Motorised", cost:45000 },
      { id:"screen-alr", label:"ALR/CLR Premium", cost:120000 }
    ]},
    { key:"wiring", name:"Wiring & Installation", options:[
      { id:"wire-basic", label:"Basic", cost:12000 },
      { id:"wire-mid", label:"Mid", cost:30000 },
      { id:"wire-prem", label:"Premium", cost:65000 }
    ]},
    { key:"avr", name:"AV Receiver", options:[
      { id:"avr-entry", label:"Entry 5.1 AVR", cost:40000 },
      { id:"avr-mid", label:"Mid 7.2 AVR", cost:70000 },
      { id:"avr-prem", label:"Premium AVR", cost:150000 }
    ]},
    { key:"speakers", name:"Speakers", options:[
      { id:"spk-budget", label:"Budget 5.1", cost:30000 },
      { id:"spk-entry", label:"Entry Towers / Bookshelf", cost:70000 },
      { id:"spk-mid", label:"Mid-range Audiophile", cost:180000 },
      { id:"spk-prem", label:"Premium Speakers", cost:350000 }
    ]},
    { key:"subwoofer", name:"Subwoofer", options:[
      { id:"sub-budget", label:"Budget", cost:30000 },
      { id:"sub-mid", label:"Mid", cost:70000 },
      { id:"sub-prem", label:"Premium", cost:150000 }
    ]},
    { key:"cables", name:"Cables & Accessories", options:[
      { id:"cbl-basic", label:"Basic", cost:2500 },
      { id:"cbl-mid", label:"Mid", cost:5000 },
      { id:"cbl-prem", label:"Premium", cost:15000 }
    ]}
  ];

  let state = { containerId:null, theme:'dark', selections:{} };

  /* -------------------------
     INIT
  ------------------------- */
  function init(options){
    state.containerId = options.containerId || 'htc-root';
    state.theme = options.defaultTheme || 'dark';

    applyTheme();
    renderThemeToggle();
    renderDeepDiveGuide();
    renderCalculator();
    updateTotal();
    loadFromURL();
    loadFromLocalStorage();
  }

  /* -------------------------
     THEME
  ------------------------- */
  function applyTheme(){
    document.body.classList.remove('htc-dark','htc-light');
    document.body.classList.add(`htc-${state.theme}`);
  }

  function toggleTheme(){
    state.theme = state.theme==='dark'?'light':'dark';
    localStorage.setItem('htc-theme',state.theme);
    applyTheme();
  }

  function renderThemeToggle(){
    const btn = document.createElement('button');
    btn.id='htc-theme-toggle';
    btn.textContent = state.theme==='dark'?'🌙':'☀️';
    btn.onclick=()=>{ toggleTheme(); btn.textContent=state.theme==='dark'?'🌙':'☀️'; };
    document.body.appendChild(btn);
    const saved = localStorage.getItem('htc-theme');
    if(saved){ state.theme=saved; applyTheme(); btn.textContent=state.theme==='dark'?'🌙':'☀️'; }
  }

  /* -------------------------
     DEEP DIVE GUIDE
  ------------------------- */
  function renderDeepDiveGuide(){
    const container = document.getElementById('htc-guide');
    if(!container) return;

    container.innerHTML = `
      <h2>🎬 Home Theatre Deep Dive Guide</h2>
      <div class="htc-tabs">
        ${categories.map(c=>`<button class="htc-tab ${c.key==='screen'?'active':''}" data-key="${c.key}">${categoryEmoji(c.key)} ${c.name}</button>`).join('')}
      </div>
      <div class="htc-tab-content">
        ${categories.map(c=>`<div class="htc-tab-panel" data-key="${c.key}" style="display:${c.key==='screen'?'block':'none'}">${getDeepDiveContent(c.key)}</div>`).join('')}
      </div>
    `;

    container.querySelectorAll('.htc-tab').forEach(tab=>{
      tab.addEventListener('click',()=>{
        const key = tab.dataset.key;
        container.querySelectorAll('.htc-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        container.querySelectorAll('.htc-tab-panel').forEach(panel=>{
          panel.style.display = panel.dataset.key === key ? 'block':'none';
        });
      });
    });
  }

  function categoryEmoji(key){
    const map={screen:'🖥', projector:'🎥', speakers:'🔊', wiring:'🔌', avr:'🎛', subwoofer:'🥁', cables:'📎'};
    return map[key]||'';
  }

  function getDeepDiveContent(key){
    const content = {
      screen:`<ul><li>Types: Manual, Motorized, Tensioned, ALR/CLR</li><li>Fabric: White vs Gray</li><li>Size: 100"-120"</li><li>Brands: Elite, Stewart, Screen Innovations</li><li>Cost low→high: Manual → Motorized → Tensioned → ALR</li></ul>`,
      projector:`<ul><li>Resolution: True 4K vs pixel-shifting</li><li>Brightness: Match room</li><li>Placement: Throw distance & lens shift</li><li>Brands: Epson, JVC, Sony, Optoma</li><li>Cost low→high: Entry → Mid → Premium</li></ul>`,
      speakers:`<ul><li>Placement: In-wall / Bookshelf / Floor</li><li>Room size guide</li><li>Brands: Klipsch, B&W, Focal, Polk</li><li>Cost low→high: Budget → Entry → Mid → Premium</li></ul>`,
      wiring:`<ul><li>Concealed wiring recommended</li><li>Quality: HDMI 2.1, gauge</li><li>Cost low→high: Basic → Mid → Premium</li></ul>`,
      avr:`<ul><li>Channels: 5.1 → 7.2</li><li>Dolby Atmos / DTS:X</li><li>Brands: Denon, Marantz, Yamaha, Onkyo</li><li>Cost low→high: Entry → Mid → Premium</li></ul>`,
      subwoofer:`<ul><li>Placement: corner vs center</li><li>Size & frequency response</li><li>Brands: SVS, REL, Klipsch</li><li>Cost low→high: Budget → Mid → Premium</li></ul>`,
      cables:`<ul><li>HDMI, optical, speaker wires</li><li>Quality vs cost: avoid cheap wires</li><li>Cost low→high: Basic → Mid → Premium</li></ul>`
    };
    return content[key]||'';
  }

  /* -------------------------
     CALCULATOR LOGIC
  ------------------------- */
  function renderCalculator(){
    const container=document.getElementById(state.containerId);
    if(!container) return;
    container.innerHTML='';

    categories.forEach(cat=>{
      const section=document.createElement('div');
      section.className='htc-section';
      const label=document.createElement('label');
      label.textContent=cat.name; section.appendChild(label);

      const select=document.createElement('select');
      cat.options.forEach(opt=>{
        const el=document.createElement('option');
        el.value=opt.cost;
        el.textContent=`${opt.label} — ₹${opt.cost.toLocaleString()}`;
        select.appendChild(el);
      });
      section.appendChild(select);

      const custom=document.createElement('input');
      custom.type='number';
      custom.placeholder='Or enter custom price (₹)';
      section.appendChild(custom);

      select.addEventListener('input',updateTotal);
      custom.addEventListener('input',updateTotal);

      container.appendChild(section);
    });

    // Buttons
    const btnContainer=document.createElement('div');
    btnContainer.className='htc-section';
    btnContainer.style.display='flex'; btnContainer.style.flexWrap='wrap'; btnContainer.style.gap='0.5rem';
    ['Shareable Link 🔗','Save Preset 💾','Load Preset 📂','Print 🖨'].forEach((txt,i)=>{
      const btn=document.createElement('button'); btn.textContent=txt;
      if(i===0) btn.onclick=generateShareableLink;
      if(i===1) btn.onclick=savePreset;
      if(i===2) btn.onclick=loadPresetPrompt;
      if(i===3) btn.onclick=()=>window.print();
      btnContainer.appendChild(btn);
    });
    container.appendChild(btnContainer);

    // Total
    const totalSection=document.createElement('div');
    totalSection.className='htc-total';
    totalSection.innerHTML=`<h2>Total</h2><div class="htc-total-cost">₹0</div>`;
    container.appendChild(totalSection);
  }

  function updateTotal(){
    let total = 0;
    const container = document.getElementById(state.containerId);
    if(!container) return;

    container.querySelectorAll('.htc-section').forEach(section=>{
      const labelEl = section.querySelector('label'); if(!labelEl) return;
      const catObj = categories.find(c => c.name === labelEl.textContent.trim());
      if(!catObj) return;
      const key = catObj.key;

      const select = section.querySelector('select');
      const custom = section.querySelector('input[type=number]');
      let val = 0;

      if(custom && custom.value && custom.value.trim()!=='') val = Number(custom.value);
      else if(select && select.value) val = Number(select.value);

      total += val;
    });

    const totalEl = container.querySelector('.htc-total-cost');
    if(totalEl) totalEl.textContent = '₹' + total.toLocaleString();

    saveCurrentState();
  }

  /* -------------------------
     SHAREABLE LINK / PRESETS
  ------------------------- */
  function generateShareableLink(){
    const data = getCurrentSelections();
    try {
      const str = btoa(JSON.stringify(data));
      const url = `${window.location.origin}${window.location.pathname}?config=${str}`;
      prompt("Shareable URL:", url);
    } catch(e){ console.error(e); alert("Failed to generate shareable link."); }
  }

  function getCurrentSelections(){
    const container=document.getElementById(state.containerId); 
    const data={};
    container.querySelectorAll('.htc-section').forEach(section=>{
      const labelEl=section.querySelector('label'); if(!labelEl) return;
      const catObj = categories.find(c => c.name === labelEl.textContent.trim());
      if(!catObj) return;
      const key = catObj.key;
      const select = section.querySelector('select'); 
      const custom = section.querySelector('input[type=number]');
      data[key] = (custom && custom.value) ? custom.value : (select ? select.value : 0);
    });
    return data;
  }

  function loadFromURL(){
    const params = new URLSearchParams(window.location.search);
    if(!params.has('config')) return;
    try{
      const data = JSON.parse(atob(params.get('config')));
      state.selections = data || {};
      const container=document.getElementById(state.containerId);
      if(container){
        container.querySelectorAll('.htc-section').forEach(section=>{
          const labelEl=section.querySelector('label'); if(!labelEl) return;
          const catObj = categories.find(c => c.name === labelEl.textContent.trim());
          if(!catObj) return;
          const key = catObj.key;
          const select = section.querySelector('select'); 
          const custom = section.querySelector('input[type=number]');
          if(state.selections[key]){
            if(select.querySelector(`option[value="${state.selections[key]}"]`)){
              select.value = state.selections[key]; if(custom) custom.value='';
            } else { if(custom) custom.value = state.selections[key]; }
          }
        });
        updateTotal();
      }
    }catch(e){ console.error("Failed to load shareable config",e); }
  }

  function savePreset(){ 
    const name = prompt("Preset name:"); if(!name) return;
    const data = getCurrentSelections(); 
    const all = JSON.parse(localStorage.getItem('htc-presets')||'{}');
    all[name] = data; 
    localStorage.setItem('htc-presets',JSON.stringify(all)); 
    alert(`Preset "${name}" saved!`);
  }

  function loadPresetPrompt(){
    const all = JSON.parse(localStorage.getItem('htc-presets')||'{}'); 
    const names = Object.keys(all);
    if(names.length===0){ alert("No presets saved."); return; }
    const sel = prompt(`Saved presets:\n${names.join('\n')}\nEnter preset name to load:`); 
    if(!sel || !all[sel]) return;
    loadPreset(sel);
  }

  function loadPreset(name){
    const all = JSON.parse(localStorage.getItem('htc-presets')||'{}'); 
    const data = all[name]; if(!data) return;
    const container = document.getElementById(state.containerId);
    container.querySelectorAll('.htc-section').forEach(section=>{
      const labelEl = section.querySelector('label'); if(!labelEl) return;
      const catObj = categories.find(c => c.name === labelEl.textContent.trim());
      if(!catObj) return;
      const key = catObj.key;
      const select = section.querySelector('select'); 
      const custom = section.querySelector('input[type=number]');
      if(data[key]){
        if(select.querySelector(`option[value="${data[key]}"]`)){ select.value = data[key]; if(custom) custom.value=''; }
        else { if(custom) custom.value = data[key]; }
      }
    });
    updateTotal();
  }

  function saveCurrentState(){ 
    const data = getCurrentSelections(); 
    localStorage.setItem('htc-current', JSON.stringify(data)); 
  }

  function loadFromLocalStorage(){ 
    const data = JSON.parse(localStorage.getItem('htc-current')||'{}'); 
    state.selections = data || {}; 
  }

  return { init };

})();
