Product Requirements Document (PRD)
PalletWholesale Pro - B2B Wholesale E-Commerce Platform
1. Executive Summary
PalletWholesale Pro is a full-stack B2B e-commerce platform designed for wholesale clothing sales by pallet. The application enables merchants to browse products organized by categories, view detailed pricing breakdowns including profit margins, manage inventory, and place orders directly via WhatsApp.

Key Highlights
Target Audience: B2B wholesale merchants and retailers
Primary Market: Arabic-speaking markets (Israel/Palestine focus)
Tech Stack: React (Vite), TypeScript, TailwindCSS, PostgreSQL, Prisma, Express
Deployment: Vercel (Frontend & API), PostgreSQL (Database)
2. Project Overview
2.1 Business Goals
Streamline B2B Wholesale Transactions: Enable merchants to easily browse and order pallets of clothing
Transparent Pricing: Provide clear cost breakdowns including base cost, delivery, and profit margins
Efficient Inventory Management: Admin dashboard for managing products, categories, and business settings
WhatsApp Integration: Leverage familiar communication channel for order completion
Multi-currency Support: Handle EGP to ILS conversions automatically
2.2 Success Metrics
Number of successful WhatsApp orders placed
Average cart value
Product catalog size and diversity
Admin efficiency (time to add/update products)
3. Technical Architecture
3.1 Technology Stack
Layer	Technology
Frontend	React 19, TypeScript, TailwindCSS 4, Vite
Backend	Express.js (Node.js)
Database	PostgreSQL with Prisma ORM
Image Storage	Cloudinary
Deployment	Vercel (Serverless Functions + Static)
Authentication	Simple token-based admin auth
3.2 Database Schema
contains
singleton
Category
string
id
PK
string
nameEn
string
nameAr
string
image
datetime
createdAt
datetime
updatedAt
Product
string
id
PK
string
categoryId
FK
string
nameEn
string
nameAr
string
descriptionEn
string
descriptionAr
string
imagesRaw
int
itemsPerPallet
float
baseCostEGP
float
conversionRate
float
deliveryCostPerItemILS
float
sellingPricePerItemILS
boolean
isActive
datetime
createdAt
datetime
updatedAt
AppSettings
int
id
PK
string
whatsappNumber
string
currencyLabel
float
conversionRate
datetime
createdAt
datetime
updatedAt
3.3 Project Structure
palletwholesale-pro/
├── components/
│   ├── Admin/
│   │   ├── AdminLogin.tsx
│   │   └── Dashboard.tsx
│   ├── Shared/
│   │   ├── FormattedPrice.tsx
│   │   └── Navbar.tsx
│   └── Storefront/
│       ├── Cart.tsx
│       ├── CategoryPage.tsx
│       ├── HomePage.tsx
│       ├── ProductCard.tsx
│       └── ProductPage.tsx
├── store/
│   └── StoreContext.tsx
├── utils/
│   └── calculations.ts
├── prisma/
│   └── schema.prisma
├── server/
│   └── index.js
├── App.tsx
└── types.ts
4. User Roles & Access
4.1 Public User (Merchant/Buyer)
Access: All storefront pages
Capabilities:
Browse categories and products
Search products by name
View detailed pricing and profit margins
Add items to cart
Complete orders via WhatsApp
4.2 Admin User
Access: Admin dashboard (via /admin route)
Authentication: Password-protected (via AdminLogin)
Capabilities:
Full CRUD on products and categories
Upload/manage product images (multiple per product)
Update business settings (WhatsApp number, conversion rate, currency)
View inventory statistics and profit metrics
Toggle product active/inactive status
5. Pages & Features
5.1 Storefront Pages
5.1.1 Home Page (/)
Purpose: Landing page showcasing brand value proposition and category navigation

Key Sections
Hero Section

Large headline highlighting B2B partnership
Call-to-action to browse categories
Trust badges (verified inventory, fast shipping)
Hero image with glassmorphism design
Features Section

Integrated logistics
100% quality guarantee
Grid layout with icons and descriptions
Category Grid (Primary Navigation)

Visual cards for each category
Search bar for filtering categories
Image, name, and arrow icon per category
Click navigates to category page
Hover effects with border highlighting
Trust & Testimonials

Trust metrics (+500 successful shipments)
Customer testimonials
Security badges (payment security, order tracking)
Logistics & Support CTA

