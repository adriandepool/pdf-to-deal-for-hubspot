// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const loaderContainer = document.getElementById('loader-container');
const loaderText = document.getElementById('loader-text');
const appContent = document.getElementById('app-content');
const pdfForm = document.getElementById('pdf-form');
const resetBtn = document.getElementById('reset-btn');
const copyTextBtn = document.getElementById('copy-text-btn');
const copyJsonBtn = document.getElementById('copy-json-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Excel and Sidebar DOM Elements
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const excelInput = document.getElementById('excel-input');
const btnSelectExcel = document.getElementById('btn-select-excel');
const excelFilename = document.getElementById('excel-filename');
const excelSheetSelect = document.getElementById('excel-sheet-select');
const pdfList = document.getElementById('pdf-list');
const pdfListContainer = document.getElementById('pdf-list-container');
const exportExcelBtn = document.getElementById('export-excel-btn');

// App State
let processedPDFs = [];
let activePDFId = null;
let selectedExcelFile = null;
let excelWorkbook = null;
let selectedSheetName = "";

// Safe LocalStorage wrapper to handle cases where browser tracking protection blocks access
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access blocked by browser settings:", e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage write blocked by browser settings:", e);
    }
  }
};

// Load Excel Settings from storage (Sheet name selection preference)
function loadExcelSettings() {
  const savedSheet = safeStorage.getItem('excel_sheet_name') || '';
  if (savedSheet && excelWorkbook) {
    const sheetExists = excelWorkbook.worksheets.some(w => w.name === savedSheet);
    if (sheetExists) {
      excelSheetSelect.value = savedSheet;
      selectedSheetName = savedSheet;
    }
  }
}

// Select Excel File trigger
btnSelectExcel.addEventListener('click', () => {
  excelInput.click();
});

// Parse Excel File on Selection using ExcelJS
excelInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  selectedExcelFile = file;
  excelFilename.textContent = "Cargando archivo...";
  excelSheetSelect.disabled = true;
  excelSheetSelect.innerHTML = '<option value="">Cargando hojas...</option>';

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const buffer = evt.target.result;
      excelWorkbook = new ExcelJS.Workbook();
      await excelWorkbook.xlsx.load(buffer);
      
      const sheetNames = excelWorkbook.worksheets.map(w => w.name);
      
      // Populate sheets dropdown
      excelSheetSelect.innerHTML = '';
      sheetNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        excelSheetSelect.appendChild(option);
      });
      excelSheetSelect.disabled = false;

      // Select first sheet by default or restore from storage
      const savedSheet = safeStorage.getItem('excel_sheet_name');
      if (savedSheet && sheetNames.includes(savedSheet)) {
        excelSheetSelect.value = savedSheet;
      } else if (sheetNames.length > 0) {
        excelSheetSelect.value = sheetNames[0];
      }
      selectedSheetName = excelSheetSelect.value;
      
      excelFilename.textContent = `${file.name} (${sheetNames.length} hojas)`;
      showToast('Archivo Excel cargado correctamente.', 'check-circle');
    } catch (err) {
      console.error("Error reading Excel:", err);
      excelFilename.textContent = "Error al cargar archivo.";
      excelSheetSelect.disabled = true;
      excelSheetSelect.innerHTML = '<option value="">Error</option>';
      showToast('Error al parsear el archivo Excel.', 'x-circle');
    }
  };
  
  reader.onerror = () => {
    excelFilename.textContent = "Error de lectura.";
    showToast('No se pudo leer el archivo Excel.', 'x-circle');
  };
  
  reader.readAsArrayBuffer(file);
});

// Sheet Selection Change
excelSheetSelect.addEventListener('change', (e) => {
  selectedSheetName = e.target.value;
  safeStorage.setItem('excel_sheet_name', selectedSheetName);
});

