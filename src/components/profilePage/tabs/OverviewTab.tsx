import ProfileOverallStats from '../ProfileOverallStats';
import ProfileRecentMatches from '../ProfileRecentMatches';
import ProfileActivityView from '../ProfileActivityView';
import ProfileMapStats from '../ProfileMapStats';
import ProfileClassStats from '../ProfileClassStats';
import ProfileTopPeers from '../ProfileTopPeers';

import type { UserProfileDTO } from '../../../types/UserProfileDTO';

export default function OverviewTab({ data }: { data: UserProfileDTO }) {
    return (
        <div className="grid grid-cols-[2fr_1fr]">
            <div className='flex flex-col gap-3'>
                <ProfileOverallStats overallStats={data.overallStats} />
                <ProfileRecentMatches matches={data.recentMatches} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <ProfileActivityView activity={data.activity} />
                </div>
                <div className="space-y-6">
                    <ProfileMapStats stats={data.mapStats} />
                    <ProfileClassStats stats={data.classStats} />
                    <ProfileTopPeers
                        topPeers={data.topPeers}
                        topEnemies={data.topEnemies}
                    />
                </div>
            </div>
        </div>
    );
}
