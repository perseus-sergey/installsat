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
