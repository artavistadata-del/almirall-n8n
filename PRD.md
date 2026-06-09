Please build a complete dashboard page using the Next.js (React) framework and Tailwind CSS. For data visualization, use Apache ECharts (`echarts` or `echarts-for-react`). All data storage must strictly use React State (pure Arrays/Objects in memory) without using localStorage, adhering to the PRD specifications below:

========================================================================
PRODUCT REQUIREMENTS DOCUMENT (PRD) - ALMIRALL DERMSUPPLY OMS (NEXT.JS)
========================================================================

## 1. PRODUCT DESCRIPTION & BUSINESS ESSENCE
Almirall DermSupply OMS is an internal Order Management System (OMS) and inventory monitoring dashboard built with Next.js for Almirall's distribution center. This system digitizes incoming orders from hospitals using AI Vision (via an n8n Webhook). The application features strict client-side validation: scanned results enter as 'DRAFT' and will only deduct the 'Master Stock' upon manual user confirmation.

## 2. USER ROLES
Although this is a client-side MVP without real authentication, design the UI/UX to serve two main personas within a single dashboard screen:
1. **Warehouse Admin:** Focuses on operational features such as the "+ Scan New Order" button, submitting manual "Restock" forms, and clicking the "Confirm Order" buttons on the history table.
2. **Supply Chain Manager:** Focuses on the analytics area, viewing the 3 KPI Cards, and monitoring real-time visual data on the ECharts.

## 3. STATE MANAGEMENT (IN-MEMORY ARRAY STORAGE)
Manage two main data states using React `useState`:

A. `stokMaster` (Almirall Inventory Array):
Initial Seed State upon first load:
[
  { "id": 1, "nama_barang": "Albendazol tablet 400 mg", "jumlah": 500, "harga": 4277350 },
  { "id": 2, "nama_barang": "Erythromycin Gel 2%", "jumlah": 200, "harga": 85000 },
  { "id": 3, "nama_barang": "Calcipotriol Ointment", "jumlah": 100, "harga": 210000 }
]

B. `riwayatTransaksi` (Order Log Array):
Stores order logs with the following object schema: (id_transaksi, timestamp, nama_barang, jumlah_pesanan, harga_satuan, total_harga, status). The default status for new incoming data is "DRAFT".

## 4. API CONTRACT (N8N PAYLOAD & RESPONSE)
For integration with the n8n endpoint (AI Vision), use the following specifications for the `fetch()` function:

- **Endpoint URL:** `const N8N_WEBHOOK_URL = 'https://PLACEHOLDER_URL_KAMU';`
- **Method:** `POST`
- **Headers:** Do not set `Content-Type` manually (let the browser set the boundary for multipart/form-data automatically).
- **Request Payload (Body):** Use standard HTML `FormData`. It must contain 1 uploaded image file with the exact key name `data0`. (Example: `formData.append('data0', fileBlob)`).
- **Expected Response:** The API will return a pure JSON Array. The app must capture this data and map it into `riwayatTransaksi`.
  Example API Response:
  [
    {
      "nama_barang": "Albendazol tablet 400 mg",
      "jumlah": 350,
      "harga": 4277350
    }
  ]

## 5. STOCK VALIDATION LOGIC (REACT STATE MUTATION)
For every row in the table with a "DRAFT" status, provide a "Confirm Order" button. Click Handler Logic:
- IF stock in `stokMaster` >= requested quantity in the table:
  * Deduct the `jumlah` attribute in `stokMaster`.
  * Update the transaction status to "CONFIRMED".
- IF stock in `stokMaster` < requested quantity in the table:
  * Cancel the process. Show an error toast/alert (e.g., "Insufficient Stock!").
  * Update the transaction status to "OUT OF STOCK".

## 6. COLOR PALETTE & BRANDING GUIDELINES
- Primary Color (Navbar, Header Panel): Deep Navy Blue (#002D54)
- Accent & Interactive Color (Primary Buttons, Success Status, ECharts Bars): Bright Mint/Teal Green (#00E6A7)
- Danger Color (Error Status / Out of Stock): Crimson Red (#EF4444)
- Page Background: Very Light Gray (#F9FAFB)
- Card Containers: Pure White (#FFFFFF) with rounded-xl and shadow-sm.

## 7. PAGE STRUCTURE & UI LAYOUT
7.1. Top Navigation (Header Navbar)
- Left: Logo/Title "Almirall DermSupply Hub".
- Right: "+ Scan New Order" button (Triggers a hidden input type="file").

7.2. Control Panel & KPI Summary (Top Section)
- Left: Manual Restock Form (Dropdown to select medicine from `stokMaster`, number input, and submit button).
- Right: 3 Dynamic KPI Cards (Total Available Stock, Total Pending Orders, Total Confirmed Revenue).

7.3. Data Visualization (Apache ECharts) (Middle Section)
- Left (ECharts Bar): "Warehouse Stock Balance". X-Axis: Medicine Name, Y-Axis: Stock Quantity. (Bar Color: #00E6A7). Must be reactive to `stokMaster` state.
- Right (ECharts Doughnut): "Order Fulfillment Status". Distribution of CONFIRMED vs DRAFT vs OUT OF STOCK transactions.

7.4. Document Processing Table (Bottom Section)
Render a table mapping the `riwayatTransaksi` array. Columns: Transaction Time, Medical Product Name, Quantity, Estimated Value (in IDR format), Status Badge (Color-coded based on status), and Action Button ("Confirm Order").

## 8. FALLBACK / MOCK SIMULATION FEATURE
Provide a "Simulate Mock Scan" option/button in the UI (next to the upload button). When clicked, inject a mock object (e.g., containing Albendazol for 350 units) into the `riwayatTransaksi` array with a "DRAFT" status so recruiters can test the 'Confirm Order' logic without needing to trigger the live n8n API.
========================================================================

Please generate clean Next.js component code, structured with React hooks (`useState`, `useEffect`), utilizing Apache ECharts optimally, and ensuring it is fully functional and bug-free.