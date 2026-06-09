import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { STATUS_COLORS, STATUS_MK } from "../logic";

interface IdeaCardProps {
  idea: any;
  voted: boolean;
  onVote: () => void;
  styles: any;
  theme: any;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  voted,
  onVote,
  styles,
  theme,
}) => {
  const navigation = useNavigation<any>();
  const s = STATUS_COLORS[idea.status] || { bg: "#F1F5F9", color: "#64748B" };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("IdeaDetail", { id: idea.id })}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {idea.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusText, { color: s.color }]}>
            {STATUS_MK[idea.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDesc} numberOfLines={3}>
        {idea.description}
      </Text>

      <View style={styles.cardBottom}>
        <Text style={styles.dateText}>
          {new Date(idea.created_at).toLocaleDateString("mk-MK")}
        </Text>

        <TouchableOpacity
          style={[styles.voteBtn, voted && styles.voteBtnActive]}
          onPress={(e) => {
            e.stopPropagation?.()
            onVote()
          }}
          activeOpacity={0.75}
        >
          <Ionicons
            name={voted ? "thumbs-up" : "thumbs-up-outline"}
            size={14}
            color={voted ? theme.colors.accent : theme.colors.textSecondary}
          />
          <Text style={[styles.voteCount, voted && styles.voteCountActive]}>
            {idea.vote_count ?? 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};