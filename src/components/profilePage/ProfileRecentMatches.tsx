export default function ProfileRecentMatches({ matches }: { matches: any[] }) {
  return (
    <div className="bg-dark p-3 bg-light-100 dark:bg-warm-800 rounded-md">
      <h3 className="text-lg text-warm-800 dark:text-light-100 font-semibold mb-2">Recent Matches</h3>
      <ul className="flex-col">
        {matches.map((match, i) => (
          <a key={i} className={`px-3 flex items-center relative h-[54px] ${i % 2 == 0 && "bg-light-300/30 dark:bg-warm-700/30"} border border-transparent hover:border-brand-orange cursor-pointer`} href={`/log/${match.logid}`}>
            <div className={`left-0  ${match.matchResult == "W" ? "bg-green-600" : match.matchResult == "L" ? "bg-brand-red" : "bg-gray-500"} w-1 h-3/4 opacity-80 flex justify-center items-center font-bold rounded-r-md absolute text-xs`}></div>
            <div className=" ml-1 w-9 flex justify-center items-center">
              <img src={`/classIcons/${match.playerClass}.png`} alt="class icon" className="h-6 w-6" />
            </div>
            <div className="flex-col flex-1 ml-2">
              <div className="text-xs text-warm-500 dark:text-light-700 ">MATCH  <span className="opacity-50 max-lg:hidden"> - {match.title}</span></div>
              <div className="text-warm-800 dark:text-light-100 font-semibold -mt-1 max-sm:truncate max-sm:w-24">
                {match.map.includes('_')
                  ? match.map.split('_')[1].charAt(0).toUpperCase() + match.map.split('_')[1].slice(1)
                  : match.map.charAt(0).toUpperCase() + match.map.slice(1)}
              </div>
            </div>
            <div className="border-r border-warm-300 pr-4">
              <img src="/badges/333.png" alt="" className="h-5 w-5" />
            </div>

            <div className="max-sm:hidden flex-col text-end w-20 max-lg:mr-5">
              <div className="text-xs text-warm-200 dark:text-light-400 font-medium">K/D/A</div>
              <div className=" text-warm-800 dark:text-light-100 font-semibold text-sm">{match.kills} / {match.deaths} / {match.assists}</div>
            </div>

            <div className="max-lg:hidden flex-col text-end w-12">
              <div className="text-xs text-warm-200 dark:text-light-400 font-medium">{match.hpm > match.dpm ? "HPM" : "DPM"}</div>
              <div className="text-warm-800 dark:text-light-100 font-semibold max-md:text-xs md:text-sm">{(match.hpm > match.dpm ? match.hpm : match.dpm).toFixed(0)}</div>
            </div>

            <div className="max-lg:hidden flex-col text-end w-12 mr-6">
              <div className="text-xs text-warm-200 dark:text-light-400 font-medium">DTM</div>
              <div className="text-warm-800 dark:text-light-100 font-semibold text-sm">{match.dtm}</div>
            </div>

            <div className="max-lg:hidden text-warm-300 dark:text-light-300 font-semibold text-sm w-12 border-x border-warm-300 text-center font-ttnormsmono">{match.format}</div>

            <div className=" flex-col text-end w-20  max-lg:border-l border-warm-300 md:ml-2">
              <div className="text-xs text-warm-200 dark:text-light-400 font-medium">{new Date(match.logDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-end text-warm-300 dark:text-light-300 font-semibold max-md:text-xs md:text-sm">{new Date(match.logDate).toLocaleDateString('en-US')}</div>
            </div>

          </a>
        ))}
      </ul>
    </div>
  );
}