// Toggle Excel settings panel visibility
toggleSettingsBtn.addEventListener('click', () => {
  const isHidden = settingsPanel.style.display === 'none';
  settingsPanel.style.display = isHidden ? 'block' : 'none';
  toggleSettingsBtn.classList.toggle('btn-primary', isHidden);
  toggleSettingsBtn.classList.toggle('btn-secondary', !isHidden);
});

// Save settings button event
saveSettingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
  toggleSettingsBtn.classList.remove('btn-primary');
  toggleSettingsBtn.classList.add('btn-secondary');
  showToast('Configuración guardada.', 'check-circle');
});

// Load settings on startup
document.addEventListener('DOMContentLoaded', () => {
  loadExcelSettings();
});

// Toggle Optional Fields Section
const toggleOptionalBtn = document.getElementById('toggle-optional-btn');
const optionalContent = document.getElementById('optional-content');
const optionalChevron = document.getElementById('optional-chevron');

if (toggleOptionalBtn && optionalContent && optionalChevron) {
  toggleOptionalBtn.addEventListener('click', () => {
    const isHidden = optionalContent.style.display === 'none';
    optionalContent.style.display = isHidden ? 'block' : 'none';
    optionalChevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  });
}

// Form Input Elements
const fields = {
  // Excel core fields
  estado: document.getElementById('estado'),
  orden: document.getElementById('orden'),
  fecha: document.getElementById('fecha'),
  presupuesto: document.getElementById('presupuesto'),
  metros: document.getElementById('metros'),
  material: document.getElementById('material'),
  empresa: document.getElementById('empresa'),
  obra: document.getElementById('obra'),
  contacto: document.getElementById('contacto'),
  mail: document.getElementById('mail'),
  telf: document.getElementById('telf'),
  objetivo: document.getElementById('objetivo'),
  detalle: document.getElementById('detalle'),
  fecha_resultados: document.getElementById('fecha_resultados'),

  // Optional fields
  dominio: document.getElementById('dominio'),
  ref: document.getElementById('ref'),
  cint: document.getElementById('cint'),
  fecha_vencimiento: document.getElementById('fecha_vencimiento'),
  total: document.getElementById('total'),
  entrega: document.getElementById('entrega'),
  forma_pago: document.getElementById('forma_pago'),
  mano_obra: document.getElementById('mano_obra'),
  mayores_costos: document.getElementById('mayores_costos'),
  validez: document.getElementById('validez'),
  observaciones: document.getElementById('observaciones'),
  condiciones: document.getElementById('condiciones')
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
  const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
  if (files.length > 0) {
    processMultiplePDFs(files);
  } else {
    showToast('Por favor, arrastra archivos PDF válidos.', 'x-circle');
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
  const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
  if (files.length > 0) {
    processMultiplePDFs(files);
  }
});

// Reset Button Event Listener
resetBtn.addEventListener('click', () => {
  pdfForm.reset();
  processedPDFs = [];
  activePDFId = null;
  renderPDFList();
  appContent.classList.remove('visible');
  dropzone.style.display = 'flex';
  fileInput.value = '';
  // Remove file details if any
  const existingDetails = dropzone.querySelector('.file-info');
  if (existingDetails) {
    existingDetails.remove();
  }
  showToast('Formulario y listado restablecidos.', 'info');
});

// Clipboard Action - Formatted Text
copyTextBtn.addEventListener('click', () => {
  if (!activePDFId) {
    showToast('No hay ningún presupuesto seleccionado.', 'alert-triangle');
    return;
  }
  
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
  if (!activePDFId) {
    showToast('No hay ningún presupuesto seleccionado.', 'alert-triangle');
    return;
  }

  const jsonData = {};
  Object.keys(fields).forEach(key => {
    jsonData[key] = fields[key].value;
  });

  navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
    .then(() => showToast('Datos copiados en formato JSON.', 'check-circle'))
    .catch(err => console.error('Error al copiar JSON: ', err));
});

