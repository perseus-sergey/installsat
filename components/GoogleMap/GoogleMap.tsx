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
// import styles from './GoogleMap.module.scss';
import { Polyline } from '@/maps/Polyline';
import FillingImg from '../Images/FillingImage';
import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import { LANGUAGE } from '@/models/ui.model';
import { MultiValue } from 'react-select';
import { ISatelliteOption } from '@/models/tblSat.model';
import { Dispatch, SetStateAction } from 'react';

interface IGoogleMapProps {
  apiKey: string;
  mapId: string;
  markerPosition: google.maps.LatLngLiteral;
  zoom: number;
  satGradeList: string[];
  selectedOptions: MultiValue<ISatelliteOption> | null;
  cameraProps: MapCameraProps;
  isMapInfoWindowOpened: boolean;
  mapClickHandler: (e: MapMouseEvent) => void;
  handleCameraChange: (ev: MapCameraChangedEvent) => void;
  markerMoved: (e: google.maps.MapMouseEvent) => void;
  setIsMapInfoWindowOpened: Dispatch<SetStateAction<boolean>>;
}

const {
  // initialCamera,
  marker: { markerImage },
} = SAT_FINDER_META_DATA.googleMap;

const GoogleMap = ({
  apiKey,
  mapId,
  markerPosition,
  zoom,
  cameraProps,
  isMapInfoWindowOpened,
  satGradeList,
  selectedOptions,
  mapClickHandler,
  handleCameraChange,
  setIsMapInfoWindowOpened,
  markerMoved,
}: IGoogleMapProps) => (
  <APIProvider apiKey={apiKey} data-testid="GoogleMap">
    <Map
      style={{ width: '100%', height: '80vh' }}
      onClick={mapClickHandler}
      mapId={mapId}
      defaultCenter={markerPosition}
      // center={markerPosition}
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
          <FillingImg {...markerImage} alt={markerImage.alt[LANGUAGE]} />
          {selectedOptions && selectedOptions.length ? (
            <ul>
              {selectedOptions.map(({ label }) => (
                <li key={label}>{label}</li>
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
