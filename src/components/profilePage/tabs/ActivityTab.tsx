import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";
type DailyActivity = {
    activityDate: string;
    totalMatches: number;
};

export default function ActivityTab() {
    const [activityData, setActivityData] = useState<DailyActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseUrl}/activity?id64=76561198083063071`, {
              credentials: "include"
            })
            .then((res) => res.json())
            .then((data) => {
                setActivityData(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-light-100">Loading...</div>;

    const activityMap = new Map<string, number>();
    activityData.forEach((a) => activityMap.set(a.activityDate, a.totalMatches));

    const parseDate = (str: string) => {
        const [y, m, d] = str.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    const dates = activityData.map((a) => parseDate(a.activityDate));
    const minDate = dates.reduce((min, d) => d < min ? d : min, new Date());
    const firstDate = new Date(minDate.getFullYear(), 0, 1); // Jan 1st of that year
    const lastDate = new Date();

    // Get start of week (Sunday)
    const startOfWeek = (date: Date) => {
        const day = date.getDay();
        const result = new Date(date);
        result.setDate(date.getDate() - day);
        return result;
    };

    // Get year from date
    const getYear = (date: Date) => date.getFullYear();

    // Format date as yyyy-mm-dd
    const formatDate = (date: Date) =>
        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()
            .toString()
            .padStart(2, "0")}`;

    // Build all days between firstDate and today
    const allDays: Date[] = [];
    for (let d = new Date(firstDate); d <= lastDate; d.setDate(d.getDate() + 1)) {
        allDays.push(new Date(d));
    }

    // Group into years → weeks → days
    const years: { [year: number]: { [weekIdx: number]: { [dayIdx: number]: Date } } } = {};
    allDays.forEach((date) => {
        const year = getYear(date);
        const weekIdx = Math.floor(
            (date.getTime() - startOfWeek(new Date(year, 0, 1)).getTime()) / (1000 * 60 * 60 * 24 * 7)
        );
        const dayIdx = date.getDay();
        if (!years[year]) years[year] = {};
        if (!years[year][weekIdx]) years[year][weekIdx] = {};
        years[year][weekIdx][dayIdx] = new Date(date);
    });

    const getColor = (count: number) => {
        if (!count) return "bg-light-300 dark:bg-warm-600";
        if (count < 2) return "bg-orange-200";
        if (count < 4) return "bg-orange-400";
        if (count < 6) return "bg-orange-500";
        return "bg-orange-700";
    };

    return (
        <div className="bg-dark p-3 bg-light-100 dark:bg-warm-800 rounded-md text-warm-800 dark:text-light-100 font-semibold">
            <h3 className="text-xl text-warm-800 dark:text-light-100 font-semibold mb-2">Most Played Maps</h3>
            <div className="flex justify-center items-center">
                <div className="max-lg:w-full">
                    {Object.entries(years).map(([year, weeks]) => (
                        <div key={year} className="mb-8 w-full max-lg:overflow-x-auto">
                            <div className="mb-1  text-light-500">{`${year}`}</div>
                            <div className="flex">
                                {/* Weekday labels */}
                                <div className="flex flex-col mr-2 text-xs text-light-500">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                                        <div key={d} className="h-[18px]">{d}</div>
                                    ))}
                                </div>

                                <div className="flex gap-[2px] ">
                                    {Object.values(weeks).map((week, wIdx) => (
                                        <div key={wIdx} className="flex flex-col gap-[2px]">
                                            {Array.from({ length: 7 }).map((_, dIdx) => {
                                                const day = week[dIdx];
                                                if (!day) return <div key={dIdx} className="w-4 h-4 " />;
                                                const key = formatDate(day);
                                                const count = activityMap.get(key) || 0;
                                                return (
                                                    <div
                                                        key={dIdx}
                                                        title={`${key}: ${count} match${count !== 1 ? "es" : ""}`}
                                                        className={`w-4 h-4 rounded-sm ${getColor(count)} hover:scale-105 transition-transform bg-opacity-70`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
