(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(dashboard)/cctv/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CCTVPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid2X2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-2x2.mjs [app-client] (ecmascript) <export default as Grid2X2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/colors.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_CAMERAS = [
    {
        id: 1,
        label: "Lab Sisdig",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_sisdig",
        cam_path: "cam_lab_sisdig"
    },
    {
        id: 2,
        label: "Lab OS",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_os",
        cam_path: "cam_lab_os"
    },
    {
        id: 3,
        label: "Lab Programming",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_programming",
        cam_path: "cam_lab_programming"
    },
    {
        id: 4,
        label: "Lab Riset Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_riset_lt5",
        cam_path: "cam_lab_riset_lt5"
    },
    {
        id: 5,
        label: "Lab ELC",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lab_elc",
        cam_path: "cam_lab_elc"
    },
    {
        id: 6,
        label: "Lab Jaringan",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_jaringan",
        cam_path: "cam_lab_jaringan"
    },
    {
        id: 7,
        label: "Lab Multimedia 1",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_multimedia1",
        cam_path: "cam_lab_multimedia1"
    },
    {
        id: 8,
        label: "Lab Multimedia 2",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_multimedia2",
        cam_path: "cam_lab_multimedia2"
    },
    {
        id: 9,
        label: "Lab APL 1",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_apl1",
        cam_path: "cam_lab_apl1"
    },
    {
        id: 10,
        label: "Lab APL 2",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_apl2",
        cam_path: "cam_lab_apl2"
    },
    {
        id: 11,
        label: "Lab Riset Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_riset_lt6",
        cam_path: "cam_lab_riset_lt6"
    },
    {
        id: 12,
        label: "Lab Tambang",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_tambang",
        cam_path: "cam_lab_tambang"
    },
    {
        id: 13,
        label: "Lab Matematika",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lab_mtk",
        cam_path: "cam_lab_mtk"
    },
    {
        id: 14,
        label: "Lobby Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lobby_lt5",
        cam_path: "cam_lobby_lt5"
    },
    {
        id: 15,
        label: "Lorong Kiri Lt 5",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_lorongkiri_lt5",
        cam_path: "cam_lorongkiri_lt5"
    },
    {
        id: 16,
        label: "Ruang Podcast",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_ruang_podcast",
        cam_path: "cam_ruang_podcast"
    },
    {
        id: 17,
        label: "Ruang Server",
        location_group: "Lantai 5 Gedung PLT",
        ecam_path: "ecam_ruang_server",
        cam_path: "cam_ruang_server"
    },
    {
        id: 18,
        label: "Lobby Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lobby_lt6",
        cam_path: "cam_lobby_lt6"
    },
    {
        id: 19,
        label: "Lorong Kanan Lt 6",
        location_group: "Lantai 6 Gedung PLT",
        ecam_path: "ecam_lorongkanan_lt6",
        cam_path: "cam_lorongkanan_lt6"
    }
];
function CCTVPage() {
    _s();
    const [cameras, setCameras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_CAMERAS);
    const [groups, setGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            name: "Lantai 5 Gedung PLT"
        },
        {
            id: 2,
            name: "Lantai 6 Gedung PLT"
        }
    ]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("grid");
    const [selectedCamId, setSelectedCamId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selectedGroup, setSelectedGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [streamReloadKey, setStreamReloadKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [expandedCamera, setExpandedCamera] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Ambil daftar grouping lokasi dinamis
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CCTVPage.useEffect": ()=>{
            fetch("/api/streaming/groups").then({
                "CCTVPage.useEffect": (res)=>res.ok ? res.json() : null
            }["CCTVPage.useEffect"]).then({
                "CCTVPage.useEffect": (data)=>{
                    if (data?.success && Array.isArray(data.groups) && data.groups.length > 0) {
                        setGroups(data.groups);
                    }
                }
            }["CCTVPage.useEffect"]).catch({
                "CCTVPage.useEffect": ()=>{}
            }["CCTVPage.useEffect"]);
        }
    }["CCTVPage.useEffect"], []);
    // Ambil data kamera streaming dinamis dari basis data Supabase / MediaMTX
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CCTVPage.useEffect": ()=>{
            fetch("/api/streaming").then({
                "CCTVPage.useEffect": (res)=>res.ok ? res.json() : null
            }["CCTVPage.useEffect"]).then({
                "CCTVPage.useEffect": (data)=>{
                    if (data?.success && Array.isArray(data.streams) && data.streams.length > 0) {
                        const mapped = data.streams.map({
                            "CCTVPage.useEffect.mapped": (s)=>{
                                const ecam = s.ecam_path || "ecam_cam";
                                const cam = s.cam_path || "cam_cam";
                                const group = s.location_group || "Lantai 5 Gedung PLT";
                                return {
                                    id: s.id,
                                    label: s.label,
                                    location_group: group,
                                    ecam_path: ecam,
                                    cam_path: cam,
                                    hls_source: s.hls_source
                                };
                            }
                        }["CCTVPage.useEffect.mapped"]);
                        setCameras(mapped);
                        if (mapped[0]) {
                            setSelectedCamId(mapped[0].id);
                        }
                    }
                }
            }["CCTVPage.useEffect"]).catch({
                "CCTVPage.useEffect": ()=>{}
            }["CCTVPage.useEffect"]);
        }
    }["CCTVPage.useEffect"], []);
    // Filter Kamera berdasarkan grouping lokasi
    const filteredCameras = cameras.filter((cam)=>{
        if (selectedGroup === "all") return true;
        return cam.location_group === selectedGroup;
    });
    const activeCamera = cameras.find((c)=>String(c.id) === String(selectedCamId)) || cameras[0];
    const handleRefreshAll = ()=>{
        setStreamReloadKey((prev)=>prev + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-5 shadow-2xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2.5 h-2.5 rounded-full bg-emerald-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 256,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
                                            children: "Streaming CCTV Terpadu"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 257,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-slate-900 dark:text-white mt-1",
                                    children: "Matriks Pemantauan CCTV Laboratorium"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
                                    children: "Menampilkan feed video kamera pengawas di Gedung Pusat Laboratorium Terpadu (PLT)."
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 264,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                            lineNumber: 254,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-2.5",
                            children: [
                                viewMode === "grid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2 text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-500 font-medium shrink-0",
                                            children: "Filter Grup:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 274,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: selectedGroup,
                                            onChange: (e)=>setSelectedGroup(e.target.value),
                                            className: "px-3 py-1.5 bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-semibold outline-none focus:border-blue-600 transition-colors cursor-pointer",
                                            "aria-label": "Pilih grup kamera",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: [
                                                        "Semua CCTV (",
                                                        cameras.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 37
                                                }, this),
                                                groups.map((grp)=>{
                                                    const count = cameras.filter((c)=>c.location_group === grp.name).length;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: grp.name,
                                                        children: [
                                                            grp.name,
                                                            " (",
                                                            count,
                                                            ")"
                                                        ]
                                                    }, grp.id, true, {
                                                        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 45
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 275,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 273,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-neutral-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setViewMode("grid"),
                                            className: `px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${viewMode === "grid" ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
                                            title: "Tampilan Matriks Grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid2X2$3e$__["Grid2X2"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Matriks"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 296,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setViewMode("single"),
                                            className: `px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${viewMode === "single" ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-2xs font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
                                            title: "Tampilan Satu Kamera",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Tunggal"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 309,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs border bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 select-none font-medium",
                                    title: "Streaming CCTV otomatis menggunakan Substream (ecam) hemat bandwidth; Mainstream dialokasikan untuk inferensi AI",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 329,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Substream (ecam)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 330,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleRefreshAll,
                                    className: "p-1.5 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-neutral-700 transition-colors",
                                    title: "Muat ulang seluruh stream kamera",
                                    "aria-label": "Muat ulang stream",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 334,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                            lineNumber: 270,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                    lineNumber: 252,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                lineNumber: 251,
                columnNumber: 13
            }, this),
            viewMode === "single" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4 shadow-2xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "single-group-select",
                                    className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
                                    children: "Pilihan Grup CCTV:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 352,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "single-group-select",
                                    value: selectedGroup,
                                    onChange: (e)=>{
                                        const newGrp = e.target.value;
                                        setSelectedGroup(newGrp);
                                        const validCams = newGrp === "all" ? cameras : cameras.filter((c)=>c.location_group === newGrp);
                                        if (validCams.length > 0 && !validCams.some((c)=>String(c.id) === String(selectedCamId))) {
                                            setSelectedCamId(validCams[0].id);
                                        }
                                    },
                                    className: "w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: [
                                                "Semua Grup (",
                                                cameras.length,
                                                " Kamera)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 368,
                                            columnNumber: 33
                                        }, this),
                                        groups.map((grp)=>{
                                            const count = cameras.filter((c)=>c.location_group === grp.name).length;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: grp.name,
                                                children: [
                                                    grp.name,
                                                    " (",
                                                    count,
                                                    " Kamera)"
                                                ]
                                            }, grp.id, true, {
                                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                lineNumber: 372,
                                                columnNumber: 41
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 355,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                            lineNumber: 351,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "single-camera-select",
                                    className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
                                    children: "Pilihan Kamera untuk Ditampilkan:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 381,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "single-camera-select",
                                    value: String(selectedCamId),
                                    onChange: (e)=>{
                                        const val = e.target.value;
                                        const matched = cameras.find((c)=>String(c.id) === val);
                                        if (matched) {
                                            setSelectedCamId(matched.id);
                                        }
                                    },
                                    className: "w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-600 cursor-pointer",
                                    children: filteredCameras.map((cam)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: String(cam.id),
                                            children: [
                                                cam.label,
                                                " (",
                                                cam.location_group,
                                                ")"
                                            ]
                                        }, cam.id, true, {
                                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 384,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                            lineNumber: 380,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                    lineNumber: 350,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                lineNumber: 349,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4" : "w-full max-w-4xl mx-auto",
                children: (viewMode === "grid" ? filteredCameras : [
                    activeCamera
                ]).map((cam)=>{
                    const streamUrl = `https://stream.ucim.my.id/${cam.ecam_path}`;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-neutral-950 border border-slate-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs relative flex flex-col group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3.5 py-2.5 bg-neutral-900/95 border-b border-neutral-800 text-white flex items-center justify-between text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 truncate",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                lineNumber: 426,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-white text-xs truncate leading-tight",
                                                children: cam.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                lineNumber: 427,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                        lineNumber: 425,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2 shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-0.5 rounded text-[10px] font-semibold border ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGroupBadgeColor"])(cam.location_group)}`,
                                                children: cam.location_group
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: streamUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-slate-400 hover:text-white p-1 rounded transition-colors",
                                                title: "Buka Stream Penuh di Tab Baru",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                                lineNumber: 434,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                        lineNumber: 430,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                lineNumber: 424,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full aspect-video bg-black relative flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                    src: streamUrl,
                                    className: "w-full h-full border-none",
                                    allowFullScreen: true,
                                    title: `Feed CCTV ${cam.label}`
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                    lineNumber: 448,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                                lineNumber: 447,
                                columnNumber: 29
                            }, this)
                        ]
                    }, `${cam.id}-${streamReloadKey}`, true, {
                        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                        lineNumber: 419,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/cctv/page.tsx",
                lineNumber: 408,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/cctv/page.tsx",
        lineNumber: 249,
        columnNumber: 9
    }, this);
}
_s(CCTVPage, "1ZU/HD/n7pHiDiBEFDddIPSDXzc=");
_c = CCTVPage;
var _c;
__turbopack_context__.k.register(_c, "CCTVPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/grid-2x2.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Grid2x2
]);
/**
 * @license lucide-react v1.49.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "grid-2x2",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M12 3v18",
                key: "108xh3"
            }
        ],
        [
            "path",
            {
                d: "M3 12h18",
                key: "1i2n21"
            }
        ],
        [
            "rect",
            {
                x: "3",
                y: "3",
                width: "18",
                height: "18",
                rx: "2",
                key: "h1oib"
            }
        ]
    ],
    aliases: [
        "grid-2-x-2"
    ]
};
__iconData.node;
const Grid2x2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/grid-2x2.mjs [app-client] (ecmascript) <export default as Grid2X2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Grid2X2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$2x2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-2x2.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Maximize2
]);
/**
 * @license lucide-react v1.49.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "maximize-2",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M15 3h6v6",
                key: "1q9fwt"
            }
        ],
        [
            "path",
            {
                d: "m21 3-7 7",
                key: "1l2asr"
            }
        ],
        [
            "path",
            {
                d: "m3 21 7-7",
                key: "tjx5ai"
            }
        ],
        [
            "path",
            {
                d: "M9 21H3v-6",
                key: "wtvkvv"
            }
        ]
    ]
};
__iconData.node;
const Maximize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Maximize2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>RotateCcw
]);
/**
 * @license lucide-react v1.49.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "rotate-ccw",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
                key: "1357e3"
            }
        ],
        [
            "path",
            {
                d: "M3 3v5h5",
                key: "1xhq8a"
            }
        ]
    ]
};
__iconData.node;
const RotateCcw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotateCcw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Square
]);
/**
 * @license lucide-react v1.49.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "square",
    size: 24,
    node: [
        [
            "rect",
            {
                width: "18",
                height: "18",
                x: "3",
                y: "3",
                rx: "2",
                key: "afitv7"
            }
        ]
    ]
};
__iconData.node;
const Square = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript) <export default as Square>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Square",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.mjs [app-client] (ecmascript)");
}),
"[project]/utils/colors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility untuk mendapatkan styling warna badge grouping lokasi CCTV secara konsisten dan berbeda-beda
 */ __turbopack_context__.s([
    "getGroupBadgeColor",
    ()=>getGroupBadgeColor
]);
function getGroupBadgeColor(groupName) {
    if (!groupName) {
        return "bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-slate-300 border-slate-200 dark:border-neutral-700";
    }
    const lower = groupName.toLowerCase();
    // Lantai 5 -> Nuansa Indigo/Biru
    if (lower.includes("5") || lower.includes("lima")) {
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80";
    }
    // Lantai 6 -> Nuansa Ungu/Violet
    if (lower.includes("6") || lower.includes("enam")) {
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800/80";
    }
    // Variasi grup lainnya
    const palette = [
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
        "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/80",
        "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/80",
        "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/80",
        "bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800/80"
    ];
    let hash = 0;
    for(let i = 0; i < groupName.length; i++){
        hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1l1_2lz._.js.map