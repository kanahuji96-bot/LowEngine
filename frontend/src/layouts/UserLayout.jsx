import { Outlet } from 'react-router-dom'
import TopNav from '../components/ui/TopNav'
import GlobalFooter from '../components/ui/GlobalFooter'

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A', paddingTop: 56 }}>
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <GlobalFooter />
    </div>
  )
}

export default UserLayout
