import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const tabs = ['overview', 'matches', 'peers', 'activity', 'gallery'];

export default function ProfileHeader({ profile }: { profile: any }) {
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = (location.pathname.split('/')[3] || 'overview').toLowerCase();
  const { playerId } = useParams();

  if (!playerId) return <div>Invalid profile link</div>;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://more.tf/profile/${playerId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTabClick = (tab: string) => {
    if (tab !== currentTab) {
      navigate(`/profile/${playerId}/${tab}`, { replace: true });
    }
  };

  const avatarUrl = `https://avatars.fastly.steamstatic.com/${profile.avatar}_full.jpg`;
  profile.flag = 'us'
  profile.badge1 = '111'
  profile.badge2 = '222'
  profile.badge3 = '333'
  profile.youtubeUrl = 'https://youtube.com/somechannel';
  profile.twitchUrl = 'https://twitch.tv/somechannel';

  return (
    <div
      className="w-full relative rounded-t-md h-80 bg-cover bg-center bg-no-repeat z-10"
      style={{
        backgroundImage:
          "url('https://images.steamusercontent.com/ugc/22838588343528740/2DC75BCCF3383C46478F6645741FAF8B6D1C58B4/')",
      }}
    >
      {/* Optional overlay for darkening */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-md -z-10" />

      {/* Content above background */}
      <div className="w-full h-full flex items-end ">
        <div className="w-full flex-col">
          <div className="ml-48 mb-3 flex justify-between items-center">
            <div className='flex'>
              <div className=" text-6xl font-medium text-light-100">{profile.steamName}</div>
              {/* Badges */}
              <div className="flex ml-1 items-center">
                {[profile.badge1, profile.badge2, profile.badge3].map(
                  (badge, index) =>
                    badge && (
                      <img
                        key={index}
                        src={`/badges/${badge}.png`}
                        alt={`Badge ${badge}`}
                        className="w-8 h-8 rounded-sm"
                      />
                    )
                )}
              </div>
            </div>
            <div className="flex gap-2 mr-3 -mb-7">
              {/* OZ */}
              <a
                href={`https://ozfortress.com/users?utf8=✓&q=${playerId}&button=`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-warm-800 bg-warm-700 hover:bg-warm-800 bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
              >
                <img src="/websiteLogos/ozf.png" alt="OZ Icon" className="w-5 h-5 object-contain" />
              </a>

              {/* RGL */}
              <a
                href={`https://rgl.gg/Public/PlayerProfile?p=${playerId}&r=24`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-warm-800 bg-warm-700 hover:bg-warm-800 bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
              >
                <img src="/websiteLogos/rgl.png" alt="RGL Icon" className="w-5 h-5" />
              </a>

              {/* ETF2L */}
              <a
                href={`https://etf2l.org/search/${playerId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#141f29] bg-[#233240] hover:bg-[#141f29] bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
              >
                <img src="/websiteLogos/etf2l-white.png" alt="ETF2L Icon" className="w-5 h-5" />
              </a>

              {/* Steam */}
              <a
                href={`https://steamcommunity.com/profiles/${playerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#162942] bg-[#133562] hover:bg-[#162942] bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
              >
                <img src="/websiteLogos/steam-icon.svg" alt="Steam Icon" className="w-5 h-5" />
              </a>

              {/* YouTube (optional) */}
              {profile.youtubeUrl && (
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[#9c001f] bg-[#ff0033] hover:bg-[#9c001f] bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
                >
                  <img src="/websiteLogos/youtube-icon.svg" alt="YouTube Icon" className="w-5 h-5" />
                </a>
              )}

              {/* Twitch (optional) */}
              {profile.twitchUrl && (
                <a
                  href={profile.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[#513488] bg-[#6441A4] hover:bg-[#513488] bg-opacity-80 rounded-sm duration-300 flex justify-center items-center cursor-pointer"
                >
                  <img src="/websiteLogos/twitch-icon.svg" alt="Twitch Icon" className="w-5 h-5" />
                </a>
              )}

              {/* Share */}
              <div
                onClick={copyLink}
                className="w-9 h-9 border border-light-50/20 hover:border-light-50/30 bg-light-50/10 hover:bg-light-50/20 duration-300 rounded-sm flex justify-center items-center cursor-pointer relative"
              >
                <img src="/websiteLogos/share-icon.svg" alt="Share Icon" className="w-5 h-5" />
                {copied && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-16 bg-light-100/40 dark:bg-warm-800/90 backdrop-blur-sm">
            <div className="ml-48 h-16 grid grid-cols-5  text-warm-400 dark:text-light-500 font-medium text-lg">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`capitalize flex justify-center items-center border-b-2 h-16 px-4
              ${currentTab === tab ? 'border-brand-orange cursor-default font-bold text-warm-800 dark:text-light-100' : 'border-transparent hover:border-brand-orange dark:hover:border-brand-orange cursor-pointer'}`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-12 bottom-7">
            <div>
              <img
                src={avatarUrl}
                alt="Player Avatar"
                className="w-28 h-28 rounded-full border-4 border-light-200"
              />
            </div>
            <div className="">
              {profile.flag && (
                <img
                  src={`https://flagcdn.com/w40/${profile.flag.toLowerCase()}.png`}
                  alt={profile.flag}
                  className="absolute bottom-3 right-0 w-[30px] h-[20px] rounded-sm border border-warm-800"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

