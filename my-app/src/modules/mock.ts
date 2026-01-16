import type { Reaction } from "./type";
import defaultImage from "../assets/DefaultImage.jpg"
import defaultImage1 from "../assets/DefaultImage1.png"
import defaultImage2 from "../assets/DefaultImage2.jpg"
import defaultImage3 from "../assets/DefaultImage3.png"
import defaultImage4 from "../assets/DefaultImage4.png"
import defaultImage5 from "../assets/DefaultImage5.png"

export const REACTIONS_MOCK: Reaction[] = [
  {
    ID: 1,
    Title: "Хлорирование толуола",
    Src: defaultImage,
    SrcUr: defaultImage1,
    Details: "Толуол хлорируют в присутствии катализатора хлорид алюминия. Исходное вещество реакции - Толуол с плотностью 0,87 г/мл, молярной массой 92 г/моль. Результирующее вещество - пара-хлорметилбензол с плотностью 1,1 г/мл, молярной массой 127 г/моль.",
    StartingMaterial: "Толуол",
    DensitySM: 0.87,
    MolarMassSM: 92,
    ResultMaterial: "Пара-хлорметилбензол",
    DensityRM: 1.1,
    MolarMassRM: 127
  },					
  {
    ID: 2,
    Title: "Свободная салициловая кислота",
    Src: defaultImage2,
    SrcUr: defaultImage3,
    Details: "Солевую форму салициловой кислоты переводят в свободную кислоту.",
    StartingMaterial: "Натрия салицилат",
    DensitySM: 1.7,
    MolarMassSM: 160,
    ResultMaterial: "Салициловая кислота",
    DensityRM: 1.44,
    MolarMassRM: 138
  },							
  {
    ID: 3,
    Title: "Получение аспирина",
    Src: defaultImage4,
    SrcUr: defaultImage5,
    Details: "Реакция салициловой кислоты и уксусной кислоты с катализатором - серной кислотой. Для расчета необходимо указать объем салициловой и уксусной кислот.",
    StartingMaterial: "Салициловая кислота",
    DensitySM: 1.44,
    MolarMassSM: 138,
    ResultMaterial: "Аспирин",
    DensityRM: 1.44,
    MolarMassRM: 180
  }
];