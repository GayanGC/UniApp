import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  ApiError,
  PastPapersResponse,
  PastPapersFilter,
  CampusesResponse,
  POIsResponse,
  BoardingPost,
  BoardingFilters,
  StudentProfile,
  UpdateStudentProfileRequest,
  PaginatedResponse,
  ChatMessage,
  Conversation,
  BoardingReview,
  ProviderAnalytics,
} from '@/types';

/**
 * API Service
 * Handles all HTTP requests to the backend
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          Cookies.remove('auth_token');
          Cookies.remove('user');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  /**
   * Get past papers with optional filtering
   */
  async getPastPapers(filters?: PastPapersFilter): Promise<PastPapersResponse> {
    const params = new URLSearchParams();
    
    if (filters?.university) params.append('university', filters.university);
    if (filters?.faculty) params.append('faculty', filters.faculty);
    if (filters?.subjectName) params.append('subjectName', filters.subjectName);
    if (filters?.academicYear) params.append('academicYear', filters.academicYear.toString());
    if (filters?.examYear) params.append('examYear', filters.examYear.toString());

    const queryString = params.toString();
    const url = queryString ? `/past-papers?${queryString}` : '/past-papers';
    
    const response = await this.api.get<PastPapersResponse>(url);
    return response.data;
  }

  /**
   * Download a past paper file
   */
  async downloadPastPaper(paperId: number): Promise<Blob> {
    const response = await this.api.get(`/past-papers/download/${paperId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get boarding posts with optional filtering.
   *
   * Maps the frontend BoardingFilters shape onto the exact query params
   * expected by the backend GetBoardingFilterDto:
   *   location  → ILIKE '%value%' on locationDetails
   *   minPrice  → monthlyRent >= value
   *   maxPrice  → monthlyRent <= value
   *   available → isAvailable = true | false
   *
   * Only appends a param when it has a meaningful value so the URL stays clean.
   */
  async getBoardingPosts(filters?: Partial<BoardingFilters>): Promise<PaginatedResponse<BoardingPost>> {
    const params = new URLSearchParams();

    if (filters?.location?.trim()) {
      params.append('location', filters.location.trim());
    }
    if (filters?.minPrice && filters.minPrice !== '') {
      params.append('minPrice', filters.minPrice);
    }
    if (filters?.maxPrice && filters.maxPrice !== '') {
      params.append('maxPrice', filters.maxPrice);
    }
    if (filters?.available !== null && filters?.available !== undefined) {
      params.append('available', String(filters.available));
    }
    if (filters?.page) {
      params.append('page', String(filters.page));
    }
    if (filters?.limit) {
      params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const url = queryString ? `/boarding?${queryString}` : '/boarding';

    const response = await this.api.get<PaginatedResponse<BoardingPost>>(url);
    return response.data;
  }

  /**
   * Get a single boarding post by ID (includes provider relation).
   * GET /api/v1/boarding/:id
   */
  async getBoardingPostById(postId: number): Promise<BoardingPost> {
    const response = await this.api.get<BoardingPost>(`/boarding/${postId}`);
    return response.data;
  }

  /**
   * Get all reviews for a specific boarding post.
   */
  async getBoardingReviews(postId: number): Promise<BoardingReview[]> {
    const response = await this.api.get<BoardingReview[]>(`/boarding/${postId}/reviews`);
    return response.data;
  }

  /**
   * Submit a review for a specific boarding post.
   */
  async createBoardingReview(postId: number, data: { rating: number; comment: string }): Promise<BoardingReview> {
    const response = await this.api.post<BoardingReview>(`/boarding/${postId}/reviews`, data);
    return response.data;
  }

  /**
   * Get provider analytics dashboard metrics.
   */
  async getProviderAnalytics(): Promise<ProviderAnalytics> {
    const response = await this.api.get<ProviderAnalytics>('/boarding/provider/analytics');
    return response.data;
  }

  /**
   * Get all campuses (Public endpoint - no auth required)
   */
  async getAllCampuses(): Promise<CampusesResponse> {
    const response = await axios.get<CampusesResponse>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/campus-guide/all`
    );
    return response.data;
  }

  /**
   * Get POIs for a specific campus (Public endpoint - no auth required)
   */
  async getPOIsByCampus(campusId: number): Promise<POIsResponse> {
    const response = await axios.get<POIsResponse>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/campus-guide/pois/${campusId}`
    );
    return response.data;
  }

  /**
   * Get the current student's profile.
   * GET /api/v1/students/profile
   * Requires: student role JWT
   */
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await this.api.get<StudentProfile>('/students/profile');
    return response.data;
  }

  /**
   * Update the current student's profile.
   * PATCH /api/v1/students/profile
   * Requires: student role JWT
   */
  async updateStudentProfile(data: UpdateStudentProfileRequest): Promise<StudentProfile> {
    const response = await this.api.patch<StudentProfile>('/students/profile', data);
    return response.data;
  }

  /**
   * Get the list of chat conversations (Inbox)
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await this.api.get<Conversation[]>('/chat/conversations');
    return response.data;
  }

  /**
   * Get chat history with a specific user
   */
  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    const response = await this.api.get<ChatMessage[]>(`/chat/history/${userId}`);
    return response.data;
  }

  /**
   * Get axios instance for custom requests
   */
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
