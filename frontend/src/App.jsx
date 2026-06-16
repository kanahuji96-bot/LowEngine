import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import { LangProvider } from './hooks/useLang'

// Layouts
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// User Pages
import HomePage from './pages/user/HomePage'
import LoginPage from './pages/user/LoginPage'
import RegisterPage from './pages/user/RegisterPage'
import ProductsPage from './pages/user/ProductsPage'
import ProductDetailPage from './pages/user/ProductDetailPage'
import CartPage from './pages/user/CartPage'
import CheckoutPage from './pages/user/CheckoutPage'
import OrdersPage from './pages/user/OrdersPage'
import OrderDetailPage from './pages/user/OrderDetailPage'
import BuyNowPage from './pages/user/BuyNowPage'
import PaymentConfirmPage from './pages/user/PaymentConfirmPage'
import PaymentSettingsPage from './pages/admin/PaymentSettingsPage'
import ProfilePage from './pages/user/ProfilePage'

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import ProductsAdminPage from './pages/admin/ProductsAdminPage'
import OrdersAdminPage from './pages/admin/OrdersAdminPage'
import PaymentsAdminPage from './pages/admin/PaymentsAdminPage'
import ReviewsAdminPage from './pages/admin/ReviewsAdminPage'
import ServicesAdminPage from './pages/admin/ServicesAdminPage'
import ProductGalleryPage from './pages/admin/ProductGalleryPage'
import ProductContentPage from './pages/admin/ProductContentPage'
import ExportPage from './pages/admin/ExportPage'
import MembershipPage from './pages/user/MembershipPage'
import FilterPage from './pages/user/FilterPage'
import ServicesPage from './pages/user/ServicesPage'
import CategoryPage from './pages/user/CategoryPage'
import SectionProductsPage from './pages/admin/SectionProductsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LangProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#fff',
                  border: '1px solid #333',
                  borderRadius: '12px',
                },
                success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
              }}
            />
            <Routes>
              {/* Home — layout sendiri (punya TopNav internal) */}
              <Route path="/" element={<HomePage />} />

              {/* User Routes */}
              <Route element={<UserLayout />}>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/filter" element={<FilterPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/buy-now" element={<BuyNowPage />} />
                <Route path="/payment-confirm" element={<PaymentConfirmPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Auth Routes (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="products" element={<ProductsAdminPage />} />
                <Route path="products/:productId/gallery" element={<ProductGalleryPage />} />
                <Route path="products/:productId/content" element={<ProductContentPage />} />
                <Route path="services" element={<ServicesAdminPage />} />
                <Route path="orders" element={<OrdersAdminPage />} />
                <Route path="payments" element={<PaymentsAdminPage />} />
                <Route path="payment-settings" element={<PaymentSettingsPage />} />
                <Route path="reviews" element={<ReviewsAdminPage />} />
                <Route path="export" element={<ExportPage />} />
                <Route path="section/:section" element={<SectionProductsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LangProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
