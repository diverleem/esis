export default function CCTVPage() {
    const cameras = [
        { id: 1, name: "Lab Sisdig", url: "https://stream.ucim.my.id/cam_lab_sisdig" },
        { id: 2, name: "Lab OS", url: "https://stream.ucim.my.id/cam_lab_os" },
        { id: 3, name: "Lab Programming", url: "https://stream.ucim.my.id/cam_lab_programming" },
        { id: 4, name: "Lab Riset", url: "https://stream.ucim.my.id/cam_lab_riset" },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center sm:text-left">
                            Live CCTV Monitoring
                        </h1>
                        <p className="text-neutral-400 text-sm text-center sm:text-left">
                            Real-time camera feeds from laboratory facilities
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-neutral-300">System Online</span>
                    </div>
                </div>

                {/* CCTV Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {cameras.map((cam) => (
                        <div
                            key={cam.id}
                            className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl"
                        >
                            {/* Overlay Header on top of stream */}
                            <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-lg font-semibold text-white drop-shadow-md">{cam.name}</h2>
                                </div>
                                <div className="flex items-center space-x-1.5 bg-red-500/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-red-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    <span className="text-xs font-bold text-red-500 tracking-wider">LIVE</span>
                                </div>
                            </div>

                            {/* Stream Container */}
                            <div className="w-full aspect-video bg-black relative">
                                <iframe
                                    src={cam.url}
                                    className="w-full h-full border-none absolute inset-0"
                                    allowFullScreen
                                    title={`CCTV Camera ${cam.name}`}
                                />
                            </div>

                            {/* Footer Status */}
                            <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500 font-mono">
                                <span>CAM_{cam.id.toString().padStart(2, "0")}</span>
                                <span className="flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>Signal OK</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
