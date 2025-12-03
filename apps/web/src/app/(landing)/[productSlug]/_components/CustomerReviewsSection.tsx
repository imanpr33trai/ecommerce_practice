'use client';

import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { Button } from '@/_components/client/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@comp/card';
import { Textarea } from '@comp/textarea';
import { Label } from '@comp/label';
import { FrostedCard } from '@/_components/client/FrostedCard';
import { Avatar, AvatarFallback, AvatarImage } from '@comp/avatar';
import { type ProductDetailed, type ProductReview } from '@/utils/typesClient';
import { useReview } from '@/hooks/useReview'; // Assuming you have a useReview hook

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';


interface StarRatingInputProps {
    value: number;
    onChange: (rating: number) => void;
    disabled?: boolean;
}

const StarRatingInput = ({ value, onChange, disabled }: StarRatingInputProps) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={cn(
                    "h-6 w-6 transition-colors",
                    star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600',
                    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:text-yellow-300 hover:fill-yellow-300'
                )}
                onClick={() => !disabled && onChange(star)}
            />
        ))}
    </div>
);

interface AddReviewFormProps {
    productId: string;
    productSlug: string;
    onReviewSubmit?: () => void;
}

const AddReviewForm = ({ productId, productSlug, onReviewSubmit }: AddReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { mutate: reviewMutations, isPending: isSubmitting } = useReview.addReview(); // Assuming useReview hook provides addReview mutation

    const { useSession } = authClient

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        reviewMutations({ productId, productSlug, rating, comment });
        // Clear form on success (handled by onSuccess in hook usually)
        // setRating(0);
        // setComment('');
        // onReviewSubmit?.();
    };

    // const isSubmitting = reviewMutations.addReview.isLoading;

    return (
        <FrostedCard>
            <CardHeader>
                <CardTitle className="text-2xl text-white">Write a Review</CardTitle>
                <CardDescription className="text-gray-300">Share your thoughts on this product.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="text-white">Your Rating</Label>
                        <StarRatingInput value={rating} onChange={setRating} disabled={isSubmitting} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="review-comment" className="text-white">Your Comment</Label>
                        <Textarea
                            id="review-comment"
                            placeholder="Tell us what you think about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            minLength={10}
                            disabled={isSubmitting}
                            className="min-h-[100px] text-white placeholder:text-gray-400 bg-white/10 border-gray-600/50 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </form>
            </CardContent>
        </FrostedCard>
    );
};

interface CustomerReviewsSectionProps {
    product: ProductDetailed;
}

export const CustomerReviewsSection = ({ product }: CustomerReviewsSectionProps) => {
    // Assuming useReview hook has a query for product reviews
    const { data: reviews, isLoading: areReviewsLoading } = useReview.reviewsByProductId(product.id);

    const isUserLoggedIn = true; // Placeholder: replace with actual session check
    const hasUserReviewed = false; // Placeholder: Check if session.user.id exists in `reviews` array

    if (product.slug === null) {
        toast.error('Product slug is null')
    }

    return (
        <FrostedCard>
            <CardHeader className="flex flex-row items-center gap-3">
                <MessageSquare className="h-6 w-6 text-white" />
                <CardTitle className="text-2xl text-white">Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {areReviewsLoading ? (
                    <p className="text-neutral-300">Loading reviews...</p>
                ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review: ProductReview) => ( // Cast to ProductReview type
                            <div key={review.id} className="rounded-lg bg-neutral-700/50 p-4 border border-neutral-600/50">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-neutral-600">
                                        <AvatarImage src={review.user.image || '/avatar-placeholder.png'} alt={review.user.name} />
                                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-white">{review.user.name}</p>
                                        <div className="flex items-center gap-0.5 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={cn("h-4 w-4", i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600')} />
                                            ))}
                                            <span className="ml-2 text-xs text-neutral-400">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-neutral-300">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-300">No reviews yet. Be the first to share your thoughts!</p>
                )}

                {/* Show Add Review Form */}
                {isUserLoggedIn && !hasUserReviewed && product.slug && (
                    <AddReviewForm productId={product.id} productSlug={product.slug} />
                )}
            </CardContent>
        </FrostedCard>
    );
};