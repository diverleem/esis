export default function CCTVPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Live CCTV Monitoring</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Camera 01 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col">
            <h2 className="text-lg font-medium mb-3 text-neutral-200 text-center">Camera 01</h2>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
              <iframe 
                src="https://stream.ucim.my.id/cam01" 
                className="w-full h-full border-none"
                allowFullScreen
                title="CCTV Camera 01"
              />
            </div>
          </div>

          {/* Camera 02 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col">
            <h2 className="text-lg font-medium mb-3 text-neutral-200 text-center">Camera 02</h2>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
              <iframe 
                src="https://stream.ucim.my.id/cam02" 
                className="w-full h-full border-none"
                allowFullScreen
                title="CCTV Camera 02"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
