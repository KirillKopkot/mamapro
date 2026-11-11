import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
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
import NotFoundPage from './pages/NotFoundPage'

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
        <Route path="/child" element={<ChildPage />} />
        <Route path="/specialist/new" element={<SpecialistNewPage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
