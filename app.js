// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const loaderContainer = document.getElementById('loader-container');
const appContent = document.getElementById('app-content');
const pdfForm = document.getElementById('pdf-form');
const resetBtn = document.getElementById('reset-btn');
const copyTextBtn = document.getElementById('copy-text-btn');
const copyJsonBtn = document.getElementById('copy-json-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// HubSpot DOM Elements
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const hubspotTokenInput = document.getElementById('hubspot-token');
const hubspotCorsMethodSelect = document.getElementById('hubspot-cors-method');
const proxyUrlGroup = document.getElementById('proxy-url-group');
const hubspotProxyUrlInput = document.getElementById('hubspot-proxy-url');
const hubspotPipelineInput = document.getElementById('hubspot-pipeline');
const hubspotStageInput = document.getElementById('hubspot-stage');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const togglePasswordBtn = document.getElementById('toggle-password-btn');
const syncHubspotBtn = document.getElementById('sync-hubspot-btn');

// Load HubSpot settings from localStorage
function loadHubSpotSettings() {
  const token = localStorage.getItem('hs_token') || '';
  const corsMethod = localStorage.getItem('hs_cors_method') || 'direct';
  const proxyUrl = localStorage.getItem('hs_proxy_url') || '';
  const pipeline = localStorage.getItem('hs_pipeline') || 'default';
  const stage = localStorage.getItem('hs_stage') || 'appointmentscheduled';

  hubspotTokenInput.value = token;
  hubspotCorsMethodSelect.value = corsMethod;
  hubspotProxyUrlInput.value = proxyUrl;
  hubspotPipelineInput.value = pipeline;
  hubspotStageInput.value = stage;

  // Show/hide proxy URL field based on method
  proxyUrlGroup.style.display = corsMethod === 'proxy' ? 'block' : 'none';
}

// Save HubSpot settings to localStorage
function saveHubSpotSettings() {
  localStorage.setItem('hs_token', hubspotTokenInput.value.trim());
  localStorage.setItem('hs_cors_method', hubspotCorsMethodSelect.value);
  localStorage.setItem('hs_proxy_url', hubspotProxyUrlInput.value.trim());
  localStorage.setItem('hs_pipeline', hubspotPipelineInput.value.trim());
  localStorage.setItem('hs_stage', hubspotStageInput.value.trim());

  showToast('Configuración de HubSpot guardada con éxito.', 'check-circle');
}

// Toggle settings panel visibility
toggleSettingsBtn.addEventListener('click', () => {
  const isHidden = settingsPanel.style.display === 'none';
  settingsPanel.style.display = isHidden ? 'block' : 'none';
  toggleSettingsBtn.classList.toggle('btn-primary', isHidden);
  toggleSettingsBtn.classList.toggle('btn-secondary', !isHidden);
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
  const isPassword = hubspotTokenInput.type === 'password';
  hubspotTokenInput.type = isPassword ? 'text' : 'password';
  
  // Update icon
  const icon = togglePasswordBtn.querySelector('i');
  icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
  lucide.createIcons();
});

// Show/hide proxy URL field based on connection method change
hubspotCorsMethodSelect.addEventListener('change', (e) => {
  proxyUrlGroup.style.display = e.target.value === 'proxy' ? 'block' : 'none';
});

// Save settings button event
saveSettingsBtn.addEventListener('click', () => {
  saveHubSpotSettings();
  settingsPanel.style.display = 'none';
  toggleSettingsBtn.classList.remove('btn-primary');
  toggleSettingsBtn.classList.add('btn-secondary');
});

// Load settings on startup
document.addEventListener('DOMContentLoaded', () => {
  loadHubSpotSettings();
});

// Form Input Elements
const fields = {
  empresa: document.getElementById('empresa'),
  contacto: document.getElementById('contacto'),
  mail: document.getElementById('mail'),
  dominio: document.getElementById('dominio'),
  telf: document.getElementById('telf'),
  ref: document.getElementById('ref'),
  presupuesto: document.getElementById('presupuesto'),
  cint: document.getElementById('cint'),
  obra: document.getElementById('obra'),
  fecha: document.getElementById('fecha'),
  fecha_vencimiento: document.getElementById('fecha_vencimiento'),
  metros: document.getElementById('metros'),
  total: document.getElementById('total'),
  observaciones: document.getElementById('observaciones'),
  condiciones: document.getElementById('condiciones'),
  entrega: document.getElementById('entrega'),
  forma_pago: document.getElementById('forma_pago'),
  mano_obra: document.getElementById('mano_obra'),
  mayores_costos: document.getElementById('mayores_costos'),
  validez: document.getElementById('validez')
};

// Drag and Drop Event Listeners
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === 'application/pdf') {
    processPDF(files[0]);
  } else {
    showToast('Por favor, arrastra un archivo PDF válido.', 'x-circle');
  }
});

