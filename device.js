function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function ratingRow(label, level) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;">
    <span style="font-size:13px;color:var(--muted);">${label}</span>
    ${signalBars(level)}
  </div>`;
}

async function renderDevicePage() {
  const id = getParam('id');
  const devices = await loadDevices();
  const d = devices.find(x => x.id === id) || devices[0];
  if (!d) return;

  document.getElementById('pageTitle').textContent = `${d.name} — full specifications | SpecShelf`;

  const quickHTML = Object.entries(d.quickspec).map(([k, v]) => `
    <div class="quickspec-item">
      <div class="quickspec-label">${k}</div>
      <div class="quickspec-value">${v}</div>
    </div>`).join('');

  const ratingsHTML = d.ratings ? Object.entries(d.ratings).map(([k, v]) =>
    ratingRow(k.charAt(0).toUpperCase() + k.slice(1), v)).join('') : '';

  const specTablesHTML = Object.entries(d.specs).map(([cat, rows]) => `
    <div class="spec-cat">${cat}</div>
    <table class="spec-table">
      ${Object.entries(rows).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
    </table>`).join('');

  const inCompare = getCompareList().includes(d.id);

  document.getElementById('deviceMain').innerHTML = `
    <div class="spec-hero">
      <div class="spec-hero-img">${d.img ? `<img src="${d.img}" alt="${d.name}">` : 'No image available'}</div>
      <div>
        <h1 class="spec-title">${d.name}</h1>
        <div class="spec-sub">${d.brand} · ${d.type} · Released ${d.released}</div>
        <div class="quickspec-grid">${quickHTML}</div>
        <div style="margin:14px 0;">${ratingsHTML}</div>
        <div class="price-box">
          <div>
            <div class="amt">${d.price_my}</div>
            <div class="label">Malaysia estimate (incl. SST)</div>
          </div>
          <div style="margin-left:auto; text-align:right;">
            <div class="amt" style="color:var(--paper);font-size:15px;">${d.price_global}</div>
            <div class="label">Global reference</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px;">
          <button class="btn btn-primary" onclick="toggleCompare('${d.id}'); this.textContent = getCompareList().includes('${d.id}') ? 'Added ✓' : 'Add to compare'">
            ${inCompare ? 'Added ✓' : 'Add to compare'}
          </button>
          <a class="btn btn-outline" href="compare.html">Go to compare</a>
        </div>
      </div>
    </div>

    <div class="ad-slot ad-inline"><!-- AdSense: in-content native --> Ad space — in-content native</div>

    <div class="spec-table-wrap">
      <h2 class="section-title">Full specifications</h2>
      ${specTablesHTML}
    </div>
  `;

  // Related devices sidebar
  const related = devices.filter(x => x.id !== d.id && x.type === d.type).slice(0, 4);
  document.getElementById('relatedList').innerHTML = related.map(r => `
    <li><a href="device.html?id=${r.id}" class="name" style="color:inherit;">${r.name}</a><span class="val">${r.price_my}</span></li>
  `).join('') || '<li>No related devices</li>';
}

document.addEventListener('DOMContentLoaded', renderDevicePage);
