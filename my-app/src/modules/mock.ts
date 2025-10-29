import type { Reaction } from "./type";
import defaultImage from "../assets/DefaultImage.jpg"

// mock.ts
export const REACTIONS_MOCK: Reaction[] = [
  {
    ID: 1,
    Title: "Хлорирование толуола",
    Src: defaultImage,
    SrcUr: defaultImage,
    Details: "Реакция ацетилирования салициловой кислоты уксусным ангидридом в присутствии катализатора с образованием ацетилсалициловой кислоты.",
    StartingMaterial: "Салициловая кислота",
    DensitySM: 1.44,
    MolarMassSM: 138,
    ResultMaterial: "Ацетилсалициловая кислота",
    DensityRM: 1.40,
    MolarMassRM: 180
  },
  {
    ID: 2,
    Title: "Очистка аспирина",
    Src: defaultImage,
    SrcUr: defaultImage,
    Details: "Процесс очистки и кристаллизации аспирина для получения чистого продукта.",
    StartingMaterial: "Сырой аспирин",
    DensitySM: 1.35,
    MolarMassSM: 180,
    ResultMaterial: "Очищенный аспирин",
    DensityRM: 1.40,
    MolarMassRM: 180
  },
  {
    ID: 3,
    Title: "Синтез салициловой кислоты",
    Src: defaultImage,
    SrcUr: defaultImage,
    Details: "Синтез салициловой кислоты из фенолята натрия и диоксида углерода.",
    StartingMaterial: "Фенолят натрия",
    DensitySM: 1.32,
    MolarMassSM: 116,
    ResultMaterial: "Салициловая кислота",
    DensityRM: 1.44,
    MolarMassRM: 138
  }
];