// Click to Upload Event Listeners
browseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent dropzone click trigger
  fileInput.click();
});

dropzone.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    processPDF(e.target.files[0]);
  }
});

// Reset Button Event Listener
resetBtn.addEventListener('click', () => {
  pdfForm.reset();
  appContent.classList.remove('visible');
  dropzone.style.display = 'flex';
  fileInput.value = '';
  // Remove file details if any
  const existingDetails = dropzone.querySelector('.file-info');
  if (existingDetails) {
    existingDetails.remove();
  }
  showToast('Formulario restablecido.', 'info');
});

// Clipboard Action - Formatted Text
copyTextBtn.addEventListener('click', () => {
  let textData = `DATOS EXTRAÍDOS DEL PRESUPUESTO
-----------------------------------
Empresa: ${fields.empresa.value}
Nombre de contacto: ${fields.contacto.value}
Mail: ${fields.mail.value}
Dominio: ${fields.dominio.value}
Telf: ${fields.telf.value}
Ref: ${fields.ref.value}
Presupuesto: ${fields.presupuesto.value}
C.Int: ${fields.cint.value}
Obra: ${fields.obra.value}
Fecha de Emisión: ${fields.fecha.value}
Fecha de Vencimiento: ${fields.fecha_vencimiento.value}
Metros cuadrados: ${fields.metros.value}
Total: ${fields.total.value}
-----------------------------------
Observaciones:
${fields.observaciones.value}
-----------------------------------
Condiciones Generales:
${fields.condiciones.value}
-----------------------------------
Entrega: ${fields.entrega.value}
Forma de pago: ${fields.forma_pago.value}
Mano de obra: ${fields.mano_obra.value}
Mayores Costos: ${fields.mayores_costos.value}
Validez de la oferta: ${fields.validez.value}`;

  navigator.clipboard.writeText(textData)
    .then(() => showToast('Datos copiados en formato texto.', 'check-circle'))
    .catch(err => console.error('Error al copiar: ', err));
});

// Clipboard Action - JSON
copyJsonBtn.addEventListener('click', () => {
  const jsonData = {};
  Object.keys(fields).forEach(key => {
    jsonData[key] = fields[key].value;
  });

  navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
    .then(() => showToast('Datos copiados en formato JSON.', 'check-circle'))
    .catch(err => console.error('Error al copiar JSON: ', err));
});

// Sync with HubSpot Action
syncHubspotBtn.addEventListener('click', async () => {
  const token = hubspotTokenInput.value.trim();
  if (!token) {
    showToast('Por favor, ingresa tu token en la configuración de HubSpot.', 'alert-triangle');
    settingsPanel.style.display = 'block';
    toggleSettingsBtn.classList.remove('btn-secondary');
    toggleSettingsBtn.classList.add('btn-primary');
    hubspotTokenInput.focus();
    return;
  }

  const originalHtml = syncHubspotBtn.innerHTML;
  syncHubspotBtn.disabled = true;
  syncHubspotBtn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width: 18px; height: 18px;"></i> Sincronizando...`;
  lucide.createIcons();

  try {
    await syncToHubspot();
  } catch (error) {
    console.error('HubSpot Sync Flow Error:', error);
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      showToast('Error de conexión (CORS). Activa tu extensión CORS o configura un proxy.', 'alert-triangle');
    } else {
      showToast(`Error: ${error.message}`, 'alert-triangle');
    }
  } finally {
    syncHubspotBtn.disabled = false;
    syncHubspotBtn.innerHTML = originalHtml;
    lucide.createIcons();
  }
});