Gradient orange background
Shipping, returns, and support policies
WhatsApp contact button
Special Features:

RTL (Right-to-Left) layout for Arabic content
Smooth scroll animations
Responsive grid (2-4 columns)
Real-time category search
5.1.2 Category Page (/category/:categoryId)
Purpose: Display all products within a specific category

Components
Category Header

Back button to home
Category image and name
Breadcrumb-style navigation
Search Bar

Product-specific search within category
Floating design with shadow
Real-time filtering
Product Grid

Product cards in responsive grid (2-5 columns)
Each card shows:
First product image
Product name
Items per pallet
Wholesale price per pallet
Profit margin percentage
"View Details" and "Add to Cart" buttons
Empty State

Message if no products in category
Styled with proper spacing
User Flow:

Home → Click Category → Category Page → Click Product → Product Page
                        ↓
                    Add to Cart → View Cart
5.1.3 Product Page (/product/:productId)
Purpose: Detailed product view with full pricing breakdown and image gallery

Layout (2-Column Grid)
Left Column (Details):

Product name (large heading)
Info cards showing:
Items per pallet
Price per item
Product description
Profit breakdown:
Expected profit per pallet (highlighted)
Total price per pallet
"Delivery included" note
"Add to Cart" button with animation
Right Column (Gallery):

Main image viewer (large square)
Profit margin badge overlay
Thumbnail navigation (scrollable)
Click thumbnail to change main image
Hover zoom effect
Pricing Display:

Uses FormattedPrice component for consistent ILS formatting
English numerals enforced via CSS class
Orange accent color for profit metrics
User Interactions:

Back button to previous page
Add to cart with success animation
Image gallery navigation
Quantity selector (handled in cart)
5.1.4 Cart Sidebar (/ with cart open)
Purpose: Review selected items and complete order via WhatsApp

Structure
Header

"Cart" title
Close button (X)
Cart Items List (Scrollable)

Product image thumbnail
Product name
Items per pallet indicator
Quantity controls (+/-)
Price per line item
Remove button
Cart Footer

Total price (large, bold)
Total expected profit (smaller, orange)
"Complete Order via WhatsApp" button (green)
Disclaimer text about pricing
Empty State:

Icon display
"Cart is empty" message
Centered layout
WhatsApp Integration: When user clicks "Complete Order":

Generate message in Arabic with:
Greeting
List of items (quantity + name)
Total price
Confirmation request
URL encode message
Open WhatsApp web/app with pre-filled message to configured number
Formula: https://wa.me/{settings.whatsappNumber}?text={encodedMessage}

5.2 Admin Pages
5.2.1 Admin Login (/admin - Unauthenticated)
Purpose: Secure entry point to admin dashboard

Features
Password input field
"Login" button
Error handling for incorrect password
Token-based session storage
No username required (single admin)
Authentication Flow:

Enter Password → POST /api/auth/login → Receive Token → Store in Context → Redirect to Dashboard
Security:

Password stored in environment variable (ADMIN_PASSWORD)
Simple token validation (x-admin-token header)
No persistent sessions (token in memory only)
5.2.2 Admin Dashboard (/admin - Authenticated)
Purpose: Central hub for inventory and business management

Header Section
Page title: "لوحة التحكم" (Dashboard)
Subtitle: "Manage inventory, categories, and business settings"
Action buttons:
"Add Pallet" (primary orange)
"Add Category" (secondary white)
Tab Navigation
Three tabs with emoji icons:

📦 Inventory (Default)
📂 Categories
⚙️ Business Settings
Tab 1: Inventory Management
Statistics Cards (4-column grid):

Total Pallets (count)
Active Products (count)
Average Margin (percentage)
Total Inventory Value (ILS currency)
Product Table:

Column	Content
Details	Image thumbnail + Product name + Category badge
Price Breakdown	Price per pallet + Items per pallet
Cost Metrics	Wholesale price per item
Profit	Profit per pallet + Margin %
Actions	Edit button + Delete button
Features:

Real-time search (searches across name, description)
Loading state ("Loading data from server...")
Error state display
Responsive table with horizontal scroll on mobile
Formatted prices using FormattedPrice component
Edit/Add Product Modal:

Structure: Full-screen on mobile, centered modal on desktop

Left Column:

