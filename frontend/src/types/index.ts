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

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Generic Paginated Response Interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

/**
 * Auth Context Type
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
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

/**
 * Boarding Post Provider (nested relation returned by the API)
 */
export interface BoardingPostProvider {
  userId: number;
  fullName: string;
  email: string;
}

/**
 * Boarding Post Interface
 * Matches the BoardingPost TypeORM entity returned by GET /api/v1/boarding
 */
export interface BoardingPost {
  postId: number;
  providerUserId: number;
  title: string;
  description: string | null;
  monthlyRent: number;
  isAvailable: boolean;
  locationDetails: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  /** Populated when fetching the public listing (relations: ['provider', 'reviews']) */
  provider?: BoardingPostProvider;
  reviews?: BoardingReview[];
  /** Server-relative image paths e.g. ["/uploads/boarding/abc.jpg"] */
  images: string[];
}

/**
 * Boarding Filter Parameters
 * Mirrors GetBoardingFilterDto on the backend — all fields optional.
 */
export interface BoardingFilters {
  location: string;       // partial case-insensitive match on locationDetails
  minPrice: string;       // string so empty input ("") is valid — converted to number before API call
  maxPrice: string;
  available: boolean | null; // null = "show all", true/false = explicit filter
  page: number;
  limit: number;
}

/**
 * Study Note Interface
 */
export interface StudyNote {
  note_id: number;
  title: string;
  description?: string;
  university?: string;
  faculty?: string;
  subject_code?: string;
  academic_year?: number;
  file_path: string;
  is_approved: boolean;
  upload_date: string;
  uploader: User;
}

/**
 * Student Profile Interface
 * Matches the Student entity returned by GET /api/v1/students/profile
 */
export interface StudentProfile {
  studentId: number;
  userId: number;
  university: string | null;
  faculty: string | null;
  academicYear: string | null;
  createdAt: string;
  updatedAt: string;
  /** Populated via the 'user' relation */
  user: {
    userId: number;
    email: string;
    fullName: string;
    role: UserRole;
  };
}

/**
 * Update Student Profile Request Body
 */
export interface UpdateStudentProfileRequest {
  university?: string;
  faculty?: string;
  academicYear?: string;
}

/**
 * Real-time Notification Item
 * Matches the NotificationPayload emitted by NotificationsGateway.
 * The `read` field is added client-side for local state tracking.
 */
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'boarding';
  createdAt: string;
  /** Client-side only — true after markAllRead() is called */
  read: boolean;
}

/**
 * Chat Message Interface
 */
export interface ChatMessage {
  id: string;
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

/**
 * Conversation Interface (Inbox item)
 */
export interface Conversation {
  user: {
    userId: number;
    fullName: string;
    email: string;
    role: UserRole;
  };
  latestMessage: ChatMessage;
  unreadCount: number;
}

/**
 * Boarding Review Interface
 */
export interface BoardingReview {
  id: string;
  postId: number;
  studentUserId: number;
  rating: number;
  comment: string;
  createdAt: string;
  student?: {
    userId: number;
    fullName: string;
  };
}

/**
 * Provider Analytics Interface
 */
export interface ProviderAnalytics {
  totalPosts: number;
  totalReviewsCount: number;
  averageRating: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
}

