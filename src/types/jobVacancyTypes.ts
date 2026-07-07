export interface FilterConfig {
  key: string;
  value: string;
  operation: string;
  conjunction: string;
}

export interface JobVacancyRequest {
  pageNo: number;
  pageSize: number;
  sortByColumn?: string;
  sortType?: "asc" | "desc";
  filter?: FilterConfig[];
}

export interface Organization {
  uniqueId: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  thumbnailUrl: string | null;
  active: boolean;
}

export interface Requirement {
  uniqueId: string;
  category: string;
  name: string;
  weight: number;
  minValue: number | null;
  isMandatory: boolean;
}

export interface JobVacancyItem {
  uniqueId: string;
  jobTitle: string;
  slug: string;
  keyword: string;
  jobDescription: string;
  location: string;
  contact: string;
  jobType: string;
  applicationDeadline: string;
  jobStatus: string;
  jobLevel: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  createDate: string;
  updateDate: string;
  thumbnailUrl: string | null;

  organization: Organization;
  requirements: Requirement[];

  hasCurrentUserApplied: boolean;
  vacancySaved: boolean;
  viewer: number;
  totalSaved: number | null;
  totalApplicants: number | null;
}

export interface JobVacancyResponse {
  message: string;
  status: boolean;
  data: {
    content: JobVacancyItem[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}