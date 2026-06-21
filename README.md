# PDF to Deal for HubSpot

Una herramienta web estática premium, rápida y segura diseñada para arrastrar presupuestos en PDF, extraer automáticamente sus datos clave de forma local en el cliente y sincronizarlos secuencialmente con tu portal de **HubSpot CRM** (Fideicomisos, Empresas, Contactos y Negocios asociados).

Desplegable de forma 100% gratuita y sin servidores en **GitHub Pages**.

![Diseño Moderno](https://img.shields.io/badge/UI-Glassmorphic-6366f1)
![Procesamiento Local](https://img.shields.io/badge/Procesamiento-Local-10b981)
![Integración HubSpot](https://img.shields.io/badge/Integración-HubSpot_CRM-ff7a59)

---

## 🚀 Características Clave

- **Estética Visual Premium:** Interfaz oscura, moderna y responsiva con efectos de glassmorphism, tipografía elegante y micro-animaciones dinámicas.
- **Procesamiento 100% Local (Privacidad Garantizada):** La extracción del texto de los PDFs se realiza directamente en tu navegador web mediante `PDF.js` (sin intermediación de servidores externos).
- **Normalización Inteligente de Datos:**
  - **Empresas:** Normaliza los nombres de los clientes limpiando sufijos corporativos (`S.A.`, `S.R.L.`, `Fideicomiso`, etc.) para realizar búsquedas inteligentes y evitar duplicados en HubSpot.
  - **Montos:** Limpia formatos monetarios locales e internacionales (miles y decimales con comas o puntos) a formato compatible decimal.
  - **Fechas:** Extrae la fecha de emisión del documento y calcula de forma automática y reactiva la fecha de vencimiento según el campo de validez de la oferta.
  - **Dominio:** Extrae de forma automática el dominio corporativo del email provisto (excluyendo proveedores gratuitos como Gmail, Hotmail, etc.).
- **Flujo Secuencial en HubSpot CRM (API v3):**
  1. **Empresa:** Busca la empresa por dominio o nombre normalizado. Si no existe, la crea.
  2. **Contacto:** Busca el contacto por email. Si no existe, lo crea y lo vincula a la empresa.
  3. **Negocio (Deal):** Crea el negocio en tu pipeline con el monto del presupuesto y lo asocia automáticamente tanto a la empresa como al contacto.
- **Exportación en un clic:** Copia la información extraída a tu portapapeles directamente en formato texto estructurado o JSON.
- **Persistencia de Token:** Guarda tus credenciales de HubSpot en el `localStorage` del navegador para no tener que ingresarlas en cada recarga.

---

## 🛠️ Requisitos e Integración con HubSpot (CORS)

La API de HubSpot bloquea de forma predeterminada peticiones HTTP hechas directamente desde navegadores web (CORS) para evitar la filtración de tokens de acceso privados.

Dado que esta aplicación es estática, se proporcionan dos alternativas dentro del panel de configuración:

### Opción A: Conexión Directa (Recomendado para uso personal)
1. Instala en tu navegador una extensión para habilitar CORS (como [Allow CORS: Access-Control-Allow-Origin](https://chromewebstore.google.com/detail/allow-cors-access-contro/lhbhongcohpobgbdjbefncedjbeeocgf)).
2. Activa la extensión cuando utilices la herramienta.
3. Pega tu Token de Aplicación Privada en la configuración de la app y selecciona **Conexión Directa**.

### Opción B: Proxy CORS (Para despliegue multiusuario)
1. Configura un servidor proxy CORS (por ejemplo, levantando una instancia propia de [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)).
2. En la configuración de la app, selecciona **CORS Proxy** e introduce el URL de tu servidor proxy.

---

## ⚙️ Configuración y Uso Local

1. Clona este repositorio o descarga los archivos.
2. Abre el archivo `index.html` directamente en tu navegador o sírvelo localmente (por ejemplo, con `npx http-server`):
   ```bash
   npx http-server -p 8080
   ```
3. Ingresa al panel de configuración haciendo clic en **"Configuración HubSpot"** (botón de engranaje) en la parte superior derecha y rellena tus datos.
4. Arrastra tu PDF de presupuesto, realiza las correcciones oportunas en los campos editables y haz clic en **"Sincronizar con HubSpot"**.

---

## 📤 Despliegue en GitHub Pages

Para publicarlo y compartirlo en la web:
1. Sube los archivos (`index.html`, `style.css`, `app.js`, `README.md`) a tu repositorio en GitHub.
2. Ve a los **Settings** (Configuración) de tu repositorio.
3. En la barra lateral izquierda, selecciona la sección **Pages**.
4. En **Build and deployment**, selecciona la rama principal (`main` o `master`) y la carpeta `/root`.
5. Haz clic en **Save** (Guardar).
6. Tu aplicación estará disponible públicamente en pocos minutos.
