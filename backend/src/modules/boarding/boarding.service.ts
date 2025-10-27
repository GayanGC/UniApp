import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardingPost } from './entities';
import { CreateBoardingPostDto, UpdateBoardingPostDto } from './dto';

/**
 * Boarding Service
 * Handles all boarding post-related business logic
 */
@Injectable()
export class BoardingService {
  constructor(
    @InjectRepository(BoardingPost)
    private readonly boardingPostRepository: Repository<BoardingPost>,
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
      });

      return await this.boardingPostRepository.save(boardingPost);
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
   * Get all available boarding posts (public)
   * @returns Array of available boarding posts
   */
  async findAllAvailable(): Promise<BoardingPost[]> {
    return await this.boardingPostRepository.find({
      where: { isAvailable: true },
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
