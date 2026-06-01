# POS System Documentation

## Overview
The Point of Sale (POS) system is a complete retail management interface for processing sales, managing inventory, and handling customer transactions in real-time.

## How It Works

### 1. Product Catalog (Left Panel)
- **Auto-refresh**: Products automatically refresh every 30 seconds to ensure stock levels are current
- **Search**: Search by product name, SKU, barcode, or description
- **Barcode Scanning**: Type or scan a barcode/SKU and press Enter to automatically add to cart
- **Category Filter**: Filter products by category/series
- **Stock Indicators**: 
  - Green: In stock (5+ items)
  - Yellow: Low stock (1-5 items)
  - Red: Out of stock

### 2. Shopping Cart (Right Panel)
- **Add Products**: Click on any product card to add to cart
- **Quantity Control**: Use +/- buttons to adjust quantities
- **Remove Items**: Click the × button to remove items
- **Stock Validation**: Cannot add more than available stock

### 3. Customer Information
- **Name**: Optional customer name field
- **Phone**: Optional phone number field
- **Default**: If left blank, uses "Walk-in Customer" and "N/A"

### 4. Payment Methods
- 💵 Cash
- 💳 Card
- 🏦 Bank Transfer
- 📱 JazzCash
- 📱 EasyPaisa

### 5. Pricing & Discounts
- **Subtotal**: Sum of all items (price × quantity)
- **Discount**: Manual discount amount in PKR
- **Tax**: Manual tax amount in PKR
- **Total**: Subtotal - Discount + Tax

### 6. Checkout Process
1. Add products to cart
2. (Optional) Enter customer details
3. Select payment method
4. (Optional) Apply discount/tax
5. Click "Complete Sale" or press Ctrl+Enter
6. Order is created in the system
7. Stock is automatically deducted
8. Receipt can be printed

## Keyboard Shortcuts
- **Ctrl+Enter**: Complete sale (when cart has items)
- **Escape**: Clear search field
- **/**: Focus on search field

## Features

### Real-time Stock Management
- Stock levels update automatically after each sale
- Low stock warnings when quantity reaches 80% of available stock
- Out of stock items are visually disabled

### Smart Pricing
- Automatically uses sale price if available and lower than regular price
- Shows both original and sale price when on sale
- Calculates totals in real-time

### Order Processing
- Orders are created via `/orders/pos` API endpoint
- Each order includes:
  - Customer information
  - All cart items with quantities
  - Payment method
  - Discount and tax amounts
  - Order number for tracking

### Receipt Printing
- After successful checkout, receipt can be printed
- Receipt includes:
  - Order number
  - Date/time
  - Customer details
  - Itemized list with quantities and prices
  - Subtotal, discount, tax, and total
  - Payment method
  - Order status

## Technical Details

### State Management
- `products`: Array of all products from inventory
- `cart`: Array of items in current cart
- `searchTerm`: Current search query
- `selectedCategory`: Active category filter
- `customerName`: Customer name input
- `customerPhone`: Customer phone input
- `discount`: Discount amount
- `tax`: Tax amount
- `paymentMethod`: Selected payment method
- `loading`: Loading state for checkout
- `showSuccess`: Success modal visibility
- `lastOrder`: Details of last completed order

### API Endpoints
- `GET /products?limit=1000`: Fetch all products
- `POST /orders/pos`: Create new POS order

### Data Flow
1. Component mounts → Fetch products
2. User searches/ filters → Update filtered products
3. User clicks product → Add to cart state
4. User adjusts quantity → Update cart item
5. User checks out → Send order to API
6. Success → Show receipt modal, clear cart, refresh products

## Best Practices

### For Cashiers
- Always verify stock levels before promising items
- Use barcode scanner for faster checkout
- Double-check quantities before completing sale
- Print receipt for every transaction
- Handle out-of-stock situations gracefully

### For Administrators
- Keep product information up to date
- Monitor stock levels regularly
- Set appropriate low stock alerts
- Review sales reports periodically
- Ensure payment methods are configured

## Troubleshooting

### Products not loading
- Check backend API is running
- Verify `/products` endpoint is accessible
- Check browser console for errors

### Checkout fails
- Verify cart has items
- Check network connection
- Ensure backend `/orders/pos` endpoint is working
- Check browser console for error messages

### Stock not updating
- Verify order was created successfully
- Check backend stock update logic
- Refresh product list manually if needed

### Barcode scanner not working
- Ensure scanner is properly connected
- Check if scanner is in keyboard mode
- Test scanner in a text editor first
- Verify barcode format matches product data

## Future Enhancements
- Customer database integration
- Receipt email option
- Multiple payment methods per order
- Hold/Resume transaction feature
- Quick keys for popular products
- Sales analytics dashboard
- Shift management
- Cash drawer integration
