window.CESIUM_BASE_URL = "./Cesium/";

import * as C from "cesium";

C.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg5MmViYWQiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE";

const viewer = new C.Viewer("cesiumContainer", {
  // imageryProvider: new C.UrlTemplateImageryProvider({
  //   url: "http://localhost:7777/services/maptiles/tiles/{z}/{x}/{y}.png",
  //   maximumLevel: 16,
  // }),
  // terrainProvider: C.createWorldTerrain(),
  terrainProvider: new C.CesiumTerrainProvider({
    url: C.IonResource.fromAssetId(770371), // pleatau terrain
    requestVertexNormals: true,
  }),
  requestVertexNormals: true,
  animation: false,
  baseLayerPicker: false,
  // fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  //infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  // navigationInstructionsInitiallyVisible: false,
  scene3DOnly: true,
  clockViewModel: null,

  requestRenderMode: true,
  maximumRenderTimeChange: 60,
  // shadows: true,
  // terrainShadows: C.ShadowMode.ENABLED,
});
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.maximumScreenSpaceError = 1; // if more refine terrain
// viewer.shadowMap.maximumDistance = 1000.0;
// viewer.shadowMap.softShadows = true;
// viewer.shadowMap.size = 4096;
viewer.clock.multiplier = 1;
viewer.clock.shouldAnimate = true;
viewer.clock.currentTime.secondsOfDay = (8 + 3) * 3600;

// viewer.scene.primitives.add(C.createOsmBuildings());
viewer.scene.primitives.add(
  new C.Cesium3DTileset({ url: "./3dtiles/14382_hakone-machi_building/bldg_notexture/tileset.json" })
);

viewer.camera.flyTo({
  destination: new C.Cartesian3(-3943063.736175449, 3414581.6352823335, 3658893.0310073597),
  orientation: {
    direction: new C.Cartesian3(0.8705384941672791, 0.3972954727045973, 0.29037740535619644),
    up: new C.Cartesian3(-0.4863750620101659, 0.6049005745075724, 0.630503444887509),
  },
});

viewer.dataSources.add(
  C.GeoJsonDataSource.load("./a.geojson", {
    stroke: C.Color.RED,
    strokeWidth: 1,
  })
);

let voxels = null;
fetch("./b.geojson")
  .then((response) => response.json())
  .then((data) => {
    voxels = data.features.map(({ geometry }, i) => {
      const [lon, lat, height] = geometry.coordinates;
      return viewer.entities.add({
        name: `Voxel ${i}`,
        position: C.Cartesian3.fromDegrees(lon, lat, height),
        box: {
          dimensions: new C.Cartesian3(10, 10, 10),
          material: C.Color.SILVER.withAlpha(0.1),
          outline: true,
          outlineColor: C.Color.SILVER,
        },
      });
    });
  });
