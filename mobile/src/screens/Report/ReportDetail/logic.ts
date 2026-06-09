import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReport,
  voteReport,
  unvoteReport,
  rateReport,
} from "../../../api/reports";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../utils/formHooks";
import Toast from "react-native-toast-message";

export function useReportDetailLogic() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { id } = route.params;
  const ratingModal = useModal();
  const imageModal = useModal();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
  });

  const hasVoted = !!report?.is_voted_by_me;

  const voteMutation = useMutation({
    mutationFn: () => (hasVoted ? unvoteReport(id) : voteReport(id)),
    onSuccess: (responseData) => {
      queryClient.setQueryData(["report", id], (oldData: any) => {
        if (!oldData) return oldData;
        
        if (responseData && typeof responseData === "object" && "is_voted_by_me" in responseData) {
          return responseData;
        }

        return {
          ...oldData,
          is_voted_by_me: !oldData.is_voted_by_me,
          vote_count: oldData.is_voted_by_me 
            ? Math.max(0, (oldData.vote_count || 1) - 1) 
            : (oldData.vote_count || 0) + 1,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["reports-map"] });
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
      
      Toast.show({
        type: "success",
        text1: hasVoted ? "Гласот е отстранет" : "Гласот е додаден ✓",
      });
    },
    onError: (err: any) => {
      Toast.show({ 
        type: "error", 
        text1: err.response?.data?.detail || "Грешка при гласање" 
      });
    },
  });

  const ratingMutation = useMutation({
    mutationFn: () => rateReport(id, rating, ratingComment || undefined),
    onSuccess: (responseData) => {
      Toast.show({ type: "success", text1: "Оцената е зачувана ✓" });
      
      queryClient.setQueryData(["report", id], (oldData: any) => {
        if (!oldData) return oldData;
        if (responseData && typeof responseData === "object" && "is_rated" in responseData) {
          return responseData;
        }
        return {
          ...oldData,
          is_rated: true,
        };
      });

      ratingModal.close();
      setRating(0);
      setRatingComment("");
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: err.response?.data?.detail || "Грешка при оценување",
      });
    },
  });

  const canRate =
    user?.id === report?.user_id &&
    report?.status === "resolved" &&
    !report?.is_rated && !report?.is_duplicate;

  return {
    report,
    isLoading,
    hasVoted,
    rating,
    setRating,
    ratingComment,
    setRatingComment,
    ratingModal,
    imageModal,
    selectedImage,
    openImage: (url: string) => {
      setSelectedImage(url);
      imageModal.open();
    },
    closeImage: () => {
      setSelectedImage(null);
      imageModal.close();
    },
    canRate,
    handleVote: () => {
      if (!voteMutation.isPending) {
        voteMutation.mutate();
      }
    },
    handleRating: () => {
      if (rating === 0)
        return Toast.show({ type: "error", text1: "Изберете оценка" });
      ratingMutation.mutate();
    },
    isVoting: voteMutation.isPending,
    isRating: ratingMutation.isPending,
    goBack: () => navigation.goBack(),
  };
}