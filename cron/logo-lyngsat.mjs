import { getLyngsatLogos } from './libs/logoLyngsat.controller.mjs';

const R_U_N = async () => {
  const QUANTITY = 30;

  const messages = await getLyngsatLogos(QUANTITY);
  console.log(`🚀 ---------------- ${new Date()} ----------------------- 🚀`);
  console.log('🚀 ~ R_U_N ~ messages:', messages);
};

R_U_N();
