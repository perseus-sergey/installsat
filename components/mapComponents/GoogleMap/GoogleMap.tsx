import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapCameraProps,
  MapCameraChangedEvent,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { Polyline } from '@/components/mapComponents/Polyline';
import FillingImg from '../../ui/Images/FillingImage';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { Dispatch, SetStateAction } from 'react';
import { ELanguage } from '@/models/ui.model';

interface IGoogleMapProps {
  lang: ELanguage;
  apiKey: string;
  mapId: string;
  markerPosition: google.maps.LatLngLiteral;
  zoom: number;
  satGradeList: string[];
  cameraProps: MapCameraProps;
  isMapInfoWindowOpened: boolean;
  mapClickHandler: (e: MapMouseEvent) => void;
  handleCameraChange: (ev: MapCameraChangedEvent) => void;
  markerMoved: (e: google.maps.MapMouseEvent) => void;
  setIsMapInfoWindowOpened: Dispatch<SetStateAction<boolean>>;
}

const {
  marker: { markerImage },
} = SAT_FINDER_META_DATA.googleMap;

const GoogleMap = ({
  lang,
  apiKey,
  mapId,
  markerPosition,
  zoom,
  cameraProps,
  isMapInfoWindowOpened,
  satGradeList,
  mapClickHandler,
  handleCameraChange,
  setIsMapInfoWindowOpened,
  markerMoved,
}: IGoogleMapProps) => (
  <APIProvider apiKey={apiKey}>
    <Map
      style={{ width: '100%', height: '80vh' }}
      onClick={mapClickHandler}
      mapId={mapId}
      defaultCenter={markerPosition}
      defaultZoom={zoom}
      gestureHandling={'greedy'}
      mapTypeId="hybrid"
      tilt={45}
      {...cameraProps}
      onCameraChanged={handleCameraChange}
      // disableDefaultUI={true}
    >
      <AdvancedMarker
        draggable={true}
        position={markerPosition}
        onClick={() => setIsMapInfoWindowOpened(true)}
        onDragEnd={markerMoved}
      >
        <Pin
          borderColor={'purple'}
          background={'#cbdafa'}
          glyphColor={'#FF0000'}
        />
      </AdvancedMarker>
      {isMapInfoWindowOpened && (
        <InfoWindow
          position={markerPosition}
          onCloseClick={() => setIsMapInfoWindowOpened(false)}
        >
          <FillingImg {...markerImage} alt={markerImage.alt[lang]} />
          {satGradeList && satGradeList.length ? (
            <ul>
              {satGradeList.map((grade) => (
                <li key={grade}>
                  {Math.abs(Number(grade))}°{Number(grade) > 0 ? `E` : `W`}
                </li>
              ))}
            </ul>
          ) : null}
        </InfoWindow>
      )}
      {satGradeList.length > 0 &&
        satGradeList.map((sat) => {
          return (
            <Polyline
              key={sat}
              geodesic={true}
              strokeColor="#FFFF00"
              strokeOpacity={1.0}
              strokeWeight={2}
              path={[markerPosition, { lat: 0, lng: parseFloat(sat) }]}
            />
          );
        })}
    </Map>
  </APIProvider>
);

export default GoogleMap;
