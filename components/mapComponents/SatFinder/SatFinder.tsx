'use client';

import { SAT_FINDER_META_DATA } from '@/models/satFinder.model';
import {
  MapCameraChangedEvent,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import Fieldset from '../../ui/Fieldset/Fieldset';
import GoogleMap from '../GoogleMap/GoogleMap';
import StyledInputField from '../../ui/StyledInputField/StyledInputField';
import { ELanguage } from '@/models/language.model';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import Image from 'next/image';
import searchBtnImg from 'public/Images/global-search.png';

interface ISatFinderProps {
  apiKey: string;
  mapId: string;
  searchQueryName: EUrlSearchParam;
  lang: ELanguage;
  satelliteSelector: React.ReactNode;
}

const {
  googleMap: { initialCamera },
  searchForm: { inputField, submitButton, fieldsetTitle },
} = SAT_FINDER_META_DATA;

const SatFinder = ({
  apiKey,
  mapId,
  searchQueryName,
  lang,
  satelliteSelector,
}: ISatFinderProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [addressInputValue, setAddressInputValue] = useState('');
  const [isMapInfoWindowOpened, setIsMapInfoWindowOpened] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(initialCamera.center);
  const [satGradeList, setSatGradeList] = useState<string[]>([]);
  const [zoom, setZoom] = useState(initialCamera.zoom);
  const [cameraProps, setCameraProps] = useState(initialCamera);

  useEffect(() => {
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

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
    setZoom(ev.detail.zoom);
  }, []);

  const mapClickHandler = useCallback(
    (e: MapMouseEvent) => {
      setIsMapInfoWindowOpened(false);
      const { latLng } = e.detail;
      if (!latLng) return;
      setMarkerPosition(latLng);
      changeMarkerPosition(latLng.lat, latLng.lng);
    },
    [getUrlSerPar, replace, pathname]
  );

  const changeMarkerPosition = useCallback(
    (lat: number, lng: number) => {
      const urlSePar = getUrlSerPar();
      urlSePar.delete(EUrlSearchParam.LATITUDE);
      urlSePar.delete(EUrlSearchParam.LONGITUDE);
      urlSePar.append(EUrlSearchParam.LATITUDE, `${lat}`);
      urlSePar.append(EUrlSearchParam.LONGITUDE, `${lng}`);
      replace(`${pathname}?${urlSePar.toString()}`, { scroll: false });
    },
    [getUrlSerPar, replace, pathname]
  );

  useEffect(() => {
    setSatGradeList(searchParams.getAll(searchQueryName));
  }, [searchParams, searchQueryName]);

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
        console.log(`Geocode failed: ${status}`);
      }
    });
  };

  const markerMoved = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;
      if (!latLng) return;

      const lat = latLng.lat();
      const lng = latLng.lng();

      setMarkerPosition({ lat, lng });
      changeMarkerPosition(lat, lng);
    },
    [changeMarkerPosition]
  );

  return (
    <>
      <Fieldset
        legendText={fieldsetTitle[lang]}
        className="p-4 my-4 mx-auto w-full"
      >
        <form
          action={formAction}
          name="formDigestInterval"
          id="formDigestInterval"
          data-testid="SatFinder"
        >
          <div className="flex flex-wrap items-center gap-4 pb-4 justify-center sm:justify-normal">
            <StyledInputField
              idName="addressInput"
              value={addressInputValue}
              handleOnChange={setAddressInputValue}
              placeholder={inputField.placeholder[lang]}
              hiddenLabelTitle={inputField.labelName[lang]}
              cancelBtnAriaLabel={inputField.cancelBtnAriaLabel[lang]}
              searchIconStr={inputField.searchIconStr}
              cancelClick={() => setAddressInputValue('')}
              widthPx={280}
            />
            <BaseButton
              className="w-11 h-11 flex items-center justify-center rounded-lg
              bg-gradient-to-b from-stone-100 via-gray-200 via-40% to-neutral-400 hover:to-lime-400 shadow-[inset_0px_1px_1px_white,_0px_1px_3px_rgba(0,_0,_0,_0.5)]"
              ariaLabel={submitButton.ariaLabel[lang]}
              type="submit"
              id="submitBtn"
            >
              <Image
                src={searchBtnImg}
                alt={
                  lang === ELanguage.UA
                    ? 'Схематичне зображення збільшуваного скла поруч із глобусом'
                    : 'Schematic illustration of a magnifying glass next to a globe'
                }
              />
            </BaseButton>
          </div>
        </form>

        <Suspense>{satelliteSelector}</Suspense>
      </Fieldset>
      <GoogleMap
        lang={lang}
        apiKey={apiKey}
        mapId={mapId}
        markerPosition={markerPosition}
        mapClickHandler={mapClickHandler}
        zoom={zoom}
        cameraProps={cameraProps}
        isMapInfoWindowOpened={isMapInfoWindowOpened}
        satGradeList={satGradeList}
        handleCameraChange={handleCameraChange}
        setIsMapInfoWindowOpened={setIsMapInfoWindowOpened}
        markerMoved={markerMoved}
      />
    </>
  );
};

export default SatFinder;
