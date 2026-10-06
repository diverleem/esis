"use client";

import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { BarChart as BarChartIcon, DollarSign, CheckSquare, FileText, Activity } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Data Mock untuk Area Chart (This Month)
const areaData = [
    { name: "SEP", series1: 25, series2: 12 },
    { name: "OCT", series1: 45, series2: 25 },
    { name: "NOV", series1: 28, series2: 15 },
    { name: "DEC", series1: 50, series2: 45 },
    { name: "JAN", series1: 25, series2: 15 },
    { name: "FEB", series1: 45, series2: 30 },
];

// Data Mock untuk Bar Chart (Weekly Revenue/Violations)
const barData = [
    { name: "17", val1: 40, val2: 20, val3: 15 },
    { name: "18", val1: 30, val2: 25, val3: 10 },
    { name: "19", val1: 20, val2: 35, val3: 20 },
    { name: "20", val1: 50, val2: 20, val3: 15 },
    { name: "21", val1: 35, val2: 30, val3: 25 },
    { name: "22", val1: 45, val2: 25, val3: 20 },
    { name: "23", val1: 25, val2: 40, val3: 10 },
    { name: "24", val1: 55, val2: 20, val3: 15 },
    { name: "25", val1: 30, val2: 35, val3: 25 },
];

export default function DashboardPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && theme === "dark";

    return (
        <div className="space-y-5">
            {/* Bagian Atas: 6 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <BarChartIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Total Pelanggaran</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">1,245</h4>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Estimasi Kerugian</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">$642.39</h4>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Kamera Aktif</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">4 / 4</h4>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Verifikasi Selesai</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">145</h4>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Total Laporan</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">433</h4>
                    </div>
                </div>

                {/* Card 6 */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl flex items-center shadow-[0_4px_12px_rgba(112,144,176,0.06)] border border-[#E0E5F2]/50 dark:border-neutral-800 transition-colors">
                    <div className="w-12 h-12 bg-[#F4F7FE] dark:bg-neutral-950 rounded-full flex items-center justify-center mr-4 text-[#4318FF] dark:text-white shrink-0">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Sistem Uptime</p>
                        <h4 className="text-xl font-bold text-[#2B3674] dark:text-white">99.9%</h4>
                    </div>
                </div>
            </div>

            {/* Bagian Tengah: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Area Chart: Tren Bulanan */}
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-[0_4px_12px_rgba(112,144,176,0.06)] transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2 bg-[#F4F7FE] dark:bg-neutral-950 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#A3AED0] dark:text-slate-300">
                            <span className="w-3 h-3 rounded bg-[#4318FF] inline-block mr-1 opacity-20"></span>
                            This month
                        </div>
                        <button className="w-7 h-7 bg-[#F4F7FE] dark:bg-neutral-950 rounded-lg flex items-center justify-center text-[#4318FF] dark:text-white">
                            <BarChartIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-[#2B3674] dark:text-white leading-tight">37.5K</h2>
                            <p className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Total Dideteksi</p>
                            <p className="text-[13px] font-bold text-[#05CD99] mt-0.5">+2.45%</p>
                        </div>
                        <div className="w-full h-[180px] -mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={areaData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#A3AED0", fontSize: 11 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            backgroundColor: isDark ? "#171717" : "#FFFFFF",
                                            color: isDark ? "#FFFFFF" : "#000000",
                                            fontSize: "13px",
                                        }}
                                    />
                                    {/* Garis pertama (Biru Muda/Cyan) */}
                                    <Line
                                        type="monotone"
                                        dataKey="series2"
                                        stroke="#6AD2FF"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5 }}
                                    />
                                    {/* Garis kedua (Ungu/Biru Tua) */}
                                    <Line
                                        type="monotone"
                                        dataKey="series1"
                                        stroke="#4318FF"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Mingguan */}
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-[0_4px_12px_rgba(112,144,176,0.06)] transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-[#2B3674] dark:text-white">Weekly Activity</h2>
                        <button className="w-7 h-7 bg-[#F4F7FE] dark:bg-neutral-950 rounded-lg flex items-center justify-center text-[#4318FF] dark:text-white">
                            <BarChartIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={8}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#A3AED0", fontSize: 11 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                        backgroundColor: isDark ? "#171717" : "#FFFFFF",
                                        color: isDark ? "#FFFFFF" : "#000000",
                                        fontSize: "13px",
                                    }}
                                />
                                {/* Stacked bar menyesuaikan warna referensi */}
                                <Bar dataKey="val3" stackId="a" fill={isDark ? "#262626" : "#E2E8F0"} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="val2" stackId="a" fill="#4318FF" />
                                <Bar dataKey="val1" stackId="a" fill="#6AD2FF" radius={[0, 0, 6, 6]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bagian Bawah: Tables Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-[0_4px_12px_rgba(112,144,176,0.06)] min-h-[260px] transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-[#2B3674] dark:text-white">Check Table</h2>
                        <button className="text-[#A3AED0] hover:text-[#2B3674] dark:hover:text-white">...</button>
                    </div>
                    {/* Placeholder content for table */}
                    <div className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-500 mt-10 text-center">
                        Data tabel pelanggaran akan dimuat di sini...
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-[0_4px_12px_rgba(112,144,176,0.06)] h-full transition-colors flex flex-col justify-center">
                        <h2 className="text-[13px] font-bold text-[#A3AED0] mb-1">Daily Traffic</h2>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-[#2B3674] dark:text-white">2.579</span>
                            <span className="text-[13px] font-medium text-[#A3AED0] dark:text-slate-400">Visitors</span>
                        </div>
                        <p className="text-[13px] font-bold text-[#05CD99] mt-1">+2.45%</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow-[0_4px_12px_rgba(112,144,176,0.06)] h-full transition-colors flex flex-col items-center justify-center">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h2 className="text-[14px] font-bold text-[#2B3674] dark:text-white">Your Pie Chart</h2>
                            <span className="text-[12px] font-medium text-[#A3AED0] dark:text-slate-400">Monthly ▼</span>
                        </div>
                        {/* Placeholder pie chart */}
                        <div className="w-[100px] h-[100px] rounded-full border-[10px] border-[#4318FF] relative mt-2">
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 border-t-[10px] border-r-[10px] border-[#6AD2FF] rounded-tr-full -mt-[10px] -mr-[10px]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
