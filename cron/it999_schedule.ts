// // pages/api/update-epg.ts
// import axios from 'axios';
// import fs from 'fs';
// import { createGunzip } from 'zlib';
// import { pipeline } from 'stream/promises';
// import sax from 'sax';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { executePoolQuery } from '../../db';

// const downloadAndExtract = async () => {
//   const response = await axios({
//     url: 'http://epg.it999.ru/edem.xml.gz',
//     method: 'GET',
//     responseType: 'stream',
//   });

//   await pipeline(
//     response.data,
//     createGunzip(),
//     fs.createWriteStream('edem.xml')
//   );

//   console.log('File downloaded and extracted');
// };

// const clearTable = async () => {
//   await executePoolQuery('TRUNCATE TABLE epg_data');
//   console.log('Table cleared');
// };

// interface Programme {
//   start: string;
//   stop: string;
//   channel: string;
//   title: string;
//   category?: string;
//   description?: string;
// }

// const parseAndInsert = async () => {
//   const parser = sax.createStream(true);
//   const fileStream = fs.createReadStream('edem.xml');

//   const buffer: Programme[] = [];
//   let insertBatch: Programme[] = [];
//   let currentTitle = '';
//   let currentCategory = '';
//   let currentDescription = '';

//   parser.on('opentag', (node) => {
//     if (node.name === 'programme') {
//       buffer.push({
//         start: node.attributes['start'],
//         stop: node.attributes['stop'],
//         channel: node.attributes['channel'],
//         title: '',
//       });
//     }
//   });

//   parser.on('text', (text) => {
//     if (buffer.length > 0) {
//       if (currentTitle) {
//         buffer[buffer.length - 1].title = text;
//         currentTitle = '';
//       } else if (currentCategory) {
//         buffer[buffer.length - 1].category = text;
//         currentCategory = '';
//       } else if (currentDescription) {
//         buffer[buffer.length - 1].description = text;
//         currentDescription = '';
//       }
//     }
//   });

//   parser.on('opencdata', () => {
//     if (buffer.length > 0) {
//       const lastProgramme = buffer[buffer.length - 1];
//       if (!lastProgramme.title) {
//         currentTitle = 'title';
//       } else if (!lastProgramme.category) {
//         currentCategory = 'category';
//       } else if (!lastProgramme.description) {
//         currentDescription = 'description';
//       }
//     }
//   });

//   parser.on('closetag', (tagName) => {
//     if (tagName === 'programme') {
//       const programme = buffer.pop();
//       if (programme) {
//         insertBatch.push(programme);
//       }

//       if (insertBatch.length >= 1000) {
//         executePoolQuery(
//           'INSERT INTO epg_data (start, end, chan_id, title, prog_cat, prog_desc) VALUES ?',
//           [
//             insertBatch.map((p) => [
//               p.start,
//               p.stop,
//               p.channel,
//               p.title,
//               p.category,
//               p.description,
//             ]),
//           ]
//         );
//         insertBatch = [];
//       }
//     }
//   });

//   parser.on('end', async () => {
//     if (insertBatch.length > 0) {
//       await executePoolQuery(
//         'INSERT INTO epg_data (start, end, chan_id, title, prog_cat, prog_desc) VALUES ?',
//         [
//           insertBatch.map((p) => [
//             p.start,
//             p.stop,
//             p.channel,
//             p.title,
//             p.category,
//             p.description,
//           ]),
//         ]
//       );
//     }
//     console.log('Data inserted into database');
//   });

//   fileStream.pipe(parser);
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     await downloadAndExtract();
//     await clearTable();
//     await parseAndInsert();
//     res.status(200).json({ message: 'Data updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
