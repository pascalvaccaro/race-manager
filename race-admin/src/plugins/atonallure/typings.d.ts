export type Media = {
  id: number;
  url: string;
  alternativeText: string;
}
export type Runner = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
};
export type Run = { id: number; runner: Runner; numberSign?: number };
export type Race = { id: number; startDate: Date; runs: Run[]; gallery: Media[] };
