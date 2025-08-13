'use client';

import React, { useState } from 'react';
// Removed next-auth dependency
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Image, X, Upload } from 'lucide-react';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: (post: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onPostCreated,
}) => {
    // Removed useSession - using cookie-based auth instead
    const { toast } = useToast();
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 5000;

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxChars) {
            setContent(value);
            setCharCount(value.length);
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
    };

    const validateForm = () => {
        if (!content.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter some content for your post',
                variant: 'destructive',
            });
            return false;
        }

        if (content.trim().length < 10) {
            toast({
                title: 'Error',
                description: 'Post content must be at least 10 characters long',
                variant: 'destructive',
            });
            return false;
        }

        if (imageUrl && !isValidUrl(imageUrl)) {
            toast({
                title: 'Error',
                description: 'Please enter a valid image URL',
                variant: 'destructive',
            });
            return false;
        }

        return true;
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feed/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content.trim(),
                    imageUrl: imageUrl.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create post');
            }

            if (data.success) {
                onPostCreated(data.data);
                handleClose();
                toast({
                    title: 'Success',
                    description: 'Post created successfully!',
                });
            } else {
                throw new Error(data.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create post',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setImageUrl('');
        setCharCount(0);
        setIsSubmitting(false);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogDescription>
                        Share your thoughts, updates, or insights with your network.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">What's on your mind?</Label>
                        <Textarea
                            id="content"
                            placeholder="Share your thoughts, updates, or insights..."
                            value={content}
                            onChange={handleContentChange}
                            onKeyDown={handleKeyDown}
                            className="min-h-[120px] resize-none"
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Use Cmd/Ctrl + Enter to post</span>
                            <span className={charCount > maxChars * 0.9 ? 'text-orange-500' : ''}>
                                {charCount}/{maxChars}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL (optional)</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={handleImageUrlChange}
                                disabled={isSubmitting}
                                className="flex-1"
                            />
                            {imageUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setImageUrl('')}
                                    disabled={isSubmitting}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {imageUrl && (
                            <div className="mt-2">
                                <Label className="text-sm text-muted-foreground">Preview:</Label>
                                <div className="mt-1 rounded-lg overflow-hidden border">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-32 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim() || content.trim().length < 10}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Post'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostModal;
