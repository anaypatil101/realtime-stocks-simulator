# Realtime Stock Simulator

A full-stack **stock-trading style** web application: browse a simulated market, watch prices update in real time, manage a portfolio, review activity and transactions, and optionally top up in-app currency through a real payment provider. Stock movements and “signals” are **generated for demonstration only**—they are not financial advice and do not reflect live markets.

---

## Why this project exists

This codebase is meant to read like a **small production-shaped product**, not a tutorial demo. It stitches together concerns you typically see across separate take-home assignments: authenticated REST APIs, persistent domain models, WebSocket-driven UI updates, a third-party payments flow with server-side verification, and an LLM-backed feature constrained by strict validation and disclaimers.

If you are reviewing this as a hiring manager or engineer: the interesting bits are less the choice of React than the **end-to-end ownership**—from socket loops and Mongo writes to client state, charts, and guarded monetization paths.

---

## What you can do in the app

- **Land & explore** — Marketing-style home content, guide, and careers routes alongside the core product.
- **Markets** — Paginated grid and list views of instruments with live price ticks over Socket.IO.
- **Security detail** — Per-instrument page with historical context and Chart.js visualization.
- **AI-assisted “signal”** — Optional classification (e.g. timing labels) from recent price history via the Groq API, with explicit “simulated data” framing in the prompt and response.
- **Accounts** — Register, log in, JWT-protected areas; guest mode for a read-only style experience when configured.
- **Portfolio** — Buy and sell against simulated balances, holdings, and transaction history.
- **Dashboard** — Account settings, insights, logs, and **Add funds** using Razorpay orders verified with HMAC on the server before mutating balances.

---

## Tech stack

| Layer | Technologies |
|--------|----------------|
| **Client** | React 17, Vite 5, React Router 5, Redux + Redux Thunk, Tailwind CSS, Chart.js, Socket.IO client, Axios |
| **Quality** | Vitest, React Testing Library, Cypress |
| **Server** | Node.js (ES modules), Express, Socket.IO, Mongoose |
| **Data** | MongoDB (connection string–driven; Atlas-compatible) |
| **Auth** | JWT (Bearer), bcrypt-hashed passwords |
| **Integrations** | Razorpay (INR coin packages), Groq (Llama-class chat model for signals) |

---

## Architecture (at a glance)

1. The **browser** loads a Vite-built SPA and talks to Express over HTTPS in production (or HTTP locally) for JSON resources.
2. **Socket.IO** opens a parallel channel; the server runs a per-ticker loop that perturbs prices, persists periodic snapshots to **price history**, and emits ticker-named events the UI subscribes to.
3. **REST** handles CRUD-shaped workflows: users, stocks, purchases, transactions, action logs, payments, and the signal endpoint (which reads `Stock` + `PriceHistory` before calling Groq).
4. **MongoDB** holds normalized-style documents (users, stocks, positions, logs, transactions, price samples) rather than pushing all state through the socket layer alone.

Routes and controllers live under `backend/routes` and `backend/controllers`; real-time logic under `backend/web_sockets`. On the client, API calls are centralized in `frontend/src/api/index.js`, Redux in `frontend/src/actions` and `frontend/src/reducers`, and views under `frontend/src/components`.

---

## Prerequisites

- **Node.js** (LTS recommended) and npm  
- A **MongoDB** deployment you can connect to (local or Atlas)  
- Optional: **Groq** API key for `/stocks/:id/signal`  
- Optional: **Razorpay** test keys for add-funds flows  

---

## Backend setup

From the repository root:

```bash
cd backend
npm install
```

Create `backend/.env` (never commit real secrets):

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGO_CONNECTION_STRING` | Yes | Mongoose connection URI |
| `JWT_SECRET` | Yes | Signing key for access tokens |
| `GUEST_ID` | For guest restrictions | MongoDB `_id` of the guest user document used to block destructive actions |
| `PORT` | No | HTTP/Socket.IO port (defaults to **4983**) |
| `GROQ_API_KEY` | No | Enables LLM-based stock signal endpoint |
| `RAZORPAY_KEY_ID` | No | Razorpay dashboard key id |
| `RAZORPAY_KEY_SECRET` | No | Razorpay secret; used for order creation and signature verification |

Start the server:

```bash
node index.js
```

The API and WebSocket server share the same HTTP server, so the URL you pass to the client for REST and for `socket.io-client` should match (including host and port in development).

**Data note:** The app expects `Stock` documents (and related user data) to exist in MongoDB. Populate your database using your own seeding approach or imports consistent with `backend/models/stock.js`. The `npm run seed` script in `backend/package.json` points at a seed file that may not be present in every checkout—if it is missing, seed manually.

---

## Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`. Vite is configured with `envPrefix: 'REACT_APP_'`, so variables keep the familiar `REACT_APP_` prefix:

| Variable | Required | Purpose |
|----------|----------|---------|
| `REACT_APP_STOCKS_API` | Yes | Base URL for REST **and** Socket.IO (e.g. `http://localhost:4983`) |
| `REACT_APP_GUEST_EMAIL` | For guest login | Base64-encoded guest account email |
| `REACT_APP_GUEST_PASS` | For guest login | Base64-encoded guest account password |
| `REACT_APP_RAZORPAY_KEY_ID` | For checkout | Public Razorpay key id passed to the client checkout helper |

Run the dev server (default Vite port **3000** per `vite.config.mjs`):

```bash
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

---

## Testing

```bash
cd frontend
npm run test        # Vitest watch mode
npm run test:ci     # Single run for CI
```

Cypress is included for broader E2E scenarios; configure and run it when you have a stable backend and base URL.

---

## API surface (summary)

Mounted under the Express app in `backend/index.js`:

- `/stocks` — List and detail  
- `/stocks/:id/signal` — Groq-backed signal when configured  
- `/user` — Registration, login, profile updates  
- `/purchased` — Holdings CRUD  
- `/transactions` — History  
- `/logs` — Action logs  
- `/payment` — Create order, verify payment  

All mutating routes that matter for money or holdings should assume **untrusted clients**: the payment path recomputes the Razorpay signature on the server before crediting coins.

---

## Security and compliance

- Treat JWTs and payment keys like production secrets; rotate if exposed.  
- This project stores the JWT client-side (typical for SPAs); hardening options such as `httpOnly` cookies are a documented tradeoff, not implemented here.  
- Simulated signals are **not** investment advice; the backend prompt states the synthetic nature of prices.  
- See `SECURITY.md` for vulnerability reporting if you maintain a fork.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**—see the `LICENSE` file in the repository root.