// Save Form Data to Active State Reactively
Object.keys(fields).forEach(key => {
  if (fields[key]) {
    fields[key].addEventListener('input', () => {
      if (activePDFId) {
        const record = processedPDFs.find(p => p.id === activePDFId);
        if (record && record.status === 'success') {
          record.data[key] = fields[key].value;
          
          // Re-render list item if metadata properties change
          if (key === 'empresa' || key === 'total') {
            renderPDFList();
          }
        }
      }
    });
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
        const formattedExp = formatDate(expirationDate);
        fields.fecha_vencimiento.value = formattedExp;
        fields.fecha_resultados.value = formattedExp;
        
        // Save to active state
        if (activePDFId) {
          const record = processedPDFs.find(p => p.id === activePDFId);
          if (record && record.status === 'success') {
            record.data.fecha_vencimiento = formattedExp;
            record.data.fecha_resultados = formattedExp;
          }
        }
        return;
      }
    }
  }

  // Clear if invalid or not computed
  fields.fecha_vencimiento.value = '';
  fields.fecha_resultados.value = '';
  if (activePDFId) {
    const record = processedPDFs.find(p => p.id === activePDFId);
    if (record && record.status === 'success') {
      record.data.fecha_vencimiento = '';
      record.data.fecha_resultados = '';
    }
  }
}

// Attach input listeners for dynamic updates
fields.fecha.addEventListener('input', recomputeExpiration);
fields.validez.addEventListener('input', recomputeExpiration);

// Process Multiple PDFs Flow
function processMultiplePDFs(files) {
  // Hide dropzone, show workspace
  dropzone.style.display = 'none';
  appContent.classList.add('visible');

  files.forEach(file => {
    const id = 'pdf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const record = {
      id: id,
      name: file.name,
      size: file.size,
      status: 'loading',
      data: {
        estado: 'Sin Definir', orden: '', fecha: '', presupuesto: '', metros: '', material: '',
        empresa: '', obra: '', contacto: '', mail: '', telf: '', objetivo: '', detalle: '', fecha_resultados: '',
        dominio: '', ref: '', cint: '', fecha_vencimiento: '', total: '', entrega: '',
        forma_pago: '', mano_obra: '', mayores_costos: '', validez: '', observaciones: '', condiciones: ''
      }
    };
    
    processedPDFs.push(record);
    parseSinglePDF(file, id);
  });

  renderPDFList();

  // If no active PDF, select the first newly added one
  if (!activePDFId && processedPDFs.length > 0) {
    activePDFId = processedPDFs[processedPDFs.length - files.length].id;
    selectPDF(activePDFId);
  }
}

