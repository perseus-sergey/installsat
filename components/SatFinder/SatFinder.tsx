'use client';

import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import styles from './SatFinder.module.scss';
import {
  MapCameraProps,
  MapCameraChangedEvent,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EUrlSearchParam } from '@/models/url.model';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';
import Fieldset from '../Fieldset/Fieldset';
import {
  ControlComponentSat,
  Group,
  ESelectType,
  MySelect,
  formatGroupSatLabel,
} from '../ReactSelect/ReactSelect';
import { MultiValue, components } from 'react-select';
import { Loader } from '../loaders/Loader';
import EmptyData from '../EmptyData/EmptyData';
import TextButton from '../buttons/TextButton/TextButton';
import GoogleMap from '../GoogleMap/GoogleMap';
import { makeSelectedOptions } from '@/controllers/satFinder.controller';

interface ISatFinderProps {
  apiKey: string;
  mapId: string;
  searchQueryName: EUrlSearchParam;
  groupedSats: Error | IGroupedSatelliteOption[];
}

const { initialCamera } = SAT_FINDER_META_DATA.googleMap;

const SatFinder = ({
  apiKey,
  mapId,
  searchQueryName,
  groupedSats,
}: ISatFinderProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedOptions, setSelectedOptions] =
    useState<MultiValue<ISatelliteOption> | null>(null);
  const [addressInputValue, setAddressInputValue] = useState('');
  const [isMapInfoWindowOpened, setIsMapInfoWindowOpened] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(initialCamera.center);
  const [satGradeList, setSatGradeList] = useState<string[]>(
    searchParams.getAll(searchQueryName)
  );
  const [zoom, setZoom] = useState<number>(initialCamera.zoom);

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(initialCamera);

  useEffect(() => {
    setSelectedOptions(makeSelectedOptions(satGradeList, groupedSats));
    const urlLat = searchParams.get(EUrlSearchParam.LATITUDE);
    const urlLng = searchParams.get(EUrlSearchParam.LONGITUDE);
    if (urlLat && urlLng) {
      const lat = parseFloat(urlLat);
      const lng = parseFloat(urlLng);
      setMarkerPosition({ lat, lng });
      setCameraProps({ center: { lat, lng }, zoom: zoom });
    }
  }, []);

  const getUrlSerPar = useCallback(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const handleCameraChange = (ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
    setZoom(ev.detail.zoom);
  };

  const mapClickHandler = (e: MapMouseEvent) => {
    setIsMapInfoWindowOpened(false);
    const { latLng } = e.detail;
    if (!latLng) return;
    setMarkerPosition(latLng);
    changeMarkerPosition(latLng.lat, latLng.lng);
  };

  const changeMarkerPosition = (lat: number, lng: number) => {
    const urlSePar = getUrlSerPar();
    urlSePar.delete(EUrlSearchParam.LATITUDE);
    urlSePar.delete(EUrlSearchParam.LONGITUDE);
    urlSePar.append(EUrlSearchParam.LATITUDE, `${lat}`);
    urlSePar.append(EUrlSearchParam.LONGITUDE, `${lng}`);
    replace(`${pathname}?${urlSePar.toString()}`);
  };

  const handleSelect = (selected: MultiValue<ISatelliteOption>) => {
    setSelectedOptions(selected);
    const urlSePar = getUrlSerPar();

    urlSePar.delete(EUrlSearchParam.SAT);
    let gradeList: string[] = [];
    setSatGradeList([]);

    selected.forEach((option) => {
      urlSePar.append(EUrlSearchParam.SAT, `${option.value}`);
      gradeList = [...gradeList, `${option.value}`];
    });
    setSatGradeList(gradeList);

    replace(`${pathname}?${urlSePar.toString()}`);
  };

  const formAction = async (formData: FormData) => {
    const addressValue = formData.get('addressInput') as string;
    if (!addressValue) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressValue }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        setCameraProps({ center: { lat, lng }, zoom: zoom });
        changeMarkerPosition(lat, lng);
      } else {
        console.log(
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  };

  if (groupedSats instanceof Error)
    return <EmptyData description={groupedSats.message} />;

  const markerMoved = (e: google.maps.MapMouseEvent) => {
    const latLng = e.latLng;
    if (!latLng) return;

    const lat = latLng.lat();
    const lng = latLng.lng();

    setMarkerPosition({ lat, lng });
    changeMarkerPosition(lat, lng);
  };

  return (
    <>
      <form
        action={formAction}
        name="formDigestInterval"
        id="formDigestInterval"
        className={styles.FormDigestInterval}
        data-testid="SatFinder"
      >
        <Fieldset legendText={'Address'}>
          <input
            type="text"
            name="addressInput"
            id="addressInput"
            value={addressInputValue}
            onChange={(e) => setAddressInputValue(e.target.value)}
          />
          <TextButton
            ariaLabel={'Select'}
            // ariaLabel={submitButton.ariaLabel[LANGUAGE]}
            type="submit"
            id="submitBtn"
            name="submitBtn"
            value="Submit"
          >
            {/* {submitButton.title[LANGUAGE]} */}
            {'Submit'}
          </TextButton>
        </Fieldset>
      </form>
      {/* <Fieldset legendText={fieldsetTitle[LANGUAGE]}> */}
      <div className={styles.formWrapper}>
        <div className={styles.selectsBlock}>
          {groupedSats.length > 0 ? (
            <MySelect
              selectName={ESelectType.SELECT_SATS}
              isMulti
              closeMenuOnSelect
              value={selectedOptions}
              onChange={(selected) => handleSelect(selected)}
              options={groupedSats}
              components={{
                Group,
                Control: ControlComponentSat,
                Input: (props) => (
                  <components.Input
                    {...props}
                    aria-activedescendant={undefined}
                  />
                ),
              }}
              formatGroupLabel={formatGroupSatLabel}
            />
          ) : (
            <h2>
              <Loader /> Loading...
            </h2>
          )}
        </div>
      </div>
      <GoogleMap
        apiKey={apiKey}
        mapId={mapId}
        markerPosition={markerPosition}
        mapClickHandler={mapClickHandler}
        zoom={zoom}
        cameraProps={cameraProps}
        isMapInfoWindowOpened={isMapInfoWindowOpened}
        satGradeList={satGradeList}
        selectedOptions={selectedOptions}
        handleCameraChange={handleCameraChange}
        setIsMapInfoWindowOpened={setIsMapInfoWindowOpened}
        markerMoved={markerMoved}
      />
    </>
  );
};

export default SatFinder;
