import { BannerSection } from '../features/home/BannerSection'
import { DirectionsSection } from '../features/home/DirectionsSection'
import { FaqSection } from '../features/home/FaqSection'
import { HeroSection } from '../features/home/HeroSection'
import { StartSection } from '../features/home/StartSection'
import { StepsSection } from '../features/home/StepsSection'
import styles from '../features/home/Home.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <DirectionsSection />
      <StartSection />
      <StepsSection />
      <BannerSection />
      <FaqSection />
    </div>
  )
}
