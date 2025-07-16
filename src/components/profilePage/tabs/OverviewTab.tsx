import ProfileOverallStats from '../ProfileOverallStats';
import ProfileRecentMatches from '../ProfileRecentMatches';
import ProfileActivityView from '../ProfileActivityView';
import ProfileMapStats from '../ProfileMapStats';
import ProfileClassStats from '../ProfileClassStats';
import ProfileTopPeers from '../ProfileTopPeers';

import type { UserProfileDTO } from '../../../types/UserProfileDTO';

export default function OverviewTab({ data }: { data: UserProfileDTO }) {
    return (
        <div className="max-md:flex-col md:grid md:grid-cols-[2fr_1fr] gap-2">
            <div className='flex flex-col space-y-2'>
                <ProfileOverallStats overallStats={data.overallStats} />
                <ProfileRecentMatches matches={data.recentMatches} />
                <ProfileClassStats stats={data.classStats} />
            </div>
            <div className="flex-col space-y-2 max-md:mt-3">
                <ProfileMapStats stats={data.mapStats} />
                <ProfileActivityView activity={data.activity} />
                <ProfileTopPeers
                    topPeers={data.topPeers}
                    topEnemies={data.topEnemies}
                />
            </div>
        </div>
    );
}
