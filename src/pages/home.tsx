import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from '../components/organism/navbar'
import Sidebar from '../components/organism/Sidebar'
import MainContain from '../components/organism/MainContain'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='bg-[#FAFAFA]'>
    <Navbar/>
    <div className='flex min-h-screen bg-[#FAFAFA]'>
    <Sidebar/>
    <MainContain/>
    </div>
    </div>
  </StrictMode>,
)
 