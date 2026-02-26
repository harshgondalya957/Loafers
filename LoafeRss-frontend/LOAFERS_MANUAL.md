# Loafers - Project Documentation

## 1️⃣ Project Overview

**Project Name:** Loafers  
**Tech Stack:** React, Vite, Netlify, TailwindCSS, Framer Motion  
<!-- **Live URL:** [https://loafers.netlify.app](https://loafers.netlify.app) -->

### Purpose
To provide a modern, mobile-responsive online menu and ordering interface for Loafers restaurant/cafe. Customers can browse categories, view items, and manage a shopping cart for Delivery or Pickup.

### Features List
*   **Dynamic Menu System:** Categorized menu (Burgers, Hot Drinks, Shakes, etc.) powered by a central data file (`products.js`).
*   **Mobile-First Design:** Optimized layout for mobile devices with horizontal scrolling categories and touch-friendly interface.
*   **Cart Functionality:** Add/remove items, adjust quantities, and view total cost.
*   **Order Type Selection:** Toggle between Delivery and Pickup modes.
*   **Interactive UI:** Smooth animations using Framer Motion, sticky headers, and modal information lookups.
*   **Responsive Layout:** Adapts seamlessly from mobile phones to large desktop screens.

---

## 2️⃣ Deployment Details

**Hosting Provider:** Netlify  
<!-- **Live Website:** [https://loafers.netlify.app](https://loafers.netlify.app) -->

### Build Settings
*   **Base Directory:** `/` (Root)
*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`

---

## 4️⃣ Admin / Login Credentials

**Current Status:**  
There is **no dedicated backend Admin Dashboard** or CMS (Content Management System) connected to this project currently. All data is managed directly within the code.

*   **Admin URL:** N/A
*   **Credentials:** N/A

To make changes to the menu, prices, or images, you must update the source code files as described in the maintenance section below.

---

## 5️⃣ Future Maintenance Note (Guide)

### How to Update (Code)
1.  Open the project folder in VS Code.
2.  Make your changes to the code.
3.  Open the terminal and run:
    ```bash
    git add .
    git commit -m "Description of changes"
    git push
    ```
4.  Netlify will detect the push to the `main` branch and automatically redeploy the site.

### How to Add a New Product
All menu data is stored in `src/data/products.js`.

1.  **Open File:** Go to `src/data/products.js`.
2.  **Import Image:** At the top of the file, import the new product image.
    ```javascript
    import newBurgerImage from '../assets/new-burger.png';
    ```
3.  **Add Item:** Find the relevant category array (e.g., `burgerBarItems`) and add a new object:
    ```javascript
    {
        name: "New Tasty Burger",
        price: "8.95",
        description: "Description of the burger...",
        image: newBurgerImage
    },
    ```
4.  **Save:** Save the file. The site will update locally (if running `npm run dev`). Push to GitHub to update the live site.

### How to Redeploy
*   **Automatic:** Any change pushed to the `main` branch on GitHub triggers an automatic deployment on Netlify.
*   **Manual (if needed):**
    1.  Log in to [Netlify](https://app.netlify.com).
    2.  Select the **loafers-app** site.
    3.  Go to the **Deploys** tab.
    4.  Click **Trigger deploy** > **Deploy site**.
