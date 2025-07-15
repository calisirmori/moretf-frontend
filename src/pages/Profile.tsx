import { useEffect, useState } from 'react';
import { fetchProfile } from '../api/profileApi';
import type { UserProfileDTO } from '../types/UserProfileDTO';
import { useParams } from 'react-router-dom';

import ProfileHeader from '../components/profilePage/ProfileHeader';
import ProfileMapStats from '../components/profilePage/ProfileMapStats';
import ProfileOverallStats from '../components/profilePage/ProfileOverallStats';
import ProfileRecentMatches from '../components/profilePage/ProfileRecentMatches';
import ProfileTopPeers from '../components/profilePage/ProfileTopPeers';
import ProfileClassStats from '../components/profilePage/ProfileClassStats';
import ProfileActivityView from '../components/profilePage/ProfileActivityView';

export default function Profile() {
    const [profileData, setProfileData] = useState<UserProfileDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { playerId } = useParams();

    useEffect(() => {
        if (!playerId) return;

        fetchProfile(playerId).then((data) => {
            setProfileData(data);
            setLoading(false);
        });
    }, [playerId]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!profileData) return <div className="p-4">No data found</div>;

    return (
        <div className="bg-light-50 dark:bg-warm-700 min-h-screen p-6 flex justify-center items-center">
            <div className='min-h-screen max-w-7xl w-full'>
                <ProfileHeader profile={profileData.profile} />
                {/* <ProfileOverallStats overallStats={profileData.overallStats} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <ProfileRecentMatches matches={profileData.recentMatches} />
                    <ProfileActivityView activity={profileData.activity} />
                </div>
                <div className="space-y-6">
                    <ProfileMapStats stats={profileData.mapStats} />
                    <ProfileClassStats stats={profileData.classStats} />
                    <ProfileTopPeers
                        topPeers={profileData.topPeers}
                        topEnemies={profileData.topEnemies}
                    />

                </div>
            </div> */}
            </div>
        </div>
    );
}
