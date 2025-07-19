import React, { useState, useRef, useEffect } from "react";

interface PlayerIdentityProps {
  steamId: string;
  username: string;
  usernameStyleId?: number;
  badge1?: number | null;
  badge2?: number | null;
  badge3?: number | null;
}

const getUsernameStyle = (id?: number) => {
  switch (id) {
    case 2:
      return "text-orange-400 font-medium";
    case 3:
      return "bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent font-medium";
    default:
      return "text-light-100 font-medium";
  }
};

const convertToSteam64 = (steamId: string) => {
  const steam3Match = steamId.match(/\[U:1:(\d+)\]/);
  if (steam3Match) {
    const id3 = parseInt(steam3Match[1], 10);
    return (76561197960265728n + BigInt(id3)).toString();
  }
  return steamId; // assume it's already a 64-bit ID
};

const getBadgeIcon = (id: number | null | undefined) => {
  switch (id) {
    case 1:
      return "👍";
    case 2:
      return "😄";
    case 3:
      return "🔥";
    default:
      return null;
  }
};

const PlayerIdentity: React.FC<PlayerIdentityProps> = ({
  steamId,
  username,
  usernameStyleId = 1,
  badge1,
  badge2,
  badge3,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const steamId64 = convertToSteam64(steamId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styleClass = getUsernameStyle(usernameStyleId);

  return (
    <div className="relative" ref={ref}>
      <div
        className={`flex items-center gap-1 cursor-pointer truncate ${styleClass}`}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate max-w-[120px]">{username}</span>
        {[badge1, badge2, badge3]
          .map(getBadgeIcon)
          .filter(Boolean)
          .map(() => (
            <img src="/badges/111.png" alt="" className="h-3.5 w-3.5" />
          ))}
      </div>

      {open && (
        <div className="absolute z-50 bg-white dark:bg-warm-800 border border-warm-300 dark:border-warm-600 rounded shadow-md min-w-40 mt-2 right-0">
          <h4 className="font-semibold text-sm p-2 border-b border-warm-600 bg-warm-850">{username}</h4>
          <ul className="text-sm space-y-2 p-2">
            <li>
              <a
                href={`/profiles/${steamId64}`}
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href={`https://steamcommunity.com/profiles/${steamId64}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                Steam
              </a>
            </li>
            <li>
              <a
                href={`https://logs.tf/profile/${steamId64}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                Logs.tf
              </a>
            </li>
            <li>
              <a
                href={`https://demos.tf/profiles/${steamId64}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                Demos.tf
              </a>
            </li>
            <li>
              <a
                href={`https://etf2l.org/search/${steamId64}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                etf2l
              </a>
            </li>
            <li>
              <a
                href={`https://rgl.gg/Public/PlayerProfile?p=${steamId64}&r=24`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline"
              >
                rgl
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerIdentity;