// Recompute expiration date dynamically when Fecha or Validez are modified by the user
function recomputeExpiration() {
  const fechaVal = fields.fecha.value.trim();
  const validezVal = fields.validez.value.trim();
  
  const dateMatch = fechaVal.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10) - 1;
    const year = parseInt(dateMatch[3], 10);
    
    // Check for valid Date components
    const docDate = new Date(year, month, day);
    if (!isNaN(docDate.getTime())) {
      const daysMatch = validezVal.match(/(\d+)\s*días/i);
      if (daysMatch) {
        const days = parseInt(daysMatch[1], 10);
        const expirationDate = new Date(docDate);
        expirationDate.setDate(docDate.getDate() + days);
        fields.fecha_vencimiento.value = formatDate(expirationDate);
      } else {
        fields.fecha_vencimiento.value = '';
      }
    } else {
      fields.fecha_vencimiento.value = '';
    }
  } else {
    fields.fecha_vencimiento.value = '';
  }
}

// Attach input listeners for dynamic updates
fields.fecha.addEventListener('input', recomputeExpiration);
fields.validez.addEventListener('input', recomputeExpiration);

// Core PDF processing function
function processPDF(file) {
  // Show file info in dropzone
  const existingDetails = dropzone.querySelector('.file-info');
  if (existingDetails) {
    existingDetails.remove();
  }

  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';
  fileInfo.innerHTML = `<i data-lucide="file-check2" style="width:16px;height:16px;"></i> <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>`;
  dropzone.appendChild(fileInfo);
  lucide.createIcons();

  // Show loader and hide form
  loaderContainer.style.display = 'flex';
  appContent.classList.remove('visible');

  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(this.result);
    try {
      // Load document using PDF.js
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = extractPageText(textContent);
        fullText += pageText + '\n';
      }

      console.log("Reconstructed PDF Text:\n", fullText);

      // Extract and populate fields
      const extractedData = extractFieldsFromText(fullText);
      populateForm(extractedData);

      // Hide dropzone and loader, then show form
      dropzone.style.display = 'none';
      loaderContainer.style.display = 'none';
      appContent.classList.add('visible');
      
      showToast('Campos extraídos con éxito!', 'check-circle');
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      loaderContainer.style.display = 'none';
      showToast('Error al parsear el PDF. Revisa la consola.', 'alert-triangle');
    }
  };
  
  reader.readAsArrayBuffer(file);
}

// Layout-aware text reconstruction from PDF.js tokens
function extractPageText(textContent) {
  const items = textContent.items;
  if (!items || items.length === 0) return '';

  const lines = [];

  for (const item of items) {
    const y = item.transform[5];
    const x = item.transform[4];

    // Find if a line exists close to this Y coordinate (threshold of 5 units)
    let foundLine = lines.find(line => Math.abs(line.y - y) < 5);

    if (foundLine) {
      foundLine.items.push({ x, text: item.str });
    } else {
      lines.push({
        y: y,
        items: [{ x, text: item.str }]
      });
    }
  }

  // Sort lines from top to bottom (Y descending)
  lines.sort((a, b) => b.y - a.y);

  // Combine items on each line sorted left to right (X ascending)
  const lineTexts = lines.map(line => {
    line.items.sort((a, b) => a.x - b.x);
    let lineStr = '';
    for (const item of line.items) {
      if (lineStr === '') {
        lineStr = item.text;
      } else {
        const needsSpace = !lineStr.endsWith(' ') && !item.text.startsWith(' ');
        lineStr += (needsSpace ? ' ' : '') + item.text;
      }
    }
    return lineStr;
  });

  return lineTexts.join('\n');
}

