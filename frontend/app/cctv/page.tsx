import Link from 'next/link';

export default function CCTVPage() {
    const cameras = [
        { id: 1, name: "Lab Sisdig", url: "https://stream.ucim.my.id/cam_lab_sisdig" },
        { id: 2, name: "Lab OS", url: "https://stream.ucim.my.id/cam_lab_os" },
        { id: 3, name: "Lab Programming", url: "https://stream.ucim.my.id/cam_lab_programming" },
        { id: 4, name: "Lab Riset", url: "https://stream.ucim.my.id/cam_lab_riset" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Home
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mb-2">
                            Live CCTV Monitoring
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Real-time camera feeds from laboratory facilities
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-semibold text-slate-700">System Online</span>
                    </div>
                </div>

                {/* CCTV Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {cameras.map((cam) => (
                        <div
                            key={cam.id}
                            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
                        >
                            {/* Overlay Header on top of stream */}
                            <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-lg font-bold text-white drop-shadow-md">{cam.name}</h2>
                                </div>
                                <div className="flex items-center space-x-1.5 bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    <span className="text-xs font-bold text-white tracking-wider">LIVE</span>
                                </div>
                            </div>

                            {/* Stream Container */}
                            <div className="w-full aspect-video bg-slate-900 relative">
                                <iframe
                                    src={cam.url}
                                    className="w-full h-full border-none absolute inset-0"
                                    allowFullScreen
                                    title={`CCTV Camera ${cam.name}`}
                                />
                            </div>

                            {/* Footer Status */}
                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
                                <span className="font-semibold text-slate-600">CAM_{cam.id.toString().padStart(2, "0")}</span>
                                <span className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="font-medium text-slate-600">Signal OK</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
