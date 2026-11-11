import { Outlet } from 'react-router-dom'
import { Header } from '../Header/Header'
import { BottomNav } from '../BottomNav/BottomNav'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
