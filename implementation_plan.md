# Implementation Plan - UI Overhaul

## Goal Description
Refactor the entire application UI (Home, Category, Product, Cart, Admin) to match the new sleek, modern design provided by the user, ensuring consistency across React components.

## Proposed Changes

### Configuration
1.  **`index.html`**:
    -   Add Google Fonts links (`Tajawal`, `Manrope`, `Noto Sans Arabic`).
    -   Add Material Icons links (`Material Icons`, `Material Symbols Outlined`).
2.  **`tailwind.config.js`**:
    -   Update `colors`: Primary (`#F97316` / `#fe6601`), Backgrounds, Surfaces.
    -   Update `fontFamily`: `Tajawal` (Display/Body), `Manrope`.
    -   Enable `darkMode: 'class'`.

### Components
#### [MODIFY] [HomePage.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Storefront/HomePage.tsx)
-   Replace entire layout with the new design.
-   Implement `Hero` section with new vibrant text and images.
-   Implement `Features` section.
-   Implement `Category Grid` with hover effects.
-   Implement `Offers` section.
-   Implement `Footer` (if part of Home or globally).

#### [MODIFY] [CategoryPage.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Storefront/CategoryPage.tsx)
-   Update standard header/hero for category.
-   Update product grid layout (Cards with new shadow/hover styles).
-   Update search bar styling.

#### [MODIFY] [ProductPage.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Storefront/ProductPage.tsx)
-   Implement the "Premium" product detail view.
-   Gallery with thumbnails.
-   Price/Profit breakdown cards.
-   Add to Cart / WhatsApp buttons styling.

#### [MODIFY] [Cart.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Storefront/Cart.tsx)
-   Redesign as a full-screen or large modal/drawer with the "WhatsApp Checkout" theme.
-   Add progress steps visuals (Cart -> Confirm -> Pay).
-   Update item list styling.

#### [NEW] [WhatsAppCheckout.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Storefront/WhatsAppCheckout.tsx)
-   Create a new page for the "Confirmation" step (QR code, visual guide).
-   Route: `/checkout` or similar.

#### [MODIFY] [AdminLogin.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Admin/AdminLogin.tsx)
-   Update login form styling (Orange gradient, rounded cards).

#### [MODIFY] [Dashboard.tsx](file:///d:/zero%20to%20hero/mr%20hero/palletwholesale-pro/components/Admin/Dashboard.tsx)
-   Update dashboard stats cards (Total, Active, Margin, etc.).
-   Update tables styling.

## Verification Plan
### Manual Verification
-   **Routes**: Click through Home -> Category -> Product -> Cart -> Checkout.
-   **Appearance**: Check fonts, colors, and shadows against the snippets.
-   **Responsiveness**: Resize window to mobile/tablet sizes.
-   **Admin**: Log in and check the stats dashboard layout.
