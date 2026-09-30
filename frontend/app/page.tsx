import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <main className="max-w-5xl mx-auto space-y-12 mt-10">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
            Sistem Informasi <span className="text-blue-600">Terpadu</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Selamat datang di Dashboard Utama. Pantau fasilitas dan layanan secara real-time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/cctv" className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Live CCTV</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Pantau seluruh kamera laboratorium (Lab Sisdig, Lab OS, Lab Programming, Lab Riset) secara real-time.
            </p>
          </Link>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 opacity-70 cursor-not-allowed">
             <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-500">Menu Mendatang</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Modul tambahan akan tersedia di pembaruan selanjutnya.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
