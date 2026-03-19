
# E‑Shoppers Frontend (React + Vite + MUI) – Extended Admin (v1.2)

This update adds:
- **Order details modal** in Admin → Orders
- **Inline Toggle Rule** button in Admin → Rules
- **Client-side pagination** to Orders, Rules, Ads, Offers, Announcements, and Categories lists

## Run
```bash
npm i
cp .env.example .env   # set VITE_API_BASE_URL if needed
npm run dev
```

## Notes
- Pagination uses MUI `TablePagination` with client-side slicing. If you later add paged endpoints, we can switch to server-side pagination easily.
- `PATCH /api/admin/rules/{id}/toggle` is called by the inline toggle button in the Rules table.
- The Orders details modal renders fields from `MyOrderResponse` (order, product, customer, address, delivery info).
# e-shoppers-frontend
