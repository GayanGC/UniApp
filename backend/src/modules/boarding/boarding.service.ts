import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BoardingPost } from './entities';
import { CreateBoardingPostDto, UpdateBoardingPostDto, GetBoardingFilterDto } from './dto';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';

/**
 * Boarding Service
 * Handles all boarding post-related business logic
 */
@Injectable()
export class BoardingService {
  constructor(
    @InjectRepository(BoardingPost)
    private readonly boardingPostRepository: Repository<BoardingPost>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Create a new boarding post
   * @param providerUserId - ID of the boarding provider
   * @param createBoardingPostDto - Boarding post creation data
   * @returns Created boarding post
   */
  async create(
    providerUserId: number,
    createBoardingPostDto: CreateBoardingPostDto,
  ): Promise<BoardingPost> {
    try {
      const boardingPost = this.boardingPostRepository.create({
        providerUserId,
        title: createBoardingPostDto.title,
        description: createBoardingPostDto.description,
        monthlyRent: createBoardingPostDto.monthlyRent,
        isAvailable: createBoardingPostDto.isAvailable ?? true,
        locationDetails: createBoardingPostDto.locationDetails,
        images: createBoardingPostDto.images ?? [],
      });

      const saved = await this.boardingPostRepository.save(boardingPost);

      // Notify the provider that their listing is now live
      this.notificationsGateway.sendToUser(providerUserId, {
        id: `boarding-created-${saved.postId}-${Date.now()}`,
        title: '🏠 Listing Published',
        message: `Your listing "${saved.title}" is now live!`,
        type: 'success',
        createdAt: new Date().toISOString(),
      });

      return saved;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create boarding post');
    }
  }

  /**
   * Get all posts created by a specific provider
   * @param providerUserId - ID of the boarding provider
   * @returns Array of boarding posts
   */
  async findMyPosts(providerUserId: number): Promise<BoardingPost[]> {
    return await this.boardingPostRepository.find({
      where: { providerUserId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all boarding posts with optional search & filtering.
   *
   * Supported filters (all optional — omitting a filter returns all results for that field):
   *  - location   → case-insensitive partial match on locationDetails  (ILIKE '%value%')
   *  - minPrice   → monthly_rent >= minPrice
   *  - maxPrice   → monthly_rent <= maxPrice
   *  - available  → is_available = true | false
   *
   * When BOTH minPrice AND maxPrice are supplied, a single BETWEEN clause is used
   * instead of two separate conditions for optimal query performance.
   *
   * @param filterDto - Validated query parameters from the request
   * @returns Array of matching boarding posts with provider info
   */
  async findAllWithFilters(filterDto: GetBoardingFilterDto): Promise<BoardingPost[]> {
    const { location, minPrice, maxPrice, available } = filterDto;

    // Start with an empty where-clause object; only add conditions for provided filters.
    const where: FindOptionsWhere<BoardingPost> = {};

    // ── Availability filter ───────────────────────────────────────────────────
    // Default to showing only available posts when the param is not supplied.
    // Passing ?available=false explicitly allows admins / providers to query unavailable posts.
    if (available !== undefined) {
      where.isAvailable = available;
    } else {
      where.isAvailable = true; // sensible default: only show available rooms
    }

    // ── Location filter (case-insensitive partial match) ──────────────────────
    if (location) {
      where.locationDetails = ILike(`%${location.trim()}%`);
    }

    // ── Price range filter ────────────────────────────────────────────────────
    // TypeORM's Between is inclusive on both ends: >= minPrice AND <= maxPrice.
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.monthlyRent = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.monthlyRent = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.monthlyRent = LessThanOrEqual(maxPrice);
    }

    return await this.boardingPostRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['provider'],
      select: {
        provider: {
          userId: true,
          fullName: true,
          email: true,
        },
      },
    });
  }

  /**
   * Get a single boarding post by ID
   * @param postId - Boarding post ID
   * @returns Boarding post if found
   */
  async findOne(postId: number): Promise<BoardingPost> {
    const post = await this.boardingPostRepository.findOne({
      where: { postId },
      relations: ['provider'],
      select: {
        provider: {
          userId: true,
          fullName: true,
          email: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Boarding post not found');
    }

    // Real-time notification to the provider when someone views their listing
    this.notificationsGateway.sendToUser(post.providerUserId, {
      id: `boarding-view-${postId}-${Date.now()}`,
      title: '👀 Someone viewed your listing',
      message: `A user just viewed your post "${post.title}".`,
      type: 'boarding',
      createdAt: new Date().toISOString(),
    });

    return post;
  }

  /**
   * Update a boarding post
   * @param postId - Boarding post ID
   * @param providerUserId - ID of the boarding provider (for authorization)
   * @param updateBoardingPostDto - Update data
   * @returns Updated boarding post
   */
  async update(
    postId: number,
    providerUserId: number,
    updateBoardingPostDto: UpdateBoardingPostDto,
  ): Promise<BoardingPost> {
    const post = await this.boardingPostRepository.findOne({
      where: { postId },
    });

    if (!post) {
      throw new NotFoundException('Boarding post not found');
    }

    // Check if the user is the owner of the post
    if (post.providerUserId !== providerUserId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    try {
      // Update fields
      if (updateBoardingPostDto.title !== undefined) {
        post.title = updateBoardingPostDto.title;
      }
      if (updateBoardingPostDto.description !== undefined) {
        post.description = updateBoardingPostDto.description;
      }
      if (updateBoardingPostDto.monthlyRent !== undefined) {
        post.monthlyRent = updateBoardingPostDto.monthlyRent;
      }
      if (updateBoardingPostDto.isAvailable !== undefined) {
        post.isAvailable = updateBoardingPostDto.isAvailable;
      }
      if (updateBoardingPostDto.locationDetails !== undefined) {
        post.locationDetails = updateBoardingPostDto.locationDetails;
      }
      // Replace images only when new files were uploaded
      if (updateBoardingPostDto.images !== undefined) {
        post.images = updateBoardingPostDto.images;
      }

      return await this.boardingPostRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update boarding post');
    }
  }

  /**
   * Delete a boarding post
   * @param postId - Boarding post ID
   * @param providerUserId - ID of the boarding provider (for authorization)
   */
  async remove(postId: number, providerUserId: number): Promise<void> {
    const post = await this.boardingPostRepository.findOne({
      where: { postId },
    });

    if (!post) {
      throw new NotFoundException('Boarding post not found');
    }

    // Check if the user is the owner of the post
    if (post.providerUserId !== providerUserId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    try {
      await this.boardingPostRepository.remove(post);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete boarding post');
    }
  }
}
