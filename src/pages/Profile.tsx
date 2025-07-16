import { useEffect, useState } from 'react'
import { useParams, Routes, Route, Navigate } from 'react-router-dom'
import { fetchProfile } from '../api/profileApi'
import type { UserProfileDTO } from '../types/UserProfileDTO'

import OverviewTab from '../components/profilePage/tabs/OverviewTab'
import MatchesTab from '../components/profilePage/tabs/MatchesTab'
import PeersTab from '../components/profilePage/tabs/PeersTab'
import ActivityTab from '../components/profilePage/tabs/ActivityTab'
import GalleryTab from '../components/profilePage/tabs/GalleryTab'
import ProfileHeader from '../components/profilePage/ProfileHeader'

export default function Profile() {
    const [profileData, setProfileData] = useState<UserProfileDTO | null>(null)
    const [loading, setLoading] = useState(true)
    const { playerId } = useParams()

    useEffect(() => {
        if (!playerId) return
        fetchProfile(playerId).then((data) => {
            setProfileData(data)
            setLoading(false)
        })
    }, [playerId])

    if (loading) return <div className="p-4">Loading...</div>
    if (!profileData) return <div className="p-4">No data found</div>

    return (
        <div className="bg-light-50 dark:bg-warm-700 min-h-screen p-6 flex justify-center items-center">
            <div className="min-h-screen max-w-7xl w-full">
                <ProfileHeader profile={profileData.profile} />
                <div className='mt-3'>
                    <Routes>
                        {/* Redirect base /profile/:id to overview */}
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<OverviewTab data={profileData} />} />
                        <Route path="matches" element={<MatchesTab />} />
                        <Route path="peers" element={<PeersTab />} />
                        <Route path="activity" element={<ActivityTab />} />
                        <Route path="gallery" element={<GalleryTab />} />
                        {/* Optional fallback */}
                        <Route path="*" element={<Navigate to="overview" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}
