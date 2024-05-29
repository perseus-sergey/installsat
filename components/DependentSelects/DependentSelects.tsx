// import { IFormState } from '@/controllers/toast.controller';
// import { IChannelCategory } from '@/models/channel.model';
// import { useEffect, useState } from 'react';
// import FieldError from '../comments/FieldError/FieldError';

// interface DependentSelectsProps {
//   categories: IChannelCategory[];
//   formData: any;
//   setFormData: React.Dispatch<React.SetStateAction<any>>;
//   filteredCats: IChannelCategory[];
//   setFilteredCats: React.Dispatch<React.SetStateAction<IChannelCategory[]>>;
//   catFinal: number;
//   setCatFinal: React.Dispatch<React.SetStateAction<number>>;
//   formState: IFormState;
// }

// const DependentSelects = ({
//   categories,
//   formData,
//   setFormData,
//   filteredCats,
//   setFilteredCats,
//   catFinal,
//   setCatFinal,
//   formState,
// }: DependentSelectsProps) => {
//   const [isFirstRender, setIsFirstRender] = useState(true);

//   useEffect(() => {
//     if (isFirstRender) {
//       setIsFirstRender(false);
//       return;
//     }

//     const filteredCats = categories.filter(
//       (cat) => cat.parent === +formData.catParentId
//     );
//     setFilteredCats(filteredCats);

//     setCatFinal(
//       filteredCats.length ? filteredCats[0].id : formData.catParentId
//     );
//   }, [formData.catParentId, categories]);

//   const handleChange = ({
//     name,
//     id,
//     value,
//   }: EventTarget &
//     (HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement)) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//       [id]: value,
//     }));
//   };

//   return (
//     <section id="depend-selects" className="flex flex-col items-start">
//       <label htmlFor="cat_id" className="text-xl">
//         <b>Category:</b>
//       </label>
//       <div className="flex gap-4">
//         <p>catParentId: {formData.catParentId}</p>
//         {formData.catParentId > 0 && (
//           <select
//             className="p-2"
//             name={'catParentId'}
//             id={'catParentId'}
//             value={formData.catParentId}
//             onChange={(e) => handleChange(e.target)}
//           >
//             {categories
//               .filter((cat) => cat.parent === 0)
//               .map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.title} {category.id}
//                 </option>
//               ))}
//           </select>
//         )}

//         <p>catFinal: {catFinal}</p>
//         {filteredCats && filteredCats.length > 0 && (
//           <select
//             className="p-2"
//             name="cat_id"
//             id="cat_id"
//             value={catFinal}
//             onChange={(e) => handleChange(e.target)}
//           >
//             <option value={0}></option>
//             {filteredCats.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.title} {category.id}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>
//       <FieldError
//         formState={formState}
//         name="cat_id"
//         errorFieldId="cat_id-error"
//         className="text-red-700"
//       />
//     </section>
//   );
// };

// export default DependentSelects;
