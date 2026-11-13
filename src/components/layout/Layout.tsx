import { Outlet } from 'react-router-dom'
import { PageContainer } from '../ui'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.root}>
      <Header />
      <PageContainer as="main" className={styles.main}>
        <Outlet />
      </PageContainer>
      <Footer />
      <BottomNav />
    </div>
  )
}