// Extract domain excluding common free providers
function extractDomain(email) {
  if (!email || !email.includes('@')) return '';
  const domain = email.split('@')[1].trim().toLowerCase();

  const freeDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com',
    'icloud.com', 'aol.com', 'zoho.com', 'protonmail.com', 'proton.me',
    'gmx.com', 'yandex.com', 'mail.com', 'yahoo.com.ar', 'hotmail.com.ar',
    'live.com.ar', 'outlook.com.ar', 'fibertel.com.ar', 'arnet.com.ar',
    'speedy.com.ar'
  ];

  if (freeDomains.includes(domain)) {
    return '';
  }
  return domain;
}

// Format date as DD/MM/YYYY
function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// Parsing patterns and regex applications
function extractFieldsFromText(text) {
  const extracted = {};

  // 1. Empresa / Cliente & Ref.
  const refLineMatch = text.match(/^(.*?)Ref\.:\s*(.*)$/m);
  if (refLineMatch) {
    let empresaRaw = refLineMatch[1].trim();
    extracted.empresa = empresaRaw.replace(/^(Sr\.|Sra\.|Sres\.|Sr|Sra|Sres)\b/i, '').trim();
    extracted.ref = refLineMatch[2].trim();
  } else {
    extracted.empresa = '';
    extracted.ref = '';
  }

  // 2. Nombre de contacto
  const contactMatch = text.match(/(?:Ate\.|Atn\.|Atención|Ate|At):\s*(.*?)(?=\s+Presupuesto|\s+N[º°o]|\s*N[º°o]|$)/i);
  extracted.contacto = contactMatch ? contactMatch[1].trim() : '';

  // 3. Presupuesto
  const budgetMatch = text.match(/Presupuesto\s*(?:Nº|N°|No\.?|N[oO])?\s*(\d+)/i);
  extracted.presupuesto = budgetMatch ? budgetMatch[1].trim() : '';

  // 4. Mail
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  extracted.mail = emailMatch ? emailMatch[0].trim() : '';

  // 5. Dominio
  extracted.dominio = extractDomain(extracted.mail);

  // 6. Telf
  const telfMatch = text.match(/(?:Tel|Teléfono|Telf|Telefono|Cel|Celular):\s*(.*?)(?=\s+C\.Int\.:|\s+Obra|\s+Mail|$)/i);
  extracted.telf = telfMatch ? telfMatch[1].trim() : '';

  // 7. C.Int.
  const cintMatch = text.match(/C\.Int\.:\s*([^\s]+)/i);
  extracted.cint = cintMatch ? cintMatch[1].trim() : '';

  // 8. Obra
  const obraMatch = text.match(/Obra:\s*(.*)/i);
  extracted.obra = obraMatch ? obraMatch[1].trim() : '';

  // 9. Metros cuadrados
  const metrosMatch = text.match(/(?:m²|m2)\s+([\d.,]+)/i);
  extracted.metros = metrosMatch ? metrosMatch[1].trim() : '';

  // 10. Total
  const totalMatch = text.match(/(\$[\d,.]+)\s*\n\s*OBSERVACIONES/i) || text.match(/TOTAL\s*\n\s*(\$[\d,.]+)/i) || text.match(/TOTAL[:\s]+(\$[\d,.]+)/i);
  extracted.total = totalMatch ? totalMatch[1].trim() : '';

  // 11. Observaciones
  const obsMatch = text.match(/OBSERVACIONES\s*\n([\s\S]*?)(?=\n\s*CONDICIONES GENERALES|$)/i);
  extracted.observaciones = obsMatch ? obsMatch[1].trim() : '';

  // 12. Condiciones Generales
  const condMatch = text.match(/CONDICIONES GENERALES\s*\n([\s\S]*?)(?=\n\s*TOTAL|\n\s*PROPUESTA COMERCIAL|\n\s*Oficina:|$)/i);
  extracted.condiciones = condMatch ? condMatch[1].trim() : '';

  // 13. Entrega
  const entregaMatch = text.match(/Entrega:\s*(.*)/i);
  extracted.entrega = entregaMatch ? entregaMatch[1].trim() : '';

  // 14. Forma de pago
  const fpMatch = text.match(/Forma de Pago:\s*(.*)/i);
  extracted.forma_pago = fpMatch ? fpMatch[1].trim() : '';

  // 15. Mano de obra
  const moMatch = text.match(/Mano de obra:\s*(.*)/i);
  extracted.mano_obra = moMatch ? moMatch[1].trim() : '';

  // 16. Mayores costos
  const mcMatch = text.match(/Mayores Costos:\s*(.*)/i);
  extracted.mayores_costos = mcMatch ? mcMatch[1].trim() : '';

  // 17. Validez de la oferta
  const valMatch = text.match(/Validez de la oferta:\s*(.*)/i);
  extracted.validez = valMatch ? valMatch[1].trim() : '';

  // 18. Fecha del documento
  console.log("Parsing Date from raw text...");
  
  // Try lenient Spanish date match first (no \b boundaries which can be problematic in JS with non-ASCII or comma context)
  let dateMatch = text.match(/(\d{1,2})\s+de\s+([a-zA-ZáéíóúñÑ]+)\s+de\s+(\d{4})/i);
  let parsedDocDate = null;
  
  if (dateMatch) {
    console.log("Spanish Date Match Found:", dateMatch[0]);
    const day = parseInt(dateMatch[1], 10);
    const monthNames = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };
    const monthKey = dateMatch[2].toLowerCase().trim();
    if (monthNames.hasOwnProperty(monthKey)) {
      const month = monthNames[monthKey];
      const year = parseInt(dateMatch[3], 10);
      parsedDocDate = new Date(year, month, day);
      extracted.fecha = formatDate(parsedDocDate);
    } else {
      console.log("Matched word is not a valid month:", monthKey);
    }
  }

  // Fallback to DD/MM/YYYY or YYYY-MM-DD
  if (!parsedDocDate) {
    const standardDateMatch = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/) || text.match(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/);
    if (standardDateMatch) {
      console.log("Standard Date Match Found:", standardDateMatch[0]);
      let day, month, year;
      if (standardDateMatch[3].length === 4) {
        day = parseInt(standardDateMatch[1], 10);
        month = parseInt(standardDateMatch[2], 10) - 1;
        year = parseInt(standardDateMatch[3], 10);
      } else {
        year = parseInt(standardDateMatch[1], 10);
        month = parseInt(standardDateMatch[2], 10) - 1;
        day = parseInt(standardDateMatch[3], 10);
      }
      const testDate = new Date(year, month, day);
      if (!isNaN(testDate.getTime())) {
        parsedDocDate = testDate;
        extracted.fecha = formatDate(parsedDocDate);
      }
    }
  }

  if (!parsedDocDate) {
    console.log("No date detected.");
    extracted.fecha = '';
  }

  // 19. Fecha de vencimiento
  if (parsedDocDate && extracted.validez) {
    const daysMatch = extracted.validez.match(/(\d+)\s*días/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      const expirationDate = new Date(parsedDocDate);
      expirationDate.setDate(parsedDocDate.getDate() + days);
      extracted.fecha_vencimiento = formatDate(expirationDate);
      console.log("Expiration calculated successfully:", extracted.fecha_vencimiento);
    } else {
      console.log("Could not parse days from validez:", extracted.validez);
      extracted.fecha_vencimiento = '';
    }
  } else {
    extracted.fecha_vencimiento = '';
  }

  return extracted;
}

