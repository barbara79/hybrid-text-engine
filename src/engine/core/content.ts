export interface JobApplicationContent {
  role: string
  company: string
  experience: string
  skills?: string[]
  education?: string
}

export interface MarketplaceContent {
  productName: string;
  description: string;
  price?: number;
  audience?: string;
  platform?: string;
}
