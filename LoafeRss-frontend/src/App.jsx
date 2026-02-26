import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import PromoSection from './components/PromoSection';
import MenuGrid from './components/MenuGrid';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import friedChicken from './assets/fried_chicken.png';
import breakfast from './assets/p3.png';
import TornPaperBackground from './components/TornPaperBackground';
import OrderNow from './pages/OrderNow';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import OfferPopup from './components/OfferPopup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './pages/Admin/AdminLayout';
import Reports from './pages/Admin/Reports';
import CustomerList from './pages/Admin/CustomerList';
import Orders from './pages/Admin/Orders';
import Dashboard from './pages/Admin/Dashboard';
import StoreSettings from './pages/Admin/StoreSettings';
import Riders from './pages/Admin/Riders';
import Categories from './pages/Admin/Categories';
import SubCategories from './pages/Admin/SubCategories';
import Customization from './pages/Admin/Customization';
import Items from './pages/Admin/Items';
import Coupons from './pages/Admin/Coupons';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import LocationModal from './components/LocationModal';
import DeliveryLayout from './pages/Delivery/DeliveryLayout';
import RiderLogin from './pages/Delivery/RiderLogin';
import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';
import DeliveryOrderDetails from './pages/Delivery/DeliveryOrderDetails';
import AboutUs from './pages/AboutUs';

// Home Page Component (extracting existing App content)
const Home = () => (
  <div className="min-h-screen bg-white font-body text-dark overflow-x-hidden selection:bg-primary selection:text-white">
    <Navbar />
    <OfferPopup />
    <main className="w-full">
      <Hero />
      <Features />

      <TornPaperBackground id="about-us" className="py-2 md:py-16" bgColor="#FFF5E5">
        <div className="container mx-auto px-0 md:px-4 relative z-10 w-full">
          <PromoSection
            title="Healthy Food Taste Better"
            highlightWord="Food Taste Better"
            desc="We're passionate about providing delicious and high quality food at Loafers in Greater - our priority is to satisfy all of our customers needs - we offer a variety of excellent food, prepared with the freshest and finest ingredients, to the highest standard."
            image={friedChicken}
            reverse={false}
          />
        </div>
      </TornPaperBackground>

      <section id="recipes" className="bg-white px-0 md:pl-20">
        <PromoSection
          title="Your Perfect Breakfast"
          highlightWord="Perfect Breakfast"
          desc={
            <>
              You can now order online, all your favourite dishes<br />
              and many other delicious options, and have them<br />
              delivered straight to your door in no time at all.
            </>
          }
          image={breakfast}
          reverse={true}
          textClassName="md:ml-20"
        />
      </section>

      <TornPaperBackground id="order-now" className="py-16" bgColor="#FFF5E5">
        <MenuGrid />
      </TornPaperBackground>

      <section id="reviews">
        <Testimonials />
      </section>
    </main>
    <section id="contact">
      <Footer />
    </section>
  </div>
);





const App = () => {
  return (
    <Router>
      <LocationProvider>
        <AuthProvider>
          <LocationModal />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryLayout />}>
              <Route path="login" element={<RiderLogin />} />
              <Route path="dashboard" element={<DeliveryDashboard />} />
              <Route path="order/:orderId" element={<DeliveryOrderDetails />} />
              <Route index element={<Navigate to="login" replace />} />
            </Route>

            {/* ... Admin & Store Routes */}
            <Route path="/order" element={<OrderNow />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<StoreSettings />} />
              <Route path="riders" element={<Riders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="sub-categories" element={<SubCategories />} />
              <Route path="customization" element={<Customization />} />
              <Route path="items" element={<Items />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reports" element={<Reports />} />
              <Route path="customers" element={<CustomerList />} />
            </Route>
          </Routes>
        </AuthProvider>
      </LocationProvider>
    </Router>
  );
};

export default App;