// Populate UI Form Fields
function populateForm(data) {
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      fields[key].value = data[key] || '';
    }
  });
}

// Show Toast feedback
function showToast(message, iconName = 'check-circle') {
  toastMessage.textContent = message;
  
  // Re-generate icon inside toast
  const iconContainer = toast.querySelector('.toast-icon');
  iconContainer.innerHTML = `<i data-lucide="${iconName}" style="width:20px;height:20px;"></i>`;
  lucide.createIcons();

  // Style customization based on type
  if (iconName === 'x-circle' || iconName === 'alert-triangle') {
    toast.style.borderColor = 'var(--danger-color)';
    iconContainer.style.color = 'var(--danger-color)';
  } else if (iconName === 'info') {
    toast.style.borderColor = 'var(--accent-color)';
    iconContainer.style.color = 'var(--accent-color)';
  } else {
    toast.style.borderColor = 'var(--success-color)';
    iconContainer.style.color = 'var(--success-color)';
  }

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Clean and normalize company name for comparison
function normalizeCompanyName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
    .replace(/\b(s\s*a|s\s*r\s*l|s\s*a\s*s|ltda|inc|co|corp|fideicomiso|fideicomisos)\b/gi, '') // Suffixes
    .replace(/\s+/g, ' ')
    .trim();
}

