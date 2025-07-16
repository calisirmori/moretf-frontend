export default function ProfileRecentMatches({ matches }: { matches: any[] }) {
  return (
    <div className="bg-dark p-3 bg-warm-800 rounded-md">
      <h3 className="text-lg text-light-100 font-semibold mb-2">Recent Matches</h3>
      <ul className="flex-col">
        {matches.map((match, i) => (
          <a key={i} className={`px-3 flex items-center relative h-[54px] ${i % 2 == 0 && "bg-warm-700/30"} border border-transparent hover:border-brand-orange cursor-pointer`} href={`/log/${match.logid}`}>
            <div className={`left-0  ${match.matchResult == "W" ? "bg-green-600" : match.matchResult == "L" ? "bg-brand-red" : "bg-gray-500"} w-1 h-3/4 opacity-80 flex justify-center items-center font-bold rounded-r-md absolute text-xs`}></div>
            <div className=" ml-1 w-9 flex justify-center items-center">
              <img src={`/classIcons/${match.playerClass}.png`} alt="class icon" className="h-6 w-6" />
            </div>
            <div className="flex-col flex-1 ml-2">
              <div className="text-xs text-light-700">MATCH - <span className="opacity-50">{match.title}</span></div>
              <div className=" text-light-100 font-semibold -mt-1">
                {match.map.includes('_')
                  ? match.map.split('_')[1].charAt(0).toUpperCase() + match.map.split('_')[1].slice(1)
                  : match.map.charAt(0).toUpperCase() + match.map.slice(1)}
              </div>
            </div>
            <div className="border-r border-warm-300 pr-4">
              <img src="/badges/333.png" alt="" className="h-5 w-5" />
            </div>

            <div className="flex-col text-end w-20">
              <div className="text-xs text-light-700">K/D/A</div>
              <div className=" text-light-100 font-semibold text-sm">{match.kills} / {match.deaths} / {match.assists}</div>
            </div>

            <div className="flex-col text-end w-12">
              <div className="text-xs text-light-700">{match.hpm > match.dpm ? "HPM" : "DPM"}</div>
              <div className=" text-light-100 font-semibold text-sm">{match.hpm > match.dpm ? match.hpm : match.dpm}</div>
            </div>

            <div className="flex-col text-end w-12 mr-6">
              <div className="text-xs text-light-700">DTM</div>
              <div className=" text-light-100 font-semibold text-sm">{match.dtm}</div>
            </div>

            <div className="text-light-300 font-semibold text-sm w-12 border-x border-warm-300 text-center font-ttnormsmono">{match.format}</div>

            <div className="text-end text-light-300 font-semibold w-20 text-sm ml-5">{new Date(match.logDate).toLocaleDateString('en-US')}</div>
          </a>
        ))}
      </ul>
    </div>
  );
}