Product name (Arabic)
Product description (Arabic textarea)
Image gallery manager:
Display existing images
Delete image button (appears on hover)
Add new images button (multi-upload)
Upload to Cloudinary via /api/upload
Active/Inactive toggle
Right Column:

Base cost (EGP input)
Delivery cost (ILS input)
Selling price (ILS input - highlighted orange)
Items per pallet (number input)
Category selector (dropdown)
Footer:

Cancel button
Save button (orange, full-width on mobile)
Tab 2: Category Management
Category List:

Each row shows:
Category image thumbnail
Category name (Arabic)
Category ID
Edit button
Delete button
Add Category button at top
Add/Edit Category Modal:

Category name (Arabic)
Image upload field
File picker
Upload to Cloudinary
Image preview
Cancel and Save buttons
Features:

Cascade deletion (deleting category removes all products)
Real-time search filtering
Tab 3: Business Settings
Settings Form:

Field	Type	Description
WhatsApp Number	Text	Format: country code + number (e.g., 1234567890)
Currency Label	Text	Display label (default: "ILS")
Conversion Rate	Number	EGP to ILS rate (affects all products)
Features:

Orange-highlighted conversion rate field
Helper text: "This rate applies to all products"
Save button (orange)
Auto-populates from current settings
Updates via /api/settings PUT request
5.3 Shared Components
5.3.1 Navbar
Layout: Sticky top navigation

Contents:

Left side (RTL): No logo (intentional design choice per conversation history)
Right side: Empty (minimal design)
Mobile: Hamburger menu support (if needed later)
Note: Based on conversation history, navbar was deliberately kept minimal with no branding.

5.3.2 FormattedPrice Component
Purpose: Consistent currency formatting across the app

Props:

amount: number
currency: string (typically "ILS")
className: optional styling
Output Format: ₪ 1,234.56 (ILS symbol + formatted number)

Features:

Locale-aware number formatting
Automatic English numeral enforcement
Configurable decimal places
Responsive sizing via className
5.3.3 ProductCard Component
Purpose: Reusable product display for grids

Props:

product
: Product object
onViewDetails: callback function
Display:

Product image (aspect ratio 4/5)
Product name
Items per pallet
Price per pallet
Profit margin badge
View Details button
Interactions:

Hover effects (scale, border glow)
Click navigates to product page
Add to cart button (optional)
6. Data Flow & State Management
6.1 Global State (StoreContext)
Managed via React Context API:

interface StoreState {
  products: Product[]
  categories: Category[]
  settings: AppSettings
  cart: CartItem[]
  language: Language // Fixed to 'ar'
  theme: Theme // Fixed to 'light'
  isAdmin: boolean
  isAdminAuthenticated: boolean
  isLoading: boolean
  error: string | null
  searchTerm: string
  
  // Actions
  setTheme(theme: Theme): void
  setIsAdmin(isAdmin: boolean): void
  setSearchTerm(term: string): void
  loginAdmin(password: string): Promise<boolean>
  logoutAdmin(): void
  
  // Product CRUD
  addProduct(product: Omit<Product, 'id'>): Promise<void>
  updateProduct(product: Product): Promise<void>
  deleteProduct(id: string): Promise<void>
  
  // Category CRUD
  addCategory(category: Omit<Category, 'id'>): Promise<void>
  updateCategory(category: Category): Promise<void>
  deleteCategory(id: string): Promise<void>
  
  // Settings
  updateSettings(settings: AppSettings): Promise<void>
  
  // Cart
  addToCart(productId: string, quantity: number): void
  removeFromCart(productId: string): void
  updateCartQuantity(productId: string, quantity: number): void
  clearCart(): void
}
6.2 Data Loading Strategy
Initial Load (on app mount):

Parallel fetch of:
Products (GET /api/products)
Categories (GET /api/categories)
Settings (GET /api/settings)
Set loading state during fetch
Update context state on success
Display error message on failure
Optimistic Updates:

Cart operations update immediately (no API)
Admin operations update local state after successful API response
6.3 API Endpoints
Method	Endpoint	Purpose	Auth
GET	/api/products	Fetch all products	❌
POST	/api/products	Create new product	✅
PUT	/api/products/:id	Update product	✅
DELETE	/api/products/:id	Delete product	✅
GET	/api/categories	Fetch all categories	❌
POST	/api/categories	Create new category	✅
PUT	/api/categories/:id	Update category	✅
DELETE	/api/categories/:id	Delete category	✅
GET	/api/settings	Fetch app settings	❌
PUT	/api/settings	Update settings	✅
POST	/api/auth/login	Admin login	❌
POST	/api/upload	Upload image to Cloudinary	✅
Authentication: Admin-protected routes require x-admin-token header.