// Clean money/currency format to a raw float string
function cleanAmount(amountStr) {
  if (!amountStr) return 0;
  let clean = amountStr.replace(/[^0-9.,]/g, '');
  if (clean.includes(',') && clean.includes('.')) {
    if (clean.indexOf(',') < clean.indexOf('.')) {
      clean = clean.replace(/,/g, '');
    } else {
      clean = clean.replace(/\./g, '').replace(/,/g, '.');
    }
  } else if (clean.includes(',')) {
    const parts = clean.split(',');
    if (parts[parts.length - 1].length === 2) {
      clean = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes('.')) {
    const parts = clean.split('.');
    if (parts[parts.length - 1].length === 3) {
      clean = clean.replace(/\./g, '');
    }
  }
  return parseFloat(clean) || 0;
}

// Helper for making API calls to HubSpot through optional proxy
async function apiCall(endpoint, options = {}) {
  const token = hubspotTokenInput.value.trim();
  const corsMethod = hubspotCorsMethodSelect.value;
  const proxyUrl = hubspotProxyUrlInput.value.trim();
  
  let url = `https://api.hubapi.com${endpoint}`;
  if (corsMethod === 'proxy' && proxyUrl) {
    const formattedProxy = proxyUrl.endsWith('/') ? proxyUrl : proxyUrl + '/';
    url = `${formattedProxy}https://api.hubapi.com${endpoint}`;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };
  
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const errText = await response.text();
    let errJson = {};
    try { errJson = JSON.parse(errText); } catch(e) {}
    const errMsg = errJson.message || `HTTP error ${response.status}`;
    throw new Error(errMsg);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
}

// Main HubSpot Sync Flow
async function syncToHubspot() {
  let companyId = null;
  let contactId = null;
  
  const empresaVal = fields.empresa.value.trim();
  const mailVal = fields.mail.value.trim();
  const contactoVal = fields.contacto.value.trim();
  const telfVal = fields.telf.value.trim();
  const dominioVal = fields.dominio.value.trim();
  
  // 1. Search or Create Company
  if (empresaVal) {
    console.log("HubSpot Sync: Searching for company...", empresaVal);
    const normName = normalizeCompanyName(empresaVal);
    let foundCompany = null;
    
    // Step A: Search by domain if present
    if (dominioVal) {
      try {
        const domainSearchResult = await apiCall('/crm/v3/objects/companies/search', {
          method: 'POST',
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'domain',
                operator: 'EQ',
                value: dominioVal
              }]
            }],
            properties: ['name', 'domain']
          })
        });
        if (domainSearchResult && domainSearchResult.results.length > 0) {
          foundCompany = domainSearchResult.results[0];
          console.log("HubSpot Sync: Company found by domain:", foundCompany);
        }
      } catch (e) {
        console.warn("Domain search failed, falling back to name search:", e);
      }
    }
    
    // Step B: Search by name if not found by domain
    if (!foundCompany && normName) {
      const nameSearchResult = await apiCall('/crm/v3/objects/companies/search', {
        method: 'POST',
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'name',
              operator: 'CONTAINS_TOKEN',
              value: normName
            }]
          }],
          properties: ['name', 'domain']
        })
      });
      
      if (nameSearchResult && nameSearchResult.results.length > 0) {
        foundCompany = nameSearchResult.results.find(c => {
          return normalizeCompanyName(c.properties.name) === normName;
        });
        if (foundCompany) {
          console.log("HubSpot Sync: Company found by name matching:", foundCompany);
        }
      }
    }
    
    if (foundCompany) {
      companyId = foundCompany.id;
    } else {
      // Step C: Create Company
      console.log("HubSpot Sync: Company not found. Creating company...", empresaVal);
      const companyCreateResult = await apiCall('/crm/v3/objects/companies', {
        method: 'POST',
        body: JSON.stringify({
          properties: {
            name: empresaVal,
            domain: dominioVal
          }
        })
      });
      companyId = companyCreateResult.id;
      console.log("HubSpot Sync: Company created successfully with ID:", companyId);
    }
  }

  // 2. Search or Create Contact
  if (mailVal) {
    console.log("HubSpot Sync: Searching for contact by email...", mailVal);
    const contactSearchResult = await apiCall('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: mailVal
          }]
        }],
        properties: ['firstname', 'lastname', 'email']
      })
    });
    
    if (contactSearchResult && contactSearchResult.results.length > 0) {
      contactId = contactSearchResult.results[0].id;
      console.log("HubSpot Sync: Contact found with ID:", contactId);
    } else {
      // Create Contact
      console.log("HubSpot Sync: Contact not found. Creating contact...", mailVal);
      let firstname = contactoVal || 'Contacto Presupuesto';
      let lastname = '';
      const spaceIdx = contactoVal.indexOf(' ');
      if (spaceIdx > 0) {
        firstname = contactoVal.substring(0, spaceIdx);
        lastname = contactoVal.substring(spaceIdx + 1);
      }
      
      const contactCreateResult = await apiCall('/crm/v3/objects/contacts', {
        method: 'POST',
        body: JSON.stringify({
          properties: {
            email: mailVal,
            firstname: firstname,
            lastname: lastname,
            phone: telfVal
          }
        })
      });
      contactId = contactCreateResult.id;
      console.log("HubSpot Sync: Contact created successfully with ID:", contactId);
    }
  }

  // 3. Associate Contact to Company (if both exist)
  if (contactId && companyId) {
    console.log(`HubSpot Sync: Associating Contact (${contactId}) to Company (${companyId})...`);
    await apiCall(`/crm/v3/objects/contacts/${contactId}/associations/companies/${companyId}/contact_to_company`, {
      method: 'PUT'
    });
    console.log("HubSpot Sync: Contact and Company associated.");
  }

  // 4. Create Deal
  console.log("HubSpot Sync: Creating deal...");
  const presupuestoNum = fields.presupuesto.value.trim() || 'S/N';
  const empresaName = fields.empresa.value.trim();
  const obraVal = fields.obra.value.trim();
  const refVal = fields.ref.value.trim();
  
  let dealName = `Presupuesto Nº ${presupuestoNum}`;
  if (empresaName) dealName += ` - ${empresaName}`;
  if (obraVal) {
    dealName += ` - ${obraVal}`;
  } else if (refVal) {
    dealName += ` - ${refVal}`;
  }
  
  const amountVal = cleanAmount(fields.total.value);
  const pipelineVal = hubspotPipelineInput.value.trim() || 'default';
  const stageVal = hubspotStageInput.value.trim() || 'appointmentscheduled';
  
  const dealCreateResult = await apiCall('/crm/v3/objects/deals', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        dealname: dealName,
        amount: amountVal.toString(),
        dealstage: stageVal,
        pipeline: pipelineVal
      }
    })
  });
  
  const dealId = dealCreateResult.id;
  console.log("HubSpot Sync: Deal created successfully with ID:", dealId);

  // 5. Associate Deal to Company
  if (dealId && companyId) {
    console.log(`HubSpot Sync: Associating Deal (${dealId}) to Company (${companyId})...`);
    await apiCall(`/crm/v3/objects/deals/${dealId}/associations/companies/${companyId}/deal_to_company`, {
      method: 'PUT'
    });
  }

  // 6. Associate Deal to Contact
  if (dealId && contactId) {
    console.log(`HubSpot Sync: Associating Deal (${dealId}) to Contact (${contactId})...`);
    await apiCall(`/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/deal_to_contact`, {
      method: 'PUT'
    });
  }

  showToast('Sincronizado con HubSpot con éxito!', 'check-circle');
}
