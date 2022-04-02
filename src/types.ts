export interface Link {
  id: number;
  url: string;
  title: string;
  text: string;
  createdAt: string;
  viewedAt: string;
}

export interface ApiResponse {
  ok: boolean;
  message?: string;
}

export interface LinksApiResponse extends ApiResponse {
  links?: Link[];
}

export interface NextApiResponse extends ApiResponse {
  link?: Link;
}