7. Pricing Calculation Logic
7.1 Formula Implementation
The app uses a comprehensive pricing model defined in 
utils/calculations.ts
:

interface CalculatedPricing {
  convertedCostILS: number          // Base cost converted from EGP
  wholesalePricePerItemILS: number  // Converted cost + delivery
  potentialProfitPerItemILS: number // Selling price - wholesale price
  profitMarginPercent: number       // (Profit / Selling price) * 100
  wholesalePricePerPalletILS: number // Wholesale price × items per pallet
  totalPotentialProfitPerPalletILS: number // Profit per item × items per pallet
}
Step-by-Step Calculation:

Convert Base Cost:

convertedCostILS = baseCostEGP × conversionRate
Calculate Wholesale Price per Item:

wholesalePricePerItemILS = convertedCostILS + deliveryCostPerItemILS
Calculate Profit per Item:

potentialProfitPerItemILS = sellingPricePerItemILS - wholesalePricePerItemILS
Calculate Profit Margin:

profitMarginPercent = (potentialProfitPerItemILS / sellingPricePerItemILS) × 100
Calculate Pallet-Level Metrics:

wholesalePricePerPalletILS = wholesalePricePerItemILS × itemsPerPallet
totalPotentialProfitPerPalletILS = potentialProfitPerItemILS × itemsPerPallet
7.2 Display Logic
Wholesale Price: Shown as the merchant's purchase price (includes cost + delivery)
Selling Price: Suggested retail price per item
Profit: Highlighted in orange to emphasize earning potential
Margin %: Displayed as badge or small text
8. User Journeys
8.1 Customer Journey: Placing an Order
Yes
No
Yes
No
Visit Homepage
Browse Categories
Click Category Card
View Category Products
Search Products?
Enter Search Term
Click Product Card
View Product Details
Review Images & Pricing
Click Add to Cart
Click Cart Icon
Review Cart Items
Adjust Quantities?
Update Quantities
View Total & Profit
Click WhatsApp Checkout
WhatsApp Opens with Pre-filled Message
Send Message to Merchant
Order Complete
Time Estimate: 2-5 minutes for returning customers

8.2 Admin Journey: Adding a New Product
No
Yes
Navigate to /admin
Authenticated?
Enter Admin Password
Click Login
Dashboard Loads
Click 'Add Pallet' Button
Product Modal Opens
Fill Product Details
Upload Product Images
Set Pricing Fields
Select Category
Toggle Active Status
Click Save
API Creates Product
Product Appears in Table
Success State
Time Estimate: 3-7 minutes per product (depending on images)

9. Design System
9.1 Color Palette
Usage	Color	Hex Code
Primary	Orange	#fe6601
Primary Hover	Dark Orange	#e55a00
Background (Light)	White	#ffffff
Background (Dark)	Near Black	#020617
Text Primary	Gray 900	#111827
Text Secondary	Gray 500	#6b7280
Border	Gray 100	#f3f4f6
Success	WhatsApp Green	#25D366
Error	Red 500	#ef4444
Note: Based on conversation history, theme is locked to light mode with orange as the sole primary color.

9.2 Typography
Font Family: System fonts (default browser stack)

Font Weights:

font-bold (700): Standard bold
font-black (900): Headlines and emphasis
font-medium (500): Body text
Font Sizes (Tailwind):

text-xs (0.75rem): Labels, badges
text-sm (0.875rem): Secondary text
text-base (1rem): Body text
text-lg (1.125rem): Subheadings
text-xl to text-6xl: Headlines
Special Classes:

.english-nums: Forces English numerals in Arabic context
9.3 Spacing & Layout
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

Border Radius:

Small: rounded-lg (0.5rem)
Medium: rounded-xl (0.75rem)
Large: rounded-2xl (1rem)
Extra Large: rounded-[2.5rem] to rounded-[3rem]
Shadows:

Minimized per user preference (conversation history)
Used sparingly: shadow-sm, shadow-lg
Preference for borders over shadows
9.4 Animations
Transitions:

Default: transition-all duration-300
Hover scales: hover:scale-105
Active scales: active:scale-95
Page Entrance:

animate-in fade-in duration-500
slide-in-from-bottom-2
UI Feedback:

Button hover effects (color, scale)
Loading spinners (animate-spin)
Cart add animation (2-second success state)
10. Responsive Design
10.1 Breakpoints (Tailwind)
Breakpoint	Min Width	Usage
sm	640px	Mobile landscape
md
768px	Tablets
lg	1024px	Desktops
xl	1280px	Large desktops
10.2 Mobile Optimizations
HomePage:

Hero section: Stack image below text on mobile
Category grid: 2 columns on mobile, 4 on desktop
Touch-friendly card sizes
CategoryPage:

Product grid: 2 columns on mobile, 5 on desktop
Search bar: Full-width with larger touch targets
ProductPage:

1-column layout on mobile
Image gallery: Horizontal scroll thumbnails
Cart:

Full-screen overlay on all devices
Slide-in animation from left (RTL)
Admin Dashboard:

Horizontal scroll for tables
Full-screen modals on mobile
Collapsible statistics cards
11. RTL (Right-to-Left) Support
Implementation:

Global dir="rtl" on main container
Text alignment: text-right for Arabic content
Flex direction: Auto-reversed for RTL
Grid columns: Maintain visual order in RTL
Exceptions:

English numerals: Use .english-nums class to force LTR
Prices: Always display left-to-right with symbols
Testing Considerations:

All UI elements should mirror appropriately
Icons/arrows should flip direction
Spacing and padding should respect RTL flow
12. Image Management
12.1 Cloudinary Integration
Upload Flow:

User selects image(s) via file input
Frontend creates FormData with image file
POST to /api/upload
Server uploads to Cloudinary via SDK
Returns public URL
Frontend stores URL in product/category data
Configuration (Environment Variables):

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
Storage:

Images stored as array of URLs in imagesRaw field (JSON string)
Parsed to array in frontend via JSON.parse()
12.2 Image Display
Product Images:

Support for multiple images (gallery)
First image used as thumbnail
Aspect ratio: square for thumbnails, 4/5 for category cards
Category Images:

Single image per category
Lazy loading recommended
Fallback:

Default Unsplash placeholder if no image
13. Environment Configuration
13.1 Required Environment Variables
Frontend (
.env
 or Vercel):

VITE_API_URL=/api
Backend (
.env.local
 or Vercel):

DATABASE_URL=postgresql://user:password@host:port/database
ADMIN_PASSWORD=your_secure_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
13.2 Deployment Considerations
Vercel Configuration:

Build command: npm run build
Output directory: dist
Install command: npm install
Serverless functions in api/ or server/
Database Migration:

Run prisma db push during build (see 
package.json
 build script)
Ensure DATABASE_URL is set in Vercel environment
Static Assets:

Hosted on Vercel CDN
Images served from Cloudinary
14. Security Considerations
14.1 Authentication Security
Current Implementation:

Simple password-based auth
Token stored in memory (not persisted)
No password hashing (environment variable only)
Recommendations for Production:

Implement bcrypt for password hashing
Use JWT with expiration
Add HTTPS enforcement
Implement rate limiting on login endpoint
14.2 Data Validation
Backend:

Validate all inputs before database operations
Sanitize user-provided data
Use Prisma's type safety
Frontend:

Required field validation on forms
Number input type restrictions
File type validation for image uploads
14.3 API Security
CORS:

Configured for allowed origins
Credentials support if needed
Admin Endpoints:

All mutating operations require x-admin-token
Token validation middleware
15. Performance Optimizations
15.1 Frontend
Code Splitting:

Lazy load admin routes
Dynamic imports for modals
Asset Optimization:

TailwindCSS purging for smaller bundle
Vite automatic code splitting
Image lazy loading
Caching:

Browser cache for static assets
Consider implementing React Query for server state
15.2 Backend
Database:

Indexed foreign keys (category-product relationship)
Connection pooling
API:

Parallel data fetching on initial load
Debounced search inputs
Images:

Cloudinary automatic optimization
Responsive image formats
16. Testing Strategy
16.1 Unit Tests
Priority Areas:

Pricing calculation functions (
utils/calculations.ts
)
Form validation logic
Cart operations (add, remove, update)
Framework: Vitest (already configured in project)

16.2 Integration Tests
API Endpoints:

