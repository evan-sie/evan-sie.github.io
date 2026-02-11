#!/usr/bin/env node
/**
 * extract-wireframe.mjs
 * ---------------------
 * Extracts clean feature edges from a GLTF model using dual-criteria filtering
 * with PER-ZONE spatial thresholds.
 *
 * Each zone defines a bounding box and its own threshold / minLength values.
 * Edges are classified by their midpoint location. First matching zone wins.
 * Edges outside all zones use the global defaults.
 *
 * Usage:
 *   node scripts/extract-wireframe.mjs [options]
 *
 * Options:
 *   --input <path>           Input GLTF file (default: public/sr71.gltf)
 *   --output <path>          Output JSON file (default: public/sr71-wireframe.json)
 *   --threshold <deg>        Global dihedral angle threshold (default: 13.75)
 *   --min-length <val>       Global minimum edge length (default: 1.8)
 *   --feature-length <val>   Edges longer than this are always kept (default: 35)
 *   --no-zones               Disable per-zone filtering
 *   --boundary / --no-boundary   Include/exclude boundary edges
 *   --stats                  Print detailed statistics
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                        SPATIAL ZONE DEFINITIONS                              ║
// ║                                                                              ║
// ║  Model coords: X=lateral (0→98), Y=vertical (9→37), Z=fore-aft (19→215)    ║
// ║  Center X ≈ 49                                                               ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// NOTE: Model coords vs visual appearance (MESH_ROTATION_Y = π):
//   High Z in model = NOSE/COCKPIT area (Visually forward)
//   Low Z in model  = TAIL/EXHAUST area (Visually aft)
//   High X in model = LEFT wing/engine (Visually left)
//   Low X in model  = RIGHT wing/engine (Visually right)

const ZONES = [
    {
        name: "Engine Intakes (Right)",
        // Model X 15-38 (Right side)
        // High Z (Visually forward) = Intake Cones
        xMin: 15, xMax: 38, yMin: 8, yMax: 38, zMin: 95, zMax: 150,
        threshold: 8,
        minLength: 0.5,
    },
    {
        name: "Engine Intakes (Left)",
        // Model X 60-83 (Left side) 
        // High Z (Visually forward) = Intake Cones
        xMin: 60, xMax: 83, yMin: 8, yMax: 38, zMin: 95, zMax: 150,
        threshold: 10,
        minLength: 2,
    },
    {
        name: "Cockpit / Nose",
        // High Z (Visually forward) = Nose tip and canopy
        xMin: 35, xMax: 63, yMin: 8, yMax: 38, zMin: 160, zMax: 215,
        threshold: 10,
        minLength: 0.8,
    },
    {
        name: "Tail / Rudders",
        // Low Z (Visually aft) = Vertical fins and exhaust area
        xMin: 0, xMax: 98, yMin: 8, yMax: 38, zMin: 19, zMax: 60,
        threshold: 8,
        minLength: 8,
    },
    {
        name: "Right Wing",
        // Low X (Visually right) = Outboard wing panel
        xMin: 0, xMax: 15, yMin: 8, yMax: 38, zMin: 19, zMax: 215,
        threshold: 10,
        minLength: 0.8,
    },
    {
        name: "Left Wing",
        // High X (Visually left) = Outboard wing panel
        xMin: 83, xMax: 98, yMin: 8, yMax: 38, zMin: 19, zMax: 215,
        threshold: 1,
        minLength: 0.8,
    },
    {
        name: "Engine Exhaust Area",
        // Low Z (Visually aft) = Lower nacelle rear section
        xMin: 15, xMax: 83, yMin: 8, yMax: 22, zMin: 20, zMax: 85,
        threshold: 20,
        minLength: 2.0,
    },
    // Everything else falls through to global defaults (fuselage body)
];

// ── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        input: "public/sr71.gltf",
        output: "public/sr71-wireframe.json",
        threshold: 13.75,
        minLength: 1.8,
        featureLength: 35,
        boundary: true,
        zones: true,
        stats: false,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--input": opts.input = args[++i]; break;
            case "--output": opts.output = args[++i]; break;
            case "--threshold": opts.threshold = parseFloat(args[++i]); break;
            case "--min-length": opts.minLength = parseFloat(args[++i]); break;
            case "--feature-length": opts.featureLength = parseFloat(args[++i]); break;
            case "--boundary": opts.boundary = true; break;
            case "--no-boundary": opts.boundary = false; break;
            case "--no-zones": opts.zones = false; break;
            case "--stats": opts.stats = true; break;
            default:
                console.warn(`Unknown option: ${args[i]}`);
        }
    }
    return opts;
}

// ── Vector math ──────────────────────────────────────────────────────────────

function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vecLength(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]); }
function normalize(v) {
    const l = vecLength(v);
    return l > 0 ? [v[0] / l, v[1] / l, v[2] / l] : [0, 0, 0];
}
function dist(a, b) { return vecLength(sub(a, b)); }
function midpoint(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; }

// ── Zone lookup ──────────────────────────────────────────────────────────────

function findZone(point) {
    for (const zone of ZONES) {
        if (
            point[0] >= zone.xMin && point[0] <= zone.xMax &&
            point[1] >= zone.yMin && point[1] <= zone.yMax &&
            point[2] >= zone.zMin && point[2] <= zone.zMax
        ) {
            return zone;
        }
    }
    return null; // Use global defaults
}

// ── GLTF parser ──────────────────────────────────────────────────────────────

function loadGLTF(gltfPath) {
    const gltfDir = dirname(resolve(gltfPath));
    const gltf = JSON.parse(readFileSync(resolve(gltfPath), "utf-8"));
    const buffer = readFileSync(resolve(gltfDir, gltf.buffers[0].uri));

    const posAccessor = gltf.accessors[0];
    const posView = gltf.bufferViews[posAccessor.bufferView];
    const posOffset = (posView.byteOffset || 0) + (posAccessor.byteOffset || 0);
    const posCount = posAccessor.count;
    const positions = new Float32Array(buffer.buffer, buffer.byteOffset + posOffset, posCount * 3);

    const idxAccessor = gltf.accessors[1];
    const idxView = gltf.bufferViews[idxAccessor.bufferView];
    const idxOffset = (idxView.byteOffset || 0) + (idxAccessor.byteOffset || 0);
    const idxCount = idxAccessor.count;

    let indices;
    if (idxAccessor.componentType === 5123) {
        indices = new Uint16Array(buffer.buffer, buffer.byteOffset + idxOffset, idxCount);
    } else if (idxAccessor.componentType === 5125) {
        indices = new Uint32Array(buffer.buffer, buffer.byteOffset + idxOffset, idxCount);
    } else {
        throw new Error(`Unsupported index component type: ${idxAccessor.componentType}`);
    }

    return { positions, indices, vertexCount: posCount, triangleCount: idxCount / 3 };
}

// ── Edge key utility ─────────────────────────────────────────────────────────

function edgeKey(a, b) {
    return a < b ? `${a}_${b}` : `${b}_${a}`;
}

// ── Main extraction ──────────────────────────────────────────────────────────

function extractFeatureEdges(gltfPath, opts) {
    console.log(`\n🔧 Loading model: ${gltfPath}`);
    const { positions, indices, vertexCount, triangleCount } = loadGLTF(gltfPath);
    console.log(`   ${vertexCount} vertices, ${triangleCount} triangles`);

    const getVertex = (i) => [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];

    // Step 1: Compute face normals
    console.log(`\n📐 Computing face normals...`);
    const faceNormals = [];
    for (let f = 0; f < triangleCount; f++) {
        const i0 = indices[f * 3], i1 = indices[f * 3 + 1], i2 = indices[f * 3 + 2];
        const v0 = getVertex(i0), v1 = getVertex(i1), v2 = getVertex(i2);
        faceNormals.push(normalize(cross(sub(v1, v0), sub(v2, v0))));
    }

    // Step 2: Build edge → face adjacency map
    console.log(`📊 Building edge adjacency map...`);
    const edgeFaces = new Map();
    for (let f = 0; f < triangleCount; f++) {
        const i0 = indices[f * 3], i1 = indices[f * 3 + 1], i2 = indices[f * 3 + 2];
        for (const ek of [edgeKey(i0, i1), edgeKey(i1, i2), edgeKey(i2, i0)]) {
            if (!edgeFaces.has(ek)) edgeFaces.set(ek, []);
            edgeFaces.get(ek).push(f);
        }
    }
    console.log(`   ${edgeFaces.size} unique edges found`);

    // Step 3: Per-zone filtering
    const useZones = opts.zones && ZONES.length > 0;

    console.log(`\n🔍 Filtering edges:`);
    console.log(`   Global defaults: threshold=${opts.threshold}°, minLength=${opts.minLength}`);
    console.log(`   Feature length (always keep): ${opts.featureLength}`);
    console.log(`   Zone filtering: ${useZones ? "ENABLED" : "DISABLED"}`);

    if (useZones) {
        console.log(`\n   📍 Zones:`);
        for (const z of ZONES) {
            console.log(`      ${z.name}: threshold=${z.threshold}°, minLength=${z.minLength}`);
        }
    }

    const featureEdges = [];
    const globalThresholdRad = (opts.threshold * Math.PI) / 180;

    // Per-zone stats
    const zoneStats = {};
    for (const z of ZONES) {
        zoneStats[z.name] = { sharp: 0, tooShort: 0, coplanar: 0 };
    }
    zoneStats["Fuselage (default)"] = { sharp: 0, tooShort: 0, coplanar: 0 };
    let stats = { sharp: 0, long: 0, boundary: 0, tooShort: 0, coplanar: 0, nonManifold: 0 };

    for (const [ek, faces] of edgeFaces) {
        const [aStr, bStr] = ek.split("_");
        const a = parseInt(aStr), b = parseInt(bStr);
        const va = getVertex(a), vb = getVertex(b);
        const edgeLen = dist(va, vb);
        const mid = midpoint(va, vb);

        // Determine zone and its thresholds
        const zone = useZones ? findZone(mid) : null;
        const zoneName = zone ? zone.name : "Fuselage (default)";
        const localThreshold = zone ? zone.threshold : opts.threshold;
        const localMinLength = zone ? zone.minLength : opts.minLength;
        const localThresholdRad = (localThreshold * Math.PI) / 180;

        // Hard floor: remove micro-edges based on zone-specific minLength
        if (edgeLen < localMinLength) {
            stats.tooShort++;
            zoneStats[zoneName].tooShort++;
            continue;
        }

        if (faces.length === 1) {
            if (opts.boundary) {
                featureEdges.push([a, b]);
                stats.boundary++;
            }
        } else if (faces.length === 2) {
            const n1 = faceNormals[faces[0]];
            const n2 = faceNormals[faces[1]];
            const cosAngle = dot(n1, n2);
            const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

            // Criterion A: Sharp edge (zone-specific threshold)
            if (angle > localThresholdRad) {
                featureEdges.push([a, b]);
                stats.sharp++;
                zoneStats[zoneName].sharp++;
            }
            // Criterion B: Long structural edge (global feature length)
            else if (edgeLen > opts.featureLength) {
                featureEdges.push([a, b]);
                stats.long++;
            }
            else {
                stats.coplanar++;
                zoneStats[zoneName].coplanar++;
            }
        } else {
            featureEdges.push([a, b]);
            stats.nonManifold++;
        }
    }

    // Print results
    console.log(`\n   Results:`);
    console.log(`   ├─ ${stats.sharp} sharp edges`);
    console.log(`   ├─ ${stats.long} long structural edges (length > ${opts.featureLength})`);
    console.log(`   ├─ ${stats.boundary} boundary edges`);
    console.log(`   ├─ ${stats.nonManifold} non-manifold edges`);
    console.log(`   ├─ ${stats.tooShort} removed (too short)`);
    console.log(`   ├─ ${stats.coplanar} removed (coplanar)`);
    console.log(`   └─ ${featureEdges.length} TOTAL kept`);

    if (useZones) {
        console.log(`\n   📍 Per-zone breakdown:`);
        for (const [name, zs] of Object.entries(zoneStats)) {
            const total = zs.sharp + zs.tooShort + zs.coplanar;
            if (total > 0) {
                console.log(`      ${name}: ${zs.sharp} kept, ${zs.tooShort} too-short, ${zs.coplanar} coplanar`);
            }
        }
    }

    // Step 4: Build compact output
    const usedVertices = new Set();
    for (const [a, b] of featureEdges) {
        usedVertices.add(a);
        usedVertices.add(b);
    }

    const vertexMap = new Map();
    const outVertices = [];
    let idx = 0;
    for (const v of usedVertices) {
        vertexMap.set(v, idx++);
        const pos = getVertex(v);
        outVertices.push(pos[0], pos[1], pos[2]);
    }

    const outIndices = [];
    for (const [a, b] of featureEdges) {
        outIndices.push(vertexMap.get(a), vertexMap.get(b));
    }

    console.log(`\n📦 Output: ${outVertices.length / 3} vertices, ${outIndices.length / 2} line segments`);

    return {
        vertices: outVertices,
        indices: outIndices,
        meta: {
            sourceVertices: vertexCount,
            sourceTriangles: triangleCount,
            sourceEdges: edgeFaces.size,
            featureEdges: featureEdges.length,
            ...stats,
            threshold: opts.threshold,
            minLength: opts.minLength,
            featureLength: opts.featureLength,
            zonesEnabled: useZones,
        },
    };
}

// ── Run ──────────────────────────────────────────────────────────────────────

const opts = parseArgs();
const result = extractFeatureEdges(opts.input, opts);

writeFileSync(resolve(opts.output), JSON.stringify(result));
console.log(`\n✅ Written to ${opts.output}`);
console.log(`   File size: ${(JSON.stringify(result).length / 1024).toFixed(1)} KB`);

if (opts.stats) {
    console.log("\n📊 Full stats:");
    console.log(JSON.stringify(result.meta, null, 2));
}
