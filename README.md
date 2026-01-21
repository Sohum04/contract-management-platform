# Contract Management Platform

A modern contract management system built with Next.js 15, TypeScript, Tailwind CSS v4, and Zustand. This platform enables users to create contract blueprints (templates), generate contracts from those blueprints, and manage contract lifecycles through a strict state machine.

## 🚀 Features

### 1. Blueprint Creation (Template Engine)
- Create reusable contract templates with custom fields
- Supported field types:
  - **Text**: Standard text input
  - **Date**: Date picker
  - **Signature**: Signature field (text-based)
  - **Checkbox**: Boolean checkbox
- Configure field properties:
  - Label
  - Type
  - Position/Order
  - Required/Optional status
- Live preview of blueprint fields
- Field reordering with up/down controls

### 2. Contract Creation
- Select from existing blueprints
- Auto-inherit all fields from the selected blueprint
- Fill in contract-specific information
- Name contracts for easy identification

### 3. Contract Lifecycle Management (State Machine)
The platform implements a strict state machine for contract lifecycle:

```
Created → Approved → Sent → Signed → Locked
   ↓                    ↓
Revoked            Revoked
```

**Status Flow Rules:**
- **Created**: Initial state → Can move to Approved or Revoked
- **Approved**: Ready for sending → Can move to Sent
- **Sent**: Sent to counterparty → Can move to Signed or Revoked
- **Signed**: Contract signed → Can move to Locked
- **Locked**: Final state, no edits allowed → Terminal state
- **Revoked**: Contract cancelled → Terminal state

**Key Constraints:**
- State transitions are strictly enforced (no skipping steps)
- Locked contracts cannot be edited
- Revoked contracts cannot proceed to other states
- Only valid transitions are available as action buttons

### 4. Contract Dashboard
- View all contracts in a table format
- **Sorting**: Click column headers to sort by:
  - Contract Name
  - Status
  - Created Date
- **Filtering**: Filter contracts by category:
  - All Contracts
  - Active (Created/Approved)
  - Pending (Sent)
  - Signed (Signed/Locked)
- **Statistics**: Dashboard shows:
  - Total contracts
  - Active contracts count
  - Pending contracts count
  - Signed contracts count

## 🛠️ Tech Stack

### Framework & Language
- **Next.js 15** (App Router): Latest React framework with server components and modern routing
- **TypeScript**: Type-safe development with strict mode enabled
- **React 19**: Latest React features and improvements

### Styling
- **Tailwind CSS v4**: Latest version with native CSS layers and improved performance
- **Custom Design System**: Consistent color palette for contract statuses

### State Management
- **Zustand**: Lightweight state management solution
  - Blueprint store for template management
  - Contract store with state machine logic
  - No boilerplate, simple API

