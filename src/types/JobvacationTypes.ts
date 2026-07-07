export interface ApiResponse {
  message: string;
  status: boolean;
  data: DataResponse;
}

export interface DataResponse {
  content: JobVacancy[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface JobVacancy {
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
  createBy: string;
  updateDate: string;
  updateBy: string;
  thumbnailUrl: string | null;

  organization: Organization;
  requirements: Requirement[];

  hasCurrentUserApplied: boolean;
  vacancySaved: boolean;
  viewer: number;
  totalSaved: number | null;
  totalApplicants: number | null;
}

export interface Organization {
  uniqueId: string;
  name: string;
  code: string;
  npwp: string;
  npwpAddress: string | null;
  address: string;
  email: string;
  phone: string;
  postcode: string | null;
  thumbnail: string;
  thumbnailUrl: string;
  active: boolean;
}

export interface Requirement {
  uniqueId: string;
  jobVacancyId: number;
  category: string;
  name: string;
  weight: number;
  minValue: number | null;
  isMandatory: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}