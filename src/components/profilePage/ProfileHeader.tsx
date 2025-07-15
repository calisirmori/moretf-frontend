import { useState } from 'react';

const tabs = ['Overview', 'Matches', 'Peers', 'Activity', 'Gallery'];

export default function ProfileHeader({ profile }: { profile: any }) {

  const [activeTab, setActiveTab] = useState('Overview');

  const avatarUrl = `https://avatars.fastly.steamstatic.com/${profile.avatar}_full.jpg`;
  profile.flag = 'us'
  profile.badge1 = '111'
  profile.badge2 = '222'
  profile.badge3 = '333'

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
            <div className="flex  gap-2 border">
              {/* Twitter */}
              <div className="w-9 h-9 bg-[#1DA1F2] hover:bg-[#1A91DA] rounded-md flex justify-center items-center cursor-pointer">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1s-1.64.98-2.6 1.26a4.48 4.48 0 0 0-7.6 4.1A12.94 12.94 0 0 1 3 2s-4 9 5 13a13 13 0 0 1-8 2c11 6 24 0 24-13.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </div>

              {/* Twitch */}
              <div className="w-9 h-9 bg-[#6441A4] hover:bg-[#6441A4] rounded-md flex justify-center items-center cursor-pointer">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.265 0L0 4.265v15.47h5.8V24l4.265-4.265h3.93L24 13.194V0H4.265zM21.43 12.007l-3.404 3.404h-4.552l-2.85 2.849v-2.849H5.801V1.838h15.63v10.169zm-3.76-6.136h-1.704v5.113h1.704V5.871zm-4.334 0h-1.704v5.113h1.704V5.871z" />
                </svg>
              </div>

              {/* Share */}
              <div className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-md flex justify-center items-center cursor-pointer">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.05-4.11A2.5 2.5 0 1 0 14.5 5c0 .17.02.33.05.5L7.5 9.61a2.5 2.5 0 1 0 0 4.78l7.05 4.11c-.03.16-.05.33-.05.5a2.5 2.5 0 1 0 2.5-2.5z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full h-16 bg-warm-800/90 backdrop-blur-sm">
            <div className="ml-48 h-16 grid grid-cols-5 text-light-500 font-medium">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex justify-center items-center border-b-2 h-16 px-4
                  ${activeTab === tab ? 'border-brand-orange cursor-default text-light-100' : 'border-transparent hover:border-brand-orange cursor-pointer'}`}
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

