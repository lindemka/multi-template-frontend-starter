'use client';

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark
} from 'lucide-react';

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { resolveAvatarUrl } from '@/lib/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    title?: string;
    company?: string;
  };
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  parentCommentId?: number;
  isEdited: boolean;
  replyCount: number;
  isLiked: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedPostProps {
  post: Post;
  onLike?: () => void;
  onComment?: (comment: Comment) => void;
  onShare?: (platform?: string) => void;
  onSave?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onCommentDelete?: (commentId: number) => void;
}

const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onUpdate,
  onDelete,
  onCommentDelete
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(), // Temporary ID
        content: commentText.trim(),
        user: {
          id: 0, // Will be set by backend
          username: '',
          displayName: '',
        },
        isEdited: false,
        replyCount: 0,
        isLiked: false,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onComment?.(newComment);
      setCommentText('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full" data-testid="feed-post">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={resolveAvatarUrl(post.author.avatarUrl as any, post.author.displayName)} alt={post.author.displayName} />
              <AvatarFallback>
                {post.author.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-foreground" data-testid="author-name">
                  {post.author.displayName}
                </h3>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(post.createdAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {post.author.title && post.author.company
                  ? `${post.author.title} at ${post.author.company}`
                  : post.author.title || post.author.company || ''
                }
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Follow {post.author.name}</DropdownMenuItem>
              <DropdownMenuItem>Hide this post</DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="mb-4">
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            {likes > 0 && (
              <span className="flex items-center space-x-1">
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                <span>{likes}</span>
              </span>
            )}
            {post.commentCount > 0 && (
              <span>{post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}</span>
            )}
            {post.shareCount > 0 && (
              <span>{post.shareCount} share{post.shareCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleSave}
          >
            <Bookmark
              className={`h-3 w-3 ${isSaved ? 'fill-current' : ''}`}
            />
          </Button>
        </div>

        <Separator className="mb-3" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 px-3 ${isLiked ? 'text-red-500 hover:text-red-600' : ''
                }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-3"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-3"
              onClick={() => onShare?.('internal')}
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t pt-4">
            {/* Comment Input */}
            <div className="flex space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={resolveAvatarUrl(comment.user.avatarUrl as any, comment.user.displayName)} />
                      <AvatarFallback>
                        {comment.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">{comment.user.displayName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedPost;