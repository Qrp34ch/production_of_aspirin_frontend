export interface Reaction {
  ID: number;
  Title: string;
  Src: string;
  SrcUr: string;
  Details: string;
  StartingMaterial: string;
  DensitySM: number;
  MolarMassSM: number;
  ResultMaterial: string;
  DensityRM: number;
  MolarMassRM: number;
}

export interface Synthesis {
  id: number;
  reactions: Reaction[];
}