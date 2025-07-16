import { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { fetchProfile } from '../api/profileApi';
import type { UserProfileDTO } from '../types/UserProfileDTO';

import OverviewTab from '../components/profilePage/tabs/OverviewTab';
import MatchesTab from '../components/profilePage/tabs/MatchesTab';
import PeersTab from '../components/profilePage/tabs/PeersTab';
import ActivityTab from '../components/profilePage/tabs/ActivityTab';
import GalleryTab from '../components/profilePage/tabs/GalleryTab';
import ProfileHeader from '../components/profilePage/ProfileHeader';

export default function Profile() {
    const [profileData, setProfileData] = useState<UserProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { playerId } = useParams();
    const location = useLocation();

    const tab = location.pathname.split('/')[3] || 'overview';

    useEffect(() => {
        if (!playerId) return;

        fetchProfile(playerId).then((data) => {
            setProfileData(data);
            setLoading(false);
        });
    }, [playerId]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!profileData) return <div className="p-4">No data found</div>;

    // Optional redirect if invalid tab
    const validTabs = ['overview', 'matches', 'peers', 'activity', 'gallery'];
    if (!validTabs.includes(tab)) {
        return <Navigate to={`/profile/${playerId}/overview`} replace />;
    }

    return (
        <div className="bg-light-50 dark:bg-warm-700 min-h-screen p-6 flex justify-center items-center">
            <div className="min-h-screen max-w-7xl w-full">
                <ProfileHeader profile={profileData.profile} />
                <div className="mt-2">
                    {tab === 'overview' && <OverviewTab data={profileData} />}
                    {tab === 'matches' && <MatchesTab/>}
                    {tab === 'peers' && <PeersTab/>}
                    {tab === 'activity' && <ActivityTab/>}
                    {tab === 'gallery' && <GalleryTab/>}
                </div>
            </div>
        </div>
    );
}