Product CRUD operations
Category CRUD operations
Settings update
Authentication flow
Tools: Supertest

16.3 E2E Tests
User Flows:

Complete customer journey (browse → cart → WhatsApp)
Admin product management
Image upload functionality
Tools: Playwright or Cypress (not currently implemented)

16.4 Manual Testing Checklist
Storefront:

 Category navigation
 Product search
 Add to cart
 Quantity adjustment
 WhatsApp message generation
 Mobile responsiveness
Admin:

 Login/logout
 Product CRUD
 Category CRUD
 Image upload
 Settings update
 Statistics accuracy
17. Known Limitations & Future Enhancements
17.1 Current Limitations
No User Accounts: Cart is session-based only
Single Admin: No multi-user admin support
No Order Tracking: Orders via WhatsApp aren't tracked in-app
Manual Inventory: No automatic stock management
Static Conversion Rate: Must be updated manually
17.2 Potential Future Features
Phase 2
 Multi-admin support with roles (super admin, editor, viewer)
 In-app order management system
 Email notifications for orders
 Inventory stock tracking
 Low stock alerts
Phase 3
 Customer accounts and order history
 Wishlist functionality
 Product reviews and ratings
 Advanced analytics dashboard
 Automated currency rate updates (API integration)
Phase 4
 Multi-language support (English + Arabic)
 Payment gateway integration
 Invoice generation
 CRM integration
 Mobile app (React Native)
18. Glossary
Term	Definition
Pallet	A wholesale unit containing multiple items (e.g., 100 shirts per pallet)
Items Per Pallet	The quantity of individual products in one pallet
Wholesale Price	The price at which the admin sells to merchants (cost + delivery)
Selling Price	Suggested retail price for end customers
Profit Margin	Percentage difference between wholesale and selling price
ILS	Israeli Shekel currency
EGP	Egyptian Pound currency
RTL	Right-to-Left text direction (for Arabic)
CRUD	Create, Read, Update, Delete operations
19. Support & Maintenance
19.1 Documentation
Code Documentation:

Inline comments for complex logic
TypeScript interfaces for type safety
README.md for setup instructions
User Documentation:

Admin guide (how to add products, manage settings)
Customer FAQ (how to place orders, pricing explanation)
19.2 Monitoring
Recommended Tools:

Vercel Analytics for traffic
Sentry for error tracking
LogRocket for session replay
Cloudinary usage dashboard
19.3 Backup Strategy
Database:

Automated daily backups (PostgreSQL provider feature)
Point-in-time recovery capability
Images:

Cloudinary automatic backups
Download periodic backups of URLs
20. Appendices
Appendix A: Sample Data Structures
Product Example:

{
  "id": "cm7a1b2c3d4e5f6g7h8i9j0k",
  "categoryId": "cat_clothing_001",
  "nameEn": "Premium Cotton T-Shirts",
  "nameAr": "تيشيرتات قطنية فاخرة",
  "descriptionEn": "High-quality cotton t-shirts in assorted colors",
  "descriptionAr": "تيشيرتات قطنية عالية الجودة بألوان متنوعة",
  "imagesRaw": "[\"https://res.cloudinary.com/.../img1.jpg\", \"https://res.cloudinary.com/.../img2.jpg\"]",
  "itemsPerPallet": 100,
  "baseCostEGP": 5000,
  "conversionRate": 0.12,
  "deliveryCostPerItemILS": 2.5,
  "sellingPricePerItemILS": 15,
  "isActive": true
}
Category Example:

{
  "id": "cat_clothing_001",
  "nameEn": "T-Shirts",
  "nameAr": "تيشيرتات",
  "image": "https://res.cloudinary.com/.../category.jpg"
}
AppSettings Example:

{
  "id": 1,
  "whatsappNumber": "972501234567",
  "currencyLabel": "ILS",
  "conversionRate": 0.12
}
Appendix B: API Response Formats
Success Response:

{
  "id": "product_123",
  "nameEn": "Product Name",
  ...
}
Error Response:

{
  "error": "Error message in English",
  "details": "Additional error details"
}
Appendix C: Browser Compatibility
Tested Browsers:

Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
Mobile Browsers:

Chrome Mobile
Safari iOS 14+
Not Supported:

Internet Explorer (any version)
Document Revision History
Version	Date	Author	Changes
1.0	2026-01-06	AI Assistant	Initial PRD creation based on codebase analysis
End of Document