// Parse a single PDF document in the background
function parseSinglePDF(file, id) {
  const reader = new FileReader();
  reader.onload = async function () {
    const typedarray = new Uint8Array(this.result);
    try {
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = extractPageText(textContent);
        fullText += pageText + '\n';
      }

      const extractedData = extractFieldsFromText(fullText);
      
      const record = processedPDFs.find(p => p.id === id);
      if (record) {
        record.status = 'success';
        record.data = { ...record.data, ...extractedData };
        
        renderPDFList();
        
        if (activePDFId === id) {
          populateForm(record.data);
          toggleFormInputs(false);
        }
      }
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      const record = processedPDFs.find(p => p.id === id);
      if (record) {
        record.status = 'error';
        record.errorMsg = error.message || 'Error al parsear el archivo';
        renderPDFList();
        if (activePDFId === id) {
          toggleFormInputs(true);
          showToast(`Error al procesar ${file.name}`, 'x-circle');
        }
      }
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
  const contactMatch = text.match(/(?:Ate\.|Atn\.|Atención|Ate|At):\s*(.*?)(?=\s+Presupuesto|\s+N[º°o]|\s*N[º°o]|\r?\n|$)/i);
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
  const telfMatch = text.match(/(?:Tel|Teléfono|Telf|Telefono|Cel|Celular):\s*(.*?)(?=\s+C\.\s*Int\.:|\s+Obra|\s+Mail|\r?\n|$)/i);
  extracted.telf = telfMatch ? telfMatch[1].trim() : '';

  // 7. C.Int.
  const cintMatch = text.match(/C\.\s*Int\.:\s*([^\s]+)/i);
  extracted.cint = cintMatch ? cintMatch[1].trim() : '';

  // 8. Obra
  const obraMatch = text.match(/Obra:\s*(.*)/i);
  extracted.obra = obraMatch ? obraMatch[1].trim() : '';

  // 9. Metros cuadrados y Material (desde la línea del item de m2)
  let materialExtracted = '';
  let metrosExtracted = '';
  const lines = text.split('\n');
  const itemRegex = /^(?:\d+[\s\.\-]*)?(.*?)\b(?:m²|m2)\s+([\d.,]+)\s+.*$/i;
  
  for (const line of lines) {
    const match = line.match(itemRegex);
    if (match) {
      materialExtracted = match[1].trim();
      metrosExtracted = match[2].trim();
      break;
    }
  }

  extracted.material = materialExtracted;
  if (metrosExtracted) {
    extracted.metros = metrosExtracted;
  } else {
    const metrosMatch = text.match(/(?:m²|m2)\s+([\d.,]+)/i);
    extracted.metros = metrosMatch ? metrosMatch[1].trim() : '';
  }

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
  let dateMatch = text.match(/(\d{1,2})\s+de\s+([a-zA-ZáéíóúñÑ]+)\s+de\s+(\d{4})/i);
  let parsedDocDate = null;
  
  if (dateMatch) {
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
    }
  }

  // Fallback to DD/MM/YYYY or YYYY-MM-DD
  if (!parsedDocDate) {
    const standardDateMatch = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/) || text.match(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/);
    if (standardDateMatch) {
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
    } else {
      extracted.fecha_vencimiento = '';
    }
  } else {
    extracted.fecha_vencimiento = '';
  }

  // Populate fecha_resultados with computed expiration date
  extracted.fecha_resultados = extracted.fecha_vencimiento;

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

// Disable/enable form inputs
function toggleFormInputs(disabled) {
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      fields[key].disabled = disabled;
    }
  });
  copyTextBtn.disabled = disabled;
  copyJsonBtn.disabled = disabled;
}

// Sidebar PDF List Render
function renderPDFList() {
  pdfList.innerHTML = '';
  if (processedPDFs.length === 0) {
    pdfList.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 2rem 0; font-size: 0.9rem;">Ningún PDF cargado</div>';
    return;
  }

  processedPDFs.forEach(pdf => {
    const item = document.createElement('div');
    item.className = `pdf-item status-${pdf.status}`;
    if (pdf.id === activePDFId) {
      item.classList.add('active');
    }

    let iconName = 'loader-2';
    if (pdf.status === 'success') {
      iconName = 'check-circle';
    } else if (pdf.status === 'error') {
      iconName = 'alert-triangle';
    }

    const metaEmpresa = pdf.status === 'success' ? (pdf.data.empresa || 'Empresa sin nombre') : (pdf.status === 'loading' ? 'Procesando...' : 'Error de lectura');
    const metaTotal = pdf.status === 'success' ? (pdf.data.total || '') : '';

    item.innerHTML = `
      <div class="pdf-status-icon">
        <i data-lucide="${iconName}" style="width: 16px; height: 16px;" class="${pdf.status === 'loading' ? 'spin' : ''}"></i>
      </div>
      <div class="pdf-item-content">
        <div class="pdf-item-title" title="${pdf.name}">${pdf.name}</div>
        <div class="pdf-item-meta">
          <span>${metaEmpresa}</span>
          ${metaTotal ? `• <span>${metaTotal}</span>` : ''}
        </div>
      </div>
      <button type="button" class="btn-remove-pdf" title="Remover de la lista">
        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    // Click selector
    item.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-pdf')) return;
      selectPDF(pdf.id);
    });

    // Remove event
    const removeBtn = item.querySelector('.btn-remove-pdf');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removePDF(pdf.id);
    });

    pdfList.appendChild(item);
  });

  lucide.createIcons();
}

// Select active PDF and fill form
function selectPDF(id) {
  activePDFId = id;
  
  // Highlight in sidebar list
  const items = pdfList.querySelectorAll('.pdf-item');
  processedPDFs.forEach((pdf, index) => {
    const item = items[index];
    if (item) {
      if (pdf.id === id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    }
  });

  const record = processedPDFs.find(p => p.id === id);
  if (record) {
    if (record.status === 'success') {
      populateForm(record.data);
      toggleFormInputs(false);
    } else if (record.status === 'loading') {
      pdfForm.reset();
      toggleFormInputs(true);
      showToast('Cargando datos...', 'info');
    } else {
      pdfForm.reset();
      toggleFormInputs(true);
      showToast('Documento con error.', 'x-circle');
    }
  }
}

// Remove a PDF from the list
function removePDF(id) {
  const index = processedPDFs.findIndex(p => p.id === id);
  if (index === -1) return;

  processedPDFs.splice(index, 1);

  if (activePDFId === id) {
    if (processedPDFs.length > 0) {
      const nextIdx = Math.min(index, processedPDFs.length - 1);
      activePDFId = processedPDFs[nextIdx].id;
      selectPDF(activePDFId);
    } else {
      activePDFId = null;
      pdfForm.reset();
      dropzone.style.display = 'flex';
      appContent.classList.remove('visible');
      fileInput.value = '';
    }
  }

  renderPDFList();
  showToast('Presupuesto removido de la lista.', 'info');
}

// Show Toast feedback
function showToast(message, iconName = 'check-circle') {
  toastMessage.textContent = message;
  
  const iconContainer = toast.querySelector('.toast-icon');
  iconContainer.innerHTML = `<i data-lucide="${iconName}" style="width:20px;height:20px;"></i>`;
  lucide.createIcons();

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

// Append new records to selected sheet in existing workbook intelligently by modifying cells
function appendToWorkbook(workbook, sheetName, newRecords) {
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
  }

  // Find the first empty row starting from row 5 (index 4) where core fields are empty
  let r = 5;
  while (r <= 10000) {
    const cellFecha = sheet.getCell(`C${r}`);
    const cellEmpresa = sheet.getCell(`G${r}`);
    const cellPresupuesto = sheet.getCell(`D${r}`);

    const isFechaEmpty = !cellFecha.value;
    const isEmpresaEmpty = !cellEmpresa.value;
    const isPresupuestoEmpty = !cellPresupuesto.value;

    if (isFechaEmpty && isEmpresaEmpty && isPresupuestoEmpty) {
      break;
    }
    r++;
  }

  console.log(`Guardando nuevos registros a partir de la fila ${r}`);

  const colMapping = {
    estado: 'A',
    orden: 'B',
    fecha: 'C',
    presupuesto: 'D',
    metros: 'E',
    material: 'F',
    empresa: 'G',
    obra: 'H',
    contacto: 'I',
    mail: 'J',
    telf: 'K',
    objetivo: 'L',
    detalle: 'M',
    fecha_resultados: 'N'
  };

  newRecords.forEach((record, index) => {
    const currentRow = r + index;

    // Calculate sequential order number (Orden) automatically
    let orderValue = "";
    if (currentRow > 5) {
      const prevCell = sheet.getCell(`B${currentRow - 1}`);
      if (prevCell && prevCell.value && !isNaN(parseInt(prevCell.value))) {
        orderValue = parseInt(prevCell.value) + 1;
      } else {
        orderValue = currentRow - 4;
      }
    } else {
      orderValue = 1;
    }

    const dataWithOrder = {
      ...record,
      orden: orderValue,
      estado: record.estado || "Sin Definir"
    };

    // Write columns A to N into cells directly
    Object.keys(colMapping).forEach(key => {
      const col = colMapping[key];
      const cell = sheet.getCell(`${col}${currentRow}`);
      const val = dataWithOrder[key] || "";
      cell.value = val;
    });

    // Write DAYS formula in column O: =DAYS(TODAY(), N<row>) if empty
    const cellO = sheet.getCell(`O${currentRow}`);
    if (!cellO.value) {
      cellO.value = { formula: `DAYS(TODAY(),N${currentRow})` };
    }
  });
}

// Trigger Excel Export Action using ExcelJS
exportExcelBtn.addEventListener('click', async () => {
  const successRecords = processedPDFs.filter(p => p.status === 'success');
  if (successRecords.length === 0) {
    showToast('No hay presupuestos cargados correctamente para exportar.', 'alert-triangle');
    return;
  }

  const originalHtml = exportExcelBtn.innerHTML;
  exportExcelBtn.disabled = true;
  exportExcelBtn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width: 18px; height: 18px;"></i> Exportando...`;
  lucide.createIcons();

  try {
    let wb;
    let fileName = "presupuestos_extraidos.xlsx";

    if (excelWorkbook && selectedSheetName) {
      wb = excelWorkbook;
      fileName = selectedExcelFile.name;
      appendToWorkbook(wb, selectedSheetName, successRecords.map(r => r.data));
    } else {
      // Create new workbook if no template was selected
      wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Presupuestos");
      const fieldsMeta = [
        { key: 'estado', header: 'Estado' },
        { key: 'orden', header: 'Orden' },
        { key: 'fecha', header: 'Fecha' },
        { key: 'presupuesto', header: 'Nº de Presupuesto' },
        { key: 'metros', header: 'M2' },
        { key: 'material', header: 'Material' },
        { key: 'empresa', header: 'Nombre y/o Empresa' },
        { key: 'obra', header: 'Zona de Obra' },
        { key: 'contacto', header: 'Contacto' },
        { key: 'mail', header: 'Email' },
        { key: 'telf', header: 'Teléfono' },
        { key: 'objetivo', header: 'Objetivo Próxima Gestión' },
        { key: 'detalle', header: 'Detalle/ Resultados' },
        { key: 'fecha_resultados', header: 'Fecha de Resultados' },
        
        // Optional fields added to a new spreadsheet
        { key: 'dominio', header: 'Dominio Corporativo' },
        { key: 'ref', header: 'Referencia' },
        { key: 'cint', header: 'C.Int.' },
        { key: 'fecha_vencimiento', header: 'Fecha de Vencimiento' },
        { key: 'total', header: 'Total del Presupuesto' },
        { key: 'entrega', header: 'Entrega' },
        { key: 'forma_pago', header: 'Forma de Pago' },
        { key: 'mano_obra', header: 'Mano de Obra' },
        { key: 'mayores_costos', header: 'Mayores Costos' },
        { key: 'validez', header: 'Validez de la Oferta' },
        { key: 'observaciones', header: 'Observaciones' },
        { key: 'condiciones', header: 'Condiciones Generales' }
      ];

      ws.columns = fieldsMeta.map(meta => ({ header: meta.header, key: meta.key }));

      successRecords.forEach((r, idx) => {
        const recordData = {
          ...r.data,
          orden: idx + 1
        };
        ws.addRow(recordData);
      });
    }

    // Write buffer using ExcelJS
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    showToast('Datos exportados e incorporados al Excel con éxito.', 'check-circle');
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    showToast(`Error al exportar: ${error.message}`, 'x-circle');
  } finally {
    exportExcelBtn.disabled = false;
    exportExcelBtn.innerHTML = originalHtml;
    lucide.createIcons();
  }
});
