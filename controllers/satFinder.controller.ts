import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';

export const makeSelectedOptions = (
  satGradeList: string[],
  groupedSats: Error | IGroupedSatelliteOption[]
): ISatelliteOption[] => {
  if (groupedSats instanceof Error || !groupedSats.length) return [];

  const flatArray = groupedSats.reduce(
    (acc: ISatelliteOption[], curr) => [...acc, ...curr.options],
    []
  );

  return satGradeList.map((satGrade) => {
    const satOption = flatArray.find((option) => option.value === satGrade);

    return satOption
      ? {
          value: satOption.value,
          label: satOption.label,
        }
      : {
          value: satGrade,
          label: satGrade,
        };
  });
};

export const makeOptions = (
  urlParamList: string[],
  itemList: Error | IGroupedSatelliteOption[]
): ISatelliteOption[] => {
  if (itemList instanceof Error || !itemList.length) return [];

  const flatArray = itemList.reduce(
    (acc: ISatelliteOption[], curr) => [...acc, ...curr.options],
    []
  );
  const options = urlParamList.map((urlParam) => {
    const opt = flatArray.find((option) => option.value === urlParam);

    return opt
      ? {
          value: opt.value,
          label: opt.label,
        }
      : {
          value: urlParam,
          label: urlParam,
        };
  });

  return options;
};

export const makeSimpleOptions = (
  urlParamList: string[],
  itemList: Error | ISatelliteOption[]
): ISatelliteOption[] => {
  if (itemList instanceof Error || !itemList.length) return [];

  const options = urlParamList.map((urlParam) => {
    const opt = itemList.find((option) => option.value === urlParam);

    return opt
      ? {
          value: opt.value,
          label: opt.label,
        }
      : {
          value: urlParam,
          label: urlParam,
        };
  });

  return options;
};
