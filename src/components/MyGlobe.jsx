import Globe from "react-globe.gl";
import { useEffect, useRef } from "react";

const MyGlobe = () => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;

      // Adjust camera position for better view
      globeEl.current.camera().position.set(250, 250, 350);

      // Adjust controls
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().enablePan = false;
      globeEl.current.controls().minDistance = 350;
      globeEl.current.controls().maxDistance = 350;
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full transform translate-y-4"></div>
      <Globe
        ref={globeEl}
        width={800}
        height={800}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        arcsData={[
          {
            startLat: 40.7128,
            startLng: -74.006,
            endLat: 51.5074,
            endLng: -0.1278,
          },
          {
            startLat: 37.7749,
            startLng: -122.4194,
            endLat: 48.8566,
            endLng: 2.3522,
          },
        ]}
        arcColor={() => "#4299e1"}
        arcDashGap={0.5}
        arcDashLength={0.3}
        arcDashAnimateTime={2000}
        atmosphereColor="#4299e1"
        atmosphereAltitude={0.15}
      />
    </div>
  );
};

export default MyGlobe;
