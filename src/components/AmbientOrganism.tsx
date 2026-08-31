export default function AmbientOrganism() {
  return (
    <div className="ambientOrganism" aria-hidden="true">
      <span className="ambientFrame ambientFrameA"><i /><i /><i /></span>
      <span className="ambientFrame ambientFrameB"><i /><i /></span>
      <span className="ambientAxis ambientAxisA" />
      <span className="ambientAxis ambientAxisB" />
      <span className="ambientDimension"><i /><b>8 600</b><i /></span>
      <span className="ambientTriangle"><i /><i /><i /><b>3 / 4 / 5</b></span>
      <span className="ambientCompass"><b>N</b><i /><em>32°</em></span>
      <span className="ambientLevel">±0.000 / DATUM</span>
      <span className="ambientSurface">A / 128.40 m²</span>
    </div>
  );
}
