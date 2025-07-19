import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Pagination from '../../common/Pagination'

export default function MatchesTab() {
    const { playerId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)


    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const map = searchParams.get('map') || ''
    const [mapInput, setMapInput] = useState(map)
    const format = searchParams.get('format') || ''
    const playerClass = searchParams.get('playerClass') || ''
    const sortBy = searchParams.get('sortBy') || ''
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (mapInput !== map) {
                searchParams.set('map', mapInput)
                searchParams.set('page', '1')
                setSearchParams(searchParams)
            }
        }, 1000)

        return () => clearTimeout(debounce)
    }, [mapInput])

    useEffect(() => {
        if (!playerId) return

        setLoading(true)
        const query = new URLSearchParams({
            id64: playerId,
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(map && { map }),
            ...(format && { format }),
            ...(playerClass && { playerClass }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
        })

        fetch(`https://api.more.tf/logs?${query}`, {
              credentials: "include"
            })
            .then(res => res.json())
            .then(json => {
                setData(json.data)
                setTotal(json.total)
                setLoading(false)
            })
    }, [playerId, page, pageSize, map, format, playerClass, sortBy, sortOrder])

    const totalPages = Math.ceil(total / pageSize)

    const goToPage = (newPage: number) => {
        searchParams.set('page', newPage.toString())
        setSearchParams(searchParams)
    }


    return (
        <div className="bg-dark p-3 bg-light-100 dark:bg-warm-800 rounded-md text-warm-800 dark:text-light-100 font-semibold ">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

                <div className='flex flex-wrap gap-3'>
                    {/* Map Filter */}
                    <input
                        type="text"
                        className="px-3 py-1 border placeholder-light-400 dark:placeholder-warm-400 border-light-600 dark:border-warm-600 rounded bg-light-50 dark:bg-warm-700 text-sm"
                        placeholder="Search map..."
                        value={mapInput}
                        onChange={(e) => setMapInput(e.target.value)}
                    />

                    {/* Format Filter */}
                    <select
                        className="px-3 py-1 border border-light-600 dark:border-warm-600 rounded bg-light-50 dark:bg-warm-700 text-sm"
                        value={format}
                        onChange={(e) => {
                            searchParams.set('format', e.target.value)
                            searchParams.set('page', '1')
                            setSearchParams(searchParams)
                        }}
                    >
                        <option value="">All Formats</option>
                        <option value="6v6">6v6</option>
                        <option value="HL">Highlander</option>
                    </select>

                    {/* Class Filter */}
                    <select
                        className="px-3 py-1 border border-light-600 dark:border-warm-600 rounded bg-light-50 dark:bg-warm-700 text-sm"
                        value={playerClass}
                        onChange={(e) => {
                            searchParams.set('playerClass', e.target.value)
                            searchParams.set('page', '1')
                            setSearchParams(searchParams)
                        }}
                    >
                        <option value="">All Classes</option>
                        <option value="scout">Scout</option>
                        <option value="soldier">Soldier</option>
                        <option value="pyro">Pyro</option>
                        <option value="demoman">Demoman</option>
                        <option value="heavyweapons">Heavy</option>
                        <option value="engineer">Engineer</option>
                        <option value="medic">Medic</option>
                        <option value="sniper">Sniper</option>
                        <option value="spy">Spy</option>
                    </select>

                </div>

                <div className="flex items-center gap-3 text-sm">
                    <label htmlFor="sortBy" className="font-medium">Sort by:</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => {
                            searchParams.set('sortBy', e.target.value)
                            setSearchParams(searchParams)
                        }}
                        className="px-2 py-1 rounded border border-light-600 dark:border-warm-600 bg-light-50 dark:bg-warm-700"
                    >
                        <option value="logDate">Date</option>
                        <option value="kills">Kills</option>
                        <option value="dpm">DPM</option>
                        <option value="map">Map</option>
                    </select>

                    <button
                        className="flex items-center px-2 py-1 rounded border border-light-600 dark:border-warm-600 bg-light-50 dark:bg-warm-700"
                        onClick={() => {
                            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
                            searchParams.set('sortOrder', newOrder)
                            setSearchParams(searchParams)
                        }}
                    >
                        {sortOrder === 'asc' ? (
                            <>
                                ↑ <span className="ml-1">Asc</span>
                            </>
                        ) : (
                            <>
                                ↓ <span className="ml-1">Desc</span>
                            </>
                        )}
                    </button>
                </div>


            </div>
            <h3 className="text-xl text-warm-800 dark:text-light-100 font-semibold mb-2">Most Played Maps</h3>

            {loading ? (
                <ul className="flex-col space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="px-3 flex items-center h-[54px] rounded bg-light-300/30 dark:bg-warm-700/30 ">
                            <div className="w-1 h-3/4 bg-gray-400 opacity-30 rounded-r-md"></div>
                            <div className="ml-2 w-9 h-6 bg-gray-400 dark:bg-warm-600 rounded"></div>
                            <div className="ml-2 flex-1 space-y-1">
                                <div className="w-24 h-3 bg-gray-300 dark:bg-warm-600 rounded"></div>
                                <div className="w-16 h-3 bg-gray-200 dark:bg-warm-700 rounded"></div>
                            </div>
                            <div className="w-5 h-5 bg-gray-400 dark:bg-warm-600 rounded mr-2"></div>
                            <div className="w-16 h-4 bg-gray-400 dark:bg-warm-600 rounded mx-2 max-sm:hidden"></div>
                            <div className="w-10 h-4 bg-gray-400 dark:bg-warm-600 rounded max-lg:hidden"></div>
                            <div className="w-10 h-4 mx-2 bg-gray-400 dark:bg-warm-600 rounded max-lg:hidden"></div>
                            <div className="w-12 h-4 bg-gray-400 dark:bg-warm-600 rounded max-lg:hidden"></div>
                            <div className="w-20 h-4 bg-gray-400 dark:bg-warm-600 rounded ml-2"></div>
                        </li>
                    ))}
                </ul>
            ) : data.length === 0 ? (
                <div className="text-center text-warm-300">No matches found.</div>
            ) : (
                <ul className="flex-col">
                    {data.map((match: any, i: number) => (
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

                            <div className="max-sm:hidden flex-col text-end w-24 max-lg:mr-5">
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
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
            />

        </div>
    )
}