### Development Tools
- **Turbopack**: Next.js 15's built-in bundler for faster development
- **ESLint**: Code quality and consistency
- **PostCSS**: CSS processing with Tailwind

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, pnpm, or bun

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd contract-management-platform
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 4: Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
contract-management-platform/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with header
│   ├── page.tsx                  # Dashboard (contract listing)
│   ├── blueprints/
│   │   ├── page.tsx              # Blueprint listing
│   │   └── create/
│   │       └── page.tsx          # Blueprint creation
│   └── contracts/
│       ├── create/
│       │   └── page.tsx          # Contract creation
│       └── [id]/
│           └── page.tsx          # Contract detail/edit
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   └── Table.tsx
│   ├── blueprint/                # Blueprint-specific components
│   │   ├── FieldConfigurator.tsx
│   │   └── BlueprintPreview.tsx
│   ├── contract/                 # Contract-specific components
│   │   ├── ContractForm.tsx
│   │   ├── StatusActions.tsx
│   │   └── ContractTable.tsx
│   └── layout/
│       └── Header.tsx            # Navigation header
├── store/                        # Zustand state management
│   ├── types.ts                  # TypeScript interfaces & types
│   ├── blueprintStore.ts         # Blueprint CRUD operations
│   └── contractStore.ts          # Contract CRUD + state machine
└── public/                       # Static assets
```

## 🏗️ Architecture Decisions

### 1. Framework Choice
We chose **Next.js 15 (App Router)** to leverage React Server Components and the latest robust routing capabilities, ensuring the application is performant and future-proof. **TypeScript** is used throughout for type safety, which is critical for the strict contract data models.

### 2. State Management
**Zustand** was selected over Redux or Context API because it offers a simpler, boilerplate-free API that works perfectly for our client-side data requirements without complex provider wrapping.

### 3. Styling
**Tailwind CSS v4** provides a utility-first approach that allowed for rapid UI development with a consistent design system. We used native CSS layers for better specificity management.

### 4. Contract Logic
The contract lifecycle is implemented as a **strict state machine**. This design pattern ensures that contracts can only move through valid states (e.g., Created -> Approved -> Sent), preventing invalid transitions and ensuring business logic integrity.

## 🔒 Data Persistence

**Current Implementation**: In-memory storage via Zustand stores. Data will be reset on page refresh.

**Future Enhancements**:
- Add `localStorage` persistence with Zustand middleware
- Integrate with REST API or GraphQL
- Add database (PostgreSQL, MongoDB, etc.)

## 🎯 Key Assumptions

1. **Single User System**: No authentication or multi-user support
2. **No Backend**: All data stored client-side in memory
3. **Basic Field Positioning**: Order-based positioning, not drag-and-drop
4. **Signature Field**: Text input field (not actual signature capture)
5. **Date Fields**: Standard HTML5 date input
6. **No File Uploads**: Contracts don't support file attachments
7. **No Notifications**: No email or push notifications
8. **No Audit Trail**: Status changes not logged (beyond updatedAt timestamp)
9. **No Search**: Filtering only, no full-text search
10. **One-Way Transitions**: Cannot rollback status changes

## 📝 Usage Guide

### Creating a Blueprint
1. Navigate to **Blueprints** → **Create New Blueprint**
2. Enter blueprint name and description
3. Add fields using "Add Field" button
4. Configure each field:
   - Set label
   - Choose type (Text, Date, Signature, Checkbox)
   - Mark as required (optional)
   - Reorder using ↑/↓ buttons
5. Preview fields in real-time on the right panel
6. Click "Create Blueprint"

### Creating a Contract
1. Navigate to **New Contract** or use "Use Template" from Blueprints page
2. Enter contract name
3. Select blueprint from dropdown
4. Fill in all contract fields (inherited from blueprint)
5. Click "Create Contract"

### Managing Contract Lifecycle
1. Open contract from dashboard
2. View current status in status badge
3. Use status action buttons to progress:
   - **Created** → Move to Approved or Revoked
   - **Approved** → Move to Sent
   - **Sent** → Move to Signed or Revoked
   - **Signed** → Move to Locked
4. Edit field values (only if not Locked/Revoked)
5. Save changes

### Dashboard Operations
- **Sort**: Click column headers (Name, Status, Created)
- **Filter**: Use dropdown to filter by status category
- **View Details**: Click "View Details" button
- **Statistics**: View contract counts at the top


## 🐛 Known Limitations

1. **Data Persistence**: Data lost on refresh (in-memory only)
2. **No Undo**: Cannot rollback status changes
3. **Basic Validation**: Limited field validation
4. **No Multi-language**: English only
5. **No Dark Mode**: Light mode only (can be added via Tailwind)
6. **No Export**: Cannot export contracts to PDF/Word
7. **No Templates**: No pre-built blueprint templates
8. **No Collaboration**: Single-user, no real-time collaboration

## 🚧 Future Enhancements

- [ ] Add localStorage persistence
- [ ] Implement backend API with database
- [ ] Add user authentication and authorization
- [ ] Support drag-and-drop field reordering
- [ ] Add signature capture widget
- [ ] Export contracts to PDF
- [ ] Email notifications for status changes
- [ ] Audit trail for all changes
- [ ] Full-text search
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Pre-built blueprint templates
- [ ] Contract versioning
- [ ] Bulk operations

## 📄 License

This project is created as an assignment demonstration.

## 👤 Author

Created as part of a frontend developer assignment.

---

**Note**: This is a frontend-only implementation with mocked data persistence. For production use, integrate with a backend API and database.
