
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequest, RequestData } from "@/context/RequestContext";

interface RatingFormProps {
  requestId: string;
}

const RatingForm: React.FC<RatingFormProps> = ({ requestId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const { rateService, getRequestById } = useRequest();
  
  const request = getRequestById(requestId);
  
  if (!request) {
    return <div>Request not found</div>;
  }
  
  if (request.status !== "completed") {
    return null;
  }
  
  if (request.rating) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <h3 className="font-medium mb-2">Your Rating</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < request.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-700">
          {request.feedback || "No feedback provided"}
        </p>
      </div>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    rateService(requestId, rating, feedback);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-medium mb-4">Rate Your Experience</h3>
      
      <div className="mb-4">
        <Label className="block mb-2">Rate the service</Label>
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <Star
                key={index}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                  ratingValue <= (hover || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="feedback" className="block mb-2">Feedback (optional)</Label>
        <Textarea
          id="feedback"
          placeholder="Please share your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button type="submit" disabled={rating === 0}>
        Submit Rating
      </Button>
    </form>
  );
};

export default RatingForm;
