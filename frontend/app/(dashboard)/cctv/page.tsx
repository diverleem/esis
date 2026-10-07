"use client";

import Link from "next/link";
import { useState } from "react";

export default function CCTVPage() {
    const cameras = [
        { id: 1, name: "Lab Sisdig", url: "https://stream.ucim.my.id/cam_lab_sisdig" },
        { id: 2, name: "Lab OS", url: "https://stream.ucim.my.id/cam_lab_os" },
        { id: 3, name: "Lab Programming", url: "https://stream.ucim.my.id/cam_lab_programming" },
        { id: 4, name: "Lab Riset Lt 5", url: "https://stream.ucim.my.id/cam_lab_riset_lt5" },
        { id: 5, name: "Lab ELC", url: "https://stream.ucim.my.id/cam_lab_elc" },
        { id: 6, name: "Lab Jaringan", url: "https://stream.ucim.my.id/cam_lab_jaringan" },
        { id: 7, name: "Lab Multimedia 1", url: "https://stream.ucim.my.id/cam_lab_multimedia1" },
        { id: 8, name: "Lab Multimedia 2", url: "https://stream.ucim.my.id/cam_lab_multimedia2" },
        { id: 9, name: "Lab APL 1", url: "https://stream.ucim.my.id/cam_lab_apl1" },
        { id: 10, name: "Lab APL 2", url: "https://stream.ucim.my.id/cam_lab_apl2" },
        { id: 11, name: "Lab Riset Lt 6", url: "https://stream.ucim.my.id/cam_lab_riset_lt6" },
        { id: 12, name: "Lab Tambang", url: "https://stream.ucim.my.id/cam_lab_tambang" },
        { id: 13, name: "Lab Matematika", url: "https://stream.ucim.my.id/cam_lab_mtk" },
    ];

    const [viewMode, setViewMode] = useState<"all" | "single">("all");
    const [selectedCamId, setSelectedCamId] = useState<number>(1);

    const activeCamera = cameras.find((c) => c.id === selectedCamId) || cameras[0];

    return (
        <div className="text-slate-900 dark:text-white font-sans p-4 sm:p-5 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-5 gap-4">
                    <div>
                        {/* Tombol kembali ke halaman Dashboard Utama */}
                        <Link
                            href="/"
                            className="inline-flex items-center text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-3 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Kembali ke Dashboard
                        </Link>
                        <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 dark:text-white mb-1.5">
                            Live CCTV Monitoring
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-[13px]">
                            Real-time camera feeds from laboratory facilities
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                        <div className="flex items-center space-x-2 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-neutral-700 shadow-sm transition-colors">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">System Online</span>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex bg-slate-200 dark:bg-neutral-800 p-1 rounded-lg w-full md:w-auto transition-colors">
                            <button
                                onClick={() => setViewMode("all")}
                                className={`flex-1 md:flex-none px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${viewMode === "all" ? "bg-white dark:bg-neutral-900 text-blue-700 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                            >
                                Tampil Semua
                            </button>
                            <button
                                onClick={() => setViewMode("single")}
                                className={`flex-1 md:flex-none px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${viewMode === "single" ? "bg-white dark:bg-neutral-900 text-blue-700 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                            >
                                Tampil 1 per 1
                            </button>
                        </div>
                    </div>
                </div>

                {/* Single View Mode - Camera Selector */}
                {viewMode === "single" && (
                    <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
                        {cameras.map((cam) => (
                            <button
                                key={cam.id}
                                onClick={() => setSelectedCamId(cam.id)}
                                className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
                                    selectedCamId === cam.id
                                        ? "bg-blue-600 dark:bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-white dark:bg-neutral-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-neutral-800"
                                }`}
                            >
                                {cam.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* CCTV Grid or Single View */}
                <div
                    className={viewMode === "all" ? "grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6" : "w-full max-w-3xl mx-auto"}
                >
                    {(viewMode === "all" ? cameras : [activeCamera]).map((cam) => (
                        <div
                            key={cam.id}
                            className={`group relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg ${viewMode === "single" ? "shadow-md" : ""}`}
                        >
                            {/* Overlay Header on top of stream */}
                            <div className="absolute top-0 left-0 w-full p-3 flex items-center justify-between z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base font-bold text-white drop-shadow-md">{cam.name}</h2>
                                </div>
                                <div className="flex items-center space-x-1.5 bg-red-500/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    <span className="text-[11px] font-bold text-white tracking-wider">LIVE</span>
                                </div>
                            </div>

                            {/* Stream Container */}
                            <div className="w-full aspect-video bg-neutral-950 relative">
                                <iframe
                                    src={cam.url}
                                    className="w-full h-full border-none absolute inset-0"
                                    allowFullScreen
                                    title={`CCTV Camera ${cam.name}`}
                                />
                            </div>

                            {/* Footer Status */}
                            <div className="px-3 py-2 bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 flex justify-between items-center text-[11px] text-slate-500 font-mono transition-colors">
                                <span className="font-semibold text-slate-600 dark:text-slate-400">
                                    CAM_{cam.id.toString().padStart(2, "0")}
                                </span>
                                <span className="flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Signal OK</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
