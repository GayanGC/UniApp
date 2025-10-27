/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  PROSPECTIVE = 'prospective',
  BOARDING_PROVIDER = 'boarding_provider',
}

/**
 * User Interface
 */
export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  university?: string;
  faculty?: string;
  academicYear?: string;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Auth Context Type
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

/**
 * Past Paper Interface
 */
export interface PastPaper {
  paperId: number;
  university: string;
  faculty: string;
  subjectName: string;
  academicYear: number;
  examYear: number;
  filePath: string;
  uploadedByUserId: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Past Papers Filter Parameters
 */
export interface PastPapersFilter {
  university?: string;
  faculty?: string;
  subjectName?: string;
  academicYear?: number;
  examYear?: number;
}

/**
 * Past Papers API Response
 */
export interface PastPapersResponse {
  message: string;
  count: number;
  data: PastPaper[];
}

/**
 * Campus Interface
 */
export interface Campus {
  campusId: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campus POI Interface
 */
export interface CampusPOI {
  poiId: number;
  campusId: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campuses API Response
 */
export interface CampusesResponse {
  message: string;
  count: number;
  data: Campus[];
}

/**
 * POIs API Response
 */
export interface POIsResponse {
  message: string;
  count: number;
  data: CampusPOI[];
}
