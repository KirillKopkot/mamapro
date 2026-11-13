import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import HomePage from './pages/HomePage'
import SpecialistsPage from './pages/SpecialistsPage'
import SpecialistDetailsPage from './pages/SpecialistDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import ComparePage from './pages/ComparePage'
import SupportPage from './pages/SupportPage'
import SupportDocumentsPage from './pages/SupportDocumentsPage'
import SupportBenefitsPage from './pages/SupportBenefitsPage'
import SupportRoutePage from './pages/SupportRoutePage'
import CommunityPage from './pages/CommunityPage'
import CommunityGroupPage from './pages/CommunityGroupPage'
import ChatPage from './pages/ChatPage'
import ChildPage from './pages/ChildPage'
import SpecialistNewPage from './pages/SpecialistNewPage'
import AdminModerationPage from './pages/AdminModerationPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ComingSoonPage from './pages/ComingSoonPage'
import { RequireAuth } from './features/auth/RequireAuth'
import NotFoundPage from './pages/NotFoundPage'

// Dev-страница UI-кита: в production-сборку не попадает
const UiKitPage = import.meta.env.DEV ? lazy(() => import('./pages/UiKitPage')) : null

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/specialists" element={<SpecialistsPage />} />
        <Route path="/specialists/:id" element={<SpecialistDetailsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/documents" element={<SupportDocumentsPage />} />
        <Route path="/support/benefits" element={<SupportBenefitsPage />} />
        <Route path="/support/route" element={<SupportRoutePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/groups/:groupId" element={<CommunityGroupPage />} />
        <Route path="/community/chat/:consultantId" element={<ChatPage />} />
        <Route
          path="/child"
          element={
            <RequireAuth>
              <ChildPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/forgot-password"
          element={
            <ComingSoonPage
              titleKey="pages.forgotPassword"
              textKey="auth.forgotSoon"
              backTo="/login"
              backKey="auth.backToLogin"
            />
          }
        />
        <Route
          path="/specialists/:id/booking"
          element={
            <RequireAuth>
              <ComingSoonPage
                titleKey="pages.booking"
                textKey="auth.bookingSoon"
                backTo="/specialists"
                backKey="auth.backToSpecialists"
              />
            </RequireAuth>
          }
        />
        <Route path="/specialist/new" element={<SpecialistNewPage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        {UiKitPage && (
          <Route
            path="/_ui"
            element={
              <Suspense fallback={null}>
                <UiKitPage